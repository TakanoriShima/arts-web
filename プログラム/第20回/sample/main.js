// 前回の復習：for 文と配列
const scores = [80, 45, 92];
for (let i = 0; i < scores.length; i++) {
  console.log(scores[i]);        // 80 45 92
}

// 関数を作る
function showTitle() {
  console.log("=== SHOOTING GAME ===");
}

showTitle();
showTitle();

// 引数
function showDamage(damage) {
  console.log(`${damage}のダメージ！`);
}
showDamage(10);                  // 10のダメージ！
showDamage(25);                  // 25のダメージ！

function showStatus(name, hp) {
  console.log(`${name}の残りHP：${hp}`);
}
showStatus("スライム", 30);      // スライムの残りHP：30

// 戻り値
function calcDamage(attack, defense) {
  return attack - defense;
}
const damage = calcDamage(40, 15);
console.log(damage);             // 25

function isAlive(hp) {
  return hp > 0;
}
console.log(isAlive(30));        // true
console.log(isAlive(0));         // false
if (!isAlive(0)) {
  console.log("倒れた");
}

// 関数の外の変数を、関数の中で使う・書き換える
let score = 0;
function addScore(point) {
  score += point;
}
addScore(100);
addScore(50);
console.log(score);              // 150

// オブジェクト
const player = {
  x: 100,
  y: 400,
  w: 32,
  h: 32,
  speed: 5
};
console.log(player.x);           // 100
console.log(player.speed);       // 5
player.x += player.speed;        // 右へ動かす
console.log(player.x);           // 105

// const と、配列・オブジェクトの中の値
// player = { x: 0, y: 0 };      // エラー：const の変数には、別の値を代入し直せない
player.y = 380;                  // const のオブジェクトでも、中の値は書き換えられる
console.log(player.y);           // 380

const enemyHps = [30, 50, 80];
enemyHps[1] = 20;                // const の配列でも、要素は書き換えられる
console.log(enemyHps);           // [30, 20, 80]

// 関数とオブジェクトを組み合わせる
const screenWidth = 400;

function updatePlayer() {
  player.x += player.speed;
  // 画面の端で止める
  if (player.x + player.w > screenWidth) {
    player.x = screenWidth - player.w;
  }
}

function showPlayer() {
  console.log(`自機の位置：x = ${player.x}, y = ${player.y}`);
}

for (let i = 0; i < 3; i++) {
  updatePlayer();
  showPlayer();                  // x = 110 → 115 → 120
}
