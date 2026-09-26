// 演習・発展（実行確認用の完成コード）
// 演習2で変えた値：自機の速さ 5 → 6、弾の間隔 10 → 8、自機の色、敵の色、残機 3 → 5
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
let spawnInterval = 60;          // 敵が出る間隔（フレーム数）
let enemySpeed = 2;              // 敵の速さ

// 発展：無敵時間
let invincibleTimer = 0;         // 0 より大きい間は、敵に当たっても残機が減らない

// ===== 自機・弾・敵 =====
const player = { x: 184, y: 440, w: 32, h: 32, speed: 6 };
let bullets = [];
let enemies = [];
let shotTimer = 0;

// ===== キー入力 =====
let isLeftPressed = false;
let isRightPressed = false;
let isSpacePressed = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    isLeftPressed = true;
  }
  if (event.key === "ArrowRight") {
    isRightPressed = true;
  }
  if (event.key === " ") {
    isSpacePressed = true;
  }
  if (event.key === "Enter" && gameState !== "play") {
    resetGame();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    isLeftPressed = false;
  }
  if (event.key === "ArrowRight") {
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
  spawnInterval = 60;
  enemySpeed = 2;
  invincibleTimer = 0;
  player.x = 184;
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
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 12, speed: 8 });
    shotTimer = 8;
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
    enemies.push({ x: Math.floor(Math.random() * (canvas.width - 32)), y: -32, w: 32, h: 32, speed: enemySpeed });
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].y += enemies[i].speed;
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
    }
  }
}

// 発展：得点が 1000 増えるごとにレベルを上げ、敵を多く・速くする
function updateDifficulty() {
  level = Math.floor(score / 1000) + 1;
  spawnInterval = 60 - (level - 1) * 10;
  if (spawnInterval < 20) {
    spawnInterval = 20;
  }
  enemySpeed = 2 + (level - 1);
  if (enemySpeed > 6) {
    enemySpeed = 6;
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
        score += 100;
        break;
      }
    }
  }
}

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
  checkBulletHits();
  checkPlayerHit();
  updateDifficulty();
}

// ===== 描画 =====
function drawBackground() {
  ctx.fillStyle = "#000022";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  // 無敵時間中は、5 フレームごとに表示と非表示を切り替える（点滅）
  if (Math.floor(invincibleTimer / 5) % 2 === 1) {
    return;
  }
  ctx.fillStyle = "#66ff66";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawBullets() {
  ctx.fillStyle = "#ffff00";
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].w, bullets[i].h);
  }
}

function drawEnemies() {
  ctx.fillStyle = "#ff8800";
  for (let i = 0; i < enemies.length; i++) {
    ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].w, enemies[i].h);
  }
}

function drawUI() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`SCORE: ${score}`, 10, 30);
  ctx.fillText(`LIVES: ${lives}`, 10, 60);
  ctx.fillText(`LEVEL: ${level}`, 10, 90);
  ctx.fillText(`HIGH SCORE: ${highScore}`, 10, 120);
}

function drawTitle() {
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "36px sans-serif";
  ctx.fillText("SHOOTING GAME", canvas.width / 2, 200);
  ctx.font = "20px sans-serif";
  ctx.fillText("← → で移動　スペースで発射", canvas.width / 2, 260);
  ctx.fillText("Enter キーでスタート", canvas.width / 2, 300);
}

function drawGameOver() {
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "40px sans-serif";
  ctx.fillText("GAME OVER", canvas.width / 2, 230);
  ctx.font = "20px sans-serif";
  ctx.fillText("Enter キーでリスタート", canvas.width / 2, 280);
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
