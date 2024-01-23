require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const identify = require('../middleware/identify');
const router = express.Router();
const { auth } = require('../middleware/auth');
const checkAnswer = require('../middleware/check');

//* Models and Constants
const User = require('../models/user');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const Score = require('../models/score');
const submission = require('../models/submission');
const saltRounds = 10;

//* Admin Authentication
const admin = function(req, res, callback){
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

        // Provide data if allowed
        if(userData.isAdmin)
          return callback();
          
        return res.json({
          error: 'Unauthorized user is making the request.'
        }).status(403);
      });
  } else {
    // Isnt logged in
    return res.json({
      error: 'User must be logged in to make request.'
    }).status(403);
  }
}

//* Admin Routes
router.post('/registeruser', (req, res) => {
  admin(req, res, async () => {
    const { username, password, category } = req.body;
    const isAdmin = req.body.isAdmin || false;
    const user = await User.findOne({ username: username });

    // Check if user exists
    if (user)
      return res.json({
        message: "User already exists.",
        error: "User with the username already exists.",
      }).status(401);

    // Hash password first
    await bcrypt.hash(password, saltRounds)
      .then(async hash => {

        // Create the document
        const data = new User({
          _id: new mongoose.Types.ObjectId(),
          username: username,
          password: hash,
          isAdmin: isAdmin,
          category: category,
          status: 'participating',
          score: 0,
          answered: [],
          submissions: [],
          lastSubmit: 0,
        }, { collection: 'users' });

        // Try to save to database
        try {
          let user = await data.save();
          return res.status(200).json({
            message: 'User registration success.',
          });
        } catch (error) {
          return res.json({ 
            message: 'Server error.', 
            error: error.message 
          }).status(500);
        }
      })
      .catch(error => res.json({ 
        message: 'Server error.',
        error: error.message 
      }).status(500));
  });
});

router.post('/edituser', (req, res) => {
  admin(req, res, async () => {
    const { username, password, category, status } = req.body;
    const user = await User.findOne({ username: username });
    let userStatus = status;
    let userCategory = category;
    
    // Fallback thingz
    if (!userStatus || userStatus == '') userStatus = user.status;
    if (!userCategory || userCategory == '') userCategory = user.category;

    // Check if user exists
    if(user) {
      try {
        if(password !== '' && password !== undefined){
          
          // Hash password first
          await bcrypt.hash(password, saltRounds)
          .then(async hash => {
            await User.updateOne(
              { username: username },
              { $set: 
                {
                  password: hash,
                  category: userCategory,
                  status: userStatus,
                }
              });
            return res.status(200).json({
              message: 'User edited successfully.',
            });
          })
          .catch(error => res.json({ 
            message: 'Server error.',
            error: error.message 
          }).status(500));
        } else {
          await User.updateOne(
            { username: username },
            { status: userStatus, category: userCategory });
          return res.status(200).json({
            message: 'User edited successfully.',
          });
        }
      } catch(err) {
        return res.json({
          error: 'Something went wrong. Try again.'
        }).status(500);
      }
    } else {
      return res.json({
        error: 'User to be edited does not exist.'
      }).status(401);
    }
  })
});


router.post('/deleteuser', (req, res) => {
  admin(req, res, async () => {
    const { username } = req.body;
    const user = await User.findOne({ username: username });

    // Check if user exists
    if(user) {
      try {
        await User.deleteOne({ username: username });
        return res.status(200).json({
          message: 'User deletion success.',
        });
      } catch(err) {
        return res.json({
          error: 'Something went wrong. Try again.'
        }).status(500);
      }
    } else {
      return res.json({
        error: 'User to be deleted does not exist.'
      }).status(401);
    }
  })
});

router.post('/userlist', (req, res) => {
  admin(req, res, async () => {
    
    // Retrieve data from database and send to user
    const users = await User.find();
    const data = { users: [] };

    users.forEach(user => { 
      data.users.push(user) 
    });

    res.json({
      users: data.users,
    });
  });
});

