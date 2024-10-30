import 'dotenv/config'

import fs from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import mustache from 'mustache';
import cookieparser from 'cookie-parser';

import { api_router } from './routes/api-router.js';
import { auth_router } from './routes/auth-router.js';
import { admin_router } from './routes/admin-router.js';
import { user_router } from './routes/user-router.js';

import { auth } from './middleware/auth.js';
import { identify } from './middleware/identify.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//
//* Some other important constants
//
const database_url = process.env.DATABASE_URL
const server_port = process.env.SERVER_PORT

//
//* The config model
//
import { Config } from './models/config.js';

//
//* Set up the database
//
mongoose.connect(database_url);
mongoose.set('strictQuery', false);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
});

database.once('connected', async () => {
  console.log('Database connected.');

  // Set up the environment variables
  const db = database;

  const config = await Config.find();
  config.forEach(configParameter => 
    process.env[configParameter.key] = configParameter.value)
});

//
//* Set up the server
//
const app = express();
const server = app.listen(server_port, () => { 
  console.log(`Server opened on port ${server_port}.`)
});

// Middleware
app.use(express.static('public'))
app.use(express.json());
app.use(cookieparser());
app.use(express.static(__dirname + '/public', { maxAge: 3600000 }));  // One hour cache

// The different routes
app.use('/api', api_router);
app.use('/auth', auth_router);
app.use('/admin', admin_router);
app.use('/user', user_router);

app.get('/', (req, res) => {
  if(req.cookies['authorization']) 
    if(req.cookies['authorization'].accessToken != '')
      return res.redirect('/dashboard');

  return res.sendFile('./public/home.html', { root: __dirname });
});

app.get('/problems', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    identify(user._id)
      .then(userData => {
        if(!userData)
          return res.sendFile('./public/home-redirect.html', { root: __dirname });

        // If it's during the elims OR if the user is an admin
        if((Date.now() > process.env.CONTEST_ELIMS_START && Date.now() < process.env.CONTEST_ELIMS_END) || userData.isAdmin) {

          // Parse the HTML file and replace the mustache tags.
          fs.readFile('./public/problems.html', 'utf-8', (err, data) => {
            res.write(mustache.render(data, { CONTEST_PROBLEMS_URL: process.env.CONTEST_PROBLEMS_URL }));
          });

          return;
        }

        return res.sendFile('./public/err-pages/unavailable-problems.html', { root: __dirname });
      });
  } else {
    // Isnt logged in
    return res.sendFile('./public/home-redirect.html', { root: __dirname });
  }
});

app.get('/config', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    identify(user._id)
      .then(userData => {
        if(!userData || !userData.isAdmin)
          return res.sendFile('./public/home-redirect.html', { root: __dirname });

        // Parse the HTML file and replace the mustache tags.
        return res.sendFile('./public/admin/config.html', { root: __dirname });
      });
  } else {
    // Isnt logged in
    return res.sendFile('./public/home-redirect.html', { root: __dirname });
  }
});

app.get('/finals', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    identify(user._id)
      .then(userData => {
        if(!userData)
          return res.sendFile('./public/home-redirect.html', { root: __dirname });

        // If it's during the finals OR user is an admin
        if((Date.now() > process.env.CONTEST_FINALS_START && Date.now() < process.env.CONTEST_FINALS_END) || userData.isAdmin) {

          // Parse the HTML file and replace the mustache tags.
          fs.readFile('./public/finals.html', 'utf-8', (err, data) => {
            res.write(mustache.render(data, { CONTEST_FINALS_URL: process.env.CONTEST_FINALS_URL }));
          });

          return;
        }

        return res.sendFile('./public/err-pages/unavailable-finals.html', { root: __dirname });
      });
  } else {
    // Isnt logged in
    return res.sendFile('./public/home-redirect.html', { root: __dirname });
  }
});

app.get('/dashboard', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            // User not found
            return res.sendFile('./public/home-redirect.html', { root: __dirname });

          // Provide right page given user rights
          if(userData.isAdmin)
            return res.sendFile('./public/admin/dashboard.html', { root: __dirname });
          return res.sendFile('./public/user/dashboard.html', { root: __dirname });
        });
    } else {
      return res.sendFile('./public/home-redirect.html', { root: __dirname });
    }
  } else {
    // Isnt logged in
    return res.sendFile('./public/home-redirect.html', { root: __dirname });
  }
});

app.get('/dashboard/js', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            // User not found
            return res.status(401);

          // Provide right page given user rights
          if(userData.isAdmin)
            return res.sendFile('./public/admin/dashboard.js', { root: __dirname });
          return res.sendFile('./public/user/dashboard.js', { root: __dirname });
        });
    } else {
      return res.status(403);
    }
  } else {
    // Isnt logged in
    return res.status(403);
  }
})

