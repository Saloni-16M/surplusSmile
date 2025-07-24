const express = require("express");
const authenticateJWT = require("../middlewares/authMiddleware");
const logger = require('../utils/logger');

const {
  registerResort,
  loginResort,
  requestPasswordReset,
  resetPassword
} = require("../controllers/resortController");

const {
  createFoodDonation,
  getAllFoodDonationsByResort,
  getSingleDonation,
  updateDonationStatus,
  getResortDonationTracking
} = require("../controllers/foodDonationController"); // You'll need to create this controller

const router = express.Router();

//  Resort Auth Routes
router.post("/register", registerResort);
router.post("/login", loginResort);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post('/logout', authenticateJWT, (req, res) => {
  logger.info({
    event: 'logout',
    userType: 'Resort',
    userId: req.user.id,
    time: new Date().toISOString(),
    ip: req.ip
  });
  res.json({ message: 'Logout successful' });
});

// TODO: Add rate limiting to login and register endpoints
// TODO: Add input validation for all endpoints

//  Food Donation Routes
router.post("/donate", authenticateJWT,createFoodDonation); // Resort food donation route
router.get("/donations/:resortId",authenticateJWT, getAllFoodDonationsByResort); // Get all donations by one resort
router.get("/donation/:donationId",authenticateJWT, getSingleDonation); // View single donation
router.patch("/donation/:donationId/status",authenticateJWT, updateDonationStatus); // Admin/NGO updates donation status (Pending/Accepted/Rejected)
router.get("/donations/:resortId/track",authenticateJWT,getResortDonationTracking );
module.exports = router;