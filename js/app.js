// declared consts
const gameContainer = document.getElementById("gameContainer");
const message = document.getElementById("message");
const countdownTimer = document.getElementById("countdown");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 15;
// this is the snake parts
let snake = [
  { x: 10 * box, y: 10 * box },
  { x: 9 * box, y: 10 * box },
  { x: 8 * box, y: 10 * box }
];
let direction = "RIGHT"; //this make it start moving
let foods = [generateFood()];
let startTime; //tbd
let game; //tbd
//rng food generator
function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}
//finds elapsed time and subtracts it from 60
function updateCountdown() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const remainingTime = 60 - elapsedTime;
  countdownTimer.textContent = `Time Left: ${remainingTime}s`;
  if (remainingTime <= 0) {
    winGame();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateCountdown();

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "green" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  for (let food of foods) {
    ctx.fillRect(food.x, food.y, box, box);
  }

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  for (let food of foods) {
    if (snakeX === food.x && snakeY === food.y) {
      gameOver();
      return;
    }
  }

  snake.unshift({ x: snakeX, y: snakeY });
  snake.pop();

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(snakeX, snakeY, snake)
  ) {
    gameOver();
  }

  if (Math.random() < 0.03) {
    foods.push(generateFood());
  }
}

function collision(x, y, array) {
  for (let i = 1; i < array.length; i++) {
    if (array[i].x === x && array[i].y === y) {
      return true;
    }
  }
  return false;
}

function gameOver() {
  clearInterval(game);
  message.innerHTML = "<h2>Game Over!</h2><button onclick='restartGame()'>Restart</button>";
  message.style.display = "block";
}

function winGame() {
  clearInterval(game);
  message.innerHTML = "<h2>You Win! You survived Poision Snake!</h2><button onclick='restartGame()'>Restart</button>";
  message.style.display = "block";
}

function restartGame() {
  message.style.display = "none";
  snake = [
    { x: 10 * box, y: 10 * box },
    { x: 9 * box, y: 10 * box },
    { x: 8 * box, y: 10 * box }
  ];
  direction = "RIGHT";
  foods = [generateFood()];
  startTime = Date.now();
  game = setInterval(draw, 100);
}

document.addEventListener("keydown", (event) => {
  changeTitleColor();
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function changeTitleColor() {
  const colors = ["red", "blue", "yellow", "purple", "orange", "pink"];
  document.getElementById("gameTitle").style.color = colors[Math.floor(Math.random() * colors.length)];
}

startTime = Date.now();
game = setInterval(draw, 100);
