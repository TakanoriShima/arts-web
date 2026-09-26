// 演習1（実行確認用の完成コード）
function showGameOver() {
  console.log("GAME OVER");
}
showGameOver();
showGameOver();

function showScore(point) {
  console.log(`得点：${point}点`);
}
showScore(300);                    // 得点：300点

// 演習2（実行確認用の完成コード）
function calcScore(enemyCount) {
  return enemyCount * 100;
}
console.log(calcScore(5));         // 500

// 演習3（実行確認用の完成コード）
const enemy = {
  name: "スライム",
  hp: 50,
  x: 120,
  y: 40
};
console.log(`${enemy.name}のHP：${enemy.hp}`);   // スライムのHP：50
enemy.hp -= 20;
console.log(`${enemy.name}のHP：${enemy.hp}`);   // スライムのHP：30

// 演習4（実行確認用の完成コード）
let totalScore = 0;

function damageEnemy(damage) {
  enemy.hp -= damage;
  if (enemy.hp <= 0) {
    console.log(`${enemy.name}を倒した！`);
    totalScore += 100;
  } else {
    console.log(`${enemy.name}の残りHP：${enemy.hp}`);
  }
}

damageEnemy(10);                   // スライムの残りHP：20
damageEnemy(10);                   // スライムの残りHP：10
damageEnemy(10);                   // スライムを倒した！
console.log(`得点：${totalScore}`); // 得点：100

// 発展（実行確認用の完成コード）
function isInScreen(x) {
  return x >= 0 && x <= 400;
}
console.log(isInScreen(200));      // true
if (!isInScreen(450)) {
  console.log("画面の外");
}

function showCharacter(character) {
  console.log(`${character.name}：x = ${character.x}, y = ${character.y}`);
}
showCharacter(enemy);              // スライム：x = 120, y = 40
