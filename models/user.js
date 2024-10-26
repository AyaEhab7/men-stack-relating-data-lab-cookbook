const mongoose = require('mongoose');

// Define foodSchema
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pantry: [(foodSchema)], // YOU DO: embed foodSchema here
});

const User = mongoose.model('User', userSchema);
module.exports = User;

