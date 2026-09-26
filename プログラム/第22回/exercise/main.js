// 演習・発展（実行確認用の完成コード）
// 第 21 回の exercise の player（色・大きさ）を引き継いでいる。

// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let frameCount = 0;

// ===== 自機 =====
const player = { x: 180, y: 430, w: 40, h: 40, speed: 6 };   // 演習２：速さを 6 にした

// ===== 更新 =====
function updatePlayer() {
  player.x += player.speed;
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
