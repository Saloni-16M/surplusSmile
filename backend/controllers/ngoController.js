const Ngo = require("../models/Ngo");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailToAdmin = require("../utils/notifyEmail");
const Otp = require("../models/Otp"); // Make sure you import this

const registerNgo = async (req, res) => {
  const { name, email, location, phone_no, isCertified, otp, password } = req.body;

  try {
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res.status(400).json({ message: "NGO already registered" });
    }

    // ✅ Check OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ✅ Clean up OTP
    await Otp.deleteMany({ email });

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newNgo = new Ngo({
      name,
      email,
      location,
      phone_no,
      isCertified,
      password: hashedPassword,
      adminApprovalStatus: "Pending"
    });

    await newNgo.save();

    // ✅ Notify Admin
    const adminEmail = "saloni45055@gmail.com";
    const subject = "New NGO Registration Pending Approval";
    const message = `Dear Admin,

A new NGO has registered and is awaiting approval. Please review the details:

🔹 NGO Name: ${name}
🔹 Email: ${email}
🔹 Location: ${location}
🔹 Phone Number: ${phone_no}
🔹 Certified: ${isCertified ? "Yes" : "No"}

Please log in to the admin panel to approve.

Regards,
System Notification Team`;

    await sendEmailToAdmin(adminEmail, subject, message);

    res.status(201).json({ message: "NGO registered, awaiting admin approval" });
  } catch (error) {
    console.error("Register NGO error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


/* NGO Login */
const loginNgo = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the NGO exists and is approved
    const ngo = await Ngo.findOne({ email, adminApprovalStatus: "Approved" });
    if (!ngo) {
      return res
        .status(401)
        .json({ message: "Invalid email or NGO not approved" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: ngo._id, email: ngo.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in loginNgo:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { loginNgo, registerNgo };
