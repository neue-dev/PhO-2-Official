import express from 'express';
import bcrypt from 'bcrypt';

// The router to use
export const admin_router = express.Router();

import { io } from '../core/io.js'
import { Aggregate, Predicate, Query, QueryFactory } from '../core/db.js'
import { authorized_user_fail } from '../pho2/auth.js';
import { check_answer } from '../pho2/check.js';

import { User } from '../models/user.js';
import { Config } from '../models/config.js';
import { Problem } from '../models/problem.js';
import { Submission } from '../models/submission.js';

import { Env } from '../core/env.js';

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
 * Generates an answer checker function (string) for a specific problem.
 * 
 * @param problem   The problem to create the function for. 
 * @return          The checker (as a string).
 */
const problem_checker = (problem) => {

  // The template function
  function checker(mantissa, exponent) {
    
    const user_mantissa = mantissa;
    const user_exponent = exponent;
    
    const tolerance = "TOLERANCE";
    const key_mantissa = "KEY.MANTISSA";
    const key_exponent = "KEY.EXPONENT";
  
    const ratio = user_mantissa / key_mantissa;
    const magnitude = Math.pow(10, user_exponent - key_exponent);
  
    // Why tf did I need to return strings...
    if (Math.abs(ratio * magnitude - 1) > tolerance + Math.pow(tolerance, 3))
      return 'wrong';
    return 'correct';
  }

  // Return the function as a string
  return checker.toString()
    .replace('"KEY.MANTISSA"', problem.answer.mantissa) 
    .replace('"KEY.EXPONENT"', problem.answer.exponent)
    .replace('"TOLERANCE"', problem.tolerance) 
}

/**
 * Registers new users.
 */
admin_router.post('/registeruser', admin(io((req, res, user) => {
  const { username, password, category, status } = req.get('user-');
  const new_user = { username, password, category, status, isAdmin: false }

  const insert_query = () => 
    QueryFactory.insert_if_unique(User, { username }, new_user)
      .then(res.success({ message: 'User created successfully.'}))
      .catch(res.failure({ status: 400, error: 'Username taken.' }))

  // We gotta hash the password first
  bcrypt.hash(password, SALT_ROUNDS)
    .then(hash => (new_user.password = hash, insert_query()))
    .catch(res.failure())
})))

/**
 * Registers new problems.
 */
admin_router.post('/registerproblem', admin(io((req, res, user) => {
  const { name, type, status, code, answer, tolerance, points } = req.get('problem-');
  const new_problem = { name, type, status, code, answer, tolerance, points }

  // Create the problem
  QueryFactory.insert_if_unique(Problem, [ { name }, { code } ], new_problem)
    .then(res.success({ message: 'Problem created successfully.'}))
    .catch(res.failure({ status: 400, error: 'Problem name or code already exists.' }))
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
admin_router.post('/submissionlog', admin(io((req, res, user) => 
  
  // Wow we're using a 'join' LMAO
  Aggregate(Submission)
    .join(User, 'user_id', '_id', 'user', [ 'username' ])
    .join(Problem, 'problem_id', '_id', 'problem', [ 'name', 'code' ])
    
    // Filter deleted users and problems
    .filter('user_username', Predicate().ne())
    .filter('problem_code', Predicate().ne())

    // Remap problem code
    .field('p_codestring', function(code) { return code.number + '' + code.alpha }, [ 'problem_code' ])
    
    // Exclude fields then rename them
    .project({ _id: false, user_id: false, problem_id: false, problem_code: false, __v: false })
    .rename({ user_username: 'username', problem_name: 'problem', p_codestring: 'code', verdict: 'verdict', timestamp: 'timestamp' })

    // Yes
    .then(submissions => res.json({ submissions }))
    .run()
    .catch(res.failure())
)));

/**
 * Updates config variables.
 */
admin_router.post('/editconfig', admin(io((req, res, user) => {
  const { _id, key, value } = req.get('config-');
  const changes = { /*key,*/ value };
  
  // Callback for success
  // ! refactor this so the key is not required!
  const succeed_and_update = () => (
    res.success({ message: 'Parameter updated successfully.' })(),
    Env.set(key, value)
  )

  QueryFactory.update_if_exists(Config, _id, changes)
    .then(succeed_and_update)
    .catch(res.failure({ status: 400, error: 'Parameter does not exist.' }))
})))

/**
 * Updates problem details.
 */
admin_router.post('/editproblem', admin(io((req, res, user) => {
  const { _id, name, type, code, answer, tolerance, points, status } = req.get('problem-');
  const changes = { name, type, code, answer, tolerance, points, status };

  QueryFactory.update_if_exists(Problem, _id, changes)
    .then(res.success({ message: 'Problem updated successfully.' }))
    .catch(res.failure({ status: 400, error: 'Problem does not exist.' }))
})));

/**
 * Updates user details.
 */
admin_router.post('/edituser', admin(io((req, res, user) => {
  const { _id, username, password, category, status } = req.get('user-');
  const changes = { username, category, status }
  
  // Update query
  const update_query = (changes) =>
    QueryFactory.update_if_exists(User, _id, changes)
      .then(res.success({ message: 'User updated successfully.' }))
      .catch(res.failure({ status: 400, error: 'User does not exist.' }))

  // Update without password
  if(!password || password === '')
    return update_query(changes)

  // Update with a password
  bcrypt.hash(password, SALT_ROUNDS)
    .then(hash => (changes.password = hash, update_query(changes)))
    .catch(res.failure())
})));

/**
 * Deletes users.
 */
admin_router.post('/deleteuser', admin(io((req, res, user) => {
  const { _id } = req.get('user-');

  QueryFactory.delete_if_exists(User, _id)
    .then(res.success({ message: 'User deleted successfully.' }))
    .catch(res.failure({ status: 400, error: 'User does not exist.' }))
})));

/**
 * Deletes problems.
 */
admin_router.post('/deleteproblem', admin(io((req, res, user) => {
  const { _id } = req.get('problem-');

  QueryFactory.delete_if_exists(Problem, _id)
    .then(res.success({ message: 'Problem deleted successfully.' }))
    .catch(res.failure({ status: 400, error: 'Problem does not exist.' }))
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

/**
 * Rechecks problems.
 */
admin_router.post('/recheckproblem', admin(io((req, res, user) => {
  const { _id } = req.get('problem-');
  
  // Query for problem first
  Query(Problem)
    .select({ _id })
    .result_is_not_empty(problems => {

      // Grab the problem and the answer key
      const problem = problems[0];
      const checker = problem_checker(problem);

      // Update the submissions
      Query(Submission)
        .select({ problem_id: _id })
        .update('verdict', checker, [ 'answer.mantissa', 'answer.exponent' ])
        .then(res.success({ message: 'Successfully rechecked problem.'}))
        .run()
    })
    .run()
    .catch(res.failure())
})));

export default {
  admin_router
}