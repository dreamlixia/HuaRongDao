// 初始化棋盘
const initialBoard = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, null]
];
let board = [...initialBoard.map(row => [...row])];

// 背景位置
const backgroundPositions = [
    '0 0', '33.33% 0', '66.66% 0', '100% 0',
    '0 33.33%', '33.33% 33.33%', '66.66% 33.33%', '100% 33.33%',
    '0 66.66%', '33.33% 66.66%', '66.66% 66.66%', '100% 66.66%',
    '0 100%', '33.33% 100%', '66.66% 100%', '100% 100%'
];

// 计算逆序数
function getInversionCount(arr) {
    let invCount = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] && arr[i] && arr[i] > arr[j]) {
                invCount++;
            }
        }
    }
    return invCount;
}

// 检查拼图是否有解
function isSolvable() {
    const flatBoard = board.flat();
    const invCount = getInversionCount(flatBoard);
    const emptyRowFromBottom = 4 - Math.floor(flatBoard.indexOf(null) / 4);
    return (emptyRowFromBottom % 2 === 1) === (invCount % 2 === 0);
}

// 打乱棋盘，直到有解
function shuffleBoard() {
    let isSolved = false;
    while (!isSolved) {
        const flatBoard = board.flat();
        for (let i = flatBoard.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flatBoard[i], flatBoard[j]] = [flatBoard[j], flatBoard[i]];
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                board[i][j] = flatBoard[i * 4 + j];
            }
        }
        isSolved = isSolvable();
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
    if (
        (x === emptyX && Math.abs(y - emptyY) === 1) ||
        (y === emptyY && Math.abs(x - emptyX) === 1)
    ) {
        [board[x][y], board[emptyX][emptyY]] = [board[emptyX][emptyY], board[x][y]];
        renderBoard();
        checkWin();
    }
}

// 检查是否获胜
function checkWin() {
    const flatBoard = board.flat();
    const flatInitialBoard = initialBoard.flat();
    if (JSON.stringify(flatBoard) === JSON.stringify(flatInitialBoard)) {
        playConfetti();
    }
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
    board = [...initialBoard.map(row => [...row])];
    shuffleBoard();
    renderBoard();
}

// 测试通关
function testWin() {
    board = [...initialBoard.map(row => [...row])];
    renderBoard();
    playConfetti();
}

// 初始化渲染
resetBoard();

// 绑定按钮事件
document.getElementById('reset-button').addEventListener('click', resetBoard);
document.getElementById('test-win-button').addEventListener('click', testWin);