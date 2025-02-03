const colors = [
  '#FF5733',
  '#33FF57',
  '#3357FF',
  '#F3FF33',
  '#FF33F3',
  '#33FFF3',
];
let targetColor = '';
let score = 0;

function startGame() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  document.getElementById('colorBox').style.backgroundColor = targetColor;
  document.getElementById('gameStatus').textContent = '';

  document.querySelectorAll('.colorOption').forEach((button, index) => {
    button.style.backgroundColor = colors[index];
    button.onclick = function () {
      if (colors[index] === targetColor) {
        document.getElementById('gameStatus').textContent = 'Correct!';
        score++;
      } else {
        document.getElementById('gameStatus').textContent = 'Wrong! Try again.';
      }
      document.getElementById('score').textContent = score;
    };
  });
}

document.getElementById('newGameButton').addEventListener('click', startGame);

startGame();
