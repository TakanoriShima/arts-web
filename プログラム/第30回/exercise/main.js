// 演習・発展（実行確認用の完成コード）
// 第 29 回の exercise/main.js の続きから作っている。
// 演習2で変えた値：自機の速さ 6 → 7、弾の間隔 15 → 12、残機 3 → 5
// 発展：難易度、無敵時間と点滅、タイトル画面、ハイスコア

// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let gameState = "title";         // "title"：タイトル　"play"：プレイ中　"gameover"：ゲームオーバー
let score = 0;
let lives = 5;
let frameCount = 0;
let highScore = 0;               // 発展：ハイスコア（リスタートしても消さない）

// 発展：難易度
let level = 1;
let spawnInterval = 45;          // 敵が出る間隔（フレーム数）
let enemySpeed = 3;              // 敵の速さ

// 発展：無敵時間
let invincibleTimer = 0;         // 0 より大きい間は、敵に当たっても残機が減らない

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
  // 発展：タイトル画面からも、Enter キーでゲームを始める
  if (event.key === "Enter" && gameState !== "play") {
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
  lives = 5;
  frameCount = 0;
  level = 1;
  spawnInterval = 45;
  enemySpeed = 3;
  invincibleTimer = 0;
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
  if (invincibleTimer > 0) {
    invincibleTimer -= 1;
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
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y + bullets[i].h < 0) {
      bullets.splice(i, 1);
    }
  }
}

function updateEnemies() {
  if (frameCount % spawnInterval === 0) {
    enemies.push({ x: Math.floor(Math.random() * (canvas.width - 40)), y: -40, w: 40, h: 40, speed: enemySpeed });
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].speed;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
    }
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

// 発展：得点が 500 増えるごとにレベルを上げ、敵を多く・速くする
function updateDifficulty() {
  level = Math.floor(score / 500) + 1;
  spawnInterval = 45 - (level - 1) * 5;
  if (spawnInterval < 20) {
    spawnInterval = 20;
  }
  enemySpeed = 3 + (level - 1);
  if (enemySpeed > 7) {
    enemySpeed = 7;
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

// 発展：無敵時間中は、敵に当たっても残機を減らさない
function checkPlayerHit() {
  if (invincibleTimer > 0) {
    return;
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (isHit(player, enemies[i])) {
      enemies.splice(i, 1);
      lives -= 1;
      invincibleTimer = 90;      // 約 1.5 秒
      if (lives <= 0) {
        gameState = "gameover";
        if (score > highScore) {
          highScore = score;
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
  checkBulletHits();
  checkPlayerHit();
  updateDifficulty();
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
  // 発展：無敵時間中は、5 フレームごとに表示と非表示を切り替える（点滅）
  if (Math.floor(invincibleTimer / 5) % 2 === 1) {
    return;
  }
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

function drawUI() {
  ctx.fillStyle = "#ffffcc";
  ctx.font = "22px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${score}`, 10, 30);
  ctx.font = "16px sans-serif";
  ctx.fillText(`LEVEL: ${level}`, 10, 55);
  ctx.fillText(`HIGH SCORE: ${highScore}`, 10, 78);
  ctx.font = "22px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(`LIVES: ${lives}`, canvas.width - 10, 30);
}

function drawTitle() {
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "36px sans-serif";
  ctx.fillText("SHOOTING GAME", canvas.width / 2, 200);
  ctx.font = "20px sans-serif";
  ctx.fillText("← → で移動　スペースで発射", canvas.width / 2, 260);
  ctx.fillText("Enter キーでスタート", canvas.width / 2, 300);
  ctx.fillText(`HIGH SCORE: ${highScore}`, canvas.width / 2, 350);
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
  if (gameState === "title") {
    drawTitle();
    return;
  }
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
