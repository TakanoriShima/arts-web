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

// 戻り値
function calcDamage(attack, defense) {
  return attack - defense;
}
const damage = calcDamage(40, 15);
console.log(damage);             // 25

// 関数の外の変数を、関数の中で使う・書き換える
let score = 0;
function addScore(point) {
  score += point;
}
addScore(100);
addScore(50);
console.log(score);              // 150

// HTML の要素を取り出して、表示を書き換える
const scoreElement = document.getElementById("score");
scoreElement.textContent = score;    // 画面の「0」が「150」に変わる

// ボタンのクリックで関数を呼び出す
const scoreButton = document.getElementById("scoreButton");

function addTenPoints() {
  addScore(10);
  scoreElement.textContent = score;
}

scoreButton.addEventListener("click", addTenPoints);
