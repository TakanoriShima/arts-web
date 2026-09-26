// 演習・発展（実行確認用の完成コード）
//
// 演習2の答え（講師用）
//   (1) "arrowLeft" → "ArrowLeft"（大文字・小文字の違い。エラーは出ないが、左に動かない）
//   (2) i <= bullets.length → i < bullets.length（ない番号 bullets.length を調べて TypeError になる）
//   (3) resetGame に enemies = []; がない（リスタート後も、前のゲームの敵が残る）
//   (4) draw の最初に drawBackground(); がない（前のフレームの絵が残り、線のように伸びる）
//
// 演習3：色を変えた（背景・自機・弾・敵・文字）
// 発展：自機と敵を、複数の四角形で描く。背景に流れる星を描く。

// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let gameState = "play";
let score = 0;
let lives = 3;
let frameCount = 0;

// ===== 自機・弾・敵 =====
const player = { x: 180, y: 430, w: 40, h: 40, speed: 6 };
let bullets = [];
let enemies = [];
let shotTimer = 0;

// 発展：星（ゲームの最初に 40 個作る）
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

// ===== リスタート =====
function resetGame() {
  gameState = "play";
  score = 0;
  lives = 3;
  frameCount = 0;
  player.x = 180;
  bullets = [];
  enemies = [];
  shotTimer = 0;
}

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
    shotTimer = 15;
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y + bullets[i].h < 0) {
      bullets.splice(i, 1);
    }
  }
}

function updateEnemies() {
  if (frameCount % 45 === 0) {
    enemies.push({ x: Math.floor(Math.random() * (canvas.width - 40)), y: -40, w: 40, h: 40, speed: 3 });
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].speed;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
    }
  }
}

// 発展：星を下へ流し、画面の下に出たら上に戻す
function updateStars() {
  for (let i = 0; i < stars.length; i++) {
    stars[i].y += stars[i].speed;
    if (stars[i].y > canvas.height) {
      stars[i].y = 0;
      stars[i].x = Math.floor(Math.random() * canvas.width);
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
      if (lives <= 0) {
        gameState = "gameover";
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

// 発展：自機を、胴体・翼・先端の 3 つの四角形で描く
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

// 発展：敵に目を描く
function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.fillStyle = "#ff5577";
    ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].w, enemies[i].h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(enemies[i].x + 8, enemies[i].y + 12, 8, 8);
    ctx.fillRect(enemies[i].x + enemies[i].w - 16, enemies[i].y + 12, 8, 8);
  }
}

function drawUI() {
  ctx.fillStyle = "#ffffcc";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${score}`, 10, 30);
  ctx.textAlign = "right";
  ctx.fillText(`LIVES: ${lives}`, canvas.width - 10, 30);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "40px sans-serif";
  ctx.fillText("GAME OVER", canvas.width / 2, 210);
  ctx.font = "24px sans-serif";
  ctx.fillText(`SCORE: ${score}`, canvas.width / 2, 260);
  ctx.font = "20px sans-serif";
  ctx.fillText("Enter キーでリスタート", canvas.width / 2, 310);
}

function draw() {
  drawBackground();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawUI();
  if (gameState === "gameover") {
    drawGameOver();
  }
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
