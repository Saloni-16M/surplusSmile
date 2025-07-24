const Otp = require("../models/Otp");
const { sendOtpToEmail } = require("../utils/sendOtp");
const rateLimit = require('express-rate-limit');

const sendOtpController = async (req, res) => {
  const { email } = req.body;

  try {
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      const now = new Date();
      const timeDiff = (now - existingOtp.createdAt) / 1000;

      if (timeDiff < 60) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(60 - timeDiff)} seconds before requesting a new OTP.`,
        });
      }

      await Otp.deleteMany({ email });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // ✅ Pass type
    const newOtp = new Otp({ email, otp, type: "email" });
    await newOtp.save();

    await sendOtpToEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email", otp });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

// Add rate limiter for OTP requests
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 OTP requests per windowMs
  message: { message: 'Too many OTP requests. Please try again later.' },
});

// TODO: Add input validation for email field

module.exports = { sendOtpController, otpLimiter };
