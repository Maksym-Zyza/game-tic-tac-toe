const combination = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [1, 5, 9],
  [3, 5, 7],
  [3, 6, 9],
];

const content = document.querySelector(".js-content");
const playersScore = document.querySelectorAll(".js-score");
const heroX = document.querySelector(".hero-x");
const heroO = document.querySelector(".hero-o");
const historyX = [];
const historyO = [];
const winner = { X: false, O: false };
const score = { X: 0, O: 0 };
let imgNumber = 2;
let player = "X";
let count = 0;
let step = 0;

content.insertAdjacentHTML("afterbegin", createMarkup());
content.addEventListener("click", handlerClick);

function createMarkup() {
  let markup = "";
  for (let i = 1; i < 10; i += 1) {
    markup += `<div class="item js-item" data-id="${i}"></div>`;
  }
  removeRotateClass();
  return markup;
}

function handlerClick({ target }) {
  if (!target.classList.contains("js-item") || target.textContent) {
    return;
  }

  const id = Number(target.dataset.id);
  if (player === "X") {
    historyX.push(id);
    historyX.length >= 3 && checkWinner(historyX, "X");
  } else {
    historyO.push(id);
    historyO.length >= 3 && checkWinner(historyO, "O");
  }

  target.textContent = player;
  player = player === "X" ? "O" : "X";
  step += 1;
  count > 0 && showMessage(step !== 9);
  count > 1 && showWinner();
  step === 9 && count === 1 && showWinner();
  step === 9 && count === 0 && modalShow("Game over!");
}

function checkWinner(history, player) {
  const winComb = combination.find((item) =>
    item.every((id) => history.includes(id))
  );
  const result = !!winComb;
  winner[player] = result;
  count += Object.values(winner).filter((el) => el).length;
  result && (updateScore(player), showWinComb(winComb));
}

function showWinComb(winnerArr) {
  const items = document.querySelectorAll(".item");
  items.forEach((el) => {
    winnerArr.includes(Number(el.dataset.id)) && el.classList.add("active");
  });
}

function updateScore(player) {
  score[player] += 1;
  playersScore[player === "X" ? 0 : 1].innerHTML = score[player];
  updateHero();
}

function updateHero() {
  const hero = player === "X" ? heroX : heroO;
  hero.style.backgroundImage = `url(./img/hero${player}${imgNumber}.png)`;
  hero.classList.add("rotate");
  imgNumber++;
  if (imgNumber > 5) imgNumber = 1;
}

function showMessage(bool) {
  if (count === 1 && bool) {
    const points = `Player ${winner.X ? "X" : "O"} scored 1 point.`;
    const message = `Player ${!winner.X ? "X" : "O"} has one more try.`;

    const markup = `<div class="message">
    <div><b>${points}</b></div>
    <div>${message}</div>
    </div>`;
    content.insertAdjacentHTML("afterend", markup);
  } else {
    const existingMessage = document.querySelector(".message");
    if (existingMessage) existingMessage.remove();
  }
}

function showWinner() {
  let message = `Player ${winner.X ? "X" : "O"} is winner!`;
  if (winner.X && winner.O) message = "Friendship won!";
  modalShow(message);
}

function modalShow(message) {
  const instance = basicLightbox.create(
    `<div class="box">
      <h1 class="message">${message}</h1>
    </div>`,
    {
      handler: null,
      onShow(instance) {
        this.handler = onEscape.bind(instance);
        document.addEventListener("keydown", this.handler);
      },
      onClose() {
        document.removeEventListener("keydown", this.handler);
        resetGame();
      },
    }
  );
  instance.show();
}

function resetGame() {
  content.innerHTML = createMarkup();
  historyX.splice(0, historyX.length);
  historyO.splice(0, historyO.length);
  player = "X";
  showMessage(false);
  winner.X = false;
  winner.O = false;
  count = 0;
  step = 0;
}

function onEscape({ code }) {
  code === "Escape" && this.close();
}

function removeRotateClass() {
  setTimeout(function () {
    heroX.classList.remove("rotate");
    heroO.classList.remove("rotate");
  }, 1000);
}
