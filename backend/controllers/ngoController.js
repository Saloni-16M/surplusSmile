const Ngo = require("../models/Ngo");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailToAdmin = require("../utils/notifyEmail");
const Otp = require("../models/Otp");
// const { getSessionId, sendSmsOtp } = require("../utils/sendSmsOtp");
// const { verifySmsOtp } = require("../utils/verifySmsOtp");
const FoodDonation = require("../models/FoodDonation");

// ✅ Register NGO
const registerNgo = async (req, res) => {
  try {
    const { name, email, phone_no, isCertified, address, location } = req.body;

    // Validation
    if (!name || !email || !phone_no || !address || !location?.coordinates?.length) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    // 🔒 Check if email is verified via OTP
    const otpRecord = await Otp.findOne({ email, type: "email", verified: true });

    if (!otpRecord) {
      return res.status(403).json({ message: 'Please verify your email before registering.' });
    }

    // Check for duplicate email
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res.status(409).json({ message: 'NGO already registered with this email.' });
    }

    const newNgo = new Ngo({
      name,
      email,
      phone_no,
      isCertified,
      address,
      location,
       emailVerified: true,
    });

    await newNgo.save();

    // ✅ Optionally delete OTP to clean up
    // await Otp.deleteMany({ email });

    res.status(201).json({ message: 'NGO registered successfully.', ngo: newNgo });

  } catch (error) {
    console.error('Error registering NGO:', error);
    res.status(500).json({ message: 'Server error while registering NGO.' });
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

// ✅ Export all controllers
module.exports = {
  registerNgo,
  loginNgo,
  // sendPhoneOtp,
  // verifyPhoneOtp,
  getAcceptedDonationsByNgo,
};
