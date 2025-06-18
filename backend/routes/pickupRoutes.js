const express = require("express");
const router = express.Router();

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

module.exports = router;
