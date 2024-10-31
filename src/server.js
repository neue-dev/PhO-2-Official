/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-28 08:26:47
 * @ Modified time: 2024-11-01 03:21:20
 * @ Description:
 * 
 * The main thread on the server.
 */

import 'dotenv/config'

import fs from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import mustache from 'mustache';
import cookieparser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { api_router } from './routers/api-router.js';
import { auth_router } from './routers/auth-router.js';
import { admin_router } from './routers/admin-router.js';
import { user_router } from './routers/user-router.js';

import { Config } from './models/config.js';
import { User } from './models/user.js';

const SERVER = (() => {

  // Interface
  const _ = {};

  // Utils
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Server config
  const DATABASE_URL = process.env.DATABASE_URL
  const SERVER_PORT = process.env.SERVER_PORT
  const SERVER_HOME_URL = '/public/home.html'
  const SERVER_PUBLIC_URL = __dirname + '/public/resources'

  // Middleware
  const MIDDLEWARE = [
    express.static(SERVER_PUBLIC_URL, { maxAge: 9000000 }),
    express.json(),
    cookieparser(),
  ]

  // Routers
  const ROUTERS = [
    [ '/api', api_router ],
    [ '/admin', admin_router ],
    [ '/auth', auth_router ],
    [ '/user', user_router ]
  ]

  // Shortcuts to resources
  const RESOURCES = [
    
    // CSS files
    '/css/responsive.css',
    '/css/main.css',
    '/css/home.css',

    // Core js files
    '/core/dom.js',
    '/core/component.js',
    '/core/x.js',

    // Pho2 js files
    '/pho2/pho2.js',
    '/pho2/darkmode.js',
    '/pho2/timer.js',
    '/pho2/trademark.js',
  ]

  // Pho2 Images
  const IMAGES = [
    '/pho-2-official-bg',
    '/pho-2-official-title',
    '/pho-2-official-subtitle',
    '/pho-2-official-icon',
    '/pho-2-official-icon-dark',
    '/pho-2-official-logo',
  ]

  // Resources that depend on whether or not someone is admin
  const PERMISSIONED_RESOURCES = [
    
  ]

  /**
   * Sends a file to the client.
   * Default root is set.
   * 
   * @param res   The response api. 
   * @param file  The file to send. 
   */
  const send_file = (res, file=SERVER_HOME_URL) => res.sendFile(file, { root: __dirname })

  /**
   * Reads a file, promisified.
   * 
   * @param file  The file to read. 
   * @return      A promise for the data.
   */
  const read_file = (file) => Promise.resolve(fs.readFileSync(file, 'utf-8'))

  /**
   * Writes a file to the output stream.
   * Replaces mustache templates with the given options too.
   * 
   * @param res         The response api. 
   * @param file        The file to write.
   * @param mustaches   The stuff to replace.  
   */
  const write_file = (res, file, mustaches) => 
    read_file(file)
      .then(data => res.write(mustache.render(data, mustaches)))

  /**
   * Redirects the client to the given path.
   * 
   * @param res   The response api. 
   * @param path  The path to go to.
   */
  const redirect = (res, path) => res.redirect(path)

  /**
   * Wraps a function around an authorization check.
   * 
   * @param func  The function to wrap.
   * @return      The wrapped function.
   */
  const authorized = (func) => (

    // The wrapped function
    (req, res) => {

      // Check for authorization first
      if(!req) 
        return send_file(res, SERVER_HOME_URL)
      
      if(!req.cookies)
        return send_file(res, SERVER_HOME_URL)

      if(!req.cookies.authorization) 
        return send_file(res, SERVER_HOME_URL)
      
      // Call func
      return func(req, res)
    }
  ) 

  /**
   * Makes sure the user is authorized...
   * AND passes the user to the wrapped function.
   * 
   * @param func  The function to decorate.
   * @return      The decorated function. 
   */
  const authorized_user = (func) => (
    
    // Wrapped func
    authorized((req, res) => {
      
      // Grab tokens
      const { 
        accessToken, 
        refreshToken 
      } = req.cookies.authorization;

      // If no token is present, redirect to home page
      if (!accessToken) 
        return send_file(res);

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
        return send_file(res);
      }
    })
  )

  /**
   * @return  Whether or not we're durin the elims.
   */
  const during_elims = () => (
    ((now) => (now > process.env.CONTEST_ELIMS_START && now < process.env.CONTEST_ELIMS_END))(Date.now())
  )

  /**
   * @return  Whether or not we're during the finals.
   */
  const during_finals = () => (
    ((now) => (now > process.env.CONTEST_FINALS_START && now < process.env.CONTEST_FINALS_START))(Date.now())
  )

  /**
   * Initializes the database.
   * We're using mongodb in this case.
   * I don't remember why I chose that...
   */
  _.init_database = () => {

    // Database init
    mongoose.connect(DATABASE_URL);
    mongoose.set('strictQuery', false);

    // Get the connection
    const database = mongoose.connection;

    // If an error occurs
    database.on('error', (error) => {
      console.error(error)
    });

    // When db connected
    database.once('connected', async () => {

      // Log
      console.log('Database connected.');

      // Grab the config params 
      const config = await Config.find();

      // Update the environment variables accordingly
      config.map(parameter => process.env[parameter.key] = parameter.value)
    }); 
  }

  /**
   * Sets up the server.
   */
  _.init_server = () => {
    
    // Create the app and the server
    const app = express();
    const server = app.listen(SERVER_PORT, () => { 
      console.log(`Server opened on port ${SERVER_PORT}.`)
    });

    // Init middleware
    for(const middleware of MIDDLEWARE) 
      app.use(middleware)

    // Init routers
    for(const router of ROUTERS)
      app.use(router[0], router[1])

    // Home Page
    app.get('/', authorized((req, res) => redirect(res, '/dashboard')));

    // Dashboard
    app.get('/dashboard', authorized_user((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/dashboard.html')
        : send_file(res, './public/user/dashboard.html')
    )))

    // Config and progress pages
    app.get([ '/config', '/progress' ], authorized_user((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/config.html')
        : send_file(res, './public/user/progress.html')
    )));

    // Problems
    app.get('/problems', authorized_user((req, res, user) => (
      during_elims() || user.isAdmin
        ? write_file(res, './public/problems.html', { CONTEST_PROBLEMS_URL: process.env.CONTEST_PROBLEMS_URL })
        : send_file(res, './public/error/unavailable-problems.html')
    )));

    // Finals
    app.get('/finals', authorized_user((req, res, user) => (
      during_finals() || user.isAdmin
        ? write_file(res, './public/finals.html', { CONTEST_FINALS_URL: process.env.CONTEST_FINALS_URL })
        : send_file(res, './public/error/unavailable-finals.html')
    )));

    // Forum
    app.get('/forum', authorized_user((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/forum.html')
        : send_file(res, './public/user/forum.html')
    )));

    // Leaderboard
    app.get('/leaderboard', authorized_user((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/leaderboard.html')
        : send_file(res, './public/user/leaderboard.html')
    )));

    // Config and progress resources
    app.get([ '/config.js', '/progress.js' ], authorized_user((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/config.js')
        : send_file(res, './public/user/progress.js')
    )))

    // Leaderboard resources
    app.get('/leaderboard.js', authorized_user((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/leaderboard.js')
        : send_file(res, './public/user/leaderboard.js')
    )))

    // Forum resources
    app.get('/forum.js', authorized_user((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/forum.js')
        : send_file(res, './public/user/forum.js')
    )))
    
    // Common resources
    for(const resource of RESOURCES)
      app.get(resource, (req, res) => send_file(res, `./public/resources${resource}`))

    // We have a different policy for images for the sake of convenience
    // Also because they tend to be more resource intensive, so we might outsource them eventually
    for(const image of IMAGES)
      app.get(image, (req, res) => send_file(res, `/public/resources/images${image}.png`))
  }

  // Init the db and server
  _.init_database();
  _.init_server();

})()