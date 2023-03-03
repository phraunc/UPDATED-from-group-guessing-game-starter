// SERVER SETUP
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

// END SERVER SETUP

// INITIALIZE RANDOM NUMBER
let randomNumber = randomNumberGenerator(1,25)

// GET & POST Routes go here

let gameObject = [
  // {
  // playerOneName: 'Tony',
  // playerOneGuess: '10',
  // playerTwoName: 'David',
  // playerTwoGuess: '1',
  // playerOneStatus: 'High'
  // playerTwoStatus: 'Low' // could be 'Win'
  // }
]

// sends gameObject from server to client
app.get('/guess', function(req, res) {
  console.log('Yo we are in the get inventory GET request');
      res.send(gameObject);
})


// sends guesses from inputs from client side to server
app.post('/', (req, res) => {
  // incoming value parsing
  let incomingPlayerOneName = req.body.playerOneName;
  let incomingPlayerOneValue = req.body.playerOneGuess;
  let incomingPlayerTwoName = req.body.playerTwoName;
  let incomingPlayerTwoValue = req.body.playerTwoGuess;


  // console.log('Incoming player one name to add:', incomingPlayerOneName);
  // console.log('Incoming player one guess to add', incomingPlayerOneValue);
  // console.log('Incoming player two name to add', incomingPlayerTwoName);
  // console.log('Incoming player two guess to add', incomingPlayerTwoValue);
  
  // creating a temporary object to add to the existing array
  const newGuess = { playerOneName : incomingPlayerOneName,
      playerOneGuess : incomingPlayerOneValue,
      playerTwoName : incomingPlayerTwoName,
      playerTwoGuess : incomingPlayerTwoValue }

  console.log('Game Object before adding new guesses', gameObject);
  gameObject.push(newGuess);
  console.log('Game Object after adding new guesses', gameObject)
  
  
  // run check function, below
  guessChecker(gameObject)
  
  // Send status
  res.sendStatus(201);
});

// function to generate a random number
function randomNumberGenerator(min, max) {
  return Math.floor(Math.random() * (1 + max - min) + min);
}

// function to check guesses (submitted via POST, above) against randomly generated number
// insert function into POST request, above?
// loop -> checks each guess (including all past guesses)
function guessChecker(array) {
  for (guess of array) {
    if ( guess.playerOneGuess > randomNumber) {
      console.log('player one guess is higher than randomNumber')
      guess.playerOneStatus = 'High'
    }
    if ( guess.playerTwoGuess > randomNumber) {
      console.log('player two guess is higher than randomNumber')
      guess.playerTwoStatus = 'High'
    }
    if ( guess.playerOneGuess < randomNumber) {
      console.log('player one guess is lower than randomNumber')
      guess.playerOneStatus = 'Low'
    }
    if ( guess.playerTwoGuess < randomNumber) {
      console.log('player two guess is lower than randomNumber')
      guess.playerTwoStatus = 'Low'
    }
    if ( guess.playerOneGuess == randomNumber) {
      console.log('player one guess is equal to randomNumber')
      guess.playerOneStatus = 'Win'
    }
    if ( guess.playerTwoGuess == randomNumber) {
      console.log('player two guess is equal to randomNumber')
      guess.playerTwoStatus = 'Win'
    }
  }
}

// restart function ** client side ** button
// restart function - server side - restart game
  // clear out gameObject? Should be a simple gameObject = []?

  app.post('/restart', (req, res) => {
    console.log('Within POST TEST');
    randomNumber = randomNumberGenerator(1, 25);
    gameObject = [];
    // Send status
    res.sendStatus(201);
  });

// Set up listening port for webpage.
app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})
