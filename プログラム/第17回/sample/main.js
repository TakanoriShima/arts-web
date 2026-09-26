// データ型
const level = 5;                 // 数値
const heroName = "勇者";         // 文字列
const isAlive = true;            // 真偽値
console.log(typeof level);       // number
console.log(typeof heroName);    // string
console.log(typeof isAlive);     // boolean

// 算術演算子
console.log(10 + 3);             // 13
console.log(10 - 3);             // 7
console.log(10 * 3);             // 30
console.log(10 / 4);             // 2.5
console.log(10 % 3);             // 1
console.log(2 + 3 * 4);          // 14（掛け算が先）
console.log((2 + 3) * 4);        // 20（( ) の中が先）

// 変数を使った計算
const attackPower = 40;
const defense = 15;
let enemyHp = 100;

const damage = attackPower - defense;
enemyHp = enemyHp - damage;
console.log(damage, enemyHp);    // 25 75

// 計算して代入
let score = 0;
score += 100;                    // score = score + 100 と同じ
score += 50;
console.log(score);              // 150
score -= 30;                     // score = score - 30 と同じ
console.log(score);              // 120

// 文字列の連結とテンプレートリテラル
const enemyName = "スライム";
const greeting = enemyName + "が現れた！";
console.log(greeting);                                   // スライムが現れた！
console.log(`${enemyName}に${damage}のダメージ！`);      // スライムに25のダメージ！
console.log(`残りHP：${enemyHp}`);                       // 残りHP：75

// 型の違いに注意
console.log(5 + 3);              // 8
console.log("5" + 3);            // 53（文字列の連結になる）

// 比較演算子と真偽値
const currentHp = 30;
console.log(currentHp > 0);      // true
console.log(currentHp >= 100);   // false
console.log(currentHp === 30);   // true
console.log(currentHp !== 30);   // false
const isDead = currentHp <= 0;
console.log(isDead);             // false
