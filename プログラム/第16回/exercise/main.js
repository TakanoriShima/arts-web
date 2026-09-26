// 演習2（実行確認用の完成コード）
const userName = "田中";
const favoriteGame = "アクションゲーム";
console.log("名前:", userName);
console.log("好きなゲーム:", favoriteGame);

// favoriteGame = "パズルゲーム";   // エラー: Assignment to constant variable.

// 演習3（実行確認用の完成コード）
const enemyName = "スライム";
let enemyHp = 120;
const attackPower = 35;

enemyHp = enemyHp - attackPower;
console.log(enemyName, enemyHp);   // スライム 85

enemyHp = enemyHp - attackPower;
console.log(enemyName, enemyHp);   // スライム 50

enemyHp = enemyHp - attackPower;
console.log(enemyName, enemyHp);   // スライム 15
