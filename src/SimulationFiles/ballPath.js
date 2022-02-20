let ballPath = (
  board,
  ballPosition,
  targetPosition,
  gravity,
  wind,
  frame,
  angle,
  velocity
) => {
  //   board.length 20
  //   board[0].length 40
  let pathHistory = [];
  let velocityRow = velocity * Math.cos(angle);
  let velocityCol = velocity * Math.sin(angle);
  let time = 1;

  while (
    (ballPosition.row != targetPosition.row ||
      ballPosition.col != targetPosition.col) &&
    time <= frame
  ) {
    ballPosition.row = position(
      ballPosition.row,
      velocity,
      angle,
      wind,
      time,
      true
    );
    ballPosition.col = position(
      ballPosition.col,
      velocity,
      angle,
      gravity,
      time,
      true
    );

    velocityRow = velocityFinal(
      ballPosition.row,
      velocity,
      angle,
      wind,
      time,
      true
    );

    velocityCol = velocityFinal(
      ballPosition.col,
      velocity,
      angle,
      gravity,
      time,
      false
    );

    velocityAfterWall(
      board,
      ballPosition.col,
      ballPosition.row,
      velocityCol,
      velocityRow
    );

    // else if (
    //   (ballPosition.row > board.length * 2 ||
    //     ballPosition.col > board[0].length ||
    //     ballPosition.row < 0 ||
    //     ballPosition.col < 0) &&
    // board[ballPosition.col][ballPosition.row].isWall {
    // }

    board[ballPosition.col][ballPosition.row].isBall = true;
    pathHistory.push(board[ballPosition.col][ballPosition.row]);
    time++;
  }
  return pathHistory;
};

let velocityAfterWall = (
  board,
  ballPositionX,
  ballPositionY,
  velocityCol,
  velocityRow
) => {
  if (
    (ballPositionY > board.length * 2 ||
      ballPositionX > board[0].length ||
      ballPositionY < 0 ||
      ballPositionX < 0) &&
    !board[ballPositionX][ballPositionY].isWall
  )
    // if leaves the board, end
    return;
  //*** in this board, right / down are positive, up / left are negative ***
  if (board[ballPositionX][ballPositionY].isWall) {
    //Case 1: (-x, +y) (bottom-left)
    if (velocityCol <= 0 && velocityRow >= 0) {
      while (board[ballPositionX][ballPositionY].isWall) {
        ballPositionX += 1;
        ballPositionY -= 1;
      }
      if (
        board[ballPositionX - 1][ballPositionY].isWall &&
        board[ballPositionX][ballPositionY + 1].isWall
      ) {
        velocityCol = -velocityCol;
        velocityRow = -velocityRow;
      } else if (board[ballPositionX - 1][ballPositionY].isWall)
        velocityRow = -velocityRow;
      else velocityCol = -velocityCol;
    }
    //Case 2: (+x, +y) (bottom-right)
    else if (velocityCol >= 0 && velocityRow >= 0) {
      while (board[ballPositionX][ballPositionY].isWall) {
        ballPositionX -= 1;
        ballPositionY -= 1;
      }
      if (
        board[ballPositionX + 1][ballPositionY].isWall &&
        board[ballPositionX][ballPositionY + 1].isWall
      ) {
        velocityCol = -velocityCol;
        velocityRow = -velocityRow;
      } else if (board[ballPositionX + 1][ballPositionY].isWall)
        velocityRow = -velocityRow;
      else velocityCol = -velocityCol;
    }
    //Case 3: (+x, -y) (top-right)
    else if (velocityCol >= 0 && velocityRow <= 0) {
      while (board[ballPositionX][ballPositionY].isWall) {
        ballPositionX -= 1;
        ballPositionY += 1;
      }
      if (
        board[ballPositionX + 1][ballPositionY].isWall &&
        board[ballPositionX][ballPositionY - 1].isWall
      ) {
        velocityCol = -velocityCol;
        velocityRow = -velocityRow;
      } else if (board[ballPositionX + 1][ballPositionY].isWall)
        velocityRow = -velocityRow;
      else velocityCol = -velocityCol;
    }
    //Case 4: (-x, -y) (top-left)
    else if (velocityCol <= 0 && velocityRow <= 0) {
      while (board[ballPositionX][ballPositionY].isWall) {
        ballPositionX += 1;
        ballPositionY += 1;
      }
      if (
        board[ballPositionX - 1][ballPositionY].isWall &&
        board[ballPositionX][ballPositionY - 1].isWall
      ) {
        velocityCol = -velocityCol;
        velocityRow = -velocityRow;
      } else if (board[ballPositionX - 1][ballPositionY].isWall)
        velocityRow = -velocityRow;
      else velocityCol = -velocityCol;
    }
  }
  return { velocityCol: velocityCol, velocityRow: velocityRow };
};

let velocityFinal = (initialVelocity, acceleration, time) => {
  return initialVelocity + acceleration * time;
};

let position = (initialPosition, initialVelocity, acceleration, time) => {
  return (
    initialPosition +
    initialVelocity * time +
    (1 / 2) * acceleration * time ** 2
  );
};

// let velocityFinal = (initialVelocity, angle, acceleration, time, isX) => {
//   return isX
//     ? initialVelocity * Math.cos(angle) + acceleration * time
//     : initialVelocity * Math.sin(angle) + acceleration * time;
// };

// let position = (
//   initialPosition,
//   initialVelocity,
//   angle,
//   acceleration,
//   time,
//   isX
// ) => {
//   return isX
//     ? initialPosition +
//         initialVelocity * Math.cos(angle) * time +
//         (1 / 2) * acceleration * time ** 2
//     : initialPosition +
//         initialVelocity * Math.sin(angle) * time +
//         (1 / 2) * acceleration * time ** 2;
// };

export default ballPath;
