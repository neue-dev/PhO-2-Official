require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const identify = require('../middleware/identify');
const router = express.Router();
const { auth } = require('../middleware/auth');
const checkAnswer = require('../middleware/check');

//* Models
const User = require('../models/user');
const Config = require('../models/config');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
const Message = require('../models/message');
const Score = require('../models/score');

//* Constants
const saltRounds = 10;

// Don't ask why this is here AHAHAH
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
          return callback(userData);
          
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
router.post('/newannouncement', (req, res) => {
  admin(req, res, async userData => {
    const { title, content } = req.body;
    const user_id = userData._id;
    const timestamp = (new Date()).getTime();

    const data = new Message({
      _id: new mongoose.Types.ObjectId(),
      user_id: user_id,
      type: 'announcement',
      title: title,
      content: content,
      timestamp: timestamp,
    }, { collection: 'messages' });

    // Try to save to database
    try {
      let announcement = await data.save();
      return res.status(200).json({
        message: 'Announcement was posted.',
      });
    } catch (error) {
      return res.json({ 
        message: 'Server error.',
        error: error.message 
      }).status(500);
    }
  })
});

router.post('/deleteannouncement', (req, res) => {
  admin(req, res, async userData => {
    const { id } = req.body;
    const _id = mongoose.Types.ObjectId(id);
    const announcement = await Message.findOne({ _id: _id });

    // Check if announcement exists
    if(announcement) {
      try {
        await Message.deleteOne({ _id: _id });
        return res.status(200).json({
          message: 'Announcement deletion success.',
        });
      } catch(err) {
        return res.json({
          error: 'Something went wrong. Try again.'
        }).status(500);
      }
    } else {
      return res.json({
        error: 'Announcement to be deleted does not exist.'
      }).status(401);
    }
  })
});

router.post('/registeruser', (req, res) => {
  admin(req, res, async userData => {
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
          attempts: [],
          submissions: [],
          lastSubmit: 0,
          lastMessage: 0,
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
  admin(req, res, async userData => {
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
  admin(req, res, async userData => {
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
  admin(req, res, async userData => {
    
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

router.post('/configlist', (req, res) => {
  admin(req, res, async userData => {
    
    // Retrieve data from database and send to user
    const config = await Config.find();
    const data = { config: [] };

    config.forEach(configParameter => { 
      data.config.push(configParameter) 
    });

    res.json({
      config: data.config,
    });
  });
});

router.post('/editconfig', (req, res) => {
  admin(req, res, async userData => {
    const { key, value } = req.body;
    const configParameter = await Config.findOne({ key: key });

    // Check if config parameter exists
    if(configParameter) {
      try {
        await Config.updateOne(
          { key: key },
          { value: value });

        // Update the environment variables too
        // Is this a good idea? Might it break something along the way? I hope fucking not!
        process.env[key] = value;

        return res.status(200).json({
          message: 'Config parameter edited successfully.',
        });
      } catch(err) {
        return res.json({
          error: 'Something went wrong. Try again.'
        }).status(500);
      }
    } else {
      return res.json({
        error: 'Config parameter to be edited does not exist.'
      }).status(401);
    }
  })
});

router.post('/registerproblem', (req, res) => {
  admin(req, res, async userData => {
    const { name, code, answer, tolerance, points } = req.body;
    const problemCode = await Problem.findOne({ "code.number": code.number, "code.alpha": code.alpha });
    const problemName = await Problem.findOne({ name: name });

    // Check if problem exists
    if (problemCode || problemName)
      return res.json({
        message: "Problem already exists.",
        error: "Problem with the code or name already exists.",
      }).status(401);

    // Create the document
    const data = new Problem({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      type: 'official',
      code: code,
      answer: answer,
      tolerance: tolerance,
      points: points,
      status: 'disabled',
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

router.post('/enableofficial', (req, res) => {
  admin(req, res, async userData => {

    // Try to update problem statuses
    try {

      // Update the problems
      const officials = await Problem.find({ type: 'official' });
      officials.forEach(official => {
        (async() => {
          await Problem.updateOne(
            { name: official.name },
            { $set: { status: 'active' }});
        })()
      });

      // Just so the UI can update properly (doesn't fall behind by accident)
      await sleep(250);

      return res.status(200).json({
        message: 'Official problems enabled.',
      });
    } catch (error) {
      return res.json({ 
        message: 'Server error.', 
        error: error.message 
      }).status(500);
    }
  })
});

router.post('/disableofficial', (req, res) => {
  admin(req, res, async userData => {
    
    // Try to update problem statuses
    try {
      
      // Update the problems
      const officials = await Problem.find({ type: 'official' });
      officials.forEach(official => {
        (async() => {
          await Problem.updateOne(
            { name: official.name },
            { $set: { status: 'disabled' }});
        })()
      });

      // Just so the UI can update properly (doesn't fall behind by accident)
      await sleep(250);

      return res.status(200).json({
        message: 'Official problems disabled.',
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
  admin(req, res, async userData => {
    const { name, type, code, answer, tolerance, points, status } = req.body;
    const problemName = await Problem.findOne({ name: name });

    const pcode = code || problemName.code;
    const ptype = type || problemName.type;
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
            type: ptype,
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
  admin(req, res, async userData => {
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

router.post('/recheckproblem', async(req, res) => {
  admin(req, res, async userData => {
    const { name } = req.body;
    const problem = await Problem.findOne({ name: name });

    // Check if problem exists
    if(problem) {
      try {

        // Recheck pertinent submissions
        const submissions = await Submission.find({ problem_id: problem._id });

        // Reset user verdicts first
        await User.updateMany(
          { attempts: { $exists: true } },
          { $set: { 
            "attempts.$[attempt].verdict": false,
          }},
          { arrayFilters: [
            { "attempt.problem_id": problem._id, }
          ]}
        );
        
        // Reset all submissions
        await Submission.updateMany(
          { problem_id: problem._id },
          { $set: { verdict: 'wrong' } });
          
        // Sort submissions
        submissions.sort((a, b) => a.timestamp - b.timestamp );
        
        // Redo the verdicts
        submissions.forEach(submission => {
          (async() => {
            
            // The answer was correct
            if(checkAnswer(submission.answer, problem.answer, problem.tolerance)){
              await Submission.updateOne(
                { _id: submission._id },
                { $set: { verdict: 'correct' } });
            
              await User.updateOne(
                { _id: submission.user_id },
                { $set: { 
                  "attempts.$[attempt].verdict": true,
                }},
                { arrayFilters: [
                  { "attempt.problem_id": problem._id, }
                ]}
              );
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
  admin(req, res, async userData => {
    
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
  admin(req, res, async userData => {
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
  admin(req, res, async userData => {
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
          if(crossCheckTable[problem][user].timestamp > process.env.CONTEST_ELIMS_START && crossCheckTable[problem][user].timestamp < process.env.CONTEST_ELIMS_END){
            newScores[user] += baseScores[problem] * 
              Math.pow(2, -crossCheckTable[problem][user].wrong / 2) * 
              Math.pow(2, -(crossCheckTable[problem][user].timestamp - process.env.CONTEST_ELIMS_START) / (process.env.CONTEST_ELIMS_END - process.env.CONTEST_ELIMS_START)) * 
              Math.pow(2, 2 * problemNumbers[problem] / 30);
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