require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generate, refresh } = require('../middleware/auth');
const router = express.Router();

//* Models
const User = require('../models/user');

//* Refresh tokens
let refreshTokens = [];

//* Authentication Routes
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password is provided
  if (!username || !password) {
    return res.json({ 
      message: 'User input error.',
      error: 'Username or password.',
    }).status(401);
  }

  // Look for user in database
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.json({
        message: "Login unsuccessful.",
        error: "User not found.",
      }).status(401);
    } else {

      if(user.status == 'disqualified' && !user.isAdmin) {
        return res.json({
          message: "Login unsuccessful.",
          error: "User disqualified.",
        }).status(401);
      }

      // Verify password if user is found
      bcrypt.compare(password, user.password)
        .then(response => {
          if(response) {

            // Create signed jwt token
            const accessToken = generate(user);
            const refreshToken = refresh(user);
            if(!refreshTokens.includes(refreshToken)) refreshTokens.push(refreshToken);
            
            return res.status(200).cookie('authorization', { accessToken, refreshToken }, {
              httpOnly: true,
              sameSite: 'lax',
            }).json({ message: 'Login success.' });

          } else {
            return res.json({ 
              message: 'Login unsuccessful.',
              error: 'Invalid login credentials.',
            }).status(401);
          }
        })
        .catch(error => res.json({ 
          message: 'Server error.',
          error: error.message 
        }).status(500))    
    }
  } catch (error) {
    return res.json({
      message: "Server error.",
      error: error.message,
    }).status(500)
  }
});

router.post('/token', (req, res) => {
  if(!req.cookies['authorization'])
    return res.json({
      message: "No auth.",
      error: "No auth tokens were provided.",
    }).status(401)

  const { refreshToken } = req.cookies['authorization'];
  
  if(!refreshToken)
    return res.json({
      message: "No refresh token.",
      error: "No refresh token was provided.",
    }).status(401)
  
  if(!refreshTokens.includes(refreshToken))
    return res.clearCookie('authorization').json({
      message: "Refresh token does not exist.",
      error: "The refresh token could not be found.",
    }).status(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) 
      return res.json({
        message: "Refresh token invalid.",
        error: "The refresh token could not be verified.",
      }).clearCookie('authorization').status(403)

    const accessToken = generate(user);
    
    if(user)
      return res.status(200).cookie('authorization', { accessToken, refreshToken }, {
        httpOnly: true,
        sameSite: 'lax',
      }).json({ message: 'Valid token.' });
    
    return res.json({ 
      message: 'Invalid token.',
      error: 'The refresh token was invalid.' 
    });
  });
});

router.post('/logout', (req, res) => {
  if(!req.cookies['authorization']) return;
  const { refreshToken } = req.cookies['authorization'];

  if(!refreshToken)
    return res.json({
      message: "No refresh token.",
      error: "No refresh token was provided.",
    }).status(401)

  // Revoke refresh token
  if(refreshTokens.includes(refreshToken))
    refreshTokens.splice(refreshTokens.indexOf(refreshToken), 1);
  
  return res.clearCookie('authorization').json({
    message: 'Logout success.'
  });
});

module.exports = router;