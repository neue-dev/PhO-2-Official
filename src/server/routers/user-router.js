import 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';

import { PHO2 } from '../pho2/pho2.js';
import { io, fail, succeed } from '../core/io.js'
import { Aggregate, Fields, Predicate, Query } from '../core/db.js'
import { authorized_user_fail } from '../pho2/auth.js';
import { check_answer } from '../pho2/check.js';

import { User } from '../models/user.js';
import { Config } from '../models/config.js';
import { Problem } from '../models/problem.js';
import { Submission } from '../models/submission.js';
import { Message } from '../models/message.js';

import { Env } from '../core/env.js';

export const user_router = express.Router();

// Possibly bad idea, but we're gonna cache some stuff here
// ! move the score_update_interval to the config!!
const CACHE = {
  scores: {},
  scores_update_interval: 100000,     // Cache lasts about a minute and a half
  scores_last_update: 0,              // Last update yes
  
  // We're gonna cache the last submit timestamps of the users too
  users: {},

  // User getter
  user: function(id) {
    return this.users[id]
  },

  // Score getter
  score: function(id) {
    return this.scores[id]
  },
  
  // Registers a user to the cache
  user_create: function(user) {
    this.users[user._id] = {
      last_submit: 0
    }
  },

  // Registers a score to the cache
  score_create: function(user) { 
    this.scores[user._id] = { 
      username: user.username, 
      category: user.category, 
      score: 0, 
      rank: 0, 
    } 
  },
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
  authorized_user_fail((req, res, user, ...args) => (
    user
      ? f(req, res, user, ...args)
      : null
  ))
)

/**
 * Request for user info.
 */
user_router.post('/data', user(io((req, res, user) => {

  // Current timestamp and cooldown
  const timestamp = new Date().getTime();
  const cooldown = Env.get_int('SUBMISSION_COOLDOWN');

  // Check cache
  if(!CACHE.users[user._id])
    CACHE.user_create(user)

  // No need to update; user can't have submitted within cooldown
  if(timestamp - CACHE.users[user._id].last_submit < cooldown && CACHE.users[user._id].last_submit > 0)
    return res.json({
      username: user.username, category: user.category,
      last_submit: CACHE.users[user._id].last_submit, 
    })

  // Get last submission timestamp
  PHO2.user_last_submit(user).then(last_submit => 
    res.json({ username: user.username, category: user.category, last_submit: last_submit }))
})));

/**
 * Public config info.
 */
user_router.post('/configlist', user(io((req, res, user) => {
  Query(Config)
    .select({ security: 'public' })
    .then(parameters => res.json({ config: parameters.map(parameter => ({ key: parameter.key, value: parameter.value }))}))
    .run()
})));

/**
 * Problem list.
 * MAKE SURE the answer is not included in the response...
 */
user_router.post('/problemlist', user(io((req, res, user) => {   
  Query(Problem)
    .select({ status: 'active' })
    .then(problems => res.json({ problems: problems.map(problem => ({ _id: problem._id, name: problem.name, code: problem.code, points: problem.points, }))}))
    .run()
})));

/**
 * Submission list.
 */
user_router.post('/submissionlist', user(io((req, res, user) => {
  Aggregate(Submission)
    .filter('user_id', user._id)
    .join(Problem, 'problem_id', '_id', 'problem', [ 'name', 'code', 'points' ])
    .filter('problem_name', Predicate().ne())
    .then(submissions => res.json({ submissions }))
    .run()
    .catch(res.failure())
})));

/**
 * Score list.
 * Computes the scores of the users.
 */
