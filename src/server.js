/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-28 08:26:47
 * @ Modified time: 2025-02-24 01:01:09
 * @ Description:
 * 
 * The main thread on the server.
 */

import express from 'express';
import mongoose from 'mongoose';
import cookieparser from 'cookie-parser';

import { api_router } from './server/routers/api-router.js';
import { auth_router } from './server/routers/auth-router.js';
import { admin_router } from './server/routers/admin-router.js';
import { user_router } from './server/routers/user-router.js';

import { Config } from './server/models/config.js';
import { write_file, redirect, SERVER_PUBLIC_URL } from './server/core/io.js'
import { authorized_redirect, authorized_user_redirect } from './server/pho2/auth.js';
import { Env } from './server/core/env.js';
import { STATIC_VERSION, STATIC_VERSION_EXCLUDES } from './server/core/info.js'

const SERVER = (() => {

  // Interface
  const _ = {};

  // Server config
  const DATABASE_URL = Env.get('DATABASE_URL')
  const SERVER_PORT = Env.get('SERVER_PORT')

  // Middleware
  const MIDDLEWARE = [
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

  // Helper functions
  const during_elims = () => ((now) => (now > Env.get('CONTEST_ELIMS_START') && now < Env.get('CONTEST_ELIMS_END')))(Date.now())
  const during_finals = () => ((now) => (now > Env.get('CONTEST_FINALS_START') && now < Env.get('CONTEST_FINALS_END')))(Date.now())

  // Production mode (default if MODE is undefined)
  const is_production = () => !Env.get('MODE') || [ 'PROD', 'PRODUCTION' ].includes(Env.get('MODE'))

  /**
   * Initializes the database.
   * We're using mongodb in this case.
   * I don't remember why I chose that...
   */
  _.init_database = () => {

    // Database init
    mongoose.set('strictQuery', true);
    mongoose.connect(DATABASE_URL);

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
      config.map(parameter => Env.set(parameter.key, parameter.value))
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
      console.log(`Running the application in ${is_production() ? 'PROD' : 'DEV'} mode.`)
    });

    // Handling static files
    app.use('/resources/', async (req, res, next) => {
      
      // Grab the version of the asset requested
      const { v: version } = req.query;

      // Invalid request
      // Every asset request must specify a version
      // This is more here for my sanity's sake
      if(!version)
        if(!STATIC_VERSION_EXCLUDES.some((exclude) => req.path.startsWith(exclude)))
          console.log(`Warning: missing version parameter for ${req.path}.`)

      // Serve asset, default mode is to set expiry for 1 week
      if(is_production())
        express.static(SERVER_PUBLIC_URL, { maxAge: 604800000 })(req, res, next);

      // Dev mode, do no caching
      else 
        express.static(SERVER_PUBLIC_URL, { etag: false })(req, res, next);
    })

    // Init middleware
    for(const middleware of MIDDLEWARE) 
      app.use(middleware)

    // Init routers
    for(const router of ROUTERS)
      app.use(router[0], router[1])

    // Home Page
    app.get('/', authorized_redirect((req, res) => redirect(res, '/dashboard')));

    // Dashboard
    app.get('/dashboard', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/dashboard.html', { STATIC_VERSION, CONTEST_FORUM_URL: Env.get('CONTEST_FORUM_URL') })
        : write_file(res, './public/user/dashboard.html', { STATIC_VERSION, CONTEST_FORUM_URL: Env.get('CONTEST_FORUM_URL') })
    )))

    // Config and progress pages
    app.get([ '/config', '/progress' ], authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/config.html', { STATIC_VERSION })
        : write_file(res, './public/user/progress.html', { STATIC_VERSION })
    )));

    // Problems
    app.get('/problems', authorized_user_redirect((req, res, user) => (
      during_elims() || user.isAdmin
        ? write_file(res, './public/problems.html', { STATIC_VERSION, CONTEST_PROBLEMS_URL: Env.get('CONTEST_PROBLEMS_URL') })
        : write_file(res, './public/error/unavailable-problems.html', { STATIC_VERSION })
    )));

    // Finals
    app.get('/finals', authorized_user_redirect((req, res, user) => (
      during_finals() || user.isAdmin
        ? write_file(res, './public/finals.html', { STATIC_VERSION, CONTEST_FINALS_URL: Env.get('CONTEST_FINALS_URL') })
        : write_file(res, './public/error/unavailable-finals.html', { STATIC_VERSION })
    )));

    // Forum
    app.get('/forum', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/forum.html', { STATIC_VERSION })
        : write_file(res, './public/user/forum.html', { STATIC_VERSION })
    )));

    // Leaderboard
    app.get('/leaderboard', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/leaderboard.html', { STATIC_VERSION })
        : write_file(res, './public/user/leaderboard.html', { STATIC_VERSION })
    )));

    // Config and progress resources
    app.get([ '/config.js', '/progress.js' ], authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/config.js', { STATIC_VERSION })
        : write_file(res, './public/user/progress.js', { STATIC_VERSION })
    )))

    // Setup resources
    app.get('/setup.js', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/setup.js', { STATIC_VERSION })
        : write_file(res, './public/user/setup.js', { STATIC_VERSION })
    )))

    // Leaderboard resources
    app.get('/leaderboard.js', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/leaderboard.js', { STATIC_VERSION })
        : write_file(res, './public/user/leaderboard.js', { STATIC_VERSION })
    )))

    // Forum resources
    app.get('/forum.js', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? write_file(res, './public/admin/forum.js', { STATIC_VERSION })
        : write_file(res, './public/user/forum.js', { STATIC_VERSION })
    )))
  }

  // Init the db and server
  _.init_database();
  _.init_server();

})()