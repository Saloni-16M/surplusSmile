const Resort = require("../models/Resort");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/emailService");

// Resort Registration
exports.registerResort = async (req, res) => {
  const { name, email, location,phone_no, isCertified } = req.body;

  try {
    const existingResort = await Resort.findOne({ email });
    if (existingResort) return res.status(400).json({ message: "Resort already registered" });

    const newResort = new Resort({ name, email, location,phone_no, isCertified });
    await newResort.save();

    res.status(201).json({ message: "Resort registered, awaiting admin approval" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

