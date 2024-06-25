document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset-button");
    const turnIndicator = document.getElementById("current-player");
    const pvpModeRadio = document.getElementById("pvp-mode");
    const pvaModeRadio = document.getElementById("pva-mode");

    let currentPlayer = "X";
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];
    let isGameActive = true;
    let isAgainstAI = false;
    const human = "X";
    const ai = "O";

    const scores = {
        X: 10,
        O: -10,
        tie: 0
    };

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    pvpModeRadio.addEventListener("change", () => {
        isAgainstAI = false;
        resetGame();
    });

    pvaModeRadio.addEventListener("change", () => {
        isAgainstAI = true;
        resetGame();
    });

    cells.forEach(cell => {
        cell.addEventListener("click", handleCellClick);
    });

    resetButton.addEventListener("click", resetGame);

    function handleCellClick(event) {
        const cell = event.target;
        const index = cell.getAttribute("data-index");
        const rowIndex = Math.floor(index / 3);
        const colIndex = index % 3;

        if (board[rowIndex][colIndex] !== "" || !isGameActive) {
            return;
        }

        updateCell(cell, rowIndex, colIndex);
        checkForWinner();

        if (isGameActive && isAgainstAI && currentPlayer === ai) {
            setTimeout(makeAIMove, 200); 
        }
    }

    function updateCell(cell, rowIndex, colIndex) {
        board[rowIndex][colIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add("active");
        if (currentPlayer === ai) {
            cell.classList.add("opponent");
        }
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        turnIndicator.textContent = currentPlayer;
        if (isAgainstAI && currentPlayer === ai) {
            turnIndicator.style.color = "red"; 
        } else {
            turnIndicator.style.color = "#333";
        }
    }

    function checkForWinner() {
        let winner = checkWinner();
        if (winner) {
            isGameActive = false;
            if (winner === "tie") {
                setTimeout(() => alert("It's a Tie!"), 10);
            } else {
                setTimeout(() => alert(`Player ${winner} Wins!`), 10);
            }
        }
    }

    function checkWinner() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            const [rowA, colA] = [Math.floor(a / 3), a % 3];
            const [rowB, colB] = [Math.floor(b / 3), b % 3];
            const [rowC, colC] = [Math.floor(c / 3), c % 3];

            if (board[rowA][colA] && board[rowA][colA] === board[rowB][colB] && board[rowA][colA] === board[rowC][colC]) {
                return board[rowA][colA];
            }
        }

        if (board.flat().every(cell => cell !== "")) {
            return "tie";
        }

        return null;
    }

    function resetGame() {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("active", "opponent");
        });
        currentPlayer = "X";
        isGameActive = true;
        turnIndicator.textContent = currentPlayer;
        turnIndicator.style.color = "#333"; 
    }

    function makeAIMove() {
        const { i, j } = bestMove();
        const cellIndex = i * 3 + j;
        const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
        updateCell(cell, i, j);
        checkForWinner();
    }

    function bestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    board[i][j] = ai;
                    let score = minimax(board, 0, false);
                    board[i][j] = "";
                    if (score > bestScore) {
                        bestScore = score;
                        move = { i, j };
                    }
                }
            }
        }
        return move;
    }

    function minimax(board, depth, isMaximizing) {
        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = ai;
                        let score = minimax(board, depth + 1, false);
                        board[i][j] = "";
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (board[i][j] === "") {
                        board[i][j] = human;
                        let score = minimax(board, depth + 1, true);
                        board[i][j] = "";
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }
});
