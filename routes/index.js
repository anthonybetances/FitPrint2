const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
var ObjectId = require('mongodb').ObjectID

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
function formatDate(date){
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  return (monthIndex+1) + '/' + day + '/' + year;
}


router.get('/dashboard', ensureAuthenticated, (req, res) => {

// date logic below - use to access meals past and present
let dateToShow = req.query.date
if (!dateToShow){
  dateToShow = formatDate(new Date())
}

let yesterdaysDate = new Date(dateToShow)
yesterdaysDate.setDate(yesterdaysDate.getDate()-1)
let yesterdaysDateFormatted = formatDate(yesterdaysDate)
let tomorrowsDate = new Date(dateToShow)
tomorrowsDate.setDate(tomorrowsDate.getDate()+1)
let tomorrowsDateFormatted = formatDate(tomorrowsDate)


  const db = mongoose.connection;
db.collection('meals').find({userId: req.session.passport.user}).toArray( (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')

      let todaysMeals = []
      for (let i = 0; i < result.length; i++){
        if(dateToShow === formatDate(result[i].date)){
          todaysMeals.push(result[i])
        }
      }

      let sumTotalCarbs = 0
      let sumTotalFats = 0
      let sumTotalProtein = 0
      let sumTotalCalories = 0

        for (let i = 0; i < todaysMeals.length ; i++){
        sumTotalCarbs += parseFloat(todaysMeals[i].carbs)
        sumTotalFats += parseFloat(todaysMeals[i].fats)
        sumTotalProtein += parseFloat(todaysMeals[i].protein)
        sumTotalCalories += parseFloat(todaysMeals[i].calories)
      }

      res.render('dashboard.ejs', {
        user: req.user,
        meals: result,
        todaysMeals: todaysMeals,
        sumTotalFats: sumTotalFats,
        sumTotalCarbs: sumTotalCarbs,
        sumTotalProtein: sumTotalProtein,
        sumTotalCalories: sumTotalCalories,
        formatDate: formatDate,
        yesterdaysDate: yesterdaysDateFormatted,
        tomorrowsDate: tomorrowsDateFormatted,
        dateToShow: dateToShow
      })
    })


});


// sets/updates cal & macro goals in ejs & database based on main.js logic

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
    res.redirect('/dashboard');
  })
})

// saves new meals in database based on main.js logic

router.post('/createMeal', (req, res) => {
  const db = mongoose.connection;
  console.log(req.session.passport.user);
  const mealObject = {
    date: new Date(req.body.date),
    foodName: req.body.foodName,
    calories: req.body.calories,
    protein: req.body.protein,
    carbs: req.body.carbs,
    fats: req.body.fats,
    userId: req.session.passport.user
  }

  db.collection('meals').save(mealObject, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect(`/dashboard?date=${req.body.date}`)
      })
    })

// router.put('/mealsRoute', (req, res) => {
//   const db = mongoose.connection;
//   const mealObject = {
//     date: new Date(req.body.date),
//     foodName: req.body.foodName,
//     calories: req.body.calories,
//     protein: req.body.protein,
//     carbs: req.body.carbs,
//     fats: req.body.fats
//   }
//
//   db.collection('users').findOneAndUpdate({name: req.user.name}, {
//     $push: {
//       meals: mealObject,
//       totalCalories: req.body.calories,
//       totalProtein: req.body.protein,
//       totalCarbs: req.body.carbs,
//       totalFats: req.body.fats
//     }
//
//   }, {
//     sort: {_id: -1},
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//     console.log(result)
//   })
//
// })


// recipe recommendations
router.post('/suggestions', ensureAuthenticated, (req, res) => {
  const db = mongoose.connection;
  db.collection('suggestions').find().toArray(
  (err, result) => {
    if (err) return res.send(500, err)
    if (result === null) return res.send({foodName: "Sorry, food not found!"})
    res.send(result)
  })
});


// meal deletion
router.delete('/mealDelete', (req, res) => {
  const db = mongoose.connection;
  const caloriesObjectId = ObjectId(req.body.caloriesObjectId);
  console.log(caloriesObjectId);
  db.collection('meals').findOneAndDelete({_id: caloriesObjectId},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'meal deleted'})
  })
})

// user deletion
router.delete('/delete', (req, res) => {
  const db = mongoose.connection;
  db.collection('users').findOneAndDelete({name: req.body.user},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'profile deleted'})
  })
})

module.exports = router;
