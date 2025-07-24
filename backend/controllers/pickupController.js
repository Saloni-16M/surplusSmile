const FoodDonation = require("../models/FoodDonation");
const logger = require('../utils/logger');

// NGO confirms pickup
const confirmPickupByNgo = async (req, res) => {
  try {
    const { donationId } = req.params;
    const donation = await FoodDonation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    donation.pickupConfirmedByNGO = true;

    // If both have confirmed, mark as picked
    if (donation.pickupConfirmedByResort) {
      donation.pickupStatus = "Picked";
      donation.pickupDate = new Date();
    }

    await donation.save();
    logger.info({
      event: 'pickup_confirmed',
      userType: 'NGO',
      userId: req.user ? req.user.id : undefined,
      donationId,
      time: new Date().toISOString(),
      ip: req.ip
    });
    res.status(200).json({ message: "Pickup confirmed by NGO", donation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Resort confirms pickup
const confirmPickupByResort = async (req, res) => {
  try {
    const { donationId } = req.params;
    console.log('[DEBUG] Resort confirm pickup for donationId:', donationId);
    const donation = await FoodDonation.findById(donationId);
    if (!donation) {
      console.log('[DEBUG] Donation not found for ID:', donationId);
      return res.status(404).json({ message: "Donation not found" });
    }

    donation.pickupConfirmedByResort = true;

    // If both have confirmed, mark as picked
    if (donation.pickupConfirmedByNGO) {
      donation.pickupStatus = "Picked";
      donation.pickupDate = new Date();
    }

    await donation.save();
    logger.info({
      event: 'pickup_confirmed',
      userType: 'Resort',
      userId: req.user ? req.user.id : undefined,
      donationId,
      time: new Date().toISOString(),
      ip: req.ip
    });
    res.status(200).json({ message: "Pickup confirmed by Resort", donation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Mark donation as fully picked (optional logic to use only when both have confirmed)
const markAsPicked = async (req, res) => {
  try {
    const { donationId } = req.params;
    const donation = await FoodDonation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });

    if (!donation.pickupConfirmedByNGO || !donation.pickupConfirmedByResort) {
      return res.status(400).json({ message: "Both parties must confirm pickup" });
    }

    donation.pickupStatus = "Picked";
    donation.pickupDate = new Date();
    await donation.save();

    res.status(200).json({ message: "Donation marked as picked", donation });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  confirmPickupByNgo,
  confirmPickupByResort,
  markAsPicked,
};