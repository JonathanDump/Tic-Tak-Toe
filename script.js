let Gameboard = (() => {
  const board = [];
  const rows = 3;
  const columns = 3;

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let k = 0; k < columns; k++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const setSymbol = (row, column, player) => {
    if (board[row][column].getValue() === "") {
      board[row][column].addSymbol(player);
    }
  };

  const print = () => {
    const boardWithSymbols = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithSymbols);
  };

  const reset = () => {
    board.forEach((row) => row.forEach((cell) => cell.addSymbol("")));
  };

  return {
    getBoard,
    setSymbol,
    print,
    reset,
  };
})();

function Cell() {
  let value = "";

  const addSymbol = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addSymbol,
    getValue,
  };
}

let gameController = (() => {
  const players = [
    {
      name: "Player X",
      token: "x",
    },

    {
      name: "Player O",
      token: "o",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const _switchPlayerTurn = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const printNewRound = () => {
    Gameboard.print();
    console.log(`${activePlayer.name}'s turn`);
  };

  let rounds = 0;

  const getRounds = () => rounds;

  const playRound = (row, column) => {
    Gameboard.setSymbol(row, column, activePlayer.token);
    const winner = getWinner();
    if (winner) {
      Gameboard.print();
      console.log(`The winner is ${winner}`);
      return "win";
      // resetGame();
    } else {
      if (Gameboard.getBoard()[row][column].getValue() !== activePlayer.token) {
        console.log("This cell is taken, choose another one");
      } else {
        _switchPlayerTurn();
        rounds++;
      }
      printNewRound();
    }
    if (rounds === 9) {
      Gameboard.print();
      console.log("It is a Tie");
      return "tie";
      // resetGame();
    }
  };

  const getWinner = () => {
    let boardValues = Gameboard.getBoard();

    let rowX = 0;
    let rowO = 0;

    let colX = 0;
    let colO = 0;

    let diagX = 0;
    let diagO = 0;

    for (let i = 0; i < 3; i++) {
      rowX = 0;
      colX = 0;
      diagX = 0;
      rowO = 0;
      colO = 0;
      diagO = 0;

      for (let k = 0; k < 3; k++) {
        if (boardValues[i][k].getValue() === "x") {
          rowX++;
        } else if (boardValues[i][k].getValue() === "o") {
          rowO++;
        }

        if (rowX === 3 || rowO === 3) {
          return activePlayer.name;
        }

        if (boardValues[k][i].getValue() === "x") {
          colX++;
        } else if (boardValues[k][i].getValue() === "o") {
          colO++;
        }
        if (colX === 3 || colO === 3) {
          return activePlayer.name;
        }
      }
    }
    if (
      (boardValues[0][0].getValue() === "x" &&
        boardValues[1][1].getValue() === "x" &&
        boardValues[2][2].getValue() === "x") ||
      (boardValues[0][0].getValue() === "o" &&
        boardValues[1][1].getValue() === "o" &&
        boardValues[2][2].getValue() === "o")
    ) {
      return activePlayer.name;
    } else if (
      (boardValues[0][2].getValue() === "x" &&
        boardValues[1][1].getValue() === "x" &&
        boardValues[2][0].getValue() === "x") ||
      (boardValues[0][2].getValue() === "o" &&
        boardValues[1][1].getValue() === "o" &&
        boardValues[2][0].getValue() === "o")
    ) {
      return activePlayer.name;
    }
  };

  const resetGame = () => {
    Gameboard.reset();
    rounds = 0;
    activePlayer = players[0];
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getWinner,
    getRounds,
    resetGame,
  };
})();

const DisplayControl = (() => {
  const displayBoard = document.querySelector(".main__board");
  const message = document.querySelector(".main__message");
  const dialogWindow = document.querySelector("dialog");
  const dialogResult = dialogWindow.querySelector(".dialog__result");
  const dialogResetButton = dialogWindow.querySelector(".dialog__reset");
  const displayResetButton = document.querySelector(".main__reset");

  const board = Gameboard.getBoard();

  const createBoard = () => {
    const activePlayer = gameController.getActivePlayer();
    displayBoard.textContent = "";
    board.forEach((row, rowIndex) =>
      row.forEach((cell, columnIndex) => {
        const square = document.createElement("button");
        square.classList.add("cell");
        square.dataset.row = rowIndex;
        square.dataset.column = columnIndex;
        square.textContent = cell.getValue();
        displayBoard.appendChild(square);
      })
    );
    message.textContent = `${activePlayer.name}'s turn`;
  };

  displayBoard.addEventListener("click", (e) => {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (!e.target.classList.contains("cell")) {
      return;
    }

    const result = gameController.playRound(row, column);
    if (result === "win") {
      dialogWindow.showModal();
      dialogWindow.classList.add("dialog");
      dialogResult.textContent = `The winner is ${
        gameController.getActivePlayer().name
      }`;
    } else if (result === "tie") {
      dialogWindow.showModal();
      dialogWindow.classList.add("dialog");
      dialogResult.textContent = "This is a tie";
    }
    createBoard();
  });

  dialogResetButton.addEventListener("click", () => {
    gameController.resetGame();
    dialogWindow.close();
    dialogWindow.classList.remove("dialog");
    createBoard();
  });

  displayResetButton.addEventListener("click", () => {
    gameController.resetGame();
    createBoard();
  });
  createBoard();
})();
