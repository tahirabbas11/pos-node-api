const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
