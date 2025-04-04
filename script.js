// Function to shuffle the cards randomly
function shuffleCards() {
  const container = document.querySelector('.game-container');
  const cardsArray = Array.from(container.children);
  cardsArray.sort(() => Math.random() - 0.5);
  cardsArray.forEach(card => container.appendChild(card));
}

// DOM Elements
const cards = document.querySelectorAll('.card');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const startButton = document.getElementById('startButton');

let flippedCards = [];
let lockBoard = false;
let score = 0;
const totalMatches = 4;
let gameStarted = false;
let timerInterval;
let timeElapsed = 0;

// Update score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}/${totalMatches}`;
}

// Update timer display
function updateTimer() {
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  timerDisplay.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Start or restart the game
function startGame() {
  // Reset state variables
  flippedCards = [];
  lockBoard = false;
  score = 0;
  updateScore();
  timeElapsed = 0;
  updateTimer();
  gameStarted = true;
  
  // Remove any flipped classes from all cards
  cards.forEach(card => card.classList.remove('flipped'));
  
  // Shuffle the cards for a new game
  shuffleCards();
  
  // Clear any previous timer and start a new one
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeElapsed++;
    updateTimer();
  }, 1000);
}

// Listen for button click to restart the game
startButton.addEventListener('click', startGame);

// Card click logic
cards.forEach(card => {
  card.addEventListener('click', () => {
    if (!gameStarted) return; // Game not started
    if (lockBoard) return;
    if (card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
      lockBoard = true;
      const firstCard = flippedCards[0];
      const secondCard = flippedCards[1];
      
      if (firstCard.getAttribute('data-card') === secondCard.getAttribute('data-card')) {
        // Match found: update score
        score++;
        updateScore();
        flippedCards = [];
        lockBoard = false;
        
        // If game complete, stop the timer and alert
        if (score === totalMatches) {
          clearInterval(timerInterval);
          setTimeout(() => {
            alert(`Game over! Time taken: ${timeElapsed} seconds.`);
            gameStarted = false;
          }, 500);
        }
      } else {
        // No match: flip the cards back after a short delay
        setTimeout(() => {
          firstCard.classList.remove('flipped');
          secondCard.classList.remove('flipped');
          flippedCards = [];
          lockBoard = false;
        }, 1000);
      }
    }
  });
});
