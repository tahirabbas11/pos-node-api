// routes/vendor.js
const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendors.js');

// Create a new vendor
router.post('/add-vendor', async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json({ vendor });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create vendor', error });
  }
});

// Get all vendors
router.get('/get-all', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({ vendors });
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch vendors', error });
  }
});

// Update a vendor
router.put('/update-vendor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ vendor: updatedVendor });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update vendor', error });
  }
});

// Delete a vendor
router.delete('/delete-vendor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVendor = await Vendor.findByIdAndDelete(id);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete vendor', error });
  }
});

module.exports = router;
