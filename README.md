## FitPrint

This app is a work in progress.  So far, FitPrint calculates your daily targets based on your current and goal weights, allows you to plan meals in advance, and recommends recipes based on your daily caloric deficits.

## Please note that, as this version does NOT use an API and recipes are manually set in separate database collection, FitPrint is currently set to suggests the same meals for caloric deficits of 500+. 

Future versions will factor in macronutrient deficiencies in addition to caloric deficits when retrieving meal suggestions from the database.

## Background
This year, I’ve been using the myfitnesspal app to track my calories and macros in an effort to lose weight and maintain my fitness, and it worked.  My biggest gripe with the app is that it’s entirely on you to create your meals from the different foods.  The app has a section where it posts Huffington Post-like articles suggesting recipes and things to try, but it doesn’t make suggestions based on your likes/dislikes, and there’s no way to select a pre-made recipe and easily add it as a meal or to a meal unless you've already done the work to set it up yourself.  This project is the beginning of what will become a full-stack tracker with a recipe bank that suggests recipes according to the macros and calories that you still have left in the day, and allows you to add them to your meal plan, store for later, and use again.


## How It's Made:
**Tech used:** HTML, CSS, JavaScript, EJS, Node.js, MongoDb, Express Framework, Passport for authentication.

## Installation

1. Clone repo
2. run `npm install`

## Usage

1. run `node app.js`
2. Navigate to `localhost:3000`
