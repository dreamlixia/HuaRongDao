// 初始化 4x4 华容道的初始状态，默认 4*4
let difficulty = '4*4';

// 根据难度初始化面板
function initBoard() {
    if (difficulty === '3*3') {
        return [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, null]
        ];
    } else {
        return [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10, 11, 12],
            [13, 14, 15, null]
        ];
    }
}

let board = initBoard();
const initialBoard = JSON.parse(JSON.stringify(board));

// 每个方块对应的背景位置
function initBackgroundPositions() {
    if (difficulty === '3*3') {
        return [
            '0 0', '50% 0', '100% 0',
            '0 50%', '50% 50%', '100% 50%',
            '0 100%', '50% 100%', '100% 100%'
        ];
    } else {
        return [
            '0 0', '33.33% 0', '66.66% 0', '100% 0',
            '0 33.33%', '33.33% 33.33%', '66.66% 33.33%', '100% 33.33%',
            '0 66.66%', '33.33% 66.66%', '66.66% 66.66%', '100% 66.66%',
            '0 100%', '33.33% 100%', '66.66% 100%', '100% 100%'
        ];
    }
}

let backgroundPositions = initBackgroundPositions();

// 打乱棋盘
function shuffleBoard() {
    const flatBoard = board.flat();
    const size = difficulty === '3*3' ? 3 : 4;
    for (let i = flatBoard.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flatBoard[i], flatBoard[j]] = [flatBoard[j], flatBoard[i]];
    }
    // 将一维数组重新转换为二维数组
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            board[i][j] = flatBoard[i * size + j];
        }
    }
}

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
    // 根据难度设置网格样式
    // const size = difficulty === '3x3' ? 3 : 4;
    // const gridColumns = size;
    // const gridRows = size;
    // puzzle.style.setProperty('--grid-columns', gridColumns);
    // puzzle.style.setProperty('--grid-rows', gridRows);
}

// 初始化渲染
shuffleBoard(); // 打乱棋盘
renderBoard(); // 渲染打乱后的棋盘

// 找到空白方块的位置
function findEmptyTile() {
    const size = difficulty === '3x3' ? 3 : 4;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
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

// 测试通关函数
function testWin() {
    const size = difficulty === '3x3' ? 3 : 4;
    const completeBoard = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, null]
    ];
    for (let i = 0; i < size; i++) { // 4 的情况
        for (let j = 0; j < size; j++) {
            board[i][j] = completeBoard[i][j];
        }
    }
    renderBoard();
    playConfetti();
}

// 播放礼花绽放效果
function playConfetti() {
    const confetti = window.confetti;
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// 重置棋盘
function resetBoard() {
    board = initBoard();
    backgroundPositions = initBackgroundPositions();
    shuffleBoard(); // 打乱棋盘
    renderBoard();
}

// 处理难度选择变化
// function handleDifficultyChange() {
//     const select = document.getElementById('difficulty');
//     difficulty = select.value;
//     resetBoard();
// }

// 初始化渲染
renderBoard();

// 绑定按钮事件
document.getElementById('reset-button').addEventListener('click', resetBoard);
document.getElementById('test-win-button').addEventListener('click', testWin);
// document.getElementById('difficulty').addEventListener('change', handleDifficultyChange);