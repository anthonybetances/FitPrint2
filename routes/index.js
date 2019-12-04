const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
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


let todaysMeals = []
for (let i = 0; i < req.user.meals.length; i++){
  if(dateToShow === formatDate(req.user.meals[i].date)){
    todaysMeals.push(req.user.meals[i])
  }
}

let sumTotalCarbs = 0
let sumTotalFats = 0
let sumTotalProtein = 0
let sumTotalCalories = 0

  for (let i = 0; i < todaysMeals.length ; i++){
  sumTotalCarbs += todaysMeals[i].carbs
  sumTotalFats += todaysMeals[i].fats
  sumTotalProtein += todaysMeals[i].protein
  sumTotalCalories += todaysMeals[i].calories
}


console.log(todaysMeals, dateToShow)


  res.render('dashboard', {
    user: req.user,
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
    res.redirect('dashboard');
  })
})


router.put('/mealsRoute', (req, res) => {
  const db = mongoose.connection;
  const mealObject = {
    date: new Date(req.body.date),
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

router.post('/suggestions', ensureAuthenticated, (req, res) => {
  const db = mongoose.connection;
  db.collection('suggestions').findOne({ calories: { $lte: req.body.caloriesLeft } },
  (err, result) => {
    if (err) return res.send(500, err)
    if (result === null) return res.send({foodName: "You can't eat shit, bitch!"})
    res.send(result)
  })
});

router.delete('/delete', (req, res) => {
  const db = mongoose.connection;
  db.collection('users').findOneAndDelete({name: req.body.user},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'profile deleted'})
  })
})

module.exports = router;
