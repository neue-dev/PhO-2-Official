import 'dotenv/config'

import express from 'express';
import bcrypt from 'bcrypt';

// The router to use
export const admin_router = express.Router();

import { io } from '../io.js'
import { Query, QueryFactory } from '../db.js'
import { authorized_user_fail } from '../auth.js';
import { check_answer } from '../check.js';

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
  authorized_user_fail((req, res, user, ...args) => (
    user.isAdmin
      ? f(req, res, user, ...args)
      : null
  ))
)

/**
 * Registers new users.
 */
admin_router.post('/registeruser', admin(io((req, res, user) => {
  const { username, password, category, status } = req.get('user-');
  const new_user = { username, password, category, status, isAdmin: false }

  // We gotta hash the password first
  bcrypt.hash(password, SALT_ROUNDS).then(hash =>
    new_user.password = hash,

    QueryFactory.insert_if_unique(User, { username })(new_user)
      (res.success({ message: 'User created successfully.'}))
      (res.failure({ status: 400, error: 'Username taken.' }))
      .run()
      .catch(res.failure())
  )
})))

/**
 * Registers new problems.
 */
admin_router.post('/registerproblem', admin(io((req, res, user) => {
  const { name, type, status, code, answer, tolerance, points } = req.get('problem-');
  const new_problem = { name, type, status, code, answer, tolerance, points }

  // Create the problem
  QueryFactory.insert_if_unique(Problem, [ { name }, { code } ])(new_problem)
    (res.success({ message: 'Problem created successfully.'}))
    (res.failure({ status: 400, error: 'Problem name or code already exists.' }))
    .run()
    .catch(res.failure())
})));

/**
 * Grabs a list of all users.
 */
admin_router.post('/userlist', admin((req, res, user) => 
  Query(User).select().then(users => res.json({ users })).run()
))

/**
 * Grabs the configuration of the contest.
 */
admin_router.post('/configlist', admin((req, res, user) => 
  Query(Config).select().then(config => res.json({ config })).run()
))

/**
 * Grabs a list of all problems.
 */
admin_router.post('/problemlist', admin((req, res, user) => 
  Query(Problem).select().then(problems => res.json({ problems })).run()
))

/**
 * Grabs a list of ALL submissions.
 */
admin_router.post('/submissionlog', admin((req, res, user) => 
  Query(Submission).select().then(submissions => res.json({ submissions })).run()
));

/**
 * Updates config variables.
 */
admin_router.post('/editconfig', admin(io((req, res, user) => {
  const { _id, key, value } = req.get('config-');
  const changes = { /*key,*/ value };

  QueryFactory.update_if_exists(Config)(_id)(changes)
    (res.success({ message: 'Parameter updated successfully.' }))
    (res.failure({ status: 400, error: 'Parameter does not exist.' }))
    .run()
    .catch(res.failure())
})))

/**
 * Updates problem details.
 */
admin_router.post('/editproblem', admin(io((req, res, user) => {
  const { _id, name, type, code, answer, tolerance, points, status } = req.get('problem-');
  const changes = { name, type, code, answer, tolerance, points, status };

  QueryFactory.update_if_exists(Problem)(_id)(changes)
    (res.success({ message: 'Problem updated successfully.' }))
    (res.failure({ status: 400, error: 'Problem does not exist.' }))
    .run()
    .catch(res.failure())
})));

/**
 * Updates user details.
 */
admin_router.post('/edituser', admin(io((req, res, user) => {
  const { _id, username, password, category, status } = req.get('user-');
  const changes = { username, category, status }
  
  // Update query
  const update_query = (changes) =>
    QueryFactory.update_if_exists(User)(_id)(changes)
      (res.success({ message: 'User updated successfully.' }))
      (res.failure({ status: 400, error: 'User does not exist.' }))
      .run().catch(res.failure())  

  // Update without password
  if(!password || password === '')
    return update_query(changes)

  // Update with a password
  bcrypt.hash(password, SALT_ROUNDS).then(hash => (
    changes.password = hash,
    update_query(changes)
  ))
})));

/**
 * Deletes users.
 */
admin_router.post('/deleteuser', admin(io((req, res, user) => {
  const { _id } = req.get('user-');

  QueryFactory.delete_if_exists(User, _id)
    (res.success({ message: 'User deleted successfully.' }))
    (res.failure({ status: 400, error: 'User does not exist.' }))
    .run()
    .catch(res.failure())
})));

/**
 * Deletes problems.
 */
admin_router.post('/deleteproblem', admin(io((req, res, user) => {
  const { _id } = req.get('problem-');

  QueryFactory.delete_if_exists(Problem, _id)
    (res.success({ message: 'Problem deleted successfully.' }))
    (res.failure({ status: 400, error: 'Problem does not exist.' }))
    .run()
    .catch(res.failure())
})));

/**
 * Enables the official problems.
 */
admin_router.post('/enableofficial', admin(io((req, res, user) => {
  Query(Problem)
    .select({ type: 'official'})
    .update({ status: 'active' })
    .then(res.success({ message: 'Official problems are now active.' }))
    .run()
    .catch(res.failure())
})));

/**
 * Disables the official problems.
 */
admin_router.post('/disableofficial', admin(io((req, res) => {
  Query(Problem)
    .select({ type: 'official'})
    .update({ status: 'disabled' })
    .then(res.success({ message: 'Official problems are now disabled.' }))
    .run()
    .catch(res.failure())
})));

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