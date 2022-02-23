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
  velocityY,
  startAboveWall // will be used to set velocity y to 0 or not
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
        wind,
        startAboveWall
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
    // console.log("outofbound:", isOutOfBound);

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

let findClosestNonWall = (
  board,
  initialBallPositionX,
  initialBallPositionY,
  ballPositionX,
  ballPositionY
) => {
  // will use this in the edge case the ball jumps over a wall
  // see case 10
  let absDeltaPosX = Math.abs(ballPositionX - initialBallPositionX);
  let absDeltaPosY = Math.abs(ballPositionY - initialBallPositionY);
  let maxDelta = Math.max(absDeltaPosX, absDeltaPosY);

  // need for reference to final position without wall to use to calculate new position, if wall
  let tempBallPositionX = ballPositionX;
  let tempBallPositionY = ballPositionY;

  // will iterate from final position to initial position
  for (let i = 1; i < maxDelta; i++) {
    console.log(initialBallPositionX, initialBallPositionY);
    console.log(
      "X:",
      Math.round(initialBallPositionX + absDeltaPosX / i),
      "Y:",
      Math.round(initialBallPositionY + absDeltaPosY / i)
    );

    try {
      if (
        board[Math.round(initialBallPositionY + absDeltaPosY / i)][
          Math.round(initialBallPositionX + absDeltaPosX / i)
        ].isWall
      ) {
        ballPositionY = Math.round(
          initialBallPositionY + absDeltaPosY / (i + 1)
        );
        ballPositionX = Math.round(
          initialBallPositionX + absDeltaPosX / (i + 1)
        );

        console.log("try X:", ballPositionX, "Y:", ballPositionY);
      }
    } catch (error) {
      if (
        board[Math.round(initialBallPositionY + absDeltaPosY / i)][
          Math.round(initialBallPositionX + absDeltaPosX / i)
        ].isWall
      ) {
        ballPositionY = Math.round(
          initialBallPositionY + absDeltaPosY / (i + 1)
        );
        ballPositionX = Math.round(
          initialBallPositionX + absDeltaPosX / (i + 1)
        );
        console.log(" catch X:", ballPositionX, "Y:", ballPositionY);
      }
    } finally {
      if (
        i == maxDelta - 1 &&
        board[Math.round(initialBallPositionY + absDeltaPosY / i)][
          Math.round(initialBallPositionY + absDeltaPosY / i)
        ].isWall
      ) {
        return [initialBallPositionX, initialBallPositionY];
      }

      console.log(
        "finally X:",
        ballPositionX,
        "Y:",
        ballPositionY,
        "initial y:",
        initialBallPositionY
      );
    }
  }
  // last check to avoid out of bounds
  if (
    ballPositionX < 0 ||
    ballPositionX >= board.length ||
    ballPositionY < 0 ||
    ballPositionY >= board[0].length
  ) {
    ballPositionX = initialBallPositionX;
    ballPositionY = initialBallPositionY;
  }
  return [ballPositionX, ballPositionY];
};

// let findClosestNonWall = (
//   board,
//   initialBallPositionX,
//   initialBallPositionY,
//   ballPositionX,
//   ballPositionY
// ) => {
//   // will use this in the edge case the ball jumps over a wall
//   // see case 10
//   let absDeltaPosX = Math.abs(ballPositionX - initialBallPositionX);
//   let absDeltaPosY = Math.abs(ballPositionY - initialBallPositionY);
//   let maxDelta = Math.max(absDeltaPosX, absDeltaPosY);

