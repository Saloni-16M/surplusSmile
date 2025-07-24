const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authMiddleware");
const {
  confirmPickupByNgo,
  confirmPickupByResort,
  markAsPicked,
} = require("../controllers/pickupController");

// NGO confirms pickup
router.put("/ngo/:donationId", authenticateJWT,confirmPickupByNgo);

// Resort confirms pickup
router.put("/resort/:donationId",authenticateJWT, confirmPickupByResort);

// Mark donation as picked (after both confirmations)
router.put("/mark/:donationId",authenticateJWT, markAsPicked);

// TEMP: Debug route to check if a donation exists by ID
// router.get('/resort/:donationId', async (req, res) => {
//   const FoodDonation = require('../models/FoodDonation');
//   const donation = await FoodDonation.findById(req.params.donationId);
//   if (!donation) return res.status(404).json({ message: "Donation not found" });
//   res.json(donation);
// });

module.exports = router;
