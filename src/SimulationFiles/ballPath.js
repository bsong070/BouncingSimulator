let ballPath = (board, ballPosition, targetPosition, gravity, wind) => {
  //   board.length 20
  //   board[0].length 40
  let pathHistory = [];
  while (
    ballPosition.row != targetPosition.row ||
    ballPosition.col != targetPosition.col
  ) {
    ballPosition.row -= gravity;
    ballPosition.col -= wind;
    if (
      ballPosition.row > board.length * 2 ||
      ballPosition.col > board[0].length ||
      ballPosition.row < 0 ||
      ballPosition.col < 0
    ) {
      break;
    }
    board[ballPosition.col][ballPosition.row].isBall = true;
    pathHistory.push(board[ballPosition.col][ballPosition.row]);
  }
  return pathHistory;
};

export default ballPath;
