const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  currentWeight: {
    type: Number,
    default: 0
  },
  goalWeight: {
    type: Number,
    default: 0
  },
  calorieGoal: {
    type: Number,
    default: 0
  },
  proteinGoal: {
    type: Number,
    default: 0
  },
  carbGoal: {
    type: Number,
    default: 0
  },
  fatGoal: {
    type: Number,
    default: 0
  },
  meals: {
    type: Array,
    default: []
  },
  totalCalories: {
    type: Array,
    default: []
  },
  totalProtein: {
    type: Array,
    default: []
  },
  totalCarbs: {
    type: Array,
    default: []
  },
  totalFats: {
    type: Array,
    default: []
  }
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
