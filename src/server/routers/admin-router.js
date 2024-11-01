import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// The router to use
export const admin_router = express.Router();

import { fail, succeed } from '../io.js'
import { select, create, update, drop, safe } from '../db.js'
import { authorized_user_fail } from '../auth.js';
import { checkAnswer } from '../check.js';

import { User } from '../models/user.js';
import { Config } from '../models/config.js';
import { Problem } from '../models/problem.js';
import { Submission } from '../models/submission.js';

const SALT_ROUNDS = 10;

/**
 * Wraps a function around an admin check, aside from a logged in check.
 * 
 * @param f   The function to wrap. 
 * @return    The wrapped function.
 */
const admin = (f) => (

  // Make sure user is authorized first
  authorized_user_fail((req, res, user) => (
    user.isAdmin
      ? f(req, res, user)
      : null
  ))
)

// //* Admin Routes
// admin_router.post('/newannouncement', (req, res) => {
//   admin(req, res, async userData => {
//     const { title, content } = req.body;
//     const user_id = userData._id;
//     const timestamp = (new Date()).getTime();

//     const data = new Message({
//       _id: new mongoose.Types.ObjectId(),
//       user_id: user_id,
//       type: 'announcement',
//       title: title,
//       content: content,
//       timestamp: timestamp,
//     }, { collection: 'messages' });

//     // Try to save to database
//     try {
//       let announcement = await data.save();
//       return res.status(200).json({
//         message: 'Announcement was posted.',
//       });
//     } catch (error) {
//       return res.json({ 
//         message: 'Server error.',
//         error: error.message 
//       }).status(500);
//     }
//   })
// });

// admin_router.post('/deleteannouncement', (req, res) => {
//   admin(req, res, async userData => {
//     const { id } = req.body;
//     const _id = mongoose.Types.ObjectId(id);
//     const announcement = await Message.findOne({ _id: _id });

//     // Check if announcement exists
//     if(announcement) {
//       try {
//         await Message.deleteOne({ _id: _id });
//         return res.status(200).json({
//           message: 'Announcement deletion success.',
//         });
//       } catch(err) {
//         return res.json({
//           error: 'Something went wrong. Try again.'
//         }).status(500);
//       }
//     } else {
//       return res.json({
//         error: 'Announcement to be deleted does not exist.'
//       }).status(401);
//     }
//   })
// });

/**
 * Registers new users.
 */
admin_router.post('/registeruser', admin((req, res) => {
  const { username, password, category, status } = req.body;
  const params = { 
    username, password, category, status, 
    score: 0, isAdmin: false, attempts: [], submissions: [], lastSubmit: 0, lastMessage: 0, 
  }

  // Ensure we capture all inputs
  Object.keys(params).map(key => params[key] = params[key] ? params[key] : req.body['user-' + key])

  // This is so sad...
  bcrypt.hash(password, SALT_ROUNDS)
    .then(hash =>
      
      // Update password
      params.password = hash,
      
      // Check if username taken
      select(User, { username })
        .then(user => !user || !user.length
          ? create(User, 'users', params)
            .then(safe(user => succeed(res, 'User successfully created.')))
            .catch(error => fail(res, error))
          : fail(res, { status: 403, error: 'Username taken.' })))
}))

/**
 * Registers new problems.
 */
admin_router.post('/registerproblem', admin((req, res) => {
  const { name, type, status, code, answer, tolerance, points } = req.body;
  const params = { name, type, status, code, answer, tolerance, points }
  
  // Ensure we capture all inputs
  Object.keys(params).map(key => params[key] = params[key] ? params[key] : req.body['problem-' + key])

  create(Problem, 'problems', params)
    .then(safe(problem => succeed(res, 'Problem successfully created.')))
    .catch(res, { status: 500, error: 'Something went wrong.' })
}));

/**
 * Grabs a list of all users.
 */
admin_router.post('/userlist', admin(async (req, res, user) => {
  select(User, {}).then(safe(users => res.json({ users })))
}))

/**
 * Grabs the configuration of the contest.
 */
admin_router.post('/configlist', admin(async (req, res, user) => {
  select(Config, {}).then(safe(parameters => res.json({ config: parameters })))
}))

/**
 * Grabs a list of all problems.
 */
admin_router.post('/problemlist', admin(async (req, res, user) => {
  select(Problem, {}).then(safe(problems => res.json({ problems })))
}))

/**
 * Grabs a list of ALL submissions.
 */
admin_router.post('/submissionlog', admin(async (req, res, user) => {
  select(Submission, {}).then(safe(submissions => res.json({ submissions })))
}));

/**
 * Updates config variables.
 */
admin_router.post('/editconfig', admin((req, res, user) => {
  const { _id, key, value } = req.body;
  const changes = { /*key,*/ value };

  // Ensure we capture all inputs
  Object.keys(changes).map(key => changes[key] = changes[key] ? changes[key] : req.body['config-' + key])

  select(Config, _id)
    .then(safe(parameter => update(Config, _id, changes), 'Parameter does not exist.'))
    .then(() => process.env[key] = value)
    .then(() => succeed(res, 'Config parameter edited successfully.'))
    .catch(error => fail(res, error));
}))

/**
 * Updates problem details.
 */
admin_router.post('/editproblem', admin((req, res, user) => {
  const { _id, name, type, code, answer, tolerance, points, status } = req.body;
  const changes = { name, type, code, answer, tolerance, points, status };

  // Ensure we capture all inputs
  Object.keys(changes).map(key => changes[key] = changes[key] ? changes[key] : req.body['problem-' + key])

  select(Problem, _id)
    .then(safe(problem => update(Problem, _id, changes), 'Problem does not exist.'))
    .then(() => succeed(res, 'Problem edited successfully.'))
    .catch(error => fail(res, error))
}));

/**
 * Updates user details.
 */
admin_router.post('/edituser', admin((req, res, user) => {
  const { _id, username, password, category, status } = req.body;
  const changes = { username, category, status }

  // Ensure we capture all inputs
  Object.keys(changes).map(key => changes[key] = changes[key] ? changes[key] : req.body['user-' + key])

  // Invalid password
  if(!password || password === '')
    fail(res, { status: 400, error: 'Password cannot be empty.' })

  // Hash password
  bcrypt.hash(password, SALT_ROUNDS).then(hash => (

    // Specify hash to store
    changes.password = hash,

    // Update user
    select(User, _id)
      .then(safe(user => update(User, _id, changes), 'User does not exist.'))
      .then(() => succeed(res, 'User edited successfully'))
      .catch(error => fail(res, error))))
}));

/**
 * Deletes users.
 */
admin_router.post('/deleteuser', admin((req, res, user) => {
  const { _id } = req.body;

  select(User, _id)
    .then(safe(user => drop(User, _id), 'User does not exist.'))
    .then(() => succeed(res, 'User successfully deleted.'))
    .catch(error => fail(res, error))
}));

/**
 * Deletes problems.
 */
admin_router.post('/deleteproblem', admin((req, res, user) => {
  const { _id } = req.body;

  select(Problem, _id)
    .then(safe(problem => drop(Problem, _id), 'Problem does not exist.'))
    .then(() => succeed(res, 'Problem successfully deleted.'))
    .catch(error => fail(res, error))
}));

// admin_router.post('/enableofficial', (req, res) => {
//   admin(req, res, async userData => {

//     // Try to update problem statuses
//     try {

//       // Update the problems
//       const officials = await Problem.find({ type: 'official' });
//       officials.forEach(official => {
//         (async() => {
//           await Problem.updateOne(
//             { name: official.name },
//             { $set: { status: 'active' }});
//         })()
//       });

//       // Just so the UI can update properly (doesn't fall behind by accident)
//       await sleep(250);

//       return res.status(200).json({
//         message: 'Official problems enabled.',
//       });
//     } catch (error) {
//       return res.json({ 
//         message: 'Server error.', 
//         error: error.message 
//       }).status(500);
//     }
//   })
// });

// admin_router.post('/disableofficial', (req, res) => {
//   admin(req, res, async userData => {
    
//     // Try to update problem statuses
//     try {
      
//       // Update the problems
//       const officials = await Problem.find({ type: 'official' });
//       officials.forEach(official => {
//         (async() => {
//           await Problem.updateOne(
//             { name: official.name },
//             { $set: { status: 'disabled' }});
//         })()
//       });

//       // Just so the UI can update properly (doesn't fall behind by accident)
//       await sleep(250);

//       return res.status(200).json({
//         message: 'Official problems disabled.',
//       });
//     } catch (error) {
//       return res.json({ 
//         message: 'Server error.', 
//         error: error.message 
//       }).status(500);
//     }
//   })
// });

// admin_router.post('/recheckproblem', async(req, res) => {
//   admin(req, res, async userData => {
//     const { name } = req.body;
//     const problem = await Problem.findOne({ name: name });

//     // Check if problem exists
//     if(problem) {
//       try {

//         // Recheck pertinent submissions
//         const submissions = await Submission.find({ problem_id: problem._id });

//         // Reset user verdicts first
//         await User.updateMany(
//           { attempts: { $exists: true } },
//           { $set: { 
//             "attempts.$[attempt].verdict": false,
//           }},
//           { arrayFilters: [
//             { "attempt.problem_id": problem._id, }
//           ]}
//         );
        
//         // Reset all submissions
//         await Submission.updateMany(
//           { problem_id: problem._id },
//           { $set: { verdict: 'wrong' } });
          
//         // Sort submissions
//         submissions.sort((a, b) => a.timestamp - b.timestamp );
        
//         // Redo the verdicts
//         submissions.forEach(submission => {
//           (async() => {
            
//             // The answer was correct
//             if(checkAnswer(submission.answer, problem.answer, problem.tolerance)){
//               await Submission.updateOne(
//                 { _id: submission._id },
//                 { $set: { verdict: 'correct' } });
            
//               await User.updateOne(
//                 { _id: submission.user_id },
//                 { $set: { 
//                   "attempts.$[attempt].verdict": true,
//                 }},
//                 { arrayFilters: [
//                   { "attempt.problem_id": problem._id, }
//                 ]}
//               );
//             }
//           })()
//         });

//         return res.json({
//           message: 'Problem rechecked.'
//         }).status(200);
//       } catch(err) {
//         return res.json({
//           error: 'Something went wrong. Try again.'
//         }).status(500);
//       }
//     } else {
//       return res.json({
//         error: 'Problem to be rechecked does not exist.'
//       }).status(401);
//     }
//   })
// });

// // Score related routes
// admin_router.post('/updatescores', (req, res) => {
//   admin(req, res, async userData => {
//     const users = await User.find({});
//     const problems = await Problem.find({});
//     const submissions = await Submission.find({});

//     const crossCheckTable = {};
//     const problemNumbers = {};
//     const baseScores = {};
//     const newScores = {};

//     let problemNumber = 0;
//     problems.sort((a, b) => {
//       if(parseInt(a.code.number) == parseInt(b.code.number))
//         return `${a.code.alpha}`.localeCompare(b.code.alpha);
//       return parseInt(a.code.number) - parseInt(b.code.number);
//     });

//     problems.forEach(problem => {
//       baseScores[problem._id.toString()] = problem.points;
//       problemNumbers[problem._id.toString()] = problem.code.number;
//     });

//     submissions.forEach(submission => {
//       if(!crossCheckTable[submission.problem_id.toString()])
//         crossCheckTable[submission.problem_id.toString()] = {};
//       if(!crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()])
//         crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()] = {
//           verdict: false,
//           wrong: 0,
//           timestamp: Number.POSITIVE_INFINITY,
//         };

//       if(submission.verdict == 'correct'){
//         crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].verdict = true;
//         if(submission.timestamp < crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].timestamp)
//           crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].timestamp = submission.timestamp;
//       }
//     });

//     submissions.forEach(submission => {
//       if(submission.verdict == 'wrong'){
//         if(submission.timestamp < crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].timestamp)
//           crossCheckTable[submission.problem_id.toString()][submission.user_id.toString()].wrong++;
//       }
//     });

//     let problemids = Object.keys(crossCheckTable)
//     problemids.forEach(problem => {
//       let userids = Object.keys(crossCheckTable[problem]);
//       userids.forEach(user => {
//         if(!newScores[user]) newScores[user] = 0;
//         if(crossCheckTable[problem][user].verdict){
//           if(crossCheckTable[problem][user].timestamp > process.env.CONTEST_ELIMS_START && crossCheckTable[problem][user].timestamp < process.env.CONTEST_ELIMS_END){
//             newScores[user] += baseScores[problem] * 
//               Math.pow(2, -crossCheckTable[problem][user].wrong / 2) * 
//               Math.pow(2, -(crossCheckTable[problem][user].timestamp - process.env.CONTEST_ELIMS_START) / (process.env.CONTEST_ELIMS_END - process.env.CONTEST_ELIMS_START)) * 
//               Math.pow(2, 2 * problemNumbers[problem] / 30);
//           }
//         }
//       })
//     })

//     try {
//       users.forEach(user => {
//         (async() => {
//           if(Object.keys(newScores).includes(user._id.toString())){
//             await User.updateOne(
//               { _id: user._id },
//               { $set: { score: newScores[user._id.toString()], }});
//           }
//         })();
//       });

//       return res.json({
//         message: 'Scores updated.'
//       }).status(200);
//     } catch(err) {
//       return res.json({
//         error: 'Something went wrong. Try again.'
//       }).status(500);
//     }
//   });
// })

export default {
  admin_router
}