const Ngo = require("../models/Ngo");
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");

// NGO Registration
const registerNgo = async (req, res) => {
  const { name, email, location, phone_no, isCertified } = req.body;

  try {
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo)
      return res.status(400).json({ message: "NGO already registered" });

    const newNgo = new Ngo({ name, email, location, phone_no, isCertified });
    await newNgo.save();

    res
      .status(201)
      .json({ message: "NGO registered, awaiting admin approval" });
  } catch (error) {
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

module.exports={loginNgo,registerNgo}