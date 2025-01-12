const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const TempUser = require("../models/TempUser");

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,  // because we're using HTTPS
    sameSite: 'none',  // required for cross-site cookies
    maxAge: 24 * 60 * 60 * 10000 
  });
};

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists in the User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if user already exists in the TempUser collection
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      return res.status(400).json({ message: "OTP already sent. Please verify your email." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create temporary user
    const tempUser = new TempUser({ email, password: hashedPassword, otp });
    await tempUser.save();

    // Send OTP email
    await sendEmail(email, "Verify your email", `Your OTP is ${otp}`);

    res.status(201).json({ message: "OTP sent to your email", email });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
// Verify Email OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the temporary user
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser || tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Create the user in the User collection
    const user = new User({ email, password: tempUser.password, isVerified: true });
    await user.save();

    // Delete the temporary user
    await TempUser.deleteOne({ email });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set token in cookie
    setTokenCookie(res, token);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

exports.resendOtp = async (req, res) => {
  const { email, password } = req.body; // Include password for creating a new TempUser

  try {
    // Find the temporary user
    let tempUser = await TempUser.findOne({ email });

    // If the temporary user doesn't exist, create a new one
    if (!tempUser) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Create a new temporary user
      tempUser = new TempUser({ email, password: hashedPassword, otp });
      await tempUser.save();
    } else {
      // If the temporary user exists, generate a new OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      tempUser.otp = otp;
      await tempUser.save();
    }

    // Send OTP email
    await sendEmail(email, "Verify your email", `Your new OTP is ${tempUser.otp}`);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Set token in cookie
    setTokenCookie(res, token);

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
      path: "/"
    });
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};


// Google Sign-In
exports.googleSignin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, name, isVerified: true });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Set token in cookie
    setTokenCookie(res, token);

    res.status(200).json({ message: "Google login successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// Check Authentication
exports.checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Authenticated", userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};