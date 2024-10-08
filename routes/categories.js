const Category = require("../models/Category.js");
const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();

//! get all category
router.get("/get-all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! create category
router.post("/add-category", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(200).json({id: savedCategory._id});
  } catch (error) {
    res.status(500).json(error);
  }
});

//! update category
router.put("/update-category", async (req, res) => {
  try {
    // Find the old category by ID
    const oldCategory = await Category.findOne({ _id: req.body.categoryId });

    // If the category title is different from the new title
    if (oldCategory.title !== req.body.title) {
      // Update the category title in the Category collection
      await Category.findOneAndUpdate(
        { _id: req.body.categoryId }, 
        { title: req.body.title }
      );

      // Update the category field in all related Product documents
      await Product.updateMany(
        { category: oldCategory.title },  // Use the category field in the query
        { category: req.body.title }      // Update to the new category title
      )
    }

    res.status(200).json("Category updated successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});


//! delete category
router.delete("/delete-category", async (req, res) => {
  try {
    await Category.findOneAndDelete({ _id: req.body.categoryId });
    res.status(200).json("Item deleted successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
