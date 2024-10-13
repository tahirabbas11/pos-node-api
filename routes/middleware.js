// const express = require('express');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const auth = async (req, res, next) => {
//     const authorization = req.headers.authorization;
//     const token = authorization ? authorization.replace('Bearer ', '') : null;

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo');
//       const user = await User.findOne({ _id: decoded.userId, token });

//       if (!user || user.tokenExpiration < Date.now()) {
//         throw new Error();
//       }

//       req.user = user;
//       next();
//     } catch (error) {
//       res.status(401).json({ message: 'Please authenticate' });
//     }
//   };

//   module.exports = auth;

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization ? authorization.replace('Bearer ', '') : null;

  try {
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo');
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    await user.removeExpiredTokens();

    const validToken = user.tokens.find(t => t.token === token && t.expiration > Date.now());

    if (!validToken) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth;
