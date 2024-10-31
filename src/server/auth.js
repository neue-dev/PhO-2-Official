/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:20:42
 * @ Modified time: 2024-11-01 05:39:08
 * @ Description:
 * 
 * Deals with auth-related tasks.
 */

import 'dotenv/config'

import jwt from 'jsonwebtoken';

import { send_file, fail, succeed } from './io.js';
import { User } from './models/user.js';

export const SERVER_HOME_URL = '/public/home.html'

/**
 * Generates a new token for the session
 * 
 * @param user  The user to generate it for. 
 * @return      The new token. 
 */
export const generate_token = (user) => jwt.sign({ _id: user._id, }, process.env.ACCESS_TOKEN_SECRET);

/**
 * Refreshes a token.
 * 
 * @param user  The user who owns the token. 
 * @return      The refreshed token.
 */
export const refresh_token = (user) => jwt.sign({ _id: user._id, }, process.env.REFRESH_TOKEN_SECRET);

/**
 * Wraps a function around an authorization check.
 * 
 * @param func  The function to wrap.
 * @param fail  A failing function.
 * @return      The wrapped function.
 */
const authorized_decorator = (func, fail) => (

  // The wrapped function
  (req, res) => {

    // Check for authorization first
    if(!req) 
      return fail(res)
    
    if(!req.cookies) 
      return fail(res)

    if(!req.cookies.authorization) 
      return fail(res)
    
    // Call func
    return func(req, res)
  }
) 

// A decorator for authorized checks
// Performs redirects
export const authorized_redirect = (func) => authorized_decorator(func, (res) => send_file(res, SERVER_HOME_URL))

// A decorator for authorized checks
// Fails the function with an error status
export const authorized_fail = (func) => authorized_decorator(func, (res) => fail(res, { status: 401, error: 'Unauthorized request.' }))

/**
 * Makes sure the user is authorized...
 * AND passes the user to the wrapped function.
 * 
 * @param func  The function to decorate.
 * @param fail  A failing function.
 * @return      The decorated function. 
 */
const authorized_user_decorator = (func, fail) => (
  
  // Wrapped func
  authorized_decorator((req, res) => {
    
    // Grab tokens
    const { 
      accessToken, 
      refreshToken 
    } = req.cookies.authorization;

    // If no token is present, redirect to home page
    if (!accessToken) 
      return fail(res);

    // Token verification
    try {

      // We retrieve the access token dynamically for possibility of hot-swapping
      req.user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      // Look for user in database and execute appropriate action
      User.findOne({ _id: req.user._id })
        .then(user => user ? func(req, res, user) : send_file(res))
      
    // Token is probably invalid
    } catch (error) {
      console.error(error);
      return fail(res);
    }
  }, fail)
)

// A decorator for authorized user checks
// Performs redirects
export const authorized_user_redirect = (func) => authorized_user_decorator(func, (res) => send_file(res))

// A decorator for authorized user checks
// Fails the function with an error status
export const authorized_user_fail = (func) => authorized_user_decorator(func, (res) => fail(res, { status: 401, error: 'Unauthorized request.' }))

export default { 
  generate_token,
  refresh_token,

  authorized_redirect,
  authorized_fail,
  authorized_user_redirect,
  authorized_user_fail,
};