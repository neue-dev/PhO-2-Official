require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();

//* Models
const User = require('../models/user');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const Score = require('../models/score');

//* Admin Routes
router.post('/submissionlog', async (req, res) => {

  // Retrieve data from database and send to user
  const submissions = await Submission.find({});
  const data = { submissions: [] };

  submissions.forEach(submission => { 
    data.submissions.push(submission)
  });

  res.json({
    submissions: data.submissions,
  });
});

module.exports = router;