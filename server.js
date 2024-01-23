require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authroutes = require('./routes/authroutes');
const adminroutes = require('./routes/adminroutes');
const userroutes = require('./routes/userroutes');
const cookieparser = require('cookie-parser');

const { auth } = require('./middleware/auth');
const identify = require('./middleware/identify');

//
//* Set up the database
//
const database_url = process.env.DATABASE_URL
mongoose.connect(database_url);
mongoose.set('strictQuery', false);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
});

database.once('connected', () => {
  console.log('Database connected.');
});

//
//* Set up the server
//
const app = express();
const server = app.listen(3000, () => { 
  console.log('Server opened on port 3000.')
});

app.use(express.json());
app.use(cookieparser());
app.use(express.static(__dirname + '/public'));
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
        return res.sendFile('./public/problems.html', { root: __dirname });
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