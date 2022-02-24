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
  let deltaPosX = ballPositionX - initialBallPositionX;
  let deltaPosY = ballPositionY - initialBallPositionY;
  let maxDelta = Math.max(Math.abs(deltaPosX), Math.max(deltaPosY));

  // will iterate from final position to initial position
  for (let i = 1; i < maxDelta; i++) {
    try {
      if (board[Math.round(ballPositionY)][Math.round(ballPositionX)].isWall) {
        if (deltaPosX > deltaPosY) {
          ballPositionY = Math.round(
            initialBallPositionY + deltaPosY / (i + 1)
          );
          ballPositionX -= deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
        } else if (deltaPosX < deltaPosY) {
          ballPositionX = Math.round(
            initialBallPositionX + deltaPosX / (i + 1)
          );
          ballPositionY -= deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
        } else if (deltaPosX == deltaPosY) {
          ballPositionY -= deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
          ballPositionX -= deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
        }
      }
    } catch (error) {
      if (deltaPosX > deltaPosY) {
        ballPositionY = Math.round(initialBallPositionY + deltaPosY / (i + 1));
        ballPositionX -= deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
      } else if (deltaPosX < deltaPosY) {
        ballPositionX = Math.round(initialBallPositionX + deltaPosX / (i + 1));
        ballPositionY -= deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
      } else if (deltaPosX == deltaPosY) {
        ballPositionY -= deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
        ballPositionX -= deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
      }
    } finally {
      try {
        if (
          i == maxDelta - 1 &&
          board[Math.round(initialBallPositionY + deltaPosY / i)][
            Math.round(initialBallPositionY + deltaPosY / i)
          ].isWall
        ) {
          console.log("finally try");
          return [initialBallPositionX, initialBallPositionY];
        }
      } catch (error) {
        console.log("finally error");
        if (i == maxDelta - 1)
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
  // if (
  //   ballPositionX < 0 ||
  //   ballPositionX >= board.length ||
  //   ballPositionY < 0 ||
  //   ballPositionY >= board[0].length
  // ) {
  //   ballPositionX = initialBallPositionX;
  //   ballPositionY = initialBallPositionY;
  // }
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
  if (
    board[ballPositionY + 1][ballPositionX].isWall ||
    board[ballPositionY - 1][ballPositionX].isWall ||
    board[ballPositionY][ballPositionX + 1].isWall ||
    board[ballPositionY][ballPositionX - 1].isWall ||
    board[ballPositionY + 1][ballPositionX + 1].isWall ||
    board[ballPositionY - 1][ballPositionX - 1].isWall
  ) {
    //Case 1: (-x, +y) (bottom-left)
    if (velocityX < 0 && velocityY > 0) {
      console.log("case 1");
      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX += 1;
        ballPositionY -= 1;
      }
      // bottom left - wall on both left and bottom, bounce and reverse both x y velocity
      // also if wall is diagonal left bottom cell, reverse both
      /***** NOT WORKING JAVASCRIPT BUG ??? only works if a second wall is present*/
      if (
        board[ballPositionY][ballPositionX - 1].isWall &&
        board[ballPositionY + 1][ballPositionX].isWall
      ) {
        velocityX =
          0.8 *
          velocityFinal(
            velocityX,
            wind,
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
      } else if (board[ballPositionY][ballPositionX - 1].isWall) {
        // bottom left - wall on both left only, reverse only x velocity and allow to downfall y
        velocityX =
          0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
      } // bottom left - wall on bottom only, reverse y velocity for bounce and allow x to continue left
      else if (board[ballPositionY + 1][ballPositionX].isWall) {
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
        // wall on diagonal also will reverse both
        // needs to be last even though first if the same result, needs to check upper case first
        /***** NOT WORKING JAVASCRIPT BUG ??? only works if a second wall is present*/
      } else if (board[ballPositionY + 1][ballPositionX - 1].isWall) {
        velocityX =
          0.8 *
          velocityFinal(
            velocityX,
            wind,
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
    //Case 2: (+x, +y) (bottom-right)
    else if (velocityX > 0 && velocityY > 0) {
      console.log("case 2");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
        ballPositionY -= 1;
      }

      // bottom right - wall on right and bottom, reverse both x y velocity
      if (
        board[ballPositionY][ballPositionX + 1].isWall &&
        board[ballPositionY + 1][ballPositionX].isWall
      ) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
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
        // bottom right - wall on right only, reverse x only, y velocity freefall still
      } else if (board[ballPositionY][ballPositionX + 1].isWall) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        // bottom right - wall on bottom only, reverse y only, x velocity goes same direction
      } else if (board[ballPositionY + 1][ballPositionX].isWall) {
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
        // wall on diagonal also will reverse both
        // needs to be last even though first if the same result in order to check for directly under cell first
      } else if (board[ballPositionY + 1][ballPositionX + 1].isWall) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
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
    //Case 3: (+x, -y) (top-right)
    else if (velocityX > 0 && velocityY < 0) {
      console.log("case 3");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
        ballPositionY += 1;
      }
      // top right - wall on top and right, reverse both x y velocity

      if (
        board[ballPositionY][ballPositionX + 1].isWall &&
        board[ballPositionY - 1][ballPositionX].isWall
      ) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
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

        // top right - wall on right, reverse x velocity only
      } else if (board[ballPositionY][ballPositionX + 1].isWall) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        // top right - wall on top, reverse y velocity only
      } else if (board[ballPositionY - 1][ballPositionX].isWall) {
        velocityY =
          0.8 *
          velocityFinal(
            velocityY,
            gravity,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      }
      // wall on diagonal also will reverse both
      // needs to be last even though first if the same result, needs to check upper case first
      /***** NOT WORKING JAVASCRIPT BUG ??? only works if a second wall is present*/
      else if (board[ballPositionY - 1][ballPositionX + 1].isWall) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
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

    //Case 4: (-x, -y) (top-left)
    else if (velocityX < 0 && velocityY < 0) {
      console.log("case 4");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX += 1;
        ballPositionY += 1;
      }

      // top left - wall on top left, reverse x y velocity
      if (
        board[ballPositionY][ballPositionX - 1].isWall &&
        board[ballPositionY - 1][ballPositionX].isWall
      ) {
        velocityX =
          0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          0.8 *
          velocityFinal(
            velocityY,
            gravity,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
        // top left - wall on left, reverse x velocity only
      } else if (board[ballPositionY][ballPositionX - 1].isWall) {
        velocityX =
          0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        // top left - wall on left, reverse y velocity only
      } else if (board[ballPositionY - 1][ballPositionX].isWall) {
        velocityY =
          0.8 *
          velocityFinal(
            velocityY,
            gravity,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
        // also reverse if diagonal top is hit
        // ordering is important, must be last
      } else if (board[ballPositionY - 1][ballPositionX - 1].isWall) {
        velocityX =
          0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          0.8 *
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
    //Case 5: (+x, 0) (right) and gravity == 0
    else if (velocityX > 0 && velocityY == 0 && gravity == 0) {
      console.log("case 5");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
      }

      if (board[ballPositionY][ballPositionX + 1].isWall) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
      }
    }
    //Case 6: (-x, 0) (left)
    else if (velocityX < 0 && velocityY == 0 && gravity == 0) {
      // working, add wind or gravity or wall?
      console.log("case 6");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX += 1;
      }

      if (board[ballPositionY][ballPositionX - 1].isWall) {
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
    }
    //Case 7: (0, +y) (down)
    else if (velocityX == 0 && velocityY >= 0) {
      console.log("case 7");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionY -= 1;
      }

      if (board[ballPositionY + 1][ballPositionX].isWall) {
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
    //Case 8: (0, -y) (up)
    else if (velocityX == 0 && velocityY < 0) {
      console.log("case 8");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionY += 1;
      }

      if (board[ballPositionY - 1][ballPositionX].isWall) {
        velocityY =
          0.8 *
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

    // gravity no bounce bug
    // and wind should not keep adding to velocity

    //Case 9: (+x, 0) (right) and gravity != 0
    else if (velocityX > 0 && velocityY == 0 && gravity != 0) {
      console.log("case 9");

      while (board[ballPositionY][ballPositionX].isWall) {
        ballPositionX -= 1;
        ballPositionY -= 1; //new
      }
      // only reverse y if bottom is wall
      if (board[ballPositionY + 1][ballPositionX].isWall) {
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

        // reverse both if bottom right diagonal edge is wall
      } else if (board[ballPositionY + 1][ballPositionX + 1].isWall) {
        velocityX =
          0.8 *
          velocityFinal(
            velocityX,
            wind,
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
      } else if (board[ballPositionY][ballPositionX + 1].isWall) {
        velocityX =
          -0.8 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
      }
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
  } else if (!board[ballPositionY][ballPositionX].isWall) {
    velocityX = velocityXNoWall;
    velocityY = velocityYNoWall;
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

export default ballPath;
