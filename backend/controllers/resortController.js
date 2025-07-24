const Resort = require("../models/Resort");
const bcrypt = require("bcryptjs");
const sendEmailToAdmin = require("../utils/notifyEmail");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp"); // Import OTP model
const crypto = require('crypto');
const sendResortEmail = require('../utils/sendResortEmail');
const logger = require('../utils/logger');

// Resort Registration
const registerResort = async (req, res) => {
  const { name, email, location, phone_no, isCertified, address } = req.body;

  try {
    // Validate required fields
    if (
      !name ||
      !email ||
      !phone_no ||
      !address ||
      !location?.coordinates?.length
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Check if resort already exists
    const existingResort = await Resort.findOne({ email });
    if (existingResort)
      return res.status(400).json({ message: "Resort already registered" });

    // ✅ Check if email is verified via OTP
    // const otpRecord = await Otp.findOne({
    //   email,
    //   type: "email",
    //   verified: true,
    // });
    // if (!otpRecord) {
    //   return res
    //     .status(403)
    //     .json({ message: "Please verify your email before registering." });
    // }

    // Prepare resort data with GeoJSON location and emailVerified
    const newResort = new Resort({
      name,
      email,
      phone_no,
      isCertified: !!isCertified,
      address,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      // emailVerified: true,
    });

    await newResort.save();

    // Optional: Delete OTP record after successful registration
    // await Otp.deleteMany({ email });

    // Send email to admin
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const subject = "New Resort Registration Pending Approval";
    const message = `Dear Admin,

A new Resort has registered and is awaiting approval. Please review the details:

🔹 Resort Name: ${name}
🔹 Email: ${email}
🔹 Phone Number: ${phone_no}
🔹 Certified: ${isCertified ? "Yes" : "No"}

Please log in to the admin panel to approve.

Regards,
System Notification Team`;

    await sendEmailToAdmin(adminEmail, subject, message);

    res
      .status(201)
      .json({ message: "Resort registered, awaiting admin approval." });
  } catch (error) {
    console.error("Error registering resort:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const loginResort = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the NGO exists and is approved
    const resort = await Resort.findOne({
      email,
      adminApprovalStatus: "Approved",
    });
    if (!resort) {
      return res
        .status(401)
        .json({ message: "Invalid email or RESORT not approved" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, resort.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: resort._id, email: resort.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    logger.info({
      event: 'login',
      userType: 'Resort',
      userId: resort._id,
      name: resort.name,
      time: new Date().toISOString(),
      ip: req.ip
    });

    res.status(200).json({
      message: "Login successful",
      token,
      resort: {
        _id: resort._id,
        name: resort.name,
        email: resort.email,
        location: resort.location,
        phone_no: resort.phone_no,
        isCertified: resort.isCertified,
      },
    });
  } catch (error) {
    console.error("Error in loginNgo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resort Password Reset: Request
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });
  const resort = await Resort.findOne({ email });
  if (!resort) return res.status(404).json({ message: 'No Resort found with that email.' });
  const token = crypto.randomBytes(32).toString('hex');
  resort.resetPasswordToken = token;
  resort.resetPasswordExpires = Date.now() + 1000 * 60 * 30; // 30 min
  await resort.save();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/resort/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendResortEmail(email, 'Resort Password Reset', `Reset your password: ${resetUrl}`);
  res.json({ message: 'Password reset link sent to your email.' });
};

// Resort Password Reset: Reset
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) return res.status(400).json({ message: 'All fields required.' });
  const resort = await Resort.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
  if (!resort) return res.status(400).json({ message: 'Invalid or expired token.' });
  resort.password = await bcrypt.hash(newPassword, 10);
  resort.resetPasswordToken = undefined;
  resort.resetPasswordExpires = undefined;
  await resort.save();
  res.json({ message: 'Password has been reset successfully.' });
};

module.exports = { loginResort, registerResort, requestPasswordReset, resetPassword };

// TODO: Add more robust input validation and sanitization for all endpoints