user_router.post('/scorelist', user(io((req, res, user) => {

  // Timestamp
  const timestamp = now()

  // Check if cache is kinda old
  if(timestamp - CACHE.scores_last_update <= CACHE.scores_update_interval)
    return res.json({ scores: CACHE.scores })

  // Clear cache
  CACHE.scores = {};

  // Get user list first to define the score cache
  Query(User).select().then(users => (
    users.map(user => CACHE.score_create(user))
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
      scores.map(score => CACHE.score(score._id).score = score.score),
      CACHE.scores = Object.values(CACHE.scores),
      
      // Sort then generate ranks
      CACHE.scores.sort((a, b) => b.score - a.score || a.username.localeCompare(b.username)),
      CACHE.scores.reduce((acc, score) => 
        (score.score !== acc.prev && acc.rank++, acc.prev = score.score, score.rank = acc.rank, acc), { prev: -1, rank: 0 }),
      CACHE.scores.filter(score => score.category === 'junior').reduce((acc, score) => 
        (score.score !== acc.prev && acc.rank++, acc.prev = score.score, score.cat_rank = acc.rank, acc), { prev: -1, rank: 0 }),
      CACHE.scores.filter(score => score.category === 'senior').reduce((acc, score) => 
        (score.score !== acc.prev && acc.rank++, acc.prev = score.score, score.cat_rank = acc.rank, acc), { prev: -1, rank: 0 }),

      // Update timestamp
      CACHE.scores_last_update = timestamp,

      // Send it to the user
      res.json({ scores: CACHE.scores })
    ))

    // Run
    .run();
})));

/**
 * Submits an answer for a problem.
 */
user_router.post('/submit', user(io((req, res, user) => {
  const { _id, answer } = req.get('submit-');

  // Grab timestamp
  const user_id = user._id;
  const timestamp = now();
  const cooldown = Env.get_int('SUBMISSION_COOLDOWN')
  const max_attempts = Env.get_int('SUBMISSION_ATTEMPTS')
  const elims_start = Env.get_int('CONTEST_ELIMS_START')
  const elims_end = Env.get_int('CONTEST_ELIMS_END')

  // Is in contest period
  if(timestamp < elims_start || timestamp > elims_end)
    return res.failure({ status: 403, error: 'You cannot submit outside of the contest period.'})()

  // Check cache
  if(!CACHE.users[user_id])
    CACHE.user_create(user)

  // Cached cooldown check
  if(timestamp - CACHE.users[user_id].last_submit < cooldown)
    return res.failure({ status: 403, error: 'You can only submit after your cooldown.'})()

  // Grab problem
  Query(Problem)
    .select({ _id })
    .result_is_empty(res.failure({ status: 400, error: 'Requested problem does not exist.' }))
    .result_is_not_empty(problems => {

      // Grab problem details
      const problem = problems[0];
      const answer_key = problem.answer;
      const tolerance = problem.tolerance;
      let attempts = 0;

      // Grab last_submit
      PHO2.user_last_submit(user).then(last_submit => {

        // Update the last submit
        CACHE.users[user_id].last_submit = last_submit;

        // Cooldown check
        if(timestamp - CACHE.users[user_id].last_submit < cooldown)
          return res.failure({ status: 403, error: 'You can only submit after your cooldown.'})()

        // Grab number of attempts
        Aggregate(Submission)
          .filter('user_id', user_id)
          .filter('problem_id', _id)
          .count('user_id')
          .result_is_empty(() => attempts = 0)
          .result_is_not_empty(submissions => attempts = submissions[0].count)
          .then(() => {

            // Max submissions reached
            if(attempts >= max_attempts)
              return res.failure({ status: 403, error: 'Maximum number of attempts reached for this problem.'})()

            // Check if already answered
            Aggregate(Submission)
              .filter('user_id', user_id)
              .filter('problem_id', _id)
              .filter('verdict', 'correct')
              .result_is_not_empty(res.failure({ status: 469, error: 'Problem already answered correctly.' }))
              .result_is_empty(() => {

                // Save the submission
                const verdict = check_answer(answer, answer_key, tolerance);
                const submission = { user_id: user_id, problem_id: _id, answer, verdict, timestamp };

                Query(Submission)
                  .insert(submission)
                  .then(res.success({ message: 'Submission logged successfully.' }))
                  .run()
              })
              .run()
          })
          .run()
      })
    })
    .run()
    .catch(res.failure())
})));

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