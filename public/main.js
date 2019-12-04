const submit = document.querySelector('.submit');
const del = document.querySelector('.delete');
const name = document.querySelector('.name').innerHTML;
const meal = document.querySelector('.meal')
const suggestion = document.querySelector('.suggestion')

submit.addEventListener('click', () => {
  const currentWeight = document.querySelector('.currentWeight').value;
  const goalWeight = document.querySelector('.goalWeight').value;
  let calorieGoal = (currentWeight * 14) - ((currentWeight * 14) * .2)
  let proteinGoal = currentWeight
  let fatGoal = (calorieGoal * .25) / 9
  let carbGoal = (calorieGoal - ((proteinGoal * 4) + (fatGoal * 9))) / 4

  fetch('goals', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'currentWeight': parseInt(currentWeight),
      'goalWeight': parseInt(goalWeight),
      'calorieGoal': parseInt(calorieGoal),
      'proteinGoal': parseInt(proteinGoal),
      'carbGoal': parseInt(carbGoal),
      'fatGoal': parseInt(fatGoal),
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
  })
})

meal.addEventListener('click', () => {
  const foodName = document.querySelector('.foodName').value;
  const calories = document.querySelector('.calories').value;
  const protein = document.querySelector('.protein').value;
  const carbs = document.querySelector('.carbs').value;
  const fats = document.querySelector('.fats').value;
  const date = document.querySelector('.date').value;

  fetch('mealsRoute', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'date': date,
      'foodName': foodName,
      'calories': parseInt(calories),
      'protein': parseInt(protein),
      'carbs': parseInt(carbs),
      'fats': parseInt(fats)
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
  })
})


suggestion.addEventListener('click', () => {
  console.log('this workssss')
  fetch('suggestions', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'caloriesLeft': caloriesLeft,
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
    document.querySelector('.suggestions').innerHTML = data.foodName
  })
})



del.addEventListener('click', () => {
  console.log(name);
  fetch('delete', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'user': name
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
  })
})
