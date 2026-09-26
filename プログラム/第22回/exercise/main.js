// 演習・発展（実行確認用の完成コード）

// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let frameCount = 0;

// ===== 自機 =====
const player = { x: 180, y: 430, w: 40, h: 40, speed: 3 };

// ===== 更新 =====
// 演習2：左へ動かし、左端から出たら右端に戻す
function updatePlayer() {
  player.x -= player.speed;
  if (player.x + player.w < 0) {
    player.x = canvas.width;
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

// 発展：30 フレームごとに、自機の色を切り替える
function drawPlayer() {
  if (Math.floor(frameCount / 30) % 2 === 0) {
    ctx.fillStyle = "#66ff66";
  } else {
    ctx.fillStyle = "#ffff66";
  }
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

// 演習3：経過時間（秒）も表示する
function drawUI() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`FRAME: ${frameCount}`, 10, 30);
  ctx.fillText(`TIME: ${Math.floor(frameCount / 60)}`, 10, 60);
}

function draw() {
  drawBackground();
  drawPlayer();
  drawUI();
}

// ===== ゲームループ =====
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
