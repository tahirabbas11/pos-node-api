const express = require("express");
const Expense = require("../models/Expenses.js");
const router = express.Router();

console.log(`Expenses route loaded.`);

//! Get all expenses
router.get("/get-all", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! Create a new expense
router.post("/add-expense", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    const savedExpense = await newExpense.save();
    res.status(200).json({ id: savedExpense._id });
  } catch (error) {
    res.status(500).json(error);
  }
});

//! Update an expense
router.put("/update-expense", async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.body.expenseId },  // Find by ID
      { 
        title: req.body.title, 
        amount: req.body.amount, 
        description: req.body.description,
        date: req.body.date 
      }, 
      { new: true }  // Return the updated document
    );
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json(error);
  }
});

//! Delete an expense
router.delete("/delete-expense", async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.body.expenseId });
    res.status(200).json("Expense deleted successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
