// 演習1（実行確認用の完成コード）
for (let i = 1; i <= 10; i++) {
  console.log(i);                  // 1 2 3 … 10
}

for (let i = 5; i >= 1; i--) {
  console.log(i);                  // 5 4 3 2 1
}
console.log("GO!");

// 演習2（実行確認用の完成コード）
const screenWidth = 100;
const speed = 15;
let myX = 0;
for (let i = 0; i < 10; i++) {
  myX += speed;
  if (myX > screenWidth) {
    myX = screenWidth;
  }
  console.log(`${i + 1}回目：x = ${myX}`);   // 15 30 45 60 75 90 100 100 100 100
}

// 演習3（実行確認用の完成コード）
const itemNames = ["回復薬", "毒消し", "木の盾", "鉄の剣"];
console.log(itemNames[0]);                       // 回復薬
console.log(itemNames[itemNames.length - 1]);    // 鉄の剣
console.log(`アイテムの数：${itemNames.length}`); // アイテムの数：4
for (let i = 0; i < itemNames.length; i++) {
  console.log(`${i + 1}：${itemNames[i]}`);
}

// 演習4（実行確認用の完成コード）
const monsterHps = [0, 25, 0, 40, 10];
let defeatCount = 0;
for (let i = 0; i < monsterHps.length; i++) {
  if (monsterHps[i] <= 0) {
    console.log(`${i}番の敵：倒した`);
    defeatCount += 1;
  } else {
    console.log(`${i}番の敵：残りHP ${monsterHps[i]}`);
  }
}
console.log(`倒した敵：${defeatCount}体`);        // 倒した敵：2体

// 発展（実行確認用の完成コード）
let bulletYs = [300, 120, 40, 200];
for (let i = 0; i < bulletYs.length; i++) {
  bulletYs[i] -= 50;
  if (bulletYs[i] < 0) {
    console.log(`${i}番の弾は画面の外`);         // 2番の弾は画面の外
  }
}
console.log(bulletYs);                           // [250, 70, -10, 150]

for (let i = itemNames.length - 1; i >= 0; i--) {
  console.log(itemNames[i]);                     // 鉄の剣 木の盾 毒消し 回復薬
}

let totalMonsterHp = 0;
for (let i = 0; i < monsterHps.length; i++) {
  totalMonsterHp += monsterHps[i];
}
console.log(`敵のHPの合計：${totalMonsterHp}`);   // 敵のHPの合計：75
