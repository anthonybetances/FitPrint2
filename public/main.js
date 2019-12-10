const submit = document.querySelector('.submit');
const del = document.querySelector('.delete');
const name = document.querySelector('.name').innerHTML;
const meal = document.querySelector('.meal')
const suggestion = document.querySelector('.suggestion')
const ingredients = document.querySelector('.ingredients')
const instructions = document.querySelector('.instructions')
const suggestionsImg = document.querySelector('.suggestionsImg')
let remove = document.getElementsByClassName("fas fa-times")
const caloriesLeft = parseFloat(document.querySelector('.caloriesLeft').value)

// current & goals
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

//   fetch('mealsRoute', {
//     method: 'put',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       'date': date,
//       'foodName': foodName,
//       'calories': parseInt(calories),
//       'protein': parseInt(protein),
//       'carbs': parseInt(carbs),
//       'fats': parseInt(fats)
//     })
//   })
//   .then(res => {
//     if (res.ok) return res.json()
//   }).
//   then(data => {
//     console.log(data)
//   })
})

// recipe recommendations

suggestion.addEventListener('click', () => {
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
    console.log(data);
    let caloriesRoundedDown = (Math.floor(caloriesLeft/100))*100
    let foodChoice
    for (let h=0;h<data.length;h++){
      if (data[h].calories === caloriesRoundedDown ){
        foodChoice = data[h]
      }
    }

    document.querySelector('.suggestions').innerHTML = foodChoice.foodName
    suggestionsImg.src = foodChoice.imageUrl

    for (let i=0; i< foodChoice.ingredients.length; i++){
      let li = document.createElement('li')
      let p = document.createElement('p')
      p.innerHTML = foodChoice.ingredients[i]
      li.appendChild(p)
      ingredients.appendChild(li)
    }

    for (let j=0; j< foodChoice.instructions.length; j++){
      let li = document.createElement('li')
      let p = document.createElement('p')
      p.innerHTML = `${j+1}. ${foodChoice.instructions[j]}`
      li.appendChild(p)
      ingredients.appendChild(li)
    }
  })
})


Array.from(remove).forEach(function(element) {
      element.addEventListener('click', function(){
        const caloriesObjectId = this.parentNode.childNodes[1].value

        fetch('mealDelete', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'caloriesObjectId': caloriesObjectId
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});


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