//   for (let i = maxDelta; i > 0; i--) {
//     if (
//       board[Math.round(ballPositionY / i)][Math.round(ballPositionX / i)].isWall
//     ) {
//       ballPositionY = Math.round(ballPositionY / i);
//       ballPositionX = Math.round(ballPositionX / i);
//     }
//   }
//   return [ballPositionX, ballPositionY];
// };

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
  wind,
  startAboveWall
) => {
  let isOutOfBound;
  // if (
  //   ballPositionY >= board[0].length ||
  //   ballPositionX >= board.length ||
  //   ballPositionY < 0 ||
  //   ballPositionX < 0
  // ) {
  //   console.log("left board");
  //   isOutOfBound = true;

  //   return [
  //     ballPositionX,
  //     ballPositionY,
  //     velocityXNoWall,
  //     velocityYNoWall,
  //     isOutOfBound,
  //   ];
  // }
  // if leaves the board, end

  // will use this in the edge case the ball jumps over a wall
  // see case 10
  [ballPositionX, ballPositionY] = findClosestNonWall(
    board,
    initialBallPositionX,
    initialBallPositionY,
    ballPositionX,
    ballPositionY
  );

  //*** in this board, right / down are positive, up / left are negative ***
  if (board[ballPositionY][ballPositionX].isWall) {
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
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else if (board[ballPositionY][ballPositionX - 1].isWall) {
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
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
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else if (board[ballPositionY][ballPositionX + 1].isWall) {
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
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
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else if (board[ballPositionY][ballPositionX + 1].isWall) {
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
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
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else if (board[ballPositionY][ballPositionX - 1].isWall) {
        velocityY =
          -0.8 *
          velocityFinal(
            velocityY,
            wind,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            gravity,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
    }
    //Case 5: (+x, 0) (right) and gravity == 0
    else if (velocityX > 0 && velocityY == 0 && gravity == 0) {
      console.log("case 5");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
      }
      velocityX =
        -0.8 *
        velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX,
          false,
          startAboveWall
        ); // goes correct direction without -
      velocityY =
        -0.8 *
        velocityFinal(
          velocityY,
          gravity,
          initialBallPositionY,
          ballPositionY,
          true,
          startAboveWall
        );
    }
    //Case 6: (-x, 0) (left)
    else if (velocityX < 0 && velocityY == 0 && gravity == 0) {
      // working, add wind or gravity or wall?
      console.log("case 6");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX += 1;
      }
      velocityX =
        0.8 *
        velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX,
          false,
          startAboveWall
        );
    }
    //Case 7: (0, +y) (down)
    else if (velocityX == 0 && velocityY >= 0) {
      console.log("case 7");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionY -= 1;
      }
      velocityY =
        -0.8 *
        velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY,
          true,
          startAboveWall
        );
    }
    //Case 8: (0, -y) (up)
    else if (velocityX == 0 && velocityY < 0) {
      console.log("case 8");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionY += 1;
      }
      velocityY =
        0.8 *
        velocityFinal(
          velocityY,
          wind,
          initialBallPositionY,
          ballPositionY,
          true,
          startAboveWall
        );
    }
    //Case 9: (+x, 0) (right) and gravity != 0
    else if (velocityX > 0 && velocityY == 0) {
      console.log("case 9");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
        ballPositionY -= 1; //new
      }
      velocityX =
        -0.8 *
        velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX,
          false,
          startAboveWall
        ); // goes correct direction without -
      velocityY =
        -0.8 *
        velocityFinal(
          velocityY,
          gravity,
          initialBallPositionY,
          ballPositionY,
          true,
          startAboveWall
        );
    }
    //Case 10: (-x, 0) (left) and gravity != 0
    else if (velocityX < 0 && velocityY == 0) {
      // working, add wind or gravity or wall?
      console.log("case 10");
      console.log(velocityX);

      while (board[ballPositionY][ballPositionX].isWall) {
        // ballPositionX += 1;
        ballPositionY -= 1;
      }
      velocityX =
        0.8 *
        velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX,
          false,
          startAboveWall
        );
      velocityY =
        -0.8 *
        velocityFinal(
          velocityY,
          gravity,
          initialBallPositionY,
          ballPositionY,
          true,
          startAboveWall
        );
    }
  }
  isOutOfBound = false;
  return [ballPositionX, ballPositionY, velocityX, velocityY, isOutOfBound];
};

let velocityFinalWithTime = (
  initialVelocity,
  acceleration,
  time,
  isY,
  startAboveWall
) => {
  //assume delta time is 1 as each frame is 1 second

  return isY && startAboveWall ? 0 : initialVelocity + acceleration;
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
  finalPosition,
  isY,
  startAboveWall
) => {
  return isY && startAboveWall
    ? 0
    : Math.sqrt(
        Math.abs(
          initialVelocity ** 2 +
            2 * acceleration * (finalPosition - initialPosition)
        )
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
