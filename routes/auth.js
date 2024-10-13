const User = require("../models/User.js");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


// // register
// router.post("/register", async (req, res) => {
//   try {
//     const { userName='Tahir', email='tahir03083740911@gmail.com', password='tahir03083740911@gmail.com' } = req.body;
//     const salt = await bcrypt.genSaltSync(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = new User({ userName, email, password: hashedPassword });
//     await newUser.save();
//     res.status(200).json("A new user created successfully");
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

//login
// ! login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'demo', { expiresIn: '6h' });
//     user.token = token;
//     user.tokenExpiration = Date.now() + 6 * 60 * 60 * 1000; // 6 hours
//     await user.save();

//     res.status(200).json({ token });
//   } catch (error) {

//     res.status(500).json({ error: error.message });
//   }
// });

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate a new token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'demo', { expiresIn: '6h' });
    const expiration = Date.now() + 6 * 60 * 60 * 1000; // 6 hours

    // Add token to the tokens array
    user.tokens.push({ token, expiration });
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/logout', async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization ? authorization.replace('Bearer ', '') : null;

  try {
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Find the user based on the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo');
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Remove the token from the user's tokens array
    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
