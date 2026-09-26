// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let frameCount = 0;              // ゲーム開始からのフレーム数

// ===== 自機 =====
const player = { x: 184, y: 440, w: 32, h: 32, speed: 5 };

// ===== 更新 =====
function updatePlayer() {
  player.x += player.speed;      // const の player でも、中の値は書き換えられる
  // 右端から出たら、左端（x を 0）に戻す
  if (player.x > canvas.width) {
    player.x = 0;
  }
}

function update() {
  frameCount += 1;
  updatePlayer();
}

// ===== 描画 =====
function drawBackground() {
  ctx.fillStyle = "#000022";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.fillStyle = "#00ccff";
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
