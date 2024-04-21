const board = document.querySelector('.board');
const minesLeft = document.querySelector('.mines-left');
const timer = document.querySelector('.timer');
const resetBtn = document.querySelector('.reset-btn');

const rows = 9;
const cols = 9;
const mines = 10;

let gameOver = false;
let flagCount = 0;
let startTime;
let intervalId;

// 初始化游戏
function initGame() {
    createBoard();
    placeMines();
    updateMinesLeft();
    resetTimer();
    gameOver = false;
    flagCount = 0;
}

// 创建游戏板
function createBoard() {
    board.innerHTML = '';
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('contextmenu', handleRightClick);
        board.appendChild(cell);
    }
}

// 放置雷
function placeMines() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        const cell = cells[randomIndex];
        if (!cell.classList.contains('mine')) {
            cell.classList.add('mine');
            minesPlaced++;
        }
    }
}

// 更新剩余雷数
function updateMinesLeft() {
    minesLeft.textContent = `剩余雷数: ${mines - flagCount}`;
}

// 重置计时器
function resetTimer() {
    clearInterval(intervalId);
    timer.textContent = '时间: 0';
    startTime = null;
}

// 开始计时
function startTimer() {
    if (!startTime) {
        startTime = new Date().getTime();
        intervalId = setInterval(() => {
            const elapsedTime = new Date().getTime() - startTime;
            const seconds = Math.floor(elapsedTime / 1000);
            timer.textContent = `时间: ${seconds}`;
        }, 1000);
    }
}

// 处理单元格点击事件
function handleCellClick(e) {
    if (gameOver) return;
    const cell = e.target;
    if (cell.classList.contains('revealed') || cell.classList.contains('flag')) return;

    if (!startTime) {
        startTimer();
    }

    if (cell.classList.contains('mine')) {
        gameOver = true;
        revealMines();
        alert('游戏结束!');
    } else {
        revealCell(cell);
        checkWin();
    }
}

// 处理右键点击事件
function handleRightClick(e) {
    e.preventDefault();
    if (gameOver) return;
    const cell = e.target;
    if (cell.classList.contains('revealed')) return;

    if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        flagCount--;
    } else {
        cell.classList.add('flag');
        flagCount++;
    }
    updateMinesLeft();
}

// 揭开单元格
function revealCell(cell) {
    const row = cell.parentNode.rowIndex;
    const col = Array.from(cell.parentNode.children).indexOf(cell);
    const mineCount = countMines(row, col);
    cell.classList.add('revealed');
    cell.textContent = mineCount > 0 ? mineCount : '';

    if (mineCount === 0) {
        revealEmptyNeighbors(row, col);
    }
}

// 计算周围雷的数量
function countMines(row, col) {
    let count = 0;
    for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, rows - 1); i++) {
        for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, cols - 1); j++) {
            const cell = document.querySelector(`.board > :nth-child(${i * cols + j + 1})`);
            if (cell.classList.contains('mine')) {
                count++;
            }
        }
    }
    return count;
}

// 揭开空白单元格周围的所有空白单元格
function revealEmptyNeighbors(row, col) {
    for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, rows - 1); i++) {
        for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, cols - 1); j++) {
            const cell = document.querySelector(`.board > :nth-child(${i * cols + j + 1})`);
            if (!cell.classList.contains('revealed') && !cell.classList.contains('mine')) {