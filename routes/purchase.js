// routes/vendor.js
const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase.js');
const Product = require('../models/Product.js');

router.post('/add-purchase', async (req, res) => {
  const { product, vendor, quantity, purchasingPrice, purchaseDate, notes } = req.body;

  try {
    // Find the product by ID
    const foundProduct = await Product.findById(product);
    if (!foundProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product's quantity
    foundProduct.quantity = (foundProduct.quantity || 0) + quantity; // Update quantity
    await foundProduct.save(); // Save the updated product

    // Create a new purchase
    const purchase = new Purchase({
      product,
      vendor,
      quantity,
      purchasingPrice,
      purchaseDate,
      notes,
    });

    await purchase.save(); // Save the purchase

    res.status(201).json({ message: "Purchase created successfully", purchase });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create purchase', error: error.message });
  }
});

router.get('/get-all', async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('product')
      .populate('vendor');
    res.status(200).json(purchases);
  } catch (error) {
    res.status(400).json({ message: 'Failed to retrieve purchases', error: error.message });
  }
});


module.exports = router;
