// declaring global variables
let unmatchedCardFacedUp, firstUnmatchedCard, secondUnmatchedCard, matches, starRating, time, started, timer, moves, cardElement;
const FIGURE_NAMES = ['fa-css3', 'fa-code', 'fa-bug', 'fa-bitcoin', 'fa-html5', 'fa-linux', 'fa-at', 'fa-git'];
const LIMIT_FOR_ONE_STAR = 25, LIMIT_FOR_TWO_STARS = 15, NUM_OF_FIGURES = 8;
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

// shuffle cards and change the DOM with this new info by adding a class like fa-bitcoin from Font Awesome
function shuffleCards() {
  // shuffle the array of figures with each figure appearing twice
  const figureNamesShuffled = shuffle(FIGURE_NAMES.concat(FIGURE_NAMES));
  const figureElements = document.querySelectorAll('.card>i');
  figureElements.forEach(
    function(currentValue, currentIndex, listObj) {
      currentValue.classList.add(figureNamesShuffled[currentIndex]);
    });
}

function resetVariables() {
  unmatchedCardFacedUp = false, matches = 0, starRating = 3, time = 0, started = false, moves = 0;
}

// remove the classes from the figureElements and just keep the fa class
function clearNameOfCards() {
  const figureElements = document.querySelectorAll('.card>i');
  figureElements.forEach(
    function(currentValue, currentIndex, listObj) {
      currentValue.setAttribute('class', 'fa');
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
  document.querySelector('.moves').innerHTML = 0;
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
  // reset to 3 stars by taking one star element, cloning it and append it
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

// will continuously be changing the timer displayed in the webpage
function startTiming() {
  started = true;
  timer = setInterval(timerFunc, 1000);
}

function resetTimer() {
  clearTimeout(timer);
  document.querySelector('.timer').innerHTML = '0:00';
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
    removeStar();
    starRating--;
}

function flipMatchedCards() {
  firstUnmatchedCard.classList.remove('open', 'show');
  firstUnmatchedCard.classList.add('match');
  secondUnmatchedCard.classList.remove('open', 'show');
  secondUnmatchedCard.classList.add('match');
}

function animateUnmatchedCards() {
  firstUnmatchedCard.animate({ transform: [ 'scale(1)', 'scale(1.2)', 'scale(1)' ], backgroundColor: ['#2e3d49','#f00'], fontSize: ['0px', '32px'] }, { duration: 1000, iterations: 1 });
  secondUnmatchedCard.animate({ transform: [ 'scale(1)', 'scale(1.2)', 'scale(1)' ], backgroundColor: ['#2e3d49','#f00'], fontSize: ['0px', '32px'] }, { duration: 1000, iterations: 1 });
}

function sameFigure(firstUnmatchedCard, secondUnmatchedCard) {
  const nameOfUnmatchedCards = [getCardName(firstUnmatchedCard), getCardName(secondUnmatchedCard)];
  return nameOfUnmatchedCards[0] == nameOfUnmatchedCards[1];
}

function cardClicked(event) {
  if (!started) {
    startTiming();
  }
  // use the closest function to assure we get the cardElement and not another element inside
  cardElement = event.target.closest('.card');
  // if the element wasn't found or it's a card already selected then do nothing
  if (!cardElement || cardAlreadySelected(cardElement)) {
    return;
  }
  // check if there is another card already faced up
  if (!unmatchedCardFacedUp) {
    firstUnmatchedCard = cardElement;
    turnCardFacedUp(firstUnmatchedCard);
    unmatchedCardFacedUp = true;
  } else {
    secondUnmatchedCard = cardElement;
    turnCardFacedUp(secondUnmatchedCard);
    document.querySelector('.moves').innerHTML = ++moves;
    // update star rating if necessary
    if (moves === LIMIT_FOR_ONE_STAR || moves === LIMIT_FOR_TWO_STARS) updateAndChangeStarRating();
    // check if both cards faced up have the same figure
    if (sameFigure(firstUnmatchedCard, secondUnmatchedCard)) {
      matches++;
      flipMatchedCards();
      if (matches == NUM_OF_FIGURES) {
        // refreshModalData();
        // toggleModal();
        if (confirm("Would you like to play again?")) {
          newGame();
        } else {
          clearTimeout(timer);
        }
      }
    }
    // if cards faced up don't have the same figure
    else {
      animateUnmatchedCards();
      firstUnmatchedCard.classList.remove('open', 'show');
      secondUnmatchedCard.classList.remove('open', 'show');
    }
    unmatchedCardFacedUp = false;
  }
}

// function refreshModalData() {
//   const modalTime = document.querySelector('.modal_time');
//   modalTime.innerHTML = `Time = ${changeTimeFormat(time)}`;
//   const modalStars = document.querySelector('.modal_stars');
//   modalStars.innerHTML = `Stars = ${starRating}`;
//   const modalMoves = document.querySelector('.modal_moves');
//   modalMoves.innerHTML = `Moves = ${moves}`;
// }
//
// function toggleModal() {
//   const modal = document.querySelector('.modal_background');
//   modal.classList.toggle('hide');
// }

function startGame() {
  deck.addEventListener('click', cardClicked);
  // setting some buttons for the modal and restart buttons
  const restartElement = document.querySelector('.restart');
  restartElement.addEventListener('click', newGame);
  // const replayButton = document.querySelector('.modal_replay');
  // replayButton.addEventListener('click', () => {toggleModal(); newGame();});
  // const cancelButton = document.querySelector('.modal_cancel');
  // cancelButton.addEventListener('click', () => {clearTimeout(timer); toggleModal();});
  newGame();
}

document.addEventListener('DOMContentLoaded', startGame);
