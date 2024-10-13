const Product = require("../models/Product.js");
const Purchase   = require("../models/Purchase.js");
const express = require("express");
const router = express.Router();

//! get all product
router.get("/get-all", async (req, res) => {
  try {
    const products = await Product.find();
    
    // const purchases = []; // To store the purchase records before saving them

    // // Loop through each product and create a purchase
    // for (const product of products) {
    //   const purchase = new Purchase({
    //     product: product._id,
    //     vendor: product.vendor, // Set the vendor or fetch dynamically if needed
    //     purchasingPrice: product.vendorPrice, // Assuming vendorPrice exists in the product
    //     purchaseDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday or custom
    //     quantity: product.quantity, // Example quantity or dynamic
    //     // notes: `Purchase for product ${product.title}`, // Optional notes
    //   });

    //   // Save the purchase object into purchases array (to bulk insert later)
    //   purchases.push(purchase);
    // }

    // // Save all purchases at once
    // await Purchase.insertMany(purchases);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! create product
// router.post("/add-product", async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(200).json("Item added successfully.");
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
router.post("/add-product", async (req, res) => {
  try {
    // Create and save the new product
    const product = new Product(req.body);
    await product.save();

    // Create a corresponding purchase after the product is saved
    const purchase = new Purchase({
      product: product._id,
      vendor: product.vendor,
      purchasingPrice: product.vendorPrice,
      purchaseDate: new Date(),
      quantity: product.quantity,
    });

    // Save the purchase
    await purchase.save();

    res.status(200).json({ message: "Product and Purchase added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error });
  }
});

//! Update product and reflect changes in purchases
router.put("/update-product", async (req, res) => {
  try {
    // Step 1: Update the product first
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.body.productId },
      req.body,
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 2: Find all purchases that are related to the updated product
    const purchasesToUpdate = await Purchase.find({ product: req.body.productId });

    if (purchasesToUpdate.length > 0) {
      // Step 3: Update the vendor and purchasingPrice for all related purchases
      await Promise.all(
        purchasesToUpdate.map(async (purchase) => {
          purchase.vendor = req.body.vendor;
          purchase.purchasingPrice = req.body.vendorPrice;
          await purchase.save();
        })
      );
    }

    res.status(200).json("Product and related purchases updated successfully.");
  } catch (error) {
    res.status(500).json({ message: "Error updating product or purchases", error });
  }
});


//! delete product
router.delete("/delete-product", async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.body.productId });
    res.status(200).json("Item deleted successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
