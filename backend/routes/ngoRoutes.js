const express = require("express");
const {
  registerNgo,
  loginNgo,
  sendPhoneOtp,
  verifyPhoneOtp,
  getAcceptedDonationsByNgo,
} = require("../controllers/ngoController");
const authenticateJWT = require("../middlewares/authMiddleware");
const {
  getAllPendingDonationsForNGO,
  updateDonationStatus,
} = require("../controllers/foodDonationController");

const { sendOtpController } = require("../controllers/sendOtpController"); 
const { verifyEmailOtp } = require("../utils/verifyOtp");
const router = express.Router();

router.post("/register", registerNgo);
router.post("/login", loginNgo);
router.post("/send-otp", sendOtpController);

// Route to verify OTP
router.post("/verify-otp", verifyEmailOtp);
router.post("/send-phone-otp", sendPhoneOtp);
router.post("/verify-phone-otp", verifyPhoneOtp);

// NGO Access to Donations
router.get("/donations/pending", getAllPendingDonationsForNGO); // Get pending donations
router.patch("/donation/:donationId/status", updateDonationStatus); // NGO accepts/rejects

<<<<<<< HEAD
// PUT route to schedule pickup
// router.put("/donation/:donationId/schedule-pickup", schedulePickup);

// routes/ngoRoutes.js
router.post("/fcm-token", async (req, res) => {
  const { ngoId, fcmToken } = req.body;

  try {
    await Ngo.findByIdAndUpdate(ngoId, { fcmToken });
    res.status(200).json({ message: "FCM token saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving FCM token" });
  }
});


router.get("/donations/accepted",authenticateJWT, getAcceptedDonationsByNgo);
=======
router.get("/donations/accepted", authenticateJWT, getAcceptedDonationsByNgo);
>>>>>>> 11eb3ff
module.exports = router;
