const Otp = require("../models/Otp");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const validOtp = await Otp.findOne({ email, otp });

    if (!validOtp) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }

    // OTP valid - proceed with verification or registration
    await Otp.deleteMany({ email }); // optional cleanup
    res.status(200).json({ message: "OTP verified" });

  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
module.exports={verifyOtp};