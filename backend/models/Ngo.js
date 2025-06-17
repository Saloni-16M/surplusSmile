const mongoose = require("mongoose");
const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_no: { type: String, required: true },
  isCertified: { type: Boolean, default: false },
  address: { type: String, required: true },
  password: { type: String, required: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  emailVerified: { type: Boolean, default: false },
  adminApprovalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
}, {
  timestamps: true,
});
// ✅ Correct
module.exports = mongoose.model('Ngo', ngoSchema);
