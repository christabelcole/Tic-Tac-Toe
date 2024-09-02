// Select DOM elements
const statusDisplay: HTMLElement | null = document.querySelector('.game__title');
const restartButton: HTMLElement | null = document.querySelector('#restartBtn');
const gameGrid: NodeListOf<HTMLElement> = document.querySelectorAll('.game__box');

// Define initial game state and variables
let gameActive: boolean = true;
let currentPlayer: string = "X";
let gameState: string[] = ["", "", "", "", "", "", "", "", ""];

// Define messages
const winningMessage = (): string => `Player ${currentPlayer} has won!`;
const drawMessage = (): string => `Game ended in a draw!`;
const currentPlayerTurn = (): string => `It's ${currentPlayer}'s turn`;

// Display the current player's turn message
if (statusDisplay) {
  statusDisplay.innerHTML = currentPlayerTurn();
}

// Add event listeners to cells and restart button
gameGrid.forEach(cell => 
  cell.addEventListener('click', (event: Event) => handleCellClick(event as MouseEvent))
);
if (restartButton) {
  restartButton.addEventListener('click', handleRestartGame);
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
  [2, 4, 6]
];

// Validate the result of the game
function handleResultValidation(): void {
  let roundWon: boolean = false;

  for (let i = 0; i <= 7; i++) {
    const winCondition: number[] = winningConditions[i];
    const a: string = gameState[winCondition[0]];
    const b: string = gameState[winCondition[1]];
    const c: string = gameState[winCondition[2]];

    if (a === '' || b === '' || c === '') {
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
    return;
  }

  let roundDraw: boolean = !gameState.some(cell => cell === "");
  if (roundDraw) {
    if (statusDisplay) {
      statusDisplay.innerHTML = drawMessage();
    }
    gameActive = false;
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
}

// Restart the game
function handleRestartGame(): void {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  if (statusDisplay) {
    statusDisplay.innerHTML = currentPlayerTurn();
  }
  gameGrid.forEach(cell => cell.innerHTML = "");
}
