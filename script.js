//Define HTML element
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const codeText = document.getElementById("code");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

//Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }]; //this also mean the segment
let food = generateFood();
let highScore = 0;
let direction = "right"; // when the game start
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

//Draw game map,snake,food
function draw() {
  board.innerHTML = " ";
  drawSnake();
  drawFood();
  updateScore();
}

//Draw Snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

//Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//Set the position of the snake or the food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}
//Testing draw function
// draw();

//Draw Food
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}
//Generate Food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1; //this will give us a random number between 1 and 20, this is what +1 do to let the number started from 1
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

//Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--; // the -- because we going closer to 1 ;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head); //unshift is adding a head

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); //clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop(); // removing the last element from the array (it make it move)
  }
}
// test moving
// setInterval(() => {
//   move(); //mover first
//   draw(); // then draw again new position
// }, 200); //this the time of moving 200 milliseconds

//Start Game function
function startGame() {
  gameStarted = true; //keep truck of a running game
  instructionText.style.display = "none";
  codeText.style.display = "none ";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

//Create a keypress eventlistener to start the game
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}
document.addEventListener("keydown", handleKeyPress);

//Control the speed of the snake
function increaseSpeed() {
  // console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

//Create the collision"crash" to rest the game if hit the wall or body of snake
function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

//Create reset game

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore;
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  codeText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}
