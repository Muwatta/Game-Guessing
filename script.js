const colorSets = [
  {
    name: 'Red',
    colors: ['#ff4d4d', '#ff6666', '#ff3333', '#ff1a1a', '#e60000', '#cc0000'],
  },
  {
    name: 'Blue',
    colors: ['#4d94ff', '#66a3ff', '#3385ff', '#1a75ff', '#007bff', '#0066cc'],
  },
  {
    name: 'Green',
    colors: ['#4dff4d', '#66ff66', '#33cc33', '#1aff1a', '#00e600', '#00b300'],
  },
  {
    name: 'Yellow',
    colors: ['#ffcc4d', '#ffdb66', '#ffb833', '#ffa500', '#ff8000', '#e67300'],
  },
  {
    name: 'Pink',
    colors: ['#ff66b2', '#ff85c2', '#ff3385', '#e60073', '#d7006e', '#f5006e'],
  },
  {
    name: 'Teal',
    colors: ['#33cccc', '#66cccc', '#339999', '#1a8080', '#009999', '#006666'],
  },
];

let targetColor = '';
let score = 0;
let highScore = 0;
let timer;
let timeLeft = 90;
let gameInProgress = false;
let wrongGuesses = 0;
let gameOverTriggered = false;
let hintsLeft = 2;

const scoreElement = document.getElementById('score');
const gameStatusElement = document.getElementById('gameStatus');
const timerElement = document.getElementById('timer');
const colorBoxElement = document.getElementById('colorBox');
const colorOptions = document.querySelectorAll('.colorOption');
const highScoreElement = document.getElementById('highScore');
const loadingScreen = document.getElementById('loadingScreen');
const hintsLeftElement = document.getElementById('hintsLeft');
const hintButton = document.getElementById('hintButton');

function startGame() {
  if (gameInProgress) return;

  wrongGuesses = 0;
  gameOverTriggered = false;
  hintsLeft = 2;

  loadingScreen.style.display = 'flex';
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    initializeGame();
  }, 1000);
}

function initializeGame() {
  gameInProgress = true;
  score = 0;
  timeLeft = 90;
  scoreElement.textContent = score;
  gameStatusElement.textContent = '';
  timerElement.textContent = timeLeft;
  hintsLeftElement.textContent = `Hints Left: ${hintsLeft}`;
  hintButton.disabled = false;

  setNewColors();
  colorOptions.forEach(button => {
    button.disabled = false;
    // Reset styling in case a hint was used previously.
    button.style.opacity = '1';
    button.style.border = 'none';
  });

  startTimer();
}

function setNewColors() {
  let randomSet = colorSets[Math.floor(Math.random() * colorSets.length)];
  targetColor = randomSet.colors[0];
  colorBoxElement.style.backgroundColor = targetColor;

  // Shuffle the colors
  let shuffledColors = randomSet.colors.sort(() => Math.random() - 0.5);
  colorOptions.forEach((button, index) => {
    button.style.backgroundColor = shuffledColors[index];
    button.dataset.color = shuffledColors[index];
    button.disabled = false;
    button.style.opacity = '1';
    button.style.border = 'none';
    button.onclick = () => checkAnswer(shuffledColors[index]);
  });
}

function checkAnswer(selectedColor) {
  if (!gameInProgress) return;

  if (selectedColor === targetColor) {
    score++;
    scoreElement.textContent = score;
    gameStatusElement.textContent = 'Correct!';
    gameStatusElement.style.color = 'green';
    setNewColors();
  } else {
    wrongGuesses++;
    gameStatusElement.textContent = 'Wrong Guess!';
    gameStatusElement.style.color = 'red';

    if (wrongGuesses >= 3 && !gameOverTriggered) {
      gameOverTriggered = true;
      gameInProgress = false;
      gameStatusElement.textContent = 'Game Over!';
      stopTimer();
      saveHighScore();
    }
  }
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      stopTimer();
      if (!gameOverTriggered) {
        gameOverTriggered = true;
        gameInProgress = false;
        gameStatusElement.textContent = "Time's Up!";
        saveHighScore();
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function saveHighScore() {
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = `High Score: ${highScore}`;
  }
}

// Updated hint function: When hint is used, disable all buttons except the one with the correct color.
function useHint() {
  if (hintsLeft > 0) {
    hintsLeft--;
    hintsLeftElement.textContent = `Hints Left: ${hintsLeft}`;

    // Disable all color buttons except the one with the correct color
    colorOptions.forEach(button => {
      if (button.dataset.color === targetColor) {
        button.disabled = false;
        // Optionally, highlight the correct button
        button.style.border = '3px solid green';
      } else {
        button.disabled = true;
        button.style.opacity = '0.3';
      }
    });

    gameStatusElement.textContent =
      'Hint: Only the correct color is available.';

    if (hintsLeft === 0) {
      hintButton.disabled = true;
    }
  }
}

document.getElementById('newGameButton').onclick = startGame;
document.getElementById('hintButton').onclick = useHint;
