$(document).ready(handleReady);

function handleReady() {
  // console.log("jquery is loaded!")

  // listener(s)
  $('#submitGuess').on('click', submitGuess)
  $('#winnerCircle').on('click', '#restartButton', restartGame)
}

// initial variable for displaying number of rounds played.
let roundsPlayed = 0


// Sends guess to server. Variable names kept simple because TEAM SPIDER HOLE
// are just that good. Also David's fingers were tired.

function submitGuess(a, b, c, d) {
  console.log('in submitGuess function')
  
  // update rounds played; function below
  roundUpdater()

  // pull values from inputs
  a = $('#playerOneNameInput').val()
  b = $('#playerOneGuessInput').val()
  c = $('#playerTwoNameInput').val();
  d = $('#playerTwoGuessInput').val();
  
  // console for confirming vals are being sent correctly.
  // console.log('submitting p1 name', a, 'p1 guess', b, 'p2 name', c, 'p2 guess', d)
  
  // if statement checks for presence of data in each input. Failure generates alert.
  if (a && b && c && d) {
    
    // ajax POST transmits data to server for evaluation.
    $.ajax({
      method: 'POST',
      url: '/',
      // creates data points for object creation on line 44 of server (app.post; '/')
        data : {
          playerOneName: a,
          playerOneGuess: b,
          playerTwoName: c,
          playerTwoGuess: d
        }
    }).then(function(response) {
      // console for POST success  
      // console.log('in POSTing - client.js');
      
      // console for confirming data is being transmitted properly.
      // console.log('submitting p1 name', a, 'p1 guess', b, 'p2 name', c, 'p2 guess', d)
      
      // getGuess triggers GET request for array gameObject
      // also triggers render function, below.
      getGuess()
    }).catch( () => {
        alert('POST failed. Woe Is Upon Thee.')
    });
  } else {
    // alert or when all players have not entered a guess.
    alert('You gotta let playas gonna play play play')
  } 
}


// AJAX GET - Gets the previous guesses from the server and renders them

function getGuess() {
  // console for confirming presence of function
  // console.log('in getGuess')
  
  // Gets array and renders
  $.ajax({
      method: 'GET',
      url: '/guess'
  }).then(function(response) {
    // console for confirming GET request is successful.
    // console.log('AJAX Success!', response);
    
    // render function takes array from this GET request
    render(response);

    // Disables changing of player names once they have made a guess.
      $('#playerOneNameInput').prop('disabled', true);
      $('#playerTwoNameInput').prop('disabled', true)
  }).catch(function() {
      alert('Request Failed. Try again later.')
  });
}


// updates round number and updates top-line tick.
function roundUpdater() {
  // change variable to +1
  roundsPlayed++
  // re-render rounds played area of HTML page.
  $('#roundsPlayedArea').empty()
  $('#roundsPlayedArea').append(`
  <p>Rounds Played: ${roundsPlayed}</p>
  `)
}


function render(renderResponse) {
  // testing for presence of render function
  // console.log('rendering...', renderResponse)

  // clean out the last guesses if any
  $('#guessRenderArea').empty();
  $('#resultArea').empty();
  
  // create variable for round counting
  // NOTE: This is strictly for rendering the array, not the roundsPlayed variable, above,
  // which tracks the current round.
  let responseRoundCounter = 1

  // loop to render out responses.
  for (response of renderResponse) {  
  // each response gets some space and data served from GET request, above.
    $('#guessRenderArea').append(`
    <p></p>
    <li>Round ${responseRoundCounter} guesses</li>
    <li>Player One: ${response.playerOneName} : ${response.playerOneGuess}</li>
    <li>Player Two: ${response.playerTwoName} : ${response.playerTwoGuess}</li>
    <p></p>
  `)

  // This area is checking if a player is high/low/has won without 
  // giving the game away.
  statusChecker(responseRoundCounter)

  // updates counter for round displays in individually rendered
  // plays.
  responseRoundCounter++
    
  }
}

// function provides the logic to check whether a player is low/hi/has won via their object
// 'playerXStatus' property.
function statusChecker(round) {
    if (response.playerOneStatus === 'High') {
      $('#guessRenderArea').append(`
      <li>Player one guess in round ${round} is High</li>`)
    }
    if (response.playerOneStatus === 'Low') {
      $('#guessRenderArea').append(`
      <li>Player one guess in round ${round} is Low</li>`)
    }
    // needlessly extravagant rendering.
    if (response.playerOneStatus === 'Win') {
      $('#guessRenderArea').append(`
      <li>Player one guess in round ${round} is Right</li>`).css('background-color', 'green')
      $('#winnerCircle').append(`
      <h1>PLAYER ONE WINS WITH THEIR GUESS OF ${response.playerOneGuess}</h1></h1>
      <button id="restartButton">Restart Game</button>
      `)
      // disable further guesses once a player has won.
      $('#playerOneGuessInput').prop('disabled', true);
      $('#playerTwoGuessInput').prop('disabled', true);
    }
    if (response.playerTwoStatus === 'High') {
      $('#guessRenderArea').append(`
      <li>Player two guess in round ${round} is High</li>`)
    }
    if (response.playerTwoStatus === 'Low') {
      $('#guessRenderArea').append(`
      <li>Player two guess in round ${round} is Low</li>`)
    }
    if (response.playerTwoStatus === 'Win') {
      $('#guessRenderArea').append(`
      <li>Player two guess in round ${round} is Right</li>`).css('background-color', 'green')
      $('#winnerCircle').append(`
      <h1>PLAYER TWO WINS WITH THEIR GUESS OF ${response.playerTwoGuess}</h1>
      <button id="restartButton">Restart Game</button>
      `)
      // disable further guesses once a player has won.
      $('#playerOneGuessInput').prop('disabled', true);
      $('#playerTwoGuessInput').prop('disabled', true);
    }
}

// function to restart the game.
function restartGame() {
// run server side restart logic
  $.ajax({
    method: 'POST',
    url: '/restart',
      data : {
        
      }
  }).then(function(response) {
    // console log for confirming good POST request.
    // console.log('restarting game')

    // re-enable inputs.
      $('#playerOneNameInput').prop('disabled', false);
      $('#playerOneGuessInput').prop('disabled', false);
      $('#playerTwoNameInput').prop('disabled', false);
      $('#playerTwoGuessInput').prop('disabled', false);
      // empty guess inputs
      // names left in place
      $('#playerOneGuessInput').val('');
      $('#playerTwoGuessInput').val('')
      // empty render area and restore white background
      $('#guessRenderArea').empty();
      $('#guessRenderArea').css('background-color', 'white')
      $('#roundsPlayedArea').empty();
      $('#winnerCircle').empty();
  }).catch( () => {
      alert('POST failed. Woe Is Upon Thee.')
  });
}