const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load the car image for the player
const carImage = new Image();
carImage.src = 'https://www.megavoxels.com/wp-content/uploads/2023/06/Pixel-Art-Car.png';

// Game variables
const player = { x: canvas.width / 2 - 25, y: canvas.height - 120, width: 50, height: 100, speed: 5 };
const ghost = { x: player.x, y: player.y, path: [], replaying: false, color: 'rgba(255, 255, 255, 0.5)' };
let obstacles = [];
let playerPath = [];
let gameStarted = false;
let timer = 0;
let gameOver = false;

// Controls
let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Generate random obstacles
function generateObstacles() {
  obstacles = [];
  for (let i = 0; i < 10; i++) {
    const obstacle = {
      x: Math.random() * (canvas.width - 60),
      y: -Math.random() * canvas.height,
      width: 50,
      height: 50,
      color: 'red',
    };
    obstacles.push(obstacle);
  }
}

// Reset game
function resetGame() {
  player.y = canvas.height - 120;
  ghost.y = canvas.height - 120;
  ghost.path = [...playerPath];
  ghost.replaying = true;
  playerPath = [];
  timer = 0;
  gameOver = false;
  generateObstacles();
}

// Draw a car
function drawCar(car) {
  if (car === player) {
    // Draw player with the car image
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
  } else {
    // Draw ghost as a transparent rectangle
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
  }
}

// Draw obstacles
function drawObstacles() {
  obstacles.forEach(obs => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

// Update obstacles
function updateObstacles() {
  obstacles.forEach(obs => {
    obs.y += 3; // Move obstacles down
    if (obs.y > canvas.height) {
      obs.y = -50; // Reset obstacle position
      obs.x = Math.random() * (canvas.width - 60);
    }
  });
}

// Update ghost replay
function updateGhost() {
  if (!ghost.replaying || ghost.path.length === 0) return;
  const nextPos = ghost.path.shift();
  if (nextPos) ghost.y = nextPos.y;
}

// Check for collisions
function checkCollision(car) {
  for (const obs of obstacles) {
    if (car.x < obs.x + obs.width &&
        car.x + car.width > obs.x &&
        car.y < obs.y + obs.height &&
        car.y + car.height > obs.y) {
      return true;
    }
  }
  return false;
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameStarted && !gameOver) {
    // Update player position
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

    // Record player path
    playerPath.push({ x: player.x, y: player.y });

    // Update obstacles
    updateObstacles();

    // Check collision
    if (checkCollision(player)) {
      gameOver = true;
      alert("You hit an obstacle! Resetting...");
      resetGame();
    }

    // End game if player reaches the finish line
    if (player.y <= 0) {
      gameOver = true;
      alert("You won! Restarting...");
      resetGame();
    }

    // Update ghost replay
    updateGhost();
  }

  // Draw elements
  drawCar(player);
  drawCar(ghost);
  drawObstacles();

  // Loop game
  requestAnimationFrame(gameLoop);
}

// Start game
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && !gameStarted) {
    gameStarted = true;
    resetGame();
  }
});

// Initialize
generateObstacles();
gameLoop();
