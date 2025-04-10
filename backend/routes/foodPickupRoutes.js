const express = require("express");
const router = express.Router();
const { confirmPickupByNgo, confirmPickupByResort, markAsPicked } = require("../controllers/pickupController");
const auth = require("../middlewares/authMiddleware");

// NGO confirms that pickup is done
router.put("/confirm-by-ngo/:donationId", auth, confirmPickupByNgo);

// Resort confirms that pickup is done
router.put("/confirm-by-resort/:donationId", auth, confirmPickupByResort);

// Admin or system marks the donation as picked
router.put("/mark-picked/:donationId", auth, markAsPicked);

module.exports = router;
