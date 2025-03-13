// 初始化 4x4 华容道的初始状态
const board = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, null]
];

// 每个方块对应的背景位置
const backgroundPositions = [
    '0 0', '33.33% 0', '66.66% 0', '100% 0',
    '0 33.33%', '33.33% 33.33%', '66.66% 33.33%', '100% 33.33%',
    '0 66.66%', '33.33% 66.66%', '66.66% 66.66%', '100% 66.66%',
    '0 100%', '33.33% 100%', '66.66% 100%', '100% 100%'
];

// 打乱棋盘
function shuffleBoard() {
    const flatBoard = board.flat();
    for (let i = flatBoard.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flatBoard[i], flatBoard[j]] = [flatBoard[j], flatBoard[i]];
    }
    // 将一维数组重新转换为二维数组
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            board[i][j] = flatBoard[i * 4 + j];
        }
    }
}

// 初始化渲染
shuffleBoard(); // 打乱棋盘

// 渲染棋盘
function renderBoard() {
    const puzzle = document.getElementById('puzzle');
    puzzle.innerHTML = '';
    board.forEach((row, i) => {
        row.forEach((tile, j) => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            if (tile === null) {
                tileElement.classList.add('empty');
            } else {
                tileElement.style.backgroundPosition = backgroundPositions[tile - 1];
                tileElement.addEventListener('click', () => handleMove(i, j));
            }
            puzzle.appendChild(tileElement);
        });
    });
}

// 找到空白方块的位置
function findEmptyTile() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === null) {
                return [i, j];
            }
        }
    }
}

// 处理方块的移动
function handleMove(x, y) {
    const [emptyX, emptyY] = findEmptyTile();
    // 检查是否相邻
    if (
        (x === emptyX && Math.abs(y - emptyY) === 1) ||
        (y === emptyY && Math.abs(x - emptyX) === 1)
    ) {
        [board[x][y], board[emptyX][emptyY]] = [board[emptyX][emptyY], board[x][y]];
        renderBoard();
    }
}

// 初始化渲染
renderBoard();