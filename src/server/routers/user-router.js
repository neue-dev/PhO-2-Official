import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';

import { fail, succeed } from '../io.js'
import { select, create, update, drop, safe } from '../db.js'
import { authorized_user_fail } from '../auth.js';
// import { checkAnswer } from '../check.js';

// The router to use
export const user_router = express.Router();

import { User } from '../models/user.js';
import { Config } from '../models/config.js';
import { Problem } from '../models/problem.js';
import { Submission } from '../models/submission.js';
import { Message } from '../models/message.js';

/**
 * Wraps a function around a user check.
 * Basically, if you're logged in, you're a user.
 * 
 * @param f   The function to wrap. 
 * @return    The wrapped function.
 */
const user = (f) => (

  // Make sure user is authorized first
  authorized_user_fail((req, res, user) => (
    user
      ? f(req, res, user)
      : null
  ))
)

/**
 * Request for user info.
 */
user_router.post('/data', user((req, res, user) => {
  res.json({
    username: user.username,
    category: user.category,
    lastSubmit: user.lastSubmit,
    lastMessage: user.lastMessage,
  });
}));

/**
 * Public config info.
 */
user_router.post('/configlist', user(async (req, res, user) => {
  select(Config, {})
    .then(safe(parameters => res.json({ config: parameters
      .filter(parameter => parameter.security === 'public')
      .map(parameter => ({ key: parameter.key, value: parameter.value }))
    })))
}));

/**
 * Problem list.
 */
user_router.post('/problemlist', user(async (req, res, user) => {    
  select(Problem, {})
    .then(safe(problems => res.json({ problems: problems
      .filter(problem => problem.status === 'active')
      .map(problem => ({ _id: problem._id, name: problem.name, code: problem.code, points: problem.points, }))
    })))
}));

/**
 * Submission list.
 */
user_router.post('/submissionlist', user(async (req, res, user) => {
  select(Submission, { user_id: user._id })
    .then(safe(submissions => res.json({ submissions })));
}));

// user_router.post('/scorelist', (req, res) => {
//   isuser(req, res, async () => {
    
//     // Retrieve data from database and send to user
//     const users = await User.find();
//     const data = { users: [] };

//     users.forEach(user => {
//       const userData = {
//         _id: user._id,
//         username: user.username,
//         attempts: (user.attempts.filter(attempt => attempt.verdict)).map(attempt => attempt.problem_id),
//         category: user.category,
//       };

//       // If competition is done
//       if(!true)
//         userData['score'] = user.score;

//       if(user.status == 'participating') 
//         data.users.push(userData)
//     });

//     res.json(data);
//   });
// });

// user_router.post('/announcementlist', (req, res) => {
//   isuser(req, res, async () => {
  
//     // Retrieve data from database and send to user
//     const announcements = await Message.find();
//     const data = { announcements: [] };

//     announcements.forEach(announcement => {
//       data.announcements.push({
//         id: announcement._id.toString(),
//         title: announcement.title,
//         content: announcement.content,
//         timestamp: announcement.timestamp,
//       })
//     });

//     res.json(data);
//   });
// });

// user_router.post('/submit', (req, res) => {
//   isuser(req, res, async userData => {
//     const { code, answer } = req.body;
//     const username = userData.username;

//     // Retrieve data from database and send to user
//     const user = await User.findOne({ username: username });
//     const problem = await Problem.findOne({ "code.number": code.number, "code.alpha": code.alpha });
//     const answerKey = problem.answer;
//     const tolerance = problem.tolerance;
    
//     if(!user)
//       return res.json({
//         message: "User does not exist.",
//         error: "You cannot submit as a non-user.",
//       }).status(401);
    
//     if((new Date()).getTime() - user.lastSubmit < parseInt(process.env.SUBMISSION_COOLDOWN))
//       return res.json({
//         message: "Cooldown insufficient.",
//         error: "You can only submit in 5-minute intervals.",
//       }).status(401);

//     if((new Date()).getTime() < process.env.CONTEST_ELIMS_START)
//       return res.json({
//         message: "Eliminations have not started.",
//         error: "You must wait for the contest to start.",
//       }).status(401);

//     if((new Date()).getTime() > process.env.CONTEST_ELIMS_END)
//       return res.json({
//         message: "Eliminations have already ended.",
//         error: "You can no longer submit after the eliminations have ended.",
//       }).status(401);

//     if(!problem)
//       return res.json({
//         message: "Problem does not exist.",
//         error: "You cannot submit to a nonexistent problem.",
//       }).status(401);
    
//     if(problem.status == 'disabled')
//       return res.json({
//         message: "Problem no longer exists.",
//         error: "You cannot submit to a nonexistent problem.",
//       }).status(401);

//     if(user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString()).length)
//       if(user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString())[0].count >= process.env.SUBMISSION_ATTEMPTS)
//         return res.json({
//           message: "Max attempts for problem reached.",
//           error: "There is a limit to the number of submissions per problem.",
//         }).status(401);

//     if(user.attempts.filter(attempt => 
//       attempt.problem_id.toString() == problem._id.toString() && 
//       attempt.verdict).length) 
//       return res.json({
//         message: "Problem already answered correctly.",
//         error: "You already got this problem right....",
//       }).status(401);
  
//     const verdict = checkAnswer(answer, answerKey, tolerance);
//     const timestamp = (new Date()).getTime();
//     const submission_id = new mongoose.Types.ObjectId();

//     // Try to save to database
//     try {

//       let count = 
//         user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString()).length ?
//         user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString())[0].count : 0;

//       // Update the user's attempts
//       if(!count) {
//         await User.updateOne(
//           { username: username },
//           { $set: { 
//             "attempts": user.attempts.concat([{
//               problem_id: problem._id,
//               count: 1,
//               verdict: verdict, 
//             }]),
//             "lastSubmit": timestamp,
//           }},
//           { arrayFilters: [
//             { "attempt.problem_id": problem._id, }
//           ]}
//         );  

//       } else {
//         await User.updateOne(
//           { username: username },
//           { $set: { 
//             "attempts.$[attempt].count": count + 1,
//             "attempts.$[attempt].verdict": verdict,
//             "lastSubmit": timestamp,
//           }},
//           { arrayFilters: [
//             { "attempt.problem_id": problem._id, }
//           ]}
//         );
//       }

//       const data = new Submission({
//         _id: submission_id,
//         user_id: user._id,
//         username: user.username,
//         problem_id: problem._id,
//         problemCodeName: problem.code.number + problem.code.alpha + ' ' + problem.name,
//         answer: answer,
//         verdict: verdict ? 'correct' : 'wrong',
//         timestamp: timestamp,
//       }, { collection: 'submissions' });
//       let submission = await data.save();

//       return res.status(200).json({
//         message: 'Submission logged successfully.',
//       });
//     } catch (error) {
//       return res.json({ 
//         message: 'Server error.',
//         error: error.message
//       }).status(500);
//     }
//   });
// });

// user_router.post('/message', (req, res) => {
//   isuser(req, res, async userData => {
    
//     //! Save the message into the messages database
//     //! Update the user's lastMessage property


//   })
// });

// user_router.post('/messages', (req, res) => {
//   isuser(req, res, async userData => {
//     //! retrieve the user's messages

//   })
// });

// export default {
//   user_router
// }