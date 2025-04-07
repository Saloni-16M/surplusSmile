const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String },
  phone_no: { type: String },
  otp: { type: String, required: true },  // ✅ Add this line
  verified: { type: Boolean, default: false },
  type: { type: String, enum: ["email", "phone"], required: true },
  createdAt: { type: Date, default: Date.now, expires: 6000 } // 10 min expiry
});

module.exports = mongoose.model("Otp", otpSchema);
