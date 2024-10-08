const Invoice = require("../models/Invoice.js");
const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();

//! Create invoice
router.post("/add-invoice", async (req, res) => {
  const { cartItems } = req.body;

  try {
    // Gather all product IDs from the cart
    const productIds = cartItems.map(item => item._id);

    // Fetch products in a single query
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a mapping of product IDs to their quantities
    const productMap = {};
    products.forEach(product => {
      productMap[product._id] = product;
    });

    // Check product availability and prepare to update quantities
    for (const item of cartItems) {
      const product = productMap[item._id];

      // Check if the product exists
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item._id} not found.` });
      }

      // Check if quantity is sufficient
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient quantity for ${product.title}. Available: ${product.quantity}, Requested: ${item.quantity}`,
        });
      }
    }

    // Create the invoice
    const invoice = new Invoice(req.body);
    await invoice.save();

    // Update product quantities in bulk
    const bulkOps = cartItems.map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOps);

    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// //! get all invoices
// router.get("/get-all", async (req, res) => {
//   try {
//     const invoices = await Invoice.find();
//     res.status(200).json(invoices);
//   } catch (error) {
//     res.send(400).json(error);
//   }
// });

router.get('/get-all', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { };
    const sort = { createdAt: 1 };

    // Function to get the start and end of a day
    const getStartOfDay = (date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      return start;
    };

    const getEndOfDay = (date) => {
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return end;
    };

    // Parse and validate startDate
    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (!isNaN(parsedStartDate.getTime())) {
        // Check if endDate is also provided and is the same as startDate
        if (endDate && new Date(endDate).toISOString() === parsedStartDate.toISOString()) {
          // If both dates are the same, set the range to the whole day
          filter.createdAt = {
            $gte: getStartOfDay(parsedStartDate),
            $lte: getEndOfDay(parsedStartDate)
          };
        } else {
          filter.createdAt = { $gte: parsedStartDate };
        }
      } else {
        return res.status(400).json({ message: 'Invalid start date' });
      }
    }

    // Parse and validate endDate
    if (endDate) {
      const parsedEndDate = new Date(endDate);
      if (!isNaN(parsedEndDate.getTime())) {
        if (filter.createdAt) {
          filter.createdAt.$lte = parsedEndDate;
        } else {
          filter.createdAt = { $lte: parsedEndDate };
        }
      } else {
        return res.status(400).json({ message: 'Invalid end date' });
      }
    }

    // Fetch invoices with the constructed filter
    const invoices = await Invoice.find(filter, {}, { sort });
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'No invoices found' });
    }

    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error); // Log the full error for debugging
    res.status(500).json({ message: 'Server error: Unable to fetch invoices' }); // Return a JSON response with an error message
  }
});



//! update invoice
// router.put("/update-invoice", async (req, res) => {
//   try {
//     await Invoice.findOneAndUpdate({ _id: req.body.invoiceId }, req.body);
//     res.status(200).json("Item updated successfully.");
//   } catch (error) {
//     res.send(400).json(error);
//   }
// });

//! delete invoice
// router.delete("/delete-invoice", async (req, res) => {
//   try {
//     await Invoice.findOneAndDelete({ _id: req.body.invoiceId });
//     res.status(200).json("Item deleted successfully.");
//   } catch (error) {
//     res.send(400).json(error);
//   }
// });

module.exports = router;
