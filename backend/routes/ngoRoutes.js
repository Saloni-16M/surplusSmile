const express = require("express");
const {
  registerNgo,
  loginNgo,
  sendPhoneOtp,
  verifyPhoneOtp,
  getAcceptedDonationsByNgo,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/ngoController");
const authenticateJWT = require("../middlewares/authMiddleware");
const logger = require('../utils/logger');
const {
  getAllPendingDonationsForNGO,
  updateDonationStatus,
} = require("../controllers/foodDonationController");

const { sendOtpController, otpLimiter } = require("../controllers/sendOtpController"); 
const { verifyEmailOtp } = require("../utils/verifyOtp");
const router = express.Router();

router.post("/register", registerNgo);
router.post("/login", loginNgo);
// TODO: Add rate limiting to login and register endpoints
// TODO: Add input validation for all endpoints

// Route to verify OTP
router.post("/verify-otp", verifyEmailOtp);
// Apply rate limiter to OTP endpoint
router.post("/send-otp", otpLimiter, sendOtpController);
// router.post("/send-phone-otp", sendPhoneOtp);
// router.post("/verify-phone-otp", verifyPhoneOtp);

// NGO Access to Donations
router.get("/donations/pending",authenticateJWT, getAllPendingDonationsForNGO); // Get pending donations
router.patch("/donation/:donationId/status",authenticateJWT, updateDonationStatus); // NGO accepts/rejects

router.get("/donations/accepted", authenticateJWT, getAcceptedDonationsByNgo);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post('/logout', authenticateJWT, (req, res) => {
  logger.info({
    event: 'logout',
    userType: 'NGO',
    userId: req.user.id,
    time: new Date().toISOString(),
    ip: req.ip
  });
  res.json({ message: 'Logout successful' });
});
module.exports = router;
