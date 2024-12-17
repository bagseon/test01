const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFCD33', '#33FFF5', '#F533FF'];

let currentBlock = createBlock();
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
let gameOver = false;

document.addEventListener('keydown', handleKeyPress);

function createBlock() {
    const type = Math.floor(Math.random() * 7);
    const color = colors[type];
    const blockShapes = [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }], // I
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }], // O
        [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], // S
        [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: 2, y: 1 }], // Z
        [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], // T
        [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], // L
        [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]  // J
    ];
    const block = blockShapes[Math.floor(Math.random() * blockShapes.length)];
    return { type, color, block, x: 4, y: 0 };
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) {
                drawBlock(col, row, board[row][col]);
            }
        }
    }
}

function drawBlock(x, y, color) {
    const gradient = ctx.createLinearGradient(x * BLOCK_SIZE, y * BLOCK_SIZE, (x + 1) * BLOCK_SIZE, (y + 1) * BLOCK_SIZE);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBlockShape() {
    currentBlock.block.forEach(block => {
        drawBlock(currentBlock.x + block.x, currentBlock.y + block.y, currentBlock.color);
    });
}

function moveBlock() {
    currentBlock.y++;
    if (checkCollision()) {
        currentBlock.y--;
        placeBlock();
        checkFullLines();
        currentBlock = createBlock();
        if (checkGameOver()) {
            alert("게임 오버!");
            gameOver = true;
        }
    }
}

function placeBlock() {
    currentBlock.block.forEach(block => {
        board[currentBlock.y + block.y][currentBlock.x + block.x] = currentBlock.color;
    });
}

function checkCollision() {
    return currentBlock.block.some(block => {
        const newX = currentBlock.x + block.x;
        const newY = currentBlock.y + block.y;
        return newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && board[newY][newX]);
    });
}

function rotateBlock() {
    const newBlock = currentBlock.block.map(b => ({ x: -b.y, y: b.x }));
    const originalBlock = currentBlock.block;
    currentBlock.block = newBlock;
    if (checkCollision()) {
        currentBlock.block = originalBlock;
    }
}

function handleKeyPress(event) {
    if (gameOver) return;

    if (event.key === 'w') {
        rotateBlock();
    } else if (event.key === 'a') {
        currentBlock.x--;
        if (checkCollision()) {
            currentBlock.x++;
        }
    } else if (event.key === 'd') {
        currentBlock.x++;
        if (checkCollision()) {
            currentBlock.x--;
        }
    } else if (event.key === 's') {
        moveBlock();
    }
}

function checkFullLines() {
    for (let row = 0; row < ROWS; row++) {
        if (board[row].every(cell => cell !== null)) {
            board.splice(row, 1);  // 행 삭제
            board.unshift(Array(COLS).fill(null));  // 새로운 빈 행 추가
        }
    }
}

function checkGameOver() {
    return currentBlock.block.some(block => {
        const newY = currentBlock.y + block.y;
        return newY < 0;  // 블록이 상단에 닿으면 게임 오버
    });
}

function gameLoop() {
    if (gameOver) return;

    drawBoard();
    drawBlockShape();
    moveBlock();
    setTimeout(gameLoop, 500);
}

gameLoop();
