// 演習1（実行確認用の完成コード）
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#001a00";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#ff8800";
ctx.fillRect(60, 60, 32, 32);
ctx.fillRect(184, 60, 32, 32);
ctx.fillRect(308, 60, 32, 32);

// 演習2（実行確認用の完成コード）
ctx.fillStyle = "#ffcc00";
for (let i = 0; i < 6; i++) {
  ctx.fillRect(20 + i * 62, 120, 24, 24);
}
ctx.fillStyle = "#cc66ff";
for (let i = 0; i < 6; i++) {
  ctx.fillRect(20 + i * 62, 160, 24, 24);
}

// 演習3（実行確認用の完成コード）
ctx.fillStyle = "#ffffff";
ctx.font = "20px sans-serif";
ctx.textAlign = "left";
ctx.fillText("SCORE: 0", 10, 30);
ctx.textAlign = "right";
ctx.fillText("LIVES: 3", canvas.width - 10, 30);

// 演習4（実行確認用の完成コード）
const player = { x: 180, y: 430, w: 40, h: 40, speed: 6 };

function drawPlayer() {
  ctx.fillStyle = "#66ff66";
  ctx.fillRect(player.x, player.y, player.w, player.h);
}

drawPlayer();

// 発展（実行確認用の完成コード）
// 自機に、左右の翼と先端を描き足す（player.x・player.y からの位置で描く）
ctx.fillStyle = "#33aa33";
ctx.fillRect(player.x - 12, player.y + 20, 12, 16);
ctx.fillRect(player.x + player.w, player.y + 20, 12, 16);
ctx.fillRect(player.x + 16, player.y - 10, 8, 10);

// 星を 30 個、ランダムな位置に描く
ctx.fillStyle = "#ffffff";
for (let i = 0; i < 30; i++) {
  ctx.fillRect(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), 2, 2);
}
