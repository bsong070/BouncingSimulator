let ballPath = (board, ballPosition, targetPosition, gravity, wind) => {
  //   board.length 20
  //   board[0].length 40
  console.log(ballPosition);
  while (
    ballPosition.row != targetPosition.row ||
    ballPosition.col != targetPosition.col
  ) {
    if (
      ballPosition.row > board.length * 2 ||
      ballPosition.col > board[0].length ||
      ballPosition.row < 0 ||
      ballPosition.col < 0
    ) {
      break;
    }
    ballPosition.row -= gravity;
    ballPosition.col -= wind;

    console.log(ballPosition);
  }
};

export default ballPath;
