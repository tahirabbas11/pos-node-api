const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    purchasingPrice: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "", // Optional field, defaults to an empty string
    },
    product: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Product
      ref: "products", // Ensure this matches the model name in the Product model
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Vendor
      ref: "Vendor", // Ensure this matches the model name in the Vendor model
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create the Purchase model
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
