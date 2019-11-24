const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  const db = mongoose.connection;
  db.collection('users').find().toArray((err, result) => {
    res.render('dashboard', {
      user: req.user,
      profile: result
    })
    console.log(result);
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

router.delete('/delete', (req, res) => {
  const db = mongoose.connection;
  db.collection('users').findOneAndDelete({name: req.body.user},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'profile deleted'})
  })
})

module.exports = router;