app.get('/leaderboard/js', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            // User not found
            return res.status(401);

          // Provide right page given user rights
          if(userData.isAdmin)
            return res.sendFile('./public/admin/leaderboard.js', { root: __dirname });
          return res.sendFile('./public/user/leaderboard.js', { root: __dirname });
        });
    } else {
      return res.status(403);
    }
  } else {
    // Isnt logged in
    return res.status(403);
  }
})

app.get('/forum/js', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            // User not found
            return res.status(401);

          // Provide right page given user rights
          if(userData.isAdmin)
            return res.sendFile('./public/admin/forum.js', { root: __dirname });
          return res.sendFile('./public/user/forum.js', { root: __dirname });
        });
    } else {
      return res.status(403);
    }
  } else {
    // Isnt logged in
    return res.status(403);
  }
})

app.get('/leaderboard', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            return res.sendFile('./public/home-redirect.html', { root: __dirname });
          
          // Provide right page given user rights
          if(userData.isAdmin)
            return res.sendFile('./public/admin/leaderboard.html', { root: __dirname });
          return res.sendFile('./public/user/leaderboard.html', { root: __dirname });
        });
    } else {
      return res.sendFile('./public/home-redirect.html', { root: __dirname });
    }
  } else {
    // Isnt logged in
    return res.sendFile('./public/home-redirect.html', { root: __dirname });
  }
});

app.get('/forum', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            return res.sendFile('./public/home-redirect.html', { root: __dirname });
          
          // Provide right page given user rights
          if(userData.isAdmin)
            return res.sendFile('./public/admin/forum.html', { root: __dirname });
          return res.sendFile('./public/user/forum.html', { root: __dirname });
        });
    } else {
      return res.sendFile('./public/home-redirect.html', { root: __dirname });
    }
  } else {
    // Isnt logged in
    return res.sendFile('./public/home-redirect.html', { root: __dirname });
  }
});

app.get('/navbar', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            // User not found
            return res.status(401);

          // Provide right page given user rights
          if(userData.isAdmin)
            return res.sendFile('./public/admin/navbar.js', { root: __dirname });
          return res.sendFile('./public/user/navbar.js', { root: __dirname });
        });
    } else {
      return res.status(403);
    }
  } else {
    // Isnt logged in
    return res.status(403);
  }
})

// Some redirects for the javascript files
app.get('/utils/js/xhr', (req, res) => {
  res.sendFile('./public/utils/xhr.js', { root: __dirname });
})

app.get('/utils/js/answer', (req, res) => {
  res.sendFile('./public/utils/answer.js', { root: __dirname });
})

app.get('/utils/js/regex', (req, res) => {
  res.sendFile('./public/utils/regex.js', { root: __dirname });
})

app.get('/utils/js/header', (req, res) => {
  res.sendFile('./public/utils/header.js', { root: __dirname });
})

app.get('/utils/js/timer', (req, res) => {
  res.sendFile('./public/utils/timer.js', { root: __dirname });
})

app.get('/utils/js/filter', (req, res) => {
  res.sendFile('./public/utils/filter.js', { root: __dirname });
})

app.get('/utils/js/logout', (req, res) => {
  res.sendFile('./public/utils/logout.js', { root: __dirname });
})

app.get('/darkmode', (req, res) => {
  res.sendFile('./public/utils/darkmode.js', { root: __dirname });
})

app.get('/trademark', (req, res) => {
  res.sendFile('./public/utils/trademark.js', { root: __dirname });
})

app.get('/pho2', (req, res) => {
  res.sendFile('./public/utils/pho2.js', { root: __dirname });
})

app.get('/dom', (req, res) => {
  res.sendFile('./public/utils/dom.js', { root: __dirname });
})

app.get('/x', (req, res) => {
  res.sendFile('./public/utils/x.js', { root: __dirname });
})

// The official logos
app.get('/pho-2-logo', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-logo.png', { root: __dirname });
})

app.get('/pho-2-icon', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-icon.png', { root: __dirname });
})

app.get('/pho-2-icon-dark', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-icon-dark.png', { root: __dirname });
})

app.get('/pho-2-bg', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-bg.png', { root: __dirname });
})

app.get('/pho-2-title', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-title.png', { root: __dirname });
})

app.get('/pho-2-subtitle', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-subtitle.png', { root: __dirname });
})

// Other resources
app.get('/utils/css/main', (req, res) => {
  res.sendFile('./public/resources/css/main.css', { root: __dirname });
})

app.get('/utils/css/home', (req, res) => {
  res.sendFile('./public/resources/css/home.css', { root: __dirname });
})

app.get('/utils/css/responsive', (req, res) => {
  res.sendFile('./public/resources/css/responsive.css', { root: __dirname });
})