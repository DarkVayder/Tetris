const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const colors = [
  "#4d6b53",
];

const tetrominos = [
  [[1, 1, 1, 1]],
  [[1, 1, 1], [1]],
  [[1, 1, 1], [0, 0, 1]],
  [[1, 1, 1], [0, 1]],
  [[1, 1, 1], [1, 0]],
  [[1, 1], [1, 1]],
  [[1, 1, 1], [1, 0, 0]],
];

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 5)];
  }
  return color;
}

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
  ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col]) {
        drawBlock(col, row, colors[board[row][col] - 1]);
      }
    }
  }
}

function drawTetromino() {
  const color = Math.floor(Math.random() * colors.length);
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col]) {
        drawBlock(currentX + col, currentY + row, colors[color]);
      }
    }
  }
}

function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveDown() {
  if (isValidMove(0, 1)) {
    currentY++;
  } else {
    mergeTetromino();
    clearRows();
    spawnTetromino();
  }
}

function moveLeft() {
  if (isValidMove(-1, 0)) {
    currentX--;
  }
}

function moveRight() {
  if (isValidMove(1, 0)) {
    currentX++;
  }
}

function rotate() {
  const rotatedTetromino = rotateMatrix(currentTetromino);
  if (isValidMove(0, 0, rotatedTetromino)) {
    currentTetromino = rotatedTetromino;
  }
}

function isValidMove(offsetX, offsetY, newTetromino = currentTetromino) {
  for (let row = 0; row < newTetromino.length; row++) {
    for (let col = 0; col < newTetromino[row].length; col++) {
      if (
        newTetromino[row][col] &&
        (board[currentY + row + offsetY] && board[currentY + row + offsetY][currentX + col + offsetX]) !== 0
      ) {
        return false;
      }
    }
  }
  return true;
}

function mergeTetromino() {
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col]) {
        board[currentY + row][currentX + col] = currentTetromino[row][col];
      }
    }
  }
}

function clearRows() {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(0));
    }
  }
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

function getRandomTetromino() {
  const randomIndex = Math.floor(Math.random() * tetrominos.length);
  return tetrominos[randomIndex];
}

function spawnTetromino() {
  currentTetromino = getRandomTetromino();
  currentX = Math.floor(COLS / 2) - Math.floor(currentTetromino[0].length / 2);
  currentY = 0;

  if (!isValidMove(0, 0)) {
    alert('Oops! Game Over!');
    resetGame();
  }
}

function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  clearBoard();
  spawnTetromino();
}

let board;
let currentTetromino;
let currentX;
let currentY;

document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      rotate();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    case 'ArrowRight':
      moveRight();
      break;
  }
  clearBoard();
  drawBoard();
  drawTetromino();
});

resetGame();
