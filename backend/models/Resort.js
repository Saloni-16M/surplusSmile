const mongoose = require("mongoose");

const resortSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  phone_no: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"],
  },
  isVerified: { type: Boolean, default: false },
  // emailVerified: { type: Boolean, default: false }, // ✅ Added
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  }, // ✅ Updated to GeoJSON format
  loginId: { type: String },
  password: { type: String },
  adminApprovalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  adminComments: { type: String, default: "" },
}, { timestamps: true });

// Add 2dsphere index for geospatial queries
resortSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Resort", resortSchema);
