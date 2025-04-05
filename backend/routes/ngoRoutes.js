const express = require("express");
const {
  registerNgo,
  loginNgo,
} = require("../controllers/ngoController");

const { sendOtpController } = require("../controllers/sendOtpController"); // ✅ Add this line!
const {verifyOtp}=require('../controllers/verifyOtp');
const router = express.Router();

router.post("/register", registerNgo);
router.post("/login", loginNgo);
router.post("/send-otp", sendOtpController); // ✅ Add this
// Route to verify OTP
router.post("/verify-otp", verifyOtp);

module.exports = router;
