import './style.css';

// Select DOM elements
const statusDisplay: HTMLElement | null = document.querySelector(".game__title");
const restartButton: HTMLElement | null = document.querySelector("#restartBtn");
const gameGrid: NodeListOf<HTMLElement> = document.querySelectorAll(".game__box");
const timerDisplay: HTMLElement | null = document.querySelector("#timer"); // Timer display

// Define initial game state and variables
let gameActive: boolean = true;
let currentPlayer: string = "X";
let gameState: string[] = ["", "", "", "", "", "", "", "", ""];
let timeLeft: number = 10; // Time left for each turn
let timer: number; // Holds the interval ID for the timer

// Define messages
const winningMessage = (): string => `LOOOOSER🤪. Player ${currentPlayer} is BETTER THAN YOU and has won!`;
const drawMessage = (): string => `Game ended in a draw!`;
const currentPlayerTurn = (): string => `OI YOU😡, PAY ATTENTION! It's ${currentPlayer}'s turn`;

// Display the current player's turn message
if (statusDisplay) {
  statusDisplay.innerHTML = currentPlayerTurn();
}

// Add event listeners to cells and restart button
gameGrid.forEach((cell) =>
  cell.addEventListener("click", (event: Event) =>
    handleCellClick(event as MouseEvent)
  )
);
if (restartButton) {
  restartButton.addEventListener("click", handleRestartGame);
}

// Start the timer for each turn
function startTimer() {
  clearInterval(timer); // Clear any existing timer
  timeLeft = 10; // Reset time left
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      handlePlayerChange(); // Automatically change player when time runs out
    }
  }, 1000); // Countdown every second
}

// Update the timer display on the UI
function updateTimerDisplay() {
  if (timerDisplay) {
    timerDisplay.innerHTML = `Time Left: ${timeLeft}s`;
  }
}

// Handle cell click events
function handleCellClick(clickedCellEvent: MouseEvent): void {
  const clickedCell = clickedCellEvent.target as HTMLElement;
  const clickedCellIndex: number = parseInt(clickedCell.id);

  // Ignore click if cell is already played or game is inactive
  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

// Update game state and UI when a cell is played
function handleCellPlayed(clickedCell: HTMLElement, clickedCellIndex: number): void {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
  clearInterval(timer); // Stop the timer when a move is made
  startTimer(); // Restart the timer for the next player's turn
}

// Define winning conditions
const winningConditions: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Validate the result of the game
function handleResultValidation(): void {
  let roundWon: boolean = false;

  for (let i = 0; i <= 7; i++) {
    const winCondition: number[] = winningConditions[i];
    const a: string = gameState[winCondition[0]];
    const b: string = gameState[winCondition[1]];
    const c: string = gameState[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }

    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    if (statusDisplay) {
      statusDisplay.innerHTML = winningMessage();
    }
    gameActive = false;
    clearInterval(timer); // Stop timer on game end
    return;
  }

  let roundDraw: boolean = !gameState.some((cell) => cell === "");
  if (roundDraw) {
    if (statusDisplay) {
      statusDisplay.innerHTML = drawMessage();
    }
    gameActive = false;
    clearInterval(timer); // Stop timer on game end
    return;
  }

  handlePlayerChange();
}

// Switch players
function handlePlayerChange(): void {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (statusDisplay) {
    statusDisplay.innerHTML = currentPlayerTurn();
  }
  startTimer(); // Start the timer when the player changes
}

// Restart the game
function handleRestartGame(): void {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  if (statusDisplay) {
    statusDisplay.innerHTML = currentPlayerTurn();
  }
  gameGrid.forEach((cell) => (cell.innerHTML = ""));
  startTimer(); // Start the timer when the game is restarted
}

// Start the timer initially when the game loads
startTimer();