router.post('/registerproblem', (req, res) => {
  admin(req, res, async () => {
    const { name, code, answer, tolerance, points } = req.body;
    const problemCode = await Problem.findOne({ "code.number": code.number, "code.alpha": code.alpha });
    const problemName = await Problem.findOne({ name: name });

    // Check if user exists
    if (problemCode || problemName)
      return res.json({
        message: "Problem already exists.",
        error: "Problem with the code or name already exists.",
      }).status(401);

    // Create the document
    const data = new Problem({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      code: code,
      answer: answer,
      tolerance: tolerance,
      points: points,
      status: 'active',
    }, { collection: 'problems' });

    // Try to save to database
    try {
      let problem = await data.save();
      return res.status(200).json({
        message: 'Problem registration success.',
      });
    } catch (error) {
      return res.json({ 
        message: 'Server error.',
        error: error.message 
      }).status(500);
    }
  })
});

router.post('/editproblem', (req, res) => {
  admin(req, res, async () => {
    const { name, code, answer, tolerance, points, status } = req.body;
    const problemName = await Problem.findOne({ name: name });

    const pcode = code || problemName.code;
    const panswer = answer || problemName.answer;
    const ptolerance = tolerance || problemName.tolerance;
    const ppoints = points || problemName.points;
    const pstatus = status || problemName.status;

    let problemCode;
    if(code) problemCode = await Problem.findOne({ "code.number": code.number, "code.alpha": code.alpha });

    // Check if problem code exists
    if (problemCode)
      return res.json({
        message: "Problem code exists.",
        error: "Cannot duplicate problem code.",
      }).status(401);

    // Try to save to database
    try {
      let problem = await Problem.findOne({ name: name });
      await Problem.updateOne(
        { name: name },
        { $set: 
          {
            code: pcode,
            answer: panswer,
            tolerance: ptolerance,
            points: ppoints,
            status: pstatus,
          }
        });

      return res.status(200).json({
        message: 'Problem updated.',
      });
    } catch (error) {
      return res.json({ 
        message: 'Server error.', 
        error: error.message 
      }).status(500);
    }
  })
});

router.post('/deleteproblem', (req, res) => {
  admin(req, res, async () => {
    const { name } = req.body;
    const problem = await Problem.findOne({ name: name });

    // Check if problem exists
    if(problem) {
      try {
        await Problem.deleteOne({ name: name });
        return res.status(200).json({
          message: 'Problem deletion success.',
        });
      } catch(err) {
        return res.json({
          error: 'Something went wrong. Try again.'
        }).status(500);
      }
    } else {
      return res.json({
        error: 'Problem to be deleted does not exist.'
      }).status(401);
    }
  })
});

router.post('/recheckproblem', (req, res) => {
  admin(req, res, async () => {
    const { name } = req.body;
    const problem = await Problem.findOne({ name: name });

    // Check if problem exists
    if(problem) {
      try {
        
        // Update the users first
        const users = await User.find({});
        users.forEach(user => {
          (async() => {
            if(user.answered.includes(problem._id)){
              let updated_answered = [];
              user.answered.forEach(p => {
                if(p.toString() != problem._id.toString())
                  updated_answered.push(p);
              });

              await User.updateOne(
                { username: user.username },
                { $set: { answered: updated_answered }});
            }
          })()
        });

        // Recheck pertinent submissions
        const submissions = await Submission.find({ problem_id: problem._id });
        submissions.sort((a, b) => a.timestamp - b.timestamp );

        // Reset the verdicts first
        submissions.forEach(submission => {
          (async() => {
            await Submission.updateOne(
              { _id: submission._id },
              { $set: { verdict: 'wrong' } });
          })()
        })

        // Redo the verdicts
        submissions.forEach(submission => {
          (async() => {
            const user = await User.findOne({ _id: submission.user_id });
            if(user){
              if(!user.answered.includes(problem._id)){
                if(checkAnswer(submission.answer, problem.answer, problem.tolerance)){
                  await Submission.updateOne(
                    { _id: submission._id },
                    { $set: { verdict: 'correct' } });
                  await User.updateOne(
                    { username: user.username },
                    { $set: { answered: user.answered.concat([problem._id]) }});
                }
              }
            } 
          })()
        });

        return res.json({
          message: 'Problem rechecked.'
        }).status(200);
      } catch(err) {
        return res.json({
          error: 'Something went wrong. Try again.'
        }).status(500);
      }
    } else {
      return res.json({
        error: 'Problem to be rechecked does not exist.'
      }).status(401);
    }
  })
});

