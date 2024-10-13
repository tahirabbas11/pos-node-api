const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: false },
    price: { type: Number, required: true },
    vendorPrice: { type: Number, required: true },
    category: { type: String, required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    quantity: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;

