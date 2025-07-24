const mongoose = require("mongoose");
const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_no: { type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],},
  isCertified: { type: Boolean, default: false },
  address: { type: String, required: true },
  password: { type: String, required: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  emailVerified: { type: Boolean, default: false },
  adminApprovalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Ngo', ngoSchema);
