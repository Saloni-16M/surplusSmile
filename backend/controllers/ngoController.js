const Ngo = require("../models/Ngo");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmailToAdmin = require("../utils/notifyEmail");
const Otp = require("../models/Otp");
// const { getSessionId, sendSmsOtp } = require("../utils/sendSmsOtp");
// const { verifySmsOtp } = require("../utils/verifySmsOtp");
const FoodDonation = require("../models/FoodDonation");
const crypto = require('crypto');
const sendNgoEmail = require('../utils/sendNgoEmail');
const logger = require('../utils/logger');

// ✅ Register NGO
const registerNgo = async (req, res) => {
  try {
    const { name, email, phone_no, isCertified, address, location } = req.body;

    // Step 1: Validate required fields
    if (!name || !email || !phone_no || !address) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Step 2: Validate location and coordinates
    let parsedLocation = null;

    if (location?.coordinates && location.coordinates.length === 2) {
      const lon = parseFloat(location.coordinates[0]);
      const lat = parseFloat(location.coordinates[1]);

      if (!isNaN(lon) && !isNaN(lat)) {
        parsedLocation = {
          type: "Point",
          coordinates: [lon, lat],
        };
      }
    }

    // Step 3: Check if email is verified via OTP
    const otpRecord = await Otp.findOne({
      email,
      type: "email",
      verified: true,
    });
    if (!otpRecord) {
      return res
        .status(403)
        .json({ message: "Please verify your email before registering." });
    }

    // Step 4: Check for duplicate NGO
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res
        .status(409)
        .json({ message: "NGO already registered with this email." });
    }

    // Step 5: Parse coordinates to floats
    // const parsedLocation = {
    //   type: "Point",
    //   coordinates: [parseFloat(coords[0]), parseFloat(coords[1])],
    // };

    // Step 6: Create new NGO
    const newNgo = new Ngo({
      name,
      email,
      phone_no,
      isCertified,
      address,
      location: parsedLocation,
      emailVerified: true,
    });

    await newNgo.save();

    // Step 7: Notify Admin
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const subject = "New NGO Registration Pending Approval";
    const message = `Dear Admin,

A new NGO has registered and is awaiting approval. Please review the details:

🔹 Name: ${name}
🔹 Email: ${email}
🔹 Phone Number: ${phone_no}
🔹 Certified: ${isCertified ? "Yes" : "No"}

Please log in to the admin panel to approve.

Regards,
System Notification Team`;

    await sendEmailToAdmin(adminEmail, subject, message);

    // Step 8: Return success
    return res.status(201).json({
      message: "NGO registered successfully. Awaiting admin approval.",
      ngo: newNgo,
    });
  } catch (error) {
    console.error("❌ Error registering NGO:", error);
    return res
      .status(500)
      .json({ message: "Server error while registering NGO." });
  }
};

// ✅ Login NGO
const loginNgo = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ngo = await Ngo.findOne({ email, adminApprovalStatus: "Approved" });
    if (!ngo) {
      return res
        .status(401)
        .json({ message: "Invalid email or NGO not approved" });
    }

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: ngo._id, email: ngo.email }, // 👈 'id' is used in JWT payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info({
      event: 'login',
      userType: 'NGO',
      userId: ngo._id,
      name: ngo.name,
      time: new Date().toISOString(),
      ip: req.ip
    });

    res.status(200).json({
      message: "Login successful",
      token,
      ngo: {
        _id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        location: ngo.location,
        phone_no: ngo.phone_no,
        isCertified: ngo.isCertified,
      },
    });
  } catch (error) {
    console.error("Error in loginNgo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Send Phone OTP
// const sendPhoneOtp = async (req, res) => {
//   const { phone_no } = req.body;

//   try {
//     await sendSmsOtp(phone_no);
//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("Phone OTP Send Error:", err);
//     res.status(500).json({ message: "Failed to send OTP", error: err.message });
//   }
// };

// ✅ Verify Phone OTP
// const verifyPhoneOtp = async (req, res) => {
//   const { phone_no, otp } = req.body;

//   try {
//     const sessionId = getSessionId(phone_no);
//     if (!sessionId) {
//       return res.status(400).json({ message: "Session not found. Please request a new OTP." });
//     }

//     const isValid = await verifySmsOtp(sessionId, otp);
//     if (!isValid) {
//       return res.status(400).json({ message: "Incorrect or expired OTP" });
//     }

//     // ✅ Mark phone as verified
//     await Otp.updateOne(
//       { phone_no, type: "phone" },
//       { verified: true },
//       { upsert: true }
//     );

//     res.status(200).json({ message: "Phone number verified successfully" });
//   } catch (err) {
//     console.error("Phone OTP Verification Error:", err);
//     res.status(500).json({ message: "OTP verification failed", error: err.message });
//   }
// };

// ✅ Get accepted donations for a particular NGO
// Adjust path as needed

const getAcceptedDonationsByNgo = async (req, res) => {
  try {
    console.log("✅ Authenticated User:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User ID not found in request" });
    }

    const ngoObjectId = new mongoose.Types.ObjectId(req.user.id);

    const acceptedDonations = await FoodDonation.find({
      assignedNGO: ngoObjectId,
      status: "Accepted",
    })
      .populate("resortId")
      .populate("assignedNGO");

    console.log("✅ Accepted Donations found:", acceptedDonations.length);

    if (acceptedDonations.length === 0) {
      return res.status(404).json({ message: "No accepted donations found" });
    }

    return res.status(200).json(acceptedDonations);
  } catch (error) {
    console.error("❌ Error fetching accepted donations:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// NGO Password Reset: Request
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });
  const ngo = await Ngo.findOne({ email });
  if (!ngo) return res.status(404).json({ message: 'No NGO found with that email.' });
  const token = crypto.randomBytes(32).toString('hex');
  ngo.resetPasswordToken = token;
  ngo.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
  await ngo.save();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/ngo/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendNgoEmail(email, 'NGO Password Reset', `Reset your password: ${resetUrl}`);
  res.json({ message: 'Password reset link sent to your email.' });
};

// NGO Password Reset: Reset
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) return res.status(400).json({ message: 'All fields required.' });
  const ngo = await Ngo.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!ngo) return res.status(400).json({ message: 'Invalid or expired token.' });
  ngo.password = await bcrypt.hash(newPassword, 10);
  ngo.resetPasswordToken = undefined;
  ngo.resetPasswordExpires = undefined;
  await ngo.save();
  res.json({ message: 'Password has been reset successfully.' });
};

// TODO: Add more robust input validation and sanitization for all endpoints

// ✅ Export all controllers
module.exports = {
  registerNgo,
  loginNgo,
  // sendPhoneOtp,
  // verifyPhoneOtp,
  getAcceptedDonationsByNgo,
  requestPasswordReset,
  resetPassword,
};
