// 前回の復習：if 文
const hp = 0;
if (hp <= 0) {
  console.log("ゲームオーバー");
}

// for 文
for (let i = 0; i < 5; i++) {
  console.log(i);                // 0 1 2 3 4
}

// for 文で、変数の値を少しずつ変える
let playerX = 0;
for (let i = 0; i < 5; i++) {
  playerX += 10;                 // 右へ 10 動く
  console.log(playerX);          // 10 20 30 40 50
}

// i-- で数を減らしながら繰り返す
for (let i = 3; i >= 1; i--) {
  console.log(i);                // 3 2 1
}
console.log("スタート！");

// 配列
const enemyNames = ["スライム", "ゴブリン", "ドラゴン"];
console.log(enemyNames[0]);                       // スライム
console.log(enemyNames[2]);                       // ドラゴン
console.log(enemyNames.length);                   // 3
console.log(enemyNames[enemyNames.length - 1]);   // ドラゴン（最後の要素）
console.log(enemyNames[3]);                       // undefined（番号 3 の要素はない）

let enemyHps = [30, 50, 80];
enemyHps[1] = 20;                // 番号 1 の要素を書き換える
console.log(enemyHps);           // [30, 20, 80]

// for 文で配列の要素を順に処理する
for (let i = 0; i < enemyNames.length; i++) {
  console.log(`${i}番：${enemyNames[i]}`);        // 0番：スライム 1番：ゴブリン 2番：ドラゴン
}

let bulletYs = [400, 300, 200];  // 3 発の弾の y 座標
for (let i = 0; i < bulletYs.length; i++) {
  bulletYs[i] -= 50;             // すべての弾を上へ 50 動かす
}
console.log(bulletYs);           // [350, 250, 150]

let totalHp = 0;
for (let i = 0; i < enemyHps.length; i++) {
  totalHp += enemyHps[i];
}
console.log(totalHp);            // 130

// 配列を後ろから順に処理する
for (let i = enemyNames.length - 1; i >= 0; i--) {
  console.log(enemyNames[i]);    // ドラゴン ゴブリン スライム
}

// for の中の if
const shotYs = [120, 30, -20, 60, -5];   // 弾の y 座標（マイナスは画面の上の外）
let outCount = 0;
for (let i = 0; i < shotYs.length; i++) {
  if (shotYs[i] < 0) {
    console.log(`${i}番の弾は画面の外`);           // 2番の弾は画面の外 4番の弾は画面の外
    outCount += 1;
  }
}
console.log(`画面の外の弾：${outCount}個`);         // 画面の外の弾：2個
