const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  name: { type: String },
});

module.exports = mongoose.model("User", userSchema);