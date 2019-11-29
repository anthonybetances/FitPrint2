const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user
  })
});

router.put('/goals', (req, res) => {
  console.log('hello');
  console.log(req.user);
  const db = mongoose.connection;
  db.collection('users').findOneAndUpdate({name: req.user.name}, {
    $set: {
      currentWeight: req.body.currentWeight,
      goalWeight: req.body.goalWeight,
      calorieGoal: req.body.calorieGoal,
      proteinGoal: req.body.proteinGoal,
      carbGoal: req.body.carbGoal,
      fatGoal: req.body.fatGoal
    }
  }, {
    sort: {_id: -1},
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})


router.put('/mealsRoute', (req, res) => {
  const db = mongoose.connection;
  const mealObject = {
    foodName: req.body.foodName,
    calories: req.body.calories,
    protein: req.body.protein,
    carbs: req.body.carbs,
    fats: req.body.fats
  }

  db.collection('users').findOneAndUpdate({name: req.user.name}, {
    $push: {
      meals: mealObject,
      totalCalories: req.body.calories,
      totalProtein: req.body.protein,
      totalCarbs: req.body.carbs,
      totalFats: req.body.fats
    }

  }, {
    sort: {_id: -1},
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
    console.log(result)
  })

})



router.delete('/delete', (req, res) => {
  const db = mongoose.connection;
  db.collection('users').findOneAndDelete({name: req.body.user},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'profile deleted'})
  })
})

module.exports = router;
