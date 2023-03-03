$(document).ready(handleReady);

function handleReady() {
  // console.log("jquery is loaded!")
  // initial render (n/a at this time)
  // listener(s)
  $('#submitGuess').on('click', submitGuess)
  $('#winnerCircle').on('click', '#restartButton', restartGame)
}

let roundsPlayed = 0

// AJAX POST - sends guesses from webpage inputs to the server for processing. 
// should then automatically run the GET function below?

function submitGuess(a, b, c, d) {
  console.log('in submitGuess function')
  
  // update rounds played
  roundUpdater()

  // pull values from inputs
  a = $('#playerOneNameInput').val()
  b = $('#playerOneGuessInput').val()
  c = $('#playerTwoNameInput').val();
  d = $('#playerTwoGuessInput').val();
  
  console.log('submitting p1 name', a, 'p1 guess', b, 'p2 name', c, 'p2 guess', d)
  if (a && b && c && d) {
    $.ajax({
      method: 'POST',
      url: '/',
        data : {
          playerOneName: a,
          playerOneGuess: b,
          playerTwoName: c,
          playerTwoGuess: d
        }
    }).then(function(response) {
        console.log('in POSTing - client.js');
        console.log('submitting p1 name', a, 'p1 guess', b, 'p2 name', c, 'p2 guess', d)
        getGuess()
    }).catch( () => {
        alert('POST failed. Woe Is Upon Thee.')
    });
  } else {
    alert('You gotta let playas gonna play play play')
  } 
}


// AJAX GET - Gets the previous guesses from the server and renders them
// some ajax stuff; render() last

function getGuess() {
  console.log('in getGuess')
  $.ajax({
      method: 'GET',
      url: '/guess'
  }).then(function(response) {
      console.log('AJAX Success!', response);
      render(response);
      $('#playerOneNameInput').prop('disabled', true);
      $('#playerTwoNameInput').prop('disabled', true)
  }).catch(function() {
      alert('Request Failed. Try again later.')
  });
}


// updates round number.
function roundUpdater() {
  roundsPlayed++
  $('#roundsPlayedArea').empty()
  $('#roundsPlayedArea').append(`
  <p>Rounds Played: ${roundsPlayed}</p>
  `)
}


function render(renderResponse) {
  // console.log('rendering...', renderResponse)
  // clean out the last guesses if any
  $('#guessRenderArea').empty();
  $('#resultArea').empty();
  
  // create variable for round counting
  let responseRoundCounter = 1

  // loop to render out responses.
  for (response of renderResponse) {  
  $('#guessRenderArea').append(`
    <p></p>
    <li>Round ${responseRoundCounter} guesses</li>
    <li>Player One: ${response.playerOneName} : ${response.playerOneGuess}</li>
    <li>Player Two: ${response.playerTwoName} : ${response.playerTwoGuess}</li>
    <p></p>
  `)
  // This area is checking if a player is high/low/has won
  statusChecker(responseRoundCounter)

  // updates counter for round displays
  responseRoundCounter++
    
  }
}


function statusChecker(round) {
    if (response.playerOneStatus === 'High') {
      $('#guessRenderArea').append(`
      <li>Player one guess in round ${round} is High</li>`)
    }
    if (response.playerOneStatus === 'Low') {
      $('#guessRenderArea').append(`
      <li>Player one guess in round ${round} is Low</li>`)
    }
    if (response.playerOneStatus === 'Win') {
      $('#guessRenderArea').append(`
      <li>Player one guess in round ${round} is Right</li>`).css('background-color', 'green')
      $('#winnerCircle').append(`
      <h1>PLAYER ONE WINS</h1>
      <button id="restartButton">Restart Game</button>
      `)
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
      <h1>PLAYER TWO WINS</h1>
      <button id="restartButton">Restart Game</button>
      `)
      $('#playerOneGuessInput').prop('disabled', true);
      $('#playerTwoGuessInput').prop('disabled', true);
    }
}

function restartGame() {

  $.ajax({
    method: 'POST',
    url: '/restart',
      data : {
        
      }
  }).then(function(response) {
      console.log('restarting game')
      $('#playerOneNameInput').prop('disabled', false);
      $('#playerOneGuessInput').prop('disabled', false);
      $('#playerTwoNameInput').prop('disabled', false);
      $('#playerTwoGuessInput').prop('disabled', false);
      $('#guessRenderArea').empty();
      $('#guessRenderArea').css('background-color', 'white')
      $('#roundsPlayedArea').empty();
      $('#winnerCircle').empty();
  }).catch( () => {
      alert('POST failed. Woe Is Upon Thee.')
  });
}