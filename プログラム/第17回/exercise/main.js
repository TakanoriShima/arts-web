// 演習1（実行確認用の完成コード）
const playerName = "勇者";
const playerLevel = 5;
const isBoss = false;
console.log(typeof playerName);   // string
console.log(typeof playerLevel);  // number
console.log(typeof isBoss);       // boolean

// 演習2（実行確認用の完成コード）
const playerAttack = 50;
const enemyDefense = 20;
let bossHp = 100;

const bossDamage = playerAttack - enemyDefense;
bossHp = bossHp - bossDamage;
bossHp = bossHp - bossDamage;
console.log(bossDamage, bossHp);  // 30 40

const itemCount = 17;
const memberCount = 5;
console.log(itemCount % memberCount);   // 2

// 演習3（実行確認用の完成コード）
const bossName = "ドラゴン";
console.log(bossName + "が現れた！");
console.log(`${bossName}に${bossDamage}のダメージ！残りHPは${bossHp}です`);
console.log(5 + 3);               // 8
console.log("5" + 3);             // 53

// 演習4（実行確認用の完成コード）
console.log(bossHp > 0);          // true（40）
bossHp = bossHp - bossDamage;
console.log(bossHp, bossHp > 0);  // 10 true
bossHp = bossHp - bossDamage;
console.log(bossHp, bossHp > 0);  // -20 false

// 発展（実行確認用の完成コード）
let exp = 0;
exp += 30;
exp += 30;
exp += 30;
console.log(exp);                 // 90
exp *= 2;
console.log(exp);                 // 180
