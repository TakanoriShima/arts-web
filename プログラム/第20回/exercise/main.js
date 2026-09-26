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
let lives = 3;
const livesElement = document.getElementById("lives");
const damageButton = document.getElementById("damageButton");
const messageElement = document.getElementById("message");      // 発展

function loseLife() {
  lives -= 1;
  livesElement.textContent = lives;
  // 発展：残機が 0 以下になったら「GAME OVER」と表示する
  if (lives <= 0) {
    messageElement.textContent = "GAME OVER";
  }
}

damageButton.addEventListener("click", loseLife);

// 発展（実行確認用の完成コード）
function calcScore(enemyCount) {
  return enemyCount * 100;
}
console.log(calcScore(5));         // 500

const resetButton = document.getElementById("resetButton");

function resetLives() {
  lives = 3;
  livesElement.textContent = lives;
  messageElement.textContent = "";
}

resetButton.addEventListener("click", resetLives);
