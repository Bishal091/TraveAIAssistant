// models/TempUser.js
const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 400 }, // Automatically delete after 10 minutes
});

module.exports = mongoose.model("TempUser", tempUserSchema);