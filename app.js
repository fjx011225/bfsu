// app.js
let rows, cols, mines, board, gameOver, flagCount;
const backgroundMusic = new Audio('background-music.mp3');
backgroundMusic.loop = true;
const difficultySelect = document.getElementById('difficulty-select');
const gameContainer = document.getElementById('game-container');
const resetBtn = document.getElementById('reset-btn');
const minesLeftSpan = document.getElementById('mines-left');

difficultySelect.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const difficulty = e.target.id;
        setDifficulty(difficulty);
        difficultySelect.style.display = 'none';
        gameContainer.style.display = 'block';
        initGame();
    }
});

resetBtn.addEventListener('click', initGame);

function setDifficulty(difficulty) {
    switch (difficulty) {
        case 'easy':
            rows = 9;
            cols = 9;
            mines = 10;
            break;
        case 'medium':
            rows = 16;
            cols = 16;
            mines = 40;
            break;
        case 'hard':
            rows = 16;
            cols = 30;
            mines = 99;
            break;
    }
}

function initGame() {
    gameOver = false;
    flagCount = 0;
    board = createBoard();
    placeMines();
    renderBoard();
    updateMinesLeft();
    backgroundMusic.play();
}

function createBoard() {
    const newBoard = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push({ isMine: false, isRevealed: false, isFlagged: false, neighbors: 0 });
        }
        newBoard.push(row);
    }
    return newBoard;
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
            updateNeighbors(row, col);
        }
    }
}

function updateNeighbors(row, col) {
    for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, rows - 1); i++) {
        for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, cols - 1); j++) {
            if (!board[i][j].isMine) {
                board[i][j].neighbors++;
            }
        }
    }
}

function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j].isRevealed) {
                cell.classList.add('revealed');
                if (board[i][j].isMine) {
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                } else {
                    cell.textContent = board[i][j].neighbors || '';
                }
            } else if (board[i][j].isFlagged) {
                cell.textContent = '🚩';
            }
            cell.addEventListener('click', () => handleCellClick(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(i, j);
            });
            gameBoard.appendChild(cell);
        }
    }
}

function handleCellClick(row, col) {
    if (gameOver || board[row][col].isFlagged) return;

    if (board[row][col].isMine) {
        gameOver = true;
        revealMines();
        backgroundMusic.pause();
        alert('游戏结束!');
    } else {
        revealCell(row, col);
        checkWin();
    }
}

function handleRightClick(row, col) {
    if (gameOver || board[row][col].isRevealed) return;

    board[row][col].isFlagged = !board[row][col].isFlagged;
    flagCount += board[row][col].isFlagged ? 1 : -1;
    updateMinesLeft();
    renderBoard();
}

function revealCell(row, col) {
    if (!board[row][col].isRevealed) {
        board[row][col].isRevealed = true;
        if (board[row][