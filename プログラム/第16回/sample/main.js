// console.log の例
console.log("Hello, JavaScript!");
console.log(1 + 2);

// 変数の例
const maxHp = 100;           // 変更しない値（最大HP）
let hp = 100;                // 変更する値（現在のHP）

hp = hp - 30;                // ダメージを受けて、現在のHPが減る
console.log(maxHp, hp);      // 100 70

// const の変数を書き換えるとエラーになる
// maxHp = 200;              // エラー: Assignment to constant variable.
