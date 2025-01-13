const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post('/google-signin', authController.googleSignin);
router.post('/google-signup', authController.googleSignup);
router.post("/resend-otp", authController.resendOtp);
router.get("/check", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

module.exports = router;