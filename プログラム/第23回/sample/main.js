// ===== 準備 =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== ゲームの状態 =====
let frameCount = 0;              // ゲーム開始からのフレーム数

// ===== 自機 =====
const player = { x: 184, y: 440, w: 32, h: 32, speed: 5 };

// ===== キー入力 =====
let isLeftPressed = false;
let isRightPressed = false;

document.addEventListener("keydown", function (event) {
  console.log(event.key);        // 押したキーの名前を確認する
  if (event.key === "ArrowLeft") {
    isLeftPressed = true;
  }
  if (event.key === "ArrowRight") {
    isRightPressed = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    isLeftPressed = false;
  }
  if (event.key === "ArrowRight") {
    isRightPressed = false;
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
  // 画面の端で止める
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.w > canvas.width) {
    player.x = canvas.width - player.w;
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

function drawUI() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`FRAME: ${frameCount}`, 10, 30);
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