router.post('/problemlist', (req, res) => {
  admin(req, res, async () => {
    
    // Retrieve data from database and send to user
    const problems = await Problem.find();
    const data = { problems: [] };

    problems.forEach(problem => { 
      data.problems.push(problem)
    });

    res.json({
      problems: data.problems,
    });
  });
});

router.post('/submissionlog', (req, res) => {
  admin(req, res, async () => {
    
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
});

// Score related routes
router.post('/updatescores', (req, res) => {
  admin(req, res, async () => {
    const users = await User.find({});
    const problems = await Problem.find({});
    const submissions = await Submission.find({});

    const crossCheckTable = {};
    const problemNumbers = {};
    const baseScores = {};
    const newScores = {};

    let problemNumber = 0;
    problems.sort((a, b) => {
      if(parseInt(a.code.number) == parseInt(b.code.number))
        return `${a.code.alpha}`.localeCompare(b.code.alpha);
      return parseInt(a.code.number) - parseInt(b.code.number);
    });

    problems.forEach(problem => {
      baseScores[problem._id.toString()] = problem.points;
      problemNumbers[problem._id.toString()] = problem.code.number;
    });

    submissions.forEach(submission => {
      if(!crossCheckTable[submission.problem_id.toString()])
        crossCheckTable[submission.problem_id.toString()] = {};
      if(!crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()])
        crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()] = {
          verdict: false,
          wrong: 0,
          timestamp: Number.POSITIVE_INFINITY,
        };

      if(submission.verdict == 'correct'){
        crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].verdict = true;
        if(submission.timestamp < crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].timestamp)
          crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].timestamp = submission.timestamp;
      }
    });

    submissions.forEach(submission => {
      if(submission.verdict == 'wrong'){
        if(submission.timestamp < crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].timestamp)
          crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].wrong++;
      }
    });

    let problemids = Object.keys(crossCheckTable)
    problemids.forEach(problem => {
      let userids = Object.keys(crossCheckTable[problem]);
      userids.forEach(user => {
        if(!newScores[user]) newScores[user] = 0;
        if(crossCheckTable[problem][user].verdict){
          if(crossCheckTable[problem][user].timestamp > process.env.CONTEST_START && crossCheckTable[problem][user].timestamp < process.env.CONTEST_END){
            newScores[user] += baseScores[problem] * 
              Math.pow(2, -crossCheckTable[problem][user].wrong / 2) * 
              Math.pow(2, -(crossCheckTable[problem][user].timestamp - process.env.CONTEST_START) / (process.env.CONTEST_END - process.env.CONTEST_START)) * 
              Math.pow(2, 2 * problemNumbers[problem] / 30);

            console.log(crossCheckTable[problem][user].timestamp);
          }
        }
      })
    })

    try {
      users.forEach(user => {
        (async() => {
          if(Object.keys(newScores).includes(user._id.toString())){
            await User.updateOne(
              { _id: user._id },
              { $set: { score: newScores[user._id.toString()], }});
          }
        })();
      });

      return res.json({
        message: 'Scores updated.'
      }).status(200);
    } catch(err) {
      return res.json({
        error: 'Something went wrong. Try again.'
      }).status(500);
    }
  });
})

module.exports = router;