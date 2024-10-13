const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const port = process.env.PORT || 4000;
const auth = require("./routes/middleware.js");

dotenv.config();


// Set up multer storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

//routes
const categoryRoute = require("./routes/categories.js");
const productRoute = require("./routes/products.js");
const invoiceRoute = require("./routes/invoices.js");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");
const vendors = require("./routes/vendors.js");
const purchaseRoute = require("./routes/purchase.js");
const expenseRoute = require("./routes/expenses.js");

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};

//middlewares
app.use(logger("dev"));
app.use(express.json());
// Use CORS middleware
app.use(cors({
  origin: '*', // or '*' to allow all origins
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.get('/', (req, res) => {
  res.json({
    name: 'Tahir Abbas',
    github: 'https://github.com/tahirabbas11',
    email: 'tahir.12868@iqra.edu.pk',
    contact: '0321-3600429',
    portfolio:'https://thetahirabbas.netlify.app'
  });
});

app.use("/api/categories",auth, categoryRoute);
app.use("/api/products",auth, productRoute);
app.use("/api/invoices",auth,  invoiceRoute);
app.use("/api/vendors",auth,  vendors);
app.use("/api/auth", authRoute);
app.use("/api/users",auth, userRoute);
app.use("/api/purchase",auth, purchaseRoute);
app.use("/api/expenses",auth, expenseRoute);

app.listen(port,'0.0.0.0', () => {
  connect();
  console.log(`Listening on port ${port}`);
});
