/**
 * @ Author: Mo David
 * @ Create Time: 2024-10-28 08:26:47
 * @ Modified time: 2024-11-11 18:25:21
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
import { send_file, write_file, redirect, SERVER_PUBLIC_URL } from './server/core/io.js'
import { authorized_redirect, authorized_user_redirect } from './server/pho2/auth.js';
import { Env } from './server/core/env.js';

const SERVER = (() => {

  // Interface
  const _ = {};

  // Server config
  const DATABASE_URL = Env.get('DATABASE_URL')
  const SERVER_PORT = Env.get('SERVER_PORT')

  // Middleware
  const MIDDLEWARE = [

    // ! remove debug param
    // ! set max age to one hour, not 1.5 mins (?)
    // express.static(SERVER_PUBLIC_URL, { etag: false }),
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
    '/core/time.js',
    '/core/preload.js',

    // Pho2 js files
    '/common/pho2.js',
    '/common/settings.js',
    '/common/timer.js',
    '/common/formatter.js',
    '/common/trademark.js',
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

  // Helper functions
  const during_elims = () => ((now) => (now > Env.get('CONTEST_ELIMS_START') && now < Env.get('CONTEST_ELIMS_END')))(Date.now())
  const during_finals = () => ((now) => (now > Env.get('CONTEST_FINALS_START') && now < Env.get('CONTEST_FINALS_END')))(Date.now())

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
    });

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
        ? write_file(res, './public/admin/dashboard.html', { CONTEST_FORUM_URL: Env.get('CONTEST_FORUM_URL') })
        : write_file(res, './public/user/dashboard.html', { CONTEST_FORUM_URL: Env.get('CONTEST_FORUM_URL') })
    )))

    // Config and progress pages
    app.get([ '/config', '/progress' ], authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/config.html')
        : send_file(res, './public/user/progress.html')
    )));

    // Problems
    app.get('/problems', authorized_user_redirect((req, res, user) => (
      during_elims() || user.isAdmin
        ? write_file(res, './public/problems.html', { CONTEST_PROBLEMS_URL: Env.get('CONTEST_PROBLEMS_URL') })
        : send_file(res, './public/error/unavailable-problems.html')
    )));

    // Finals
    app.get('/finals', authorized_user_redirect((req, res, user) => (
      during_finals() || user.isAdmin
        ? write_file(res, './public/finals.html', { CONTEST_FINALS_URL: Env.get('CONTEST_FINALS_URL') })
        : send_file(res, './public/error/unavailable-finals.html')
    )));

    // Forum
    app.get('/forum', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/forum.html')
        : send_file(res, './public/user/forum.html')
    )));

    // Leaderboard
    app.get('/leaderboard', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/leaderboard.html')
        : send_file(res, './public/user/leaderboard.html')
    )));

    // Config and progress resources
    app.get([ '/config.js', '/progress.js' ], authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/config.js')
        : send_file(res, './public/user/progress.js')
    )))

    // Setup resources
    app.get('/setup.js', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/setup.js')
        : send_file(res, './public/user/setup.js')
    )))

    // Leaderboard resources
    app.get('/leaderboard.js', authorized_user_redirect((req, res, user) => (
      user.isAdmin
        ? send_file(res, './public/admin/leaderboard.js')
        : send_file(res, './public/user/leaderboard.js')
    )))

    // Forum resources
    app.get('/forum.js', authorized_user_redirect((req, res, user) => (
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