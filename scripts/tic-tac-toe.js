const cells = document.querySelectorAll('.grid-cell');
const gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// User is always X, AI is O
const user = 'X';
const ai = 'O';

function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = Array.from(cells).indexOf(cell);

  if (gameState[cellIndex] !== '' || !gameActive) return;

  // User's move
  gameState[cellIndex] = user;
  cell.textContent = user;

  if (checkWinner(user)) {
    endGame('You win!');
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    endGame("It's a draw!");
    return;
  }

  // AI's move
  setTimeout(aiMove, 500); // Delay for a smoother experience
}

function aiMove() {
  const bestMove = getBestMove(gameState, ai, -Infinity, Infinity);
  gameState[bestMove.index] = ai;
  cells[bestMove.index].textContent = ai;

  if (checkWinner(ai)) {
    endGame('AI wins!');
    return;
  }

  if (gameState.every(cell => cell !== '')) {
    endGame("It's a draw!");
  }
}

function checkWinner(player) {
  return winningConditions.some(condition => {
    return condition.every(index => gameState[index] === player);
  });
}

function endGame(message) {
  gameActive = false;
  alert(message);
}

// Minimax Algorithm with Alpha-Beta Pruning
function getBestMove(state, currentPlayer, alpha, beta) {
  const emptyCells = state
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);

  if (checkWinner(user)) return { score: -10 };
  if (checkWinner(ai)) return { score: 10 };
  if (emptyCells.length === 0) return { score: 0 }; // Draw

  let bestMove = null;

  if (currentPlayer === ai) {
    let maxEval = -Infinity;

    emptyCells.forEach(index => {
      state[index] = ai;
      const evaluation = getBestMove(state, user, alpha, beta).score;
      state[index] = '';

      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = index;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) return;
    });

    return { index: bestMove, score: maxEval };
  } else {
    let minEval = Infinity;

    emptyCells.forEach(index => {
      state[index] = user;
      const evaluation = getBestMove(state, ai, alpha, beta).score;
      state[index] = '';

      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = index;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) return;
    });

    return { index: bestMove, score: minEval };
  }
}

// Restart Game
function restartGame() {
  gameState.fill('');
  cells.forEach(cell => (cell.textContent = ''));
  gameActive = true;
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#reset-button')?.addEventListener('click', restartGame);
