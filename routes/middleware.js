const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization ? authorization.replace('Bearer ', '') : null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded.userId, token });
  
      if (!user || user.tokenExpiration < Date.now()) {
        throw new Error();
      }
  
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Please authenticate' });
    }
  };

  module.exports = auth;
