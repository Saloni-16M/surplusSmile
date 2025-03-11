const Ngo = require("../models/Ngo");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/emailService");

// NGO Registration
exports.registerNgo = async (req, res) => {
  const { name, email, location,phone_no, isCertified } = req.body;

  try {
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) return res.status(400).json({ message: "NGO already registered" });

    const newNgo = new Ngo({ name, email, location,phone_no, isCertified });
    await newNgo.save();

    res.status(201).json({ message: "NGO registered, awaiting admin approval" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// // Admin Approves NGO & Sends Login
exports.verifyNgo = async (req, res) => {
  const { email, status, adminComments } = req.body; // Accept status & comments from admin

  try {
    const ngo = await Ngo.findOne({ email });
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    if (status === "Approved") {
      const password = Math.random().toString(36).slice(-8); // Generate random password
      const hashedPassword = await bcrypt.hash(password, 10);

      ngo.isVerified = true;
      ngo.adminApprovalStatus = "Approved";
      ngo.adminComments = adminComments || "Approved by admin.";
      ngo.loginId = email;
      ngo.password = hashedPassword;
      
      await ngo.save();

      await sendEmail(
        email,
        "NGO Approval",
        `Congratulations! Your NGO has been approved.\n\nLogin Credentials:\nLogin ID: ${email}\nPassword: ${password}`
      );

      res.json({ message: "NGO approved and credentials sent." });
    } else if (status === "Rejected") {
      ngo.isVerified = false;
      ngo.adminApprovalStatus = "Rejected";
      ngo.adminComments = adminComments || "Rejected by admin.";
      
      await ngo.save();

      await sendEmail(
        email,
        "NGO Rejection Notice",
        `Unfortunately, your NGO registration has been rejected.\nReason: ${ngo.adminComments}`
      );

      res.json({ message: "NGO rejected and notification sent." });
    } else {
      res.status(400).json({ message: "Invalid status. Use 'Approved' or 'Rejected'." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
