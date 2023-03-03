$(document).ready(handleReady);

function handleReady() {
  // console.log("jquery is loaded!")
  // initial render (n/a at this time)
  // listener(s)
  $('#submitGuess').on('click', submitGuess)
  $('#winnersCirlce').on('click', '#restartButton', restartGame)
}



// AJAX POST - sends guesses from webpage inputs to the server for processing. 
// should then automatically run the GET function below?

function submitGuess(a, b, c, d) {
  console.log('in submitGuess function')
  
  a = $('#playerOneNameInput').val()
  b = $('#playerOneGuessInput').val()
  c = $('#playerTwoNameInput').val();
  d = $('#playerTwoGuessInput').val();
  
  console.log('submitting p1 name', a, 'p1 guess', b, 'p2 name', c, 'p2 guess', d)
  
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
  // clearInputFields()
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
  }).catch(function() {
      alert('Request Failed. Try again later.')
  });
}







function render(renderResponse) {
  // console.log('rendering...', renderResponse)
  // clean out the last guesses if any
  $('#guessRenderArea').empty();
  for (response of renderResponse) {
  
    if (response.playerOneStatus === 'High') {
      console.log('player one response check is working')
      $('#resultArea').append(`
      <li>Player one guess is High</li>`)
    }
    if (response.playerOneStatus === 'Low') {
      $('#resultArea').append(`
      <li>Player one guess is Low</li>`)
    }
    if (response.playerOneStatus === 'Win') {
      $('#resultArea').append(`
      <li>Player one guess is Right</li>`).css('background-color', 'green')
    }
    $('#guessRenderArea').append(`
    <li>Player One: ${response.playerOneName} : ${response.playerOneGuess}</li>
    <li>Player Two: ${response.playerTwoName} : ${response.playerTwoGuess}</li>
  `)
  }
}


function restartGame() {
  console.log('restarting game')
}