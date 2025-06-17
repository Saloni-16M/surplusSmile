const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_no: { type: String, required: true },
  isCertified: { type: Boolean, default: false },
  address: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
    emailVerified: { type: Boolean, default: false },
}, {
  timestamps: true,
});

ngoSchema.index({ location: "2dsphere" }); // For geospatial queries

module.exports = mongoose.model('Ngo', ngoSchema);
