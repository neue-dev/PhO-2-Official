require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const identify = require('../middleware/identify');
const router = express.Router();
const { auth } = require('../middleware/auth');
const checkAnswer = require('../middleware/check');

//* Models and Constants
const Config = require('../models/config');
const User = require('../models/user');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const Message = require('../models/message');

//* User Authentication
const isuser = function(req, res, callback){
  const user = auth(req, res);
  if(user){

    // Look for user
    identify(user._id)
      .then(userData => {
        if(!userData)
          // User does not exist
          return res.json({
            error: 'Invalid user is making the request.'
          }).status(403);

        if(userData.status == 'disqualified' && !user.isAdmin) {
          return res.json({
            message: "Disqualified user making request.",
            error: "User disqualified.",
          }).status(401);
        }

        return callback(userData);
      });
  } else {
    // Isnt logged in
    return res.json({
      error: 'User must be logged in to make request.'
    }).status(403);
  }
}

router.post('/data', (req, res) => {
  isuser(req, res, async data => {
    res.json({
      username: data.username,
      category: data.category,
      lastSubmit: data.lastSubmit,
      lastMessage: data.lastMessage,
    });
  });
});

router.post('/scorelist', (req, res) => {
  isuser(req, res, async () => {
    
    // Retrieve data from database and send to user
    const users = await User.find();
    const data = { users: [] };

    users.forEach(user => {
      const userData = {
        _id: user._id,
        username: user.username,
        attempts: (user.attempts.filter(attempt => attempt.verdict)).map(attempt => attempt.problem_id),
        category: user.category,
      };

      // If competition is done
      if(!true)
        userData['score'] = user.score;

      if(user.status == 'participating') 
        data.users.push(userData)
    });

    res.json(data);
  });
});

router.post('/configlist', (req, res) => {
  isuser(req, res, async () => {
  
    // Retrieve data from database and send to user
    const config = await Config.find();
    const data = { config: [] };

    config.forEach(configParameter => {
      if(configParameter.security == 'public')
        data.config.push({
          key: configParameter.key,
          value: configParameter.value
        })
    });

    res.json(data);
  });
});

router.post('/announcementlist', (req, res) => {
  isuser(req, res, async () => {
  
    // Retrieve data from database and send to user
    const announcements = await Message.find();
    const data = { announcements: [] };

    announcements.forEach(announcement => {
      data.announcements.push({
        id: announcement._id.toString(),
        title: announcement.title,
        content: announcement.content,
        timestamp: announcement.timestamp,
      })
    });

    res.json(data);
  });
});

router.post('/problemlist', (req, res) => {
  isuser(req, res, async () => {
    
    // Retrieve data from database and send to user
    const problems = await Problem.find();
    const data = { problems: [] };

    problems.forEach(problem => {
      if(problem.status == 'active') 
        data.problems.push({
          _id: problem._id,
          name: problem.name,
          code: problem.code,
          points: problem.points,
        })
    });

    res.json(data);
  });
});

router.post('/submissionlist', (req, res) => {
  isuser(req, res, async userData => {
    
    // Retrieve data from database and send to user
    const submissions = await Submission.find({ user_id: userData._id });
    const data = { submissions: submissions };

    res.json(data);
  });
});

router.post('/submit', (req, res) => {
  isuser(req, res, async userData => {
    const { code, answer } = req.body;
    const username = userData.username;

    // Retrieve data from database and send to user
    const user = await User.findOne({ username: username });
    const problem = await Problem.findOne({ "code.number": code.number, "code.alpha": code.alpha });
    const answerKey = problem.answer;
    const tolerance = problem.tolerance;
    
    if(!user)
      return res.json({
        message: "User does not exist.",
        error: "You cannot submit as a non-user.",
      }).status(401);
    
    if((new Date()).getTime() - user.lastSubmit < parseInt(process.env.SUBMISSION_COOLDOWN))
      return res.json({
        message: "Cooldown insufficient.",
        error: "You can only submit in 5-minute intervals.",
      }).status(401);

    if((new Date()).getTime() < process.env.CONTEST_ELIMS_START)
      return res.json({
        message: "Eliminations have not started.",
        error: "You must wait for the contest to start.",
      }).status(401);

    if((new Date()).getTime() > process.env.CONTEST_ELIMS_END)
      return res.json({
        message: "Eliminations have already ended.",
        error: "You can no longer submit after the eliminations have ended.",
      }).status(401);

    if(!problem)
      return res.json({
        message: "Problem does not exist.",
        error: "You cannot submit to a nonexistent problem.",
      }).status(401);
    
    if(problem.status == 'disabled')
      return res.json({
        message: "Problem no longer exists.",
        error: "You cannot submit to a nonexistent problem.",
      }).status(401);

    if(user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString()).length)
      if(user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString())[0].count >= process.env.SUBMISSION_ATTEMPTS)
        return res.json({
          message: "Max attempts for problem reached.",
          error: "There is a limit to the number of submissions per problem.",
        }).status(401);

    if(user.attempts.filter(attempt => 
      attempt.problem_id.toString() == problem._id.toString() && 
      attempt.verdict).length) 
      return res.json({
        message: "Problem already answered correctly.",
        error: "You already got this problem right....",
      }).status(401);
  
    const verdict = checkAnswer(answer, answerKey, tolerance);
    const timestamp = (new Date()).getTime();
    const submission_id = new mongoose.Types.ObjectId();

    // Try to save to database
    try {

      let count = 
        user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString()).length ?
        user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString())[0].count : 0;

      // Update the user's attempts
      if(!count) {
        await User.updateOne(
          { username: username },
          { $set: { 
            "attempts": user.attempts.concat([{
              problem_id: problem._id,
              count: 1,
              verdict: verdict, 
            }]),
            "lastSubmit": timestamp,
          }},
          { arrayFilters: [
            { "attempt.problem_id": problem._id, }
          ]}
        );  

      } else {
        await User.updateOne(
          { username: username },
          { $set: { 
            "attempts.$[attempt].count": count + 1,
            "attempts.$[attempt].verdict": verdict,
            "lastSubmit": timestamp,
          }},
          { arrayFilters: [
            { "attempt.problem_id": problem._id, }
          ]}
        );
      }

      const data = new Submission({
        _id: submission_id,
        user_id: user._id,
        username: user.username,
        problem_id: problem._id,
        problemCodeName: problem.code.number + problem.code.alpha + ' ' + problem.name,
        answer: answer,
        verdict: verdict ? 'correct' : 'wrong',
        timestamp: timestamp,
      }, { collection: 'submissions' });
      let submission = await data.save();

      return res.status(200).json({
        message: 'Submission logged successfully.',
      });
    } catch (error) {
      return res.json({ 
        message: 'Server error.',
        error: error.message
      }).status(500);
    }
  });
});

router.post('/message', (req, res) => {
  isuser(req, res, async userData => {
    
    //! Save the message into the messages database
    //! Update the user's lastMessage property


  })
});

router.post('/messages', (req, res) => {
  isuser(req, res, async userData => {
    //! retrieve the user's messages

  })
});

module.exports = router;