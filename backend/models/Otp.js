const mongoose = require("mongoose");


const otpSchema = new mongoose.Schema({
  email: { type: String },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: false },
  type: { type: String, enum: ["email"], required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // expires after 10 mins
});

module.exports = mongoose.model("Otp", otpSchema);
