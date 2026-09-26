// 演習・発展（実行確認用の完成コード）
// 第 29 回の exercise/main.js の続きから作っている。
// 演習２で変えた値：自機の速さ 6 → 7、弾の間隔 15 → 12、残機 3 → 5
// 発展：タイトル画面（HTML のパネル）、ハイスコア（HTML に表示）。どちらも、これまでに学んだ HTML と jQuery だけで作る。

// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let gameState = "title";         // 発展："title"：タイトル　"play"：プレイ中　"gameover"：ゲームオーバー
let score = 0;
let lives = 5;
let frameCount = 0;
let highScore = 0;               // 発展：ハイスコア（リスタートしても消さない）

// ===== 自機・弾・敵 =====
const player = { x: 180, y: 430, w: 40, h: 40, speed: 7 };
let bullets = [];
let enemies = [];
let shotTimer = 0;

// 星（ゲームの最初に 40 個作る）
const stars = [];
for (let i = 0; i < 40; i++) {
  stars.push({ x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height), speed: Math.floor(Math.random() * 3) + 1 });
}

// ===== キー入力 =====
let isLeftPressed = false;
let isRightPressed = false;
let isSpacePressed = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    isLeftPressed = true;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    isRightPressed = true;
  }
  if (event.key === " ") {
    isSpacePressed = true;
  }
  if (event.key === "Enter" && gameState === "gameover") {
    resetGame();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    isLeftPressed = false;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    isRightPressed = false;
  }
  if (event.key === " ") {
    isSpacePressed = false;
  }
});

function updateUI() {
  $("#score").text(score);
  $("#lives").text(lives);
}

// ===== リスタート =====
function resetGame() {
  gameState = "play";
  score = 0;
  lives = 5;
  frameCount = 0;
  player.x = 180;
  bullets = [];
  enemies = [];
  shotTimer = 0;
  updateUI();
  $("#gameOverPanel").hide();
  $("#titlePanel").hide();       // 発展：タイトルのパネルも隠す
}

$("#restartButton").on("click", resetGame);
$("#startButton").on("click", resetGame);   // 発展：スタートボタンでもゲームを始める

// ===== 更新 =====
function updatePlayer() {
  if (isLeftPressed) {
    player.x -= player.speed;
  }
  if (isRightPressed) {
    player.x += player.speed;
  }
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.w > canvas.width) {
    player.x = canvas.width - player.w;
  }
}

function updateBullets() {
  if (shotTimer > 0) {
    shotTimer -= 1;
  }
  if (isSpacePressed && shotTimer === 0) {
    bullets.push({ x: player.x + player.w / 2 - 3, y: player.y, w: 6, h: 16, speed: 10 });
    shotTimer = 12;
  }
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;
  }
}

function updateEnemies() {
  if (frameCount % 45 === 0) {
    enemies.push({ x: Math.floor(Math.random() * (canvas.width - 40)), y: -40, w: 40, h: 40, speed: 3 });
  }
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemies[i].speed;
  }
}

function updateStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].y += stars[i].speed;
    if (stars[i].y > canvas.height) {
      stars[i].y = 0;
      stars[i].x = Math.floor(Math.random() * canvas.width);
    }
  }
}

function removeEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
    }
  }
}

function removeBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].y + bullets[i].h < 0) {
      bullets.splice(i, 1);
    }
  }
}

function isHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function checkBulletHits() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (isHit(bullets[i], enemies[j])) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score += 50;
        updateUI();
        break;
      }
    }
  }
}

function checkPlayerHit() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (isHit(player, enemies[i])) {
      enemies.splice(i, 1);
      lives -= 1;
      updateUI();
      if (lives <= 0) {
        gameState = "gameover";
        $("#finalScore").text(score);
        $("#gameOverPanel").show();
        // 発展：ハイスコアを更新して表示する
        if (score > highScore) {
          highScore = score;
          $("#highScore").text(highScore);
        }
      }
      break;
    }
  }
}

function update() {
  frameCount += 1;
  updatePlayer();
  updateBullets();
  updateEnemies();
  updateStars();
  removeEnemies();
  removeBullets();
  checkBulletHits();
  checkPlayerHit();
}

// ===== 描画 =====
function drawBackground() {
  ctx.fillStyle = "#0a0a1f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#aaaaff";
  for (let i = 0; i < stars.length; i++) {
    ctx.fillRect(stars[i].x, stars[i].y, 2, 2);
  }
}

function drawPlayer() {
  ctx.fillStyle = "#44ddff";
  ctx.fillRect(player.x + 12, player.y, 16, player.h);
  ctx.fillRect(player.x, player.y + 20, player.w, 14);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(player.x + 17, player.y + 4, 6, 8);
}

function drawBullets() {
  ctx.fillStyle = "#ffee55";
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].w, bullets[i].h);
  }
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.fillStyle = "#ff5577";
    ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].w, enemies[i].h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(enemies[i].x + 8, enemies[i].y + 12, 8, 8);
    ctx.fillRect(enemies[i].x + enemies[i].w - 16, enemies[i].y + 12, 8, 8);
  }
}

function draw() {
  drawBackground();
  drawPlayer();
  drawBullets();
  drawEnemies();
}

// ===== ゲームループ =====
function gameLoop() {
  if (gameState === "play") {
    update();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
