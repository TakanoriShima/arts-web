// 前回の復習：比較の結果は真偽値
console.log(30 > 0);             // true
console.log(30 <= 0);            // false

// if 文
const playerHp = 30;
if (playerHp > 0) {
  console.log("まだ戦える");
}
console.log("ターン終了");

// if 文で変数を書き換える（画面の端で止める）
const screenWidth = 400;
let playerX = 390;
playerX += 20;                   // 右へ 20 動く
if (playerX > screenWidth) {
  playerX = screenWidth;         // 画面の端で止める
}
console.log(playerX);            // 400

// if ... else
const enemyHp = 0;
if (enemyHp <= 0) {
  console.log("敵を倒した！");
} else {
  console.log(`敵の残りHP：${enemyHp}`);
}

// else if
const score = 750;
if (score >= 1000) {
  console.log("ランク：S");
} else if (score >= 500) {
  console.log("ランク：A");      // 750 は、ここ
} else {
  console.log("ランク：B");
}

// 論理演算子
const enemyX = 250;
console.log(enemyX >= 0 && enemyX <= screenWidth);   // true（0 以上 かつ 400 以下）
console.log(enemyX < 0 || enemyX > screenWidth);     // false（画面の外ではない）

const hasKey = true;
const level = 8;
if (hasKey && level >= 10) {
  console.log("扉が開いた");
} else {
  console.log("扉は開かない");   // level が 10 未満なので、こちら
}

const isGameOver = false;
console.log(!isGameOver);        // true
if (!isGameOver) {
  console.log("ゲームを続ける");
}

// 乱数
console.log(Math.random());      // 0 以上 1 未満の小数（毎回変わる）
console.log(Math.floor(3.7));    // 3（小数点以下を切り捨てる）

const dice = Math.floor(Math.random() * 6) + 1;
console.log(dice);               // 1〜6 のどれか

const spawnX = Math.floor(Math.random() * screenWidth);
console.log(spawnX);             // 0〜399 のどれか（敵の出現位置）

if (Math.random() < 0.3) {
  console.log("会心の一撃！");   // 約 30% の確率
} else {
  console.log("通常の攻撃");
}
