const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const maxScoreDisplay = document.getElementById('maxScore');
const restartBtn = document.getElementById('restartBtn');

const box = 20;
let snake = [{ x: 200, y: 200 }];
let food = getRandomFoodPosition();
let score = 0;
let dx = box;
let dy = 0;
let speed = 100;

let gameInterval = setInterval(gameLoop, speed);

let maxScore = localStorage.getItem('maxScore') ? parseInt(localStorage.getItem('maxScore')) : 0;
maxScoreDisplay.textContent = `Макс. очки: ${maxScore}`;

window.addEventListener('keydown', changeDirection);
restartBtn.addEventListener('click', restartGame);

function gameLoop() {
    moveSnake();
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreDisplay.textContent = 'Очки: ' + score;
        food = getRandomFoodPosition();
        increaseSpeed();
    } else {
        snake.pop();
    }
    if (isGameOver()) return;
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4caf50';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, box, box));
    ctx.fillStyle = '#ff4757';
    ctx.fillRect(food.x, food.y, box, box);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
}

function changeDirection(event) {
    const { key } = event;
    if (key === 'ArrowLeft' && dx === 0) { dx = -box; dy = 0; }
    else if (key === 'ArrowUp' && dy === 0) { dx = 0; dy = -box; }
    else if (key === 'ArrowRight' && dx === 0) { dx = box; dy = 0; }
    else if (key === 'ArrowDown' && dy === 0) { dx = 0; dy = box; }
}

function getRandomFoodPosition() {
    const x = Math.floor(Math.random() * (canvas.width / box)) * box;
    const y = Math.floor(Math.random() * (canvas.height / box)) * box;
    return { x, y };
}

function isGameOver() {
    const head = snake[0];
    if (head.x < 0) head.x = canvas.width - box;
    if (head.y < 0) head.y = canvas.height - box;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y >= canvas.height) head.y = 0;
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function increaseSpeed() {
    clearInterval(gameInterval);
    speed *= 0.95;
    gameInterval = setInterval(gameLoop, speed);
}

function restartGame() {
    snake = [{ x: 200, y: 200 }];
    food = getRandomFoodPosition();
    score = 0;
    scoreDisplay.textContent = 'Очки: 0';
    speed = 100;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

if (score > maxScore) {
    maxScore = score;
    localStorage.setItem('maxScore', maxScore);
    maxScoreDisplay.textContent = `Макс. очки: ${maxScore}`;
}
