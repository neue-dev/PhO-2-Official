import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';

import { io, fail, succeed } from '../io.js'
import { Aggregate, Fields, Predicate, Query, select, create, update, drop, safe } from '../db.js'
import { authorized_user_fail } from '../auth.js';
// import { checkAnswer } from '../check.js';

// The router to use
export const user_router = express.Router();

import { User } from '../models/user.js';
import { Config } from '../models/config.js';
import { Problem } from '../models/problem.js';
import { Submission } from '../models/submission.js';
import { Message } from '../models/message.js';

// Bad idea, but we're gonna cache the scores here LMAO
const SCORE_CACHE = {
  scores: {},
  interval: 100000, // Cache lasts about a minute and a half
  last_update: 0,   // Last update yes
}

/**
 * Gets the current timestamp.
 * 
 * @return  Timestamp now.
 */
const now = () => (
  new Date().getTime()
)

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
user_router.post('/data', user(io((req, res, user) => {
  


  select(Submission, { user_id: user._id })
    .then(safe(submissions => {

      // ! todo
      const last_submit = 0;

      res.json({
        username: user.username,
        category: user.category,
        last_submit, 
      })
    }))
})));

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

/**
 * Score list.
 */
user_router.post('/scorelist', user(async (req, res, user) => {

  // Check if cache is kinda old
  if(now() - SCORE_CACHE.last_update <= SCORE_CACHE.interval)
    return res.json({ scores: SCORE_CACHE.scores })

  // Clear cache
  SCORE_CACHE.scores = {};

  // Get user list first to define the score cache
  Query(User).select().then(users => (
    users.map(user => 
      SCORE_CACHE.scores[user._id] = { 
        username: user.username, 
        category: user.category, 
        score: 0, 
        rank: 0, 
      })
  )).run()

  // This is way better
  Aggregate(Submission)

		// Filter by correct submissions
		.filter('verdict', 'correct')

		// Group by user AND problem
		.group([ 'problem_id', 'user_id' ], [ 'user_id', 'problem_id', 'points' ])
		
		// Join problem data and filter by status and nullity
		.join(Problem, 'problem_id', '_id', 'p', [ 'name', 'points', 'status' ])
		.filter('p_status', 'active')
		.filter('p_name', Predicate().ne())

		// Group by user, filter by user
		.group('user_id', [], Fields().field('score').sum('p_points'))
		.join(User, '_id', '_id', 'u', [ 'username', 'category' ])
		.filter('u_username', Predicate().ne())

		// Rename fields to proper format
		.rename({ u_username: 'username', u_category: 'category', score: 'score' })

    // Update scores after query finishes
    .then(scores => (

      // Update score cache
      scores.map(score => SCORE_CACHE.scores[score._id].score = score.score),
      SCORE_CACHE.scores = Object.values(SCORE_CACHE.scores),
      
      // Sort then generate ranks
      SCORE_CACHE.scores.sort((a, b) => b.score - a.score || a.username.localeCompare(b.username)),
      SCORE_CACHE.scores.reduce((acc, score) => 
        (score.score !== acc.prev && acc.rank++, acc.prev = score.score, score.rank = acc.rank, acc), { prev: -1, rank: 0 }),
      SCORE_CACHE.scores.filter(score => score.category === 'junior').reduce((acc, score) => 
        (score.score !== acc.prev && acc.rank++, acc.prev = score.score, score.cat_rank = acc.rank, acc), { prev: -1, rank: 0 }),
      SCORE_CACHE.scores.filter(score => score.category === 'senior').reduce((acc, score) => 
        (score.score !== acc.prev && acc.rank++, acc.prev = score.score, score.cat_rank = acc.rank, acc), { prev: -1, rank: 0 }),

      // Update timestamp
      SCORE_CACHE.last_update = now(),

      // Send it to the user
      res.json({ scores: SCORE_CACHE.scores })
    ))

    // Run
    .run();
}));

// user_router.post('/submit', user((req, res, user) => {
//   const { _id, code, answer } = req.body;
//   const username = user.username;

//   select(User, { username })
//     .then(safe(user => 
//   select(Problem, { _id })
//     .then(safe(problem => {

//     // Grab timestamp
//     const timestamp = now();

//     if(timestamp - user.lastSubmit < parseInt(process.env.SUBMISSION_COOLDOWN.toString()))
//       return fail(res, { status: 403, error: 'You can only submit after your cooldown.'})

//     if(timestamp < parseInt(process.env.CONTEST_ELIMS_START.toString()) || 
//       timestamp > parseInt(process.env.CONTEST_ELIMS_END.toString()))
//       return fail(res, { status: 403, error: 'You cannot submit outside of the contest period.'})

//     if(problem.status === 'disabled')
//       return fail(res, { status: 403, error: 'The requested problem has been disabled.' })

//   }))))

//   // Retrieve data from database and send to user
//   const user = await User.findOne({ username: username });
//   const problem = await Problem.findOne({ "code.number": code.number, "code.alpha": code.alpha });
//   const answerKey = problem.answer;
//   const tolerance = problem.tolerance;
  
  

//   if(user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString()).length)
//     if(user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString())[0].count >= process.env.SUBMISSION_ATTEMPTS)
//       return res.json({
//         message: "Max attempts for problem reached.",
//         error: "There is a limit to the number of submissions per problem.",
//       }).status(401);

//   if(user.attempts.filter(attempt => 
//     attempt.problem_id.toString() == problem._id.toString() && 
//     attempt.verdict).length) 
//     return res.json({
//       message: "Problem already answered correctly.",
//       error: "You already got this problem right....",
//     }).status(401);

//   const verdict = checkAnswer(answer, answerKey, tolerance);
//   const timestamp = (new Date()).getTime();
//   const submission_id = new mongoose.Types.ObjectId();

//   // Try to save to database
//   try {

//     let count = 
//       user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString()).length ?
//       user.attempts.filter(attempt => attempt.problem_id.toString() == problem._id.toString())[0].count : 0;

//     // Update the user's attempts
//     if(!count) {
//       await User.updateOne(
//         { username: username },
//         { $set: { 
//           "attempts": user.attempts.concat([{
//             problem_id: problem._id,
//             count: 1,
//             verdict: verdict, 
//           }]),
//           "lastSubmit": timestamp,
//         }},
//         { arrayFilters: [
//           { "attempt.problem_id": problem._id, }
//         ]}
//       );  

//     } else {
//       await User.updateOne(
//         { username: username },
//         { $set: { 
//           "attempts.$[attempt].count": count + 1,
//           "attempts.$[attempt].verdict": verdict,
//           "lastSubmit": timestamp,
//         }},
//         { arrayFilters: [
//           { "attempt.problem_id": problem._id, }
//         ]}
//       );
//     }

//     const data = new Submission({
//       _id: submission_id,
//       user_id: user._id,
//       username: user.username,
//       problem_id: problem._id,
//       problemCodeName: problem.code.number + problem.code.alpha + ' ' + problem.name,
//       answer: answer,
//       verdict: verdict ? 'correct' : 'wrong',
//       timestamp: timestamp,
//     }, { collection: 'submissions' });
//     let submission = await data.save();

//     return res.status(200).json({
//       message: 'Submission logged successfully.',
//     });
//   } catch (error) {
//     return res.json({ 
//       message: 'Server error.',
//       error: error.message
//     }).status(500);
//   }
// }));

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