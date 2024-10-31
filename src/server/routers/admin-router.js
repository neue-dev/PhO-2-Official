import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// The router to use
export const admin_router = express.Router();

import { fail, succeed } from '../io.js'
import { select, update, safe } from '../db.js'
import { authorized_user_fail } from '../auth.js';
import { checkAnswer } from '../check.js';

//* Models
import { User } from '../models/user.js';
import { Config } from '../models/config.js';
import { Problem } from '../models/problem.js';
import { Submission } from '../models/submission.js';

//* Constants
const saltRounds = 10;

/**
 * Wraps a function around an admin check, aside from a logged in check.
 * 
 * @param f   The function to wrap. 
 * @return    The wrapped function.
 */
const admin = (f) => (

  // Make sure use is authorized first
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

// admin_router.post('/registeruser', (req, res) => {
//   admin(req, res, async userData => {
//     const { username, password, category } = req.body;
//     const isAdmin = req.body.isAdmin || false;
//     const user = await User.findOne({ username: username });

//     // Check if user exists
//     if (user)
//       return res.json({
//         message: "User already exists.",
//         error: "User with the username already exists.",
//       }).status(401);

//     // Hash password first
//     await bcrypt.hash(password, saltRounds)
//       .then(async hash => {

//         // Create the document
//         const data = new User({
//           _id: new mongoose.Types.ObjectId(),
//           username: username,
//           password: hash,
//           isAdmin: isAdmin,
//           category: category,
//           status: 'participating',
//           score: 0,
//           attempts: [],
//           submissions: [],
//           lastSubmit: 0,
//           lastMessage: 0,
//         }, { collection: 'users' });

//         // Try to save to database
//         try {
//           let user = await data.save();
//           return res.status(200).json({
//             message: 'User registration success.',
//           });
//         } catch (error) {
//           return res.json({ 
//             message: 'Server error.', 
//             error: error.message 
//           }).status(500);
//         }
//       })
//       .catch(error => res.json({ 
//         message: 'Server error.',
//         error: error.message 
//       }).status(500));
//   });
// });

// admin_router.post('/deleteuser', (req, res) => {
//   admin(req, res, async userData => {
//     const { username } = req.body;
//     const user = await User.findOne({ username: username });

//     // Check if user exists
//     if(user) {
//       try {
//         await User.deleteOne({ username: username });
//         return res.status(200).json({
//           message: 'User deletion success.',
//         });
//       } catch(err) {
//         return res.json({
//           error: 'Something went wrong. Try again.'
//         }).status(500);
//       }
//     } else {
//       return res.json({
//         error: 'User to be deleted does not exist.'
//       }).status(401);
//     }
//   })
// });

admin_router.post('/userlist', admin(async (req, res, user) => {
  const users = await User.find();
  const data = { users: [] };

  users.map(user => data.users.push(user));
  res.json(data);
}))

admin_router.post('/configlist', admin(async (req, res, user) => {
  const config = await Config.find();
  const data = { config: [] };

  config.map(parameter => data.config.push(parameter));
  res.json(data);
}))


admin_router.post('/problemlist', admin(async (req, res, user) => {
  const problems = await Problem.find();
  const data = { problems: [] };

  problems.map(problem => data.problems.push(problem));
  res.json(data);
}))

admin_router.post('/submissionlog', admin(async (req, res, user) => {
  const submissions = await Submission.find({});
  const data = { submissions: [] };

  submissions.map(submission => data.submissions.push(submission));
  res.json(data);
}));

// Updates config variables
admin_router.post('/editconfig', admin((req, res, user) => {
  const { _id, key, value } = req.body;
  const changes = { /*key,*/ value };

  select(Config, _id)
    .then(safe(parameter => update(Config, _id, changes), 'Parameter does not exist.'))
    .then(() => process.env[key] = value)
    .then(() => succeed(res, 'Config parameter edited successfully.'))
    .catch(error => fail(res, error));
}))

// Updates problems
admin_router.post('/editproblem', admin((req, res, user) => {
  const { _id, name, type, code, answer, tolerance, points, status } = req.body;
  const changes = { name, type, code, answer, tolerance, points, status };

  select(Problem, _id)
    .then(safe(problem => update(Problem, _id, changes), 'Problem does not exist.'))
    .then(() => succeed(res, 'Problem edited successfully.'))
    .catch(error => fail(res, error))
}));

// Updates users
admin_router.post('/edituser', admin((req, res, user) => {
  const { _id, username, password, category, status } = req.body;
  const changes = { username, category, status }

  // Invalid password
  if(!password || password === '')
    fail(res, { status: 400, error: 'Password cannot be empty.' })

  // Hash password
  bcrypt.hash(password, saltRounds).then(hash => (

    // Specify hash to store
    changes.password = hash,

    // Update user
    select(User, _id)
      .then(safe(user => update(User, _id, changes), 'User does not exist.'))
      .then(() => succeed(res, 'User edited successfully'))
      .catch(error => fail(res, error))))
}));

// admin_router.post('/registerproblem', (req, res) => {
//   admin(req, res, async userData => {
//     const { name, code, answer, tolerance, points } = req.body;
//     const problemCode = await Problem.findOne({ "code.number": code.number, "code.alpha": code.alpha });
//     const problemName = await Problem.findOne({ name: name });

//     // Check if problem exists
//     if (problemCode || problemName)
//       return res.json({
//         message: "Problem already exists.",
//         error: "Problem with the code or name already exists.",
//       }).status(401);

//     // Create the document
//     const data = new Problem({
//       _id: new mongoose.Types.ObjectId(),
//       name: name,
//       type: 'official',
//       code: code,
//       answer: answer,
//       tolerance: tolerance,
//       points: points,
//       status: 'disabled',
//     }, { collection: 'problems' });

//     // Try to save to database
//     try {
//       let problem = await data.save();
//       return res.status(200).json({
//         message: 'Problem registration success.',
//       });
//     } catch (error) {
//       return res.json({ 
//         message: 'Server error.',
//         error: error.message 
//       }).status(500);
//     }
//   })
// });

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

// admin_router.post('/deleteproblem', (req, res) => {
//   admin(req, res, async userData => {
//     const { name } = req.body;
//     const problem = await Problem.findOne({ name: name });

//     // Check if problem exists
//     if(problem) {
//       try {
//         await Problem.deleteOne({ name: name });
//         return res.status(200).json({
//           message: 'Problem deletion success.',
//         });
//       } catch(err) {
//         return res.json({
//           error: 'Something went wrong. Try again.'
//         }).status(500);
//       }
//     } else {
//       return res.json({
//         error: 'Problem to be deleted does not exist.'
//       }).status(401);
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