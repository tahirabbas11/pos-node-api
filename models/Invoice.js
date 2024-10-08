// const mongoose = require("mongoose");

// const InvoiceSchema = mongoose.Schema(
//   {
//     customerName: { type: String, required: true },
//     customerPhoneNumber: { type: String, required: false },
//     invoiceNumber: { type: String, required: false },
//     paymentMode: { type: String, required: true },
//     cartItems: { type: Array, required: true },
//     subTotal: { type: Number, required: true },
//     tax: { type: Number, required: true },
//     totalAmount: { type: Number, required: true },
//     discount: { type: Number, required: true, default: 0 },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Invoice = mongoose.model("invoices", InvoiceSchema);

// module.exports = Invoice;

const mongoose = require("mongoose");

// Define the Counter Schema for auto-incrementing invoice numbers
const CounterSchema = new mongoose.Schema({
  model: { type: String, required: true },
  field: { type: String, required: true },
  count: { type: Number, default: 0 },
});

// Create the Counter model
const Counter = mongoose.model("Counter", CounterSchema);

// Define the Invoice Schema
const InvoiceSchema = mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhoneNumber: { type: String, required: false },
    invoiceNumber: { type: String, required: false }, // Will be generated automatically
    paymentMode: { type: String, required: true },
    cartItems: { type: Array, required: true },
    subTotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Function to get the next invoice number
const getNewInvoiceNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { model: "Invoice", field: "invoiceNumber" }, // Specify the model and field
    { $inc: { count: 1 } }, // Increment the count
    { new: true, upsert: true } // Create if it doesn't exist
  );

  // Format the invoice number as needed with 8 digits
  return counter.count.toString().padStart(8, '0'); // 8-digit format
};

// Pre-save hook to auto-increment invoiceNumber
InvoiceSchema.pre("save", async function (next) {
  if (this.isNew) { // Check if it's a new record
    try {
      this.invoiceNumber = await getNewInvoiceNumber(); // Assign the new invoice number
      next(); // Proceed with saving
    } catch (err) {
      next(err); // Handle error
    }
  } else {
    next(); // Just save if it's not a new record
  }
});

// Create the Invoice model
const Invoice = mongoose.model("invoices", InvoiceSchema);

// Export the Invoice model
module.exports = Invoice;

