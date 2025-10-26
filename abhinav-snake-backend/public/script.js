// Abhinav Snake - script.js (clean ES6+)
document.addEventListener('DOMContentLoaded', () => {
  const ARENA_SIZE = 600;
  const CELL_SIZE = 20;
  const INITIAL_SPEED = 200;

  const arena = document.getElementById('game-arena');
  const scoreBoard = document.getElementById('score-board');
  const startButton = document.getElementById('start-button');
  const modal = document.getElementById('game-over-modal');
  const restartButton = document.getElementById('restart-button');
  const finalScore = document.getElementById('final-score');

  let snake = [];
  let food = null;
  let dx = CELL_SIZE;
  let dy = 0;
  let score = 0;
  let speed = INITIAL_SPEED;
  let intervalId = null;
  let running = false;

  function init() {
    snake = [{x:160,y:200},{x:140,y:200},{x:120,y:200}];
    dx = CELL_SIZE; dy = 0;
    food = placeFood();
    score = 0;
    speed = INITIAL_SPEED;
    running = false;
    updateScore();
    render();
  }

  function placeFood() {
    let pos;
    const cells = ARENA_SIZE / CELL_SIZE;
    do {
      pos = {
        x: Math.floor(Math.random() * cells) * CELL_SIZE,
        y: Math.floor(Math.random() * cells) * CELL_SIZE
      };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  function render() {
    arena.innerHTML = '';
    snake.forEach(part => createBlock(part.x, part.y, 'snake'));
    createBlock(food.x, food.y, 'food');
  }

  function createBlock(x, y, cls) {
    const el = document.createElement('div');
    el.className = cls;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    arena.appendChild(el);
    return el;
  }

  function update() {
    const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(newHead);

    // Food collision
    if (newHead.x === food.x && newHead.y === food.y) {
      score += 10;
      updateScore();
      food = placeFood();
      accelerate();
    } else {
      snake.pop();
    }
  }

  function accelerate() {
    if (speed > 50) {
      clearInterval(intervalId);
      speed -= 10;
      startLoop();
    }
  }

  function updateScore() {
    scoreBoard.textContent = `Score: ${score}`;
  }

  function isGameOver() {
    const head = snake[0];
    const hitWall = head.x < 0 || head.y < 0 || head.x >= ARENA_SIZE || head.y >= ARENA_SIZE;
    const hitSelf = snake.slice(1).some(p => p.x === head.x && p.y === head.y);
    return hitWall || hitSelf;
  }

  function loopStep() {
    if (isGameOver()) return endGame();
    update();
    render();
  }

  function startLoop() {
    intervalId = setInterval(loopStep, speed);
  }

  function startGame() {
    if (running) return;
    running = true;
    document.addEventListener('keydown', handleKey);
    startButton.style.display = 'none';
    startLoop();
  }

  function endGame() {
    clearInterval(intervalId);
    running = false;
    finalScore.textContent = `Your Score: ${score}`;
    modal.classList.remove('hidden');
  }

  function restartGame() {
    modal.classList.add('hidden');
    startButton.style.display = 'inline-block';
    init();
  }

  function handleKey(e) {
    const goingUp = dy === -CELL_SIZE;
    const goingDown = dy === CELL_SIZE;
    const goingLeft = dx === -CELL_SIZE;
    const goingRight = dx === CELL_SIZE;

    if (e.key === 'ArrowUp' && !goingDown) { dx = 0; dy = -CELL_SIZE; }
    else if (e.key === 'ArrowDown' && !goingUp) { dx = 0; dy = CELL_SIZE; }
    else if (e.key === 'ArrowLeft' && !goingRight) { dx = -CELL_SIZE; dy = 0; }
    else if (e.key === 'ArrowRight' && !goingLeft) { dx = CELL_SIZE; dy = 0; }
  }

  // Controls
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', restartGame);

  // Initialize
  init();
});
