const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Existing route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.render('users/index.ejs', { users }); // Render without currentUserId
  } catch (err) {
    console.error(err);
    res.redirect('/'); // Redirect in case of an error
  }
});

// New route to view a specific user's pantry
router.get('/:userId/pantry', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.redirect('/users'); // Redirect if user not found
    }
    res.render('users/pantry.ejs', { user });
  } catch (err) {
    console.error(err);
    res.redirect('/'); // Redirect in case of an error
  }
});

module.exports = router;
