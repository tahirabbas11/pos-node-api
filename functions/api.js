const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('morgan');
const auth = require('../routes/middleware.js');

dotenv.config();

const app = express();
const router = express.Router();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));


// Use router
app.use('/.netlify/functions/api', router);

// Import routes
const expenses = require('../routes/expenses');
const categoryRoute = require('../routes/categories');
const productRoute = require('../routes/products');
const invoiceRoute = require('../routes/invoices');
const authRoute = require('../routes/auth');
const userRoute = require('../routes/users');

// Setup routes
router.get('/', (req, res) => {
  res.json({
    name: 'Tahir Abbas',
    github: 'https://github.com/tahirabbas11',
    email: 'tahir.12868@iqra.edu.pk',
    contact: '0321-3600429',
    portfolio: 'https://thetahirabbas.netlify.app',
  });
});
router.use('/expenses', auth, expenses);
router.use('/categories', auth, categoryRoute);
router.use('/products', auth, productRoute);
router.use('/invoices', auth, invoiceRoute);
router.use('/auth', authRoute);
router.use('/users', auth, userRoute);


module.exports.handler = serverless(app);
