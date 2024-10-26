const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const session = require('express-session');

const mongoose = require('mongoose')
const methodOverride = require('method-override');
const app = express();

const morgan = require('morgan');
require('dotenv').config();

// Controllers
const isSignedIn = require('./middleware/isSignedIn');
const addUserToViews = require('./middleware/addUserToViews');

const authController = require('./controllers/auth');
const foodsController = require('./controllers/foods');
const usersController = require('./controllers/users.js');


// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';
const path = require('path');
mongoose.connect(process.env.MONGODB_URI);


// MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(addUserToViews);

// Public Routes
app.get('/', async (req, res) => {
  res.render('index.ejs');
});



app.get('/protected', async (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.sendStatus(404);
    // res.send('Sorry, no guests allowed.');
  }
});


app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users', usersController);
app.use('/users/:userId/foods', foodsController);


app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`The express app is ready on port ${port}!`);
});
