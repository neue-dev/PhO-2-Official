/**
 * @ Author: Mo David
 * @ Create Time: 2024-11-01 03:20:42
 * @ Modified time: 2025-01-29 14:13:40
 * @ Description:
 * 
 * Deals with auth-related tasks.
 */

import jwt from 'jsonwebtoken';

import { send_file, write_file, fail, succeed, SERVER_HOME_URL } from '../core/io.js';
import { User } from '../models/user.js';

import { Env } from '../core/env.js';
import { STATIC_VERSION } from '../core/info.js'

/**
 * Generates a new token for the session
 * 
 * @param user  The user to generate it for. 
 * @return      The new token. 
 */
export const generate_token = (user) => jwt.sign({ _id: user._id, }, Env.get('ACCESS_TOKEN_SECRET'));

/**
 * Refreshes a token.
 * 
 * @param user  The user who owns the token. 
 * @return      The refreshed token.
 */
export const refresh_token = (user) => jwt.sign({ _id: user._id, }, Env.get('REFRESH_TOKEN_SECRET'));

/**
 * Wraps a function around an authorization check.
 * 
 * @param func  The function to wrap.
 * @param fail  A failing function.
 * @return      The wrapped function.
 */
const authorized_decorator = (func, fail) => (

  // The wrapped function
  (req, res, ...args) => {

    // Check for authorization first
    if(!req) 
      return fail(res)
    
    if(!req.cookies) 
      return fail(res)

    if(!req.cookies.authorization) 
      return fail(res)
    
    // Call func
    return func(req, res, ...args)
  }
) 

// A decorator for authorized checks
// Performs redirects
export const authorized_redirect = (func) => authorized_decorator(func, (res) => write_file(res, SERVER_HOME_URL, { STATIC_VERSION }))

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
  authorized_decorator((req, res, ...args) => {
    
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
      req.user = jwt.verify(accessToken, Env.get('ACCESS_TOKEN_SECRET'));

      // Look for user in database and execute appropriate action
      // We don't use our API to avoid coupling io.js to db.js
      User.findOne({ _id: req.user._id })
        .then(user => user ? func(req, res, user, ...args) : send_file(res))
      
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