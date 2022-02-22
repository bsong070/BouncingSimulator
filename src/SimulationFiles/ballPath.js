let ballPath = (
  board,
  ballPositionCol,
  ballPositionRow,
  targetPositionCol,
  targetPositionRow,
  gravity,
  wind,
  frame,
  velocityX,
  velocityY
) => {
  //   board.length 20
  //   board[0].length 40
  let pathHistory = [];
  let time = 1;

  ballPositionCol = parseInt(ballPositionCol);
  ballPositionRow = parseInt(ballPositionRow);
  targetPositionCol = parseInt(targetPositionCol);
  targetPositionRow = parseInt(targetPositionRow);
  gravity = parseInt(gravity);
  wind = parseInt(wind);
  frame = parseInt(frame);
  velocityX = parseInt(velocityX);
  velocityY = parseInt(velocityY);

  // while (
  //     (Math.round(ballPositionRow) != targetPositionRow ||
  //         Math.round(ballPositionCol) != targetPositionCol) &&
  //     (Math.round(ballPositionCol) > 0 ||
  //         Math.round(ballPositionCol) < board.length - 1 ||
  //         Math.round(ballPositionRow) > 0 ||
  //         Math.round(ballPositionRow) < board[0].length - 1 // may need to change
  //     ) &&
  //     time <= frame
  // ) {
  while (
    (Math.round(ballPositionRow) != targetPositionRow ||
      Math.round(ballPositionCol) != targetPositionCol) &&
    (Math.round(ballPositionCol) > 0 ||
      Math.round(ballPositionCol) < board.length - 1 ||
      Math.round(ballPositionRow) > 0 ||
      Math.round(ballPositionRow) < board[0].length - 1) && // may need to change
    time <= frame
  ) {
    console.log(
      "vx:",
      velocityX,
      "vy:",
      velocityY,
      "dx:",
      ballPositionCol,
      "dy:",
      ballPositionRow
    );

    let initialBallPositionCol = ballPositionCol;
    let initialBallPositionRow = ballPositionRow;

    ballPositionRow = position(
      initialBallPositionRow,
      velocityY,
      gravity,
      time
    );
    ballPositionCol = position(initialBallPositionCol, velocityX, wind, time);

    //check for out of bounds and end if true

    if (
      Math.round(ballPositionCol) < 0 ||
      Math.round(ballPositionCol) > board.length - 1 ||
      Math.round(ballPositionRow) < 0 ||
      Math.round(ballPositionRow) > board[0].length - 1 // may need to change
    )
      time = frame;

    let isOutOfBound = false;

    // temp holder, need to determine if ball went out of bounds, if yes need to calculate new velocity else keep temp

    let velocityYNoWall = velocityFinalWithTime(velocityY, gravity, time);

    let velocityXNoWall = velocityFinalWithTime(velocityX, wind, time);

    [ballPositionCol, ballPositionRow, velocityX, velocityY, isOutOfBound] =
      velocityAfterWall(
        board,
        Math.round(initialBallPositionCol),
        Math.round(initialBallPositionRow),
        Math.round(ballPositionCol), // need whole numbers for cell properties
        Math.round(ballPositionRow),
        velocityX,
        velocityY,
        velocityXNoWall,
        velocityYNoWall,
        gravity,
        wind
      );

    console.log(
      "vx final:",
      velocityX,
      "vy final:",
      velocityY,
      "dx final:",
      ballPositionCol,
      "dy final",
      ballPositionRow
    );
    console.log("outofbound:", isOutOfBound);

    // use distance formula to determine velocity final, CANNOT be dependent on time else use velocity from time

    // if (wasAtWall) {
    //     velocityX = (tempVelocityX, gravity, ballPositionCol, ballPositionX)
    //     velocityY = (tempVelocityY, wind, ballPositionRow, ballPositionY)

    // } else {
    //     velocityX = velocityXNoWall;
    //     velocityY = velocityYNoWall;
    // }
    // ballPositionCol = ballPositionX;
    // ballPositionRow = ballPositionY;

    if (isOutOfBound) return pathHistory;

    // [velocityX, velocityY] = velocityAfterWall(
    //     board,
    //     Math.round(ballPositionCol), // need whole numbers for cell properties
    //     Math.round(ballPositionRow),
    //     velocityX,
    //     velocityY
    // );
    board[Math.round(ballPositionRow)][
      Math.round(ballPositionCol)
    ].isBall = true;
    pathHistory.push(
      board[Math.round(ballPositionRow)][Math.round(ballPositionCol)]
    );
    time++;
    console.log(pathHistory);
  }
  return pathHistory;
};

let velocityAfterWall = (
  board,
  initialBallPositionX,
  initialBallPositionY,
  ballPositionX,
  ballPositionY,
  velocityX,
  velocityY,
  velocityXNoWall,
  velocityYNoWall,
  gravity,
  wind
) => {
  let isOutOfBound = true;
  if (
    ballPositionY >= board[0].length ||
    ballPositionX >= board.length ||
    ballPositionY < 0 ||
    ballPositionX < 0
  ) {
    console.log("left board");

    return [
      ballPositionX,
      ballPositionY,
      velocityXNoWall,
      velocityYNoWall,
      isOutOfBound,
    ];
  }
  // if leaves the board, end

  //*** in this board, right / down are positive, up / left are negative ***
  if (board[ballPositionY][ballPositionX].isWall) {
    // will use this in the edge case the ball jumps over a wall
    // see case 10
    let absDeltaPosX = Math.abs(ballPositionX - initialBallPositionX);
    let absDeltaPosY = Math.abs(ballPositionY - initialBallPositionY);
    let maxDelta = Math.max(absDeltaPosX, absDeltaPosY);

    for (let i = maxDelta; i > 0; i--) {
      console.log(Math.round(ballPositionX / i), Math.round(ballPositionY / i));
      if (
        board[Math.round(ballPositionY / i)][Math.round(ballPositionX / i)]
          .isWall
      ) {
        ballPositionY = Math.round(ballPositionY / i);
        ballPositionX = Math.round(ballPositionX / i);
      }
    }

    //Case 1: (-x, +y) (bottom-left)
    if (velocityX < 0 && velocityY > 0) {
      console.log("case 1");
      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX += 1;
        ballPositionY -= 1;
      }
      if (
        board[ballPositionY][ballPositionX - 1].isWall &&
        board[ballPositionY + 1][ballPositionX].isWall
      ) {
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      } else if (board[ballPositionY][ballPositionX - 1].isWall)
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      else
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
    }
    //Case 2: (+x, +y) (bottom-right)
    else if (velocityX > 0 && velocityY > 0) {
      console.log("case 2");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
        ballPositionY -= 1;
      }
      if (board.isWall && board[ballPositionY + 1][ballPositionX].isWall) {
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      } else if (board[ballPositionY][ballPositionX + 1].isWall)
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      else
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
    }
    //Case 3: (+x, -y) (top-right)
    else if (velocityX > 0 && velocityY < 0) {
      console.log("case 3");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
        ballPositionY += 1;
      }
      if (
        board[ballPositionY][ballPositionX + 1].isWall &&
        board[ballPositionY - 1][ballPositionX].isWall
      ) {
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      } else if (board[ballPositionY][ballPositionX + 1].isWall)
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      else
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
    }

    //Case 4: (-x, -y) (top-left)
    else if (velocityX < 0 && velocityY < 0) {
      console.log("case 4");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX += 1;
        ballPositionY += 1;
      }
      if (
        board[ballPositionY][ballPositionX - 1].isWall &&
        board[ballPositionY - 1][ballPositionX].isWall
      ) {
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      } else if (board[ballPositionY][ballPositionX - 1].isWall)
        velocityY = -velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY
        );
      else
        velocityX = -velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX
        );
    }
    //Case 5: (+x, 0) (right)
    else if (velocityX > 0 && velocityY == 0) {
      console.log("case 5");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
      }
      velocityX = -velocityFinal(
        velocityX,
        gravity,
        initialBallPositionX,
        ballPositionX
      );
    }
    //Case 6: (-x, 0) (left)
    else if (velocityX < 0 && velocityY == 0) {
      console.log("case 6");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX += 1;
      }
      velocityX = -velocityFinal(
        velocityX,
        gravity,
        initialBallPositionX,
        ballPositionX
      );
    }
    //Case 7: (0, +y) (down)
    else if (velocityX == 0 && velocityY >= 0) {
      console.log("case 7");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionY -= 1;
      }
      velocityY = -velocityFinal(
        velocityY,
        wind,
        initialBallPositionY,
        ballPositionY
      );
    }
    //Case 8: (0, -y) (up)
    else if (velocityX == 0 && velocityY < 0) {
      console.log("case 8");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionY += 1;
      }
      velocityY = -velocityFinal(
        velocityY,
        wind,
        initialBallPositionY,
        ballPositionY
      );
    }
  }
  isOutOfBound = false;
  return [ballPositionX, ballPositionY, velocityX, velocityY, isOutOfBound];
};

let velocityFinalWithTime = (initialVelocity, acceleration, time) => {
  //assume delta time is 1 as each frame is 1 second

  return initialVelocity + acceleration;
  // * time;
};

let position = (initialPosition, initialVelocity, acceleration, time) => {
  return (
    //assume delta time is 1 as each frame is 1 second
    initialPosition +
    initialVelocity +
    // * time
    (1 / 2) * acceleration
    //  * time ** 2
  );
};

let velocityFinal = (
  initialVelocity,
  acceleration,
  initialPosition,
  finalPosition
) => {
  return velocityFinal > 0
    ? Math.sqrt(
        initialVelocity ** 2 +
          2 * acceleration * (finalPosition - initialPosition)
      )
    : -Math.sqrt(
        initialVelocity ** 2 +
          2 * acceleration * (finalPosition - initialPosition)
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
