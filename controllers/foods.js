const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Index Route - View all pantry items
router.get('/', async (req, res) => {
  try {
    const userId = req.session.user._id; // Get user ID from session
    const user = await User.findById(userId); // Find the user

    res.render('foods/index.ejs', {
      user: user,
      pantry: user.pantry, // Pass the pantry items
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

//add a new item
router.get('/new', (req, res) => {
  res.render('foods/new.ejs', { user: req.session.user });
});

// POST Route - Add a new food item
router.post('/', async (req, res) => {
  try {
    const userId = req.session.user._id; // Get the user ID from the session
    const newFood = {
      name: req.body.name, // Get the food name from the form
    };

    // Find the user and add the new food item to the pantry
    await User.findByIdAndUpdate(userId, {
      $push: { pantry: newFood }, // Push the new item to the pantry array
    });

    res.redirect('/users/' + userId + '/foods'); // Redirect to the index page
  } catch (error) {
    console.error(error);
    res.redirect('/'); 
  }
});

// Show Route - Display a specific food item
router.get('/:itemId', async (req, res) => {
  try {
    const userId = req.session.user._id; // Get user ID from session
    const user = await User.findById(userId); // Find the user
    const foodItem = user.pantry.id(req.params.itemId); // Find the specific food item

    res.render('foods/show.ejs', {
      user: user,
      foodItem: foodItem, // Pass the food item to the view
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

// DELETE Route - Remove a specific food item
router.delete('/:itemId', async (req, res) => {
  try {
    const userId = req.session.user._id; // Get user ID from session

    // Find the user and remove the specific food item from the pantry
    await User.findByIdAndUpdate(userId, {
      $pull: { pantry: { _id: req.params.itemId } } // Pull the food item from the pantry
    });

    res.redirect(`/users/${userId}/foods`); // Redirect back to the pantry
  } catch (error) {
    console.error(error);
    res.redirect('/'); // Redirect on error
  }
});

// Update Route - Update a specific food item
router.put('/:itemId', async (req, res) => {
  try {
    const userId = req.session.user._id; // Get user ID from session
    const foodUpdate = {
      name: req.body.name, // Get the updated food name from the form
    };

    // Find the user and update the specific food item in the pantry
    await User.findByIdAndUpdate(
      userId,
      { $set: { 'pantry.$[elem]': foodUpdate } }, // Update the specific food item
      {
        arrayFilters: [{ 'elem._id': req.params.itemId }],
      }
    );

    res.redirect(`/users/${userId}/foods`); // Redirect back to the pantry
  } catch (error) {
    console.error(error);
    res.redirect('/'); // Redirect on error
  }
});


// Edit Route - Show the edit form for a specific food item
router.get('/:itemId/edit', async (req, res) => {
  try {
    const userId = req.session.user._id; // Get user ID from session
    const user = await User.findById(userId); // Find the user
    const foodItem = user.pantry.id(req.params.itemId); // Find the specific food item

    res.render('foods/edit.ejs', {
      user: user,
      foodItem: foodItem, // Pass the food item to the view
    });
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

module.exports = router;
