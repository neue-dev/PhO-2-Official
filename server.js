require('dotenv').config();

const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const mustache = require('mustache');
const apiroutes = require('./routes/apiroutes');
const authroutes = require('./routes/authroutes');
const adminroutes = require('./routes/adminroutes');
const userroutes = require('./routes/userroutes');
const cookieparser = require('cookie-parser');

const { auth } = require('./middleware/auth');
const identify = require('./middleware/identify');

//
//* Some other important constants
//
const database_url = process.env.DATABASE_URL
const server_port = process.env.SERVER_PORT

//
//* The config model
//
const Config = require('./models/config');

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
app.use(express.json());
app.use(cookieparser());
app.use(express.static(__dirname + '/public'));

// The different routes
app.use('/api', apiroutes);
app.use('/auth', authroutes);
app.use('/admin', adminroutes);
app.use('/user', userroutes);

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

        return res.sendFile('./public/err-pages/problems-unavailable.html', { root: __dirname });
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

        return res.sendFile('./public/err-pages/finals-unavailable.html', { root: __dirname });
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

app.get('/leaderboard', (req, res) => {
  const user = auth(req, res);
  if(user){

    // Look for user
    if(user._id) {
      identify(user._id)
        .then(userData => {
          if(!userData)
            return res.sendFile('./public/home-redirect.html', { root: __dirname });
          return res.sendFile('./public/leaderboard.html', { root: __dirname });
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
          return res.sendFile('./public/forum.html', { root: __dirname });
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

app.get('/utils/js/config', (req, res) => {
  res.sendFile('./public/utils/config.js', { root: __dirname });
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

// The official logos
app.get('/pho-2-logo', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-logo.png', { root: __dirname });
})

app.get('/pho-2-icon', (req, res) => {
  res.sendFile('./public/resources/images/pho-2-official-icon.png', { root: __dirname });
})

// Other resources
app.get('/utils/css/main', (req, res) => {
  res.sendFile('./public/resources/css/main.css', { root: __dirname });
})