// 演習・発展（実行確認用の完成コード）

// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let frameCount = 0;

// ===== 自機 =====
const player = { x: 180, y: 430, w: 40, h: 40, speed: 6 };

// ===== キー入力 =====
let isLeftPressed = false;
let isRightPressed = false;
let isUpPressed = false;         // 発展
let isDownPressed = false;       // 発展

// 演習２：A キー・D キーでも動かせるようにする
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    isLeftPressed = true;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    isRightPressed = true;
  }
  if (event.key === "ArrowUp") {
    isUpPressed = true;
  }
  if (event.key === "ArrowDown") {
    isDownPressed = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft" || event.key === "a") {
    isLeftPressed = false;
  }
  if (event.key === "ArrowRight" || event.key === "d") {
    isRightPressed = false;
  }
  if (event.key === "ArrowUp") {
    isUpPressed = false;
  }
  if (event.key === "ArrowDown") {
    isDownPressed = false;
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
  // 発展：上下にも動かし、上下の端で止める
  if (isUpPressed) {
    player.y -= player.speed;
  }
  if (isDownPressed) {
    player.y += player.speed;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y + player.h > canvas.height) {
    player.y = canvas.height - player.h;
  }
}

function update() {
  frameCount += 1;
  updatePlayer();
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

function draw() {
  drawBackground();
  drawPlayer();
}

// ===== ゲームループ =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
