const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const port = process.env.PORT || 4000;
const auth = require("./routes/middleware.js");

dotenv.config();

//routes
const categoryRoute = require("./routes/categories.js");
const productRoute = require("./routes/products.js");
const invoiceRoute = require("./routes/invoices.js");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");

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
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization'
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
app.use("/api/auth", authRoute);
app.use("/api/users",auth, userRoute);

app.listen(port, () => {
  connect();
  console.log(`Listening on port ${port}`);
});
