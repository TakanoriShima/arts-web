// 演習・発展（実行確認用の完成コード）

// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let frameCount = 0;

// ===== 自機・弾 =====
const player = { x: 180, y: 430, w: 40, h: 40, speed: 6 };
let bullets = [];
let shotTimer = 0;

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
    // 演習１：弾の大きさ 6 × 16、速さ 10。自機の中央から出す（6 の半分の 3 を引く）
    bullets.push({ x: player.x + player.w / 2 - 3, y: player.y, w: 6, h: 16, speed: 10 });
    // 発展：自機の左端と右端からも、同時に撃つ
    bullets.push({ x: player.x, y: player.y, w: 6, h: 16, speed: 10 });
    bullets.push({ x: player.x + player.w - 6, y: player.y, w: 6, h: 16, speed: 10 });
    shotTimer = 15;                // 演習２：連射の間隔を 15 にした
  }
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;
  }
}

function update() {
  frameCount += 1;
  updatePlayer();
  updateBullets();
}

// ===== 描画 =====
function drawBackground() {
  ctx.fillStyle = "#001a00";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.fillStyle = "#66ff66";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

function drawBullets() {
  ctx.fillStyle = "#ff66ff";
  for (let i = 0; i < bullets.length; i++) {
    ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].w, bullets[i].h);
  }
}

function draw() {
  drawBackground();
  drawPlayer();
  drawBullets();
}

// ===== ゲームループ =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
