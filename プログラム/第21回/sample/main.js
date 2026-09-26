// オブジェクト
const player = { x: 184, y: 440, w: 32, h: 32, speed: 5 };
console.log(player.x);           // 184（値の読み取り）
console.log(player.w);           // 32
player.x = 100;                  // 値の変更
console.log(player.x);           // 100

// Canvas を使う準備
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// 背景（キャンバス全体を塗る）
ctx.fillStyle = "#000022";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// 四角形を描く
ctx.fillStyle = "#ff4444";
ctx.fillRect(50, 150, 80, 40);

// 文字を描く
ctx.fillStyle = "#ffffff";
ctx.font = "20px sans-serif";
ctx.textAlign = "center";
ctx.fillText("SHOOTING GAME", canvas.width / 2, 250);

// for 文で、敵を横に並べて描く
ctx.fillStyle = "#ff4444";
for (let i = 0; i < 5; i++) {
  ctx.fillRect(40 + i * 70, 70, 32, 32);
}

// オブジェクトと関数で、自機を描く
function drawPlayer() {
  ctx.fillStyle = "#00ccff";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

drawPlayer();
