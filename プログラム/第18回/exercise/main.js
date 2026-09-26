// 演習1（実行確認用の完成コード）
let myHp = 50;
const enemyAttack = 20;
myHp -= enemyAttack;
if (myHp <= 0) {
  console.log("ゲームオーバー");
} else {
  console.log(`残りHP：${myHp}`);  // 残りHP：30
}

// 演習2（実行確認用の完成コード）
const myScore = 650;
if (myScore >= 1000) {
  console.log("ランク：S");
} else if (myScore >= 500) {
  console.log("ランク：A");        // 650 は、ここ
} else if (myScore >= 200) {
  console.log("ランク：B");
} else {
  console.log("ランク：C");
}

// 演習3（実行確認用の完成コード）
const screenWidth = 640;
const screenHeight = 480;
const enemyX = 320;
const enemyY = 500;
if (enemyX >= 0 && enemyX <= screenWidth && enemyY >= 0 && enemyY <= screenHeight) {
  console.log("画面の中");
} else {
  console.log("画面の外");         // enemyY が 480 より大きいので、こちら
}

// 演習4（実行確認用の完成コード）
const dice = Math.floor(Math.random() * 6) + 1;
console.log(`サイコロの目：${dice}`);
if (dice === 6) {
  console.log("大当たり！");
} else {
  console.log("はずれ");
}

// 発展1（実行確認用の完成コード）
let bossHp = 30;
const attackDamage = Math.floor(Math.random() * 11) + 10;   // 10〜20
if (Math.random() < 0.8) {
  bossHp -= attackDamage;
  console.log(`${attackDamage}のダメージ！`);
} else {
  console.log("ミス！");
}
if (bossHp <= 0) {
  console.log("ボスを倒した！");
} else {
  console.log(`ボスの残りHP：${bossHp}`);
}

// 発展2（実行確認用の完成コード）
const playerWidth = 32;
const speed = 30;
let playerX = 590;
playerX += speed;                  // 右へ動く
if (playerX + playerWidth > screenWidth) {
  playerX = screenWidth - playerWidth;
}
console.log(playerX);              // 608

playerX = 10;
playerX -= speed;                  // 左へ動く
if (playerX < 0) {
  playerX = 0;
}
console.log(playerX);              // 0
