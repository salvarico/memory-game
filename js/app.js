// declaring global variables
let unmatchedCardFacedUp, firstUnmatchedCard, secondUnmatchedCard, matches, starRating, time, started, timer, numOfFigures = 8, moves, cardElement;
const figureNames = ['fa-css3', 'fa-code', 'fa-bug', 'fa-bitcoin', 'fa-html5', 'fa-linux', 'fa-at', 'fa-git'];
const limitForOneStar = 25, limitForTwoStars = 15;
const deck = document.querySelector('.deck');

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
  }
  return array;
}

// shuffle cards and change the DOM with this new info
function shuffleCards() {
  const figureNamesShuffled = shuffle(figureNames.concat(figureNames));
  const figureElements = document.querySelectorAll('.card>i');
  figureElements.forEach(
    function(currentValue, currentIndex, listObj) {
      currentValue.classList.add(figureNamesShuffled[currentIndex]);
    });
}

function resetVariables() {
  unmatchedCardFacedUp = false, matches = 0, starRating = 3, time = 0, started = false, moves = 0;
}

function clearNameOfCards() {
  const figureElements = document.querySelectorAll('.card>i');
  figureElements.forEach(
    function(currentValue, currentIndex, listObj) {
      currentValue.setAttribute("class", "fa");
    });
}

function newGame() {
  resetVariables();
  resetStars();
  resetMoves();
  clearNameOfCards();
  shuffleCards();
  resetTimer();
  faceAllCardsDown();
}

function resetMoves() {
  document.querySelector('.moves').innerHTML = moves;
}

function faceAllCardsDown() {
  const cardsElement = document.querySelectorAll('.card');
  for (const cardElement of cardsElement) {
    if (cardElement.classList.contains('match')) cardElement.classList.remove('match');
    if (cardElement.classList.contains('show')) cardElement.classList.remove('open', 'show');
  }
}

function resetStars() {
  let starElement;
  const starsContainer = document.querySelector('.stars');
  while (starsContainer.childElementCount < 3) {
    starElement = starsContainer.children[0];
    starsContainer.appendChild(starElement.cloneNode(true));
  }
}

function timerFunc() {
  ++time;
  document.querySelector('.timer').innerHTML = changeTimeFormat(time);
}

function changeTimeFormat(time) {
  const seconds = time % 60;
  const minutes = Math.floor(time / 60);
  if (seconds < 10) {
    return `${minutes}:0${seconds}`;
  }
  else {
    return `${minutes}:${seconds}`;
  }
}

function startTiming() {
  started = true;
  timer = setInterval(timerFunc, 1000);
}

function resetTimer() {
  clearTimeout(timer);
  document.querySelector('.timer').innerHTML = "0:00";
}

function removeStar() {
  const starToRemove = document.querySelector('.stars>li');
  starToRemove.parentNode.removeChild(starToRemove);
}

function cardAlreadySelected(card) {
  return card.classList.contains('match') || card.classList.contains('open');
}

function turnCardFacedUp(card) {
  card.classList.add('open', 'show');
}

function getCardName(card) {
  return card.firstElementChild.className;
}

function updateAndChangeStarRating() {
  if (moves === limitForOneStar || moves === limitForTwoStars) {
    removeStar();
    starRating--;
  }
}

function updateDataAfterNewMatch() {
  matches++;
  firstUnmatchedCard.classList.remove('open', 'show');
  firstUnmatchedCard.classList.add('match');
  secondUnmatchedCard.classList.remove('open', 'show');
  secondUnmatchedCard.classList.add('match');
}

function animateUnmatchedCards() {
  firstUnmatchedCard.animate({ transform: [ 'scale(1)', 'scale(1.2)', 'scale(1)' ], backgroundColor: ["#2e3d49","#f00"], fontSize: ["0px", "32px"] }, { duration: 1000, iterations: 1 });
  secondUnmatchedCard.animate({ transform: [ 'scale(1)', 'scale(1.2)', 'scale(1)' ], backgroundColor: ["#2e3d49","#f00"], fontSize: ["0px", "32px"] }, { duration: 1000, iterations: 1 });
}

function sameFigure(firstUnmatchedCard, secondUnmatchedCard) {
  const nameOfUnmatchedCards = [getCardName(firstUnmatchedCard), getCardName(secondUnmatchedCard)];
  return nameOfUnmatchedCards[0] == nameOfUnmatchedCards[1];
}

function cardClicked(event) {
  if (!started) {
    startTiming();
  }
  cardElement = event.target.closest('.card');
  if (!cardElement || cardAlreadySelected(cardElement)) {
    return;
  }
  if (!unmatchedCardFacedUp) {
    firstUnmatchedCard = cardElement;
    turnCardFacedUp(firstUnmatchedCard);
    unmatchedCardFacedUp = true;
  } else {
    secondUnmatchedCard = cardElement;
    document.querySelector('.moves').innerHTML = ++moves;
    turnCardFacedUp(secondUnmatchedCard);
    updateAndChangeStarRating();
    if (sameFigure(firstUnmatchedCard, secondUnmatchedCard)) {
      updateDataAfterNewMatch();
      if (matches == numOfFigures) {
        refreshModalData();
        toggleModal();
      }
    }
    else {
      animateUnmatchedCards();
      firstUnmatchedCard.classList.remove('open', 'show');
      secondUnmatchedCard.classList.remove('open', 'show');
    }
    unmatchedCardFacedUp = false;
  }
}

function refreshModalData() {
  const modalTime = document.querySelector('.modal_time');
  modalTime.innerHTML = `Time = ${changeTimeFormat(time)}`;
  const modalStars = document.querySelector('.modal_stars');
  modalStars.innerHTML = `Stars = ${starRating}`;
  const modalMoves = document.querySelector('.modal_moves');
  modalMoves.innerHTML = `Moves = ${moves}`;
}

function startGame() {
  let restartElement;
  deck.addEventListener('click', cardClicked);
  restartElement = document.querySelector('.restart');
  restartElement.addEventListener('click', newGame);
  replayButton = document.querySelector('.modal_replay');
  replayButton.addEventListener('click', () => {toggleModal(); newGame();});
  cancelButton = document.querySelector('.modal_cancel');
  cancelButton.addEventListener('click', () => {clearTimeout(timer); toggleModal();});
  newGame();
}

function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}

document.addEventListener('DOMContentLoaded', startGame);
