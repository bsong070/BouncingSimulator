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

  while (
    (Math.floor(ballPositionRow) != targetPositionRow ||
      Math.floor(ballPositionCol) != targetPositionCol) &&
    (Math.floor(ballPositionCol) > 0 ||
      Math.floor(ballPositionCol) < board.length - 1 ||
      Math.floor(ballPositionRow) > 0 ||
      Math.floor(ballPositionRow) < board[0].length - 1) && // may need to change
    time <= frame
  ) {
    let initialBallPositionCol = ballPositionCol;
    let initialBallPositionRow = ballPositionRow;

    ballPositionRow = position(
      initialBallPositionRow,
      velocityY,
      gravity,
      true,
      board
    );
    ballPositionCol = position(
      initialBallPositionCol,
      velocityX,
      wind,
      false,
      board
    );

    // temp holder, need to determine if ball went out of bounds, if yes need to calculate new velocity else keep temp

    let velocityYNoWall = velocityFinalWithTime(velocityY, gravity, time);
    let velocityXNoWall = velocityFinalWithTime(velocityX, wind, time);

    [ballPositionCol, ballPositionRow, velocityX, velocityY] =
      velocityAfterWall(
        board,
        Math.floor(initialBallPositionCol),
        Math.floor(initialBallPositionRow),
        Math.floor(ballPositionCol), // need whole numbers for cell properties
        Math.floor(ballPositionRow),
        velocityX,
        velocityY,
        velocityXNoWall,
        velocityYNoWall,
        gravity,
        wind,
        startAboveWall,
        targetPositionCol,
        targetPositionRow
      );

    board[Math.floor(ballPositionRow)][
      Math.floor(ballPositionCol)
    ].isBall = true;
    pathHistory.push(
      board[Math.floor(ballPositionRow)][Math.floor(ballPositionCol)]
    );
    time++;
  }
  return pathHistory;
};

let findClosestNonWall = (
  board,
  initialBallPositionX,
  initialBallPositionY,
  ballPositionX,
  ballPositionY,
  targetPositionX,
  targetPositionY
) => {
  // will use this in the edge case the ball jumps over a wall
  // see case 10
  let deltaPosX = ballPositionX - initialBallPositionX;
  let deltaPosY = ballPositionY - initialBallPositionY;
  let maxDelta = Math.max(Math.abs(deltaPosX), Math.abs(deltaPosY));
  let tempBallPositionX = ballPositionX;
  let tempBallPositionY = ballPositionY;

  // edge case, bottom right at start going 1 tile right
  if (
    deltaPosX == 1 &&
    deltaPosY == 1 &&
    board[Math.floor(initialBallPositionY + 1)][
      Math.floor(initialBallPositionX + 1)
    ].isWall
  )
    return [initialBallPositionX, initialBallPositionY];

  // edge case, bottom left at start going 1 tile bottom left
  if (
    deltaPosX == -1 &&
    deltaPosY == 1 &&
    board[Math.floor(initialBallPositionY + 1)][
      Math.floor(initialBallPositionX - 1)
    ].isWall
  )
    return [initialBallPositionX, initialBallPositionY];

  // edge case, top left at start going 1 tile top left
  if (
    deltaPosX == -1 &&
    deltaPosY == -1 &&
    board[Math.floor(initialBallPositionY - 1)][
      Math.floor(initialBallPositionX - 1)
    ].isWall
  )
    return [initialBallPositionX, initialBallPositionY];

  // edge case, top right at start going 1 tile top right
  if (
    deltaPosX == 1 &&
    deltaPosY == -1 &&
    board[Math.floor(initialBallPositionY - 1)][
      Math.floor(initialBallPositionX + 1)
    ].isWall
  )
    return [initialBallPositionX, initialBallPositionY];

  // will iterate from final position to initial position
  for (let i = 1; i < maxDelta; i++) {
    // if ball at target, end

    // need to add try catch, if ball's position initially or during the loop goes out of range, errors out
    // if position is wall, OR if undefined (meaning is out of bounds of the board) find next closest position
    if (
      Math.floor(ballPositionX) == targetPositionX &&
      Math.floor(ballPositionY) == targetPositionY
    )
      return [targetPositionX, targetPositionY];

    try {
      if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX)].isWall ||
        // Special Cases if going diagonal and vertical and horizontal adjacent cells are walls
        // if goes out of bound, ball is either on the edge wall or out of bounds
        // Case 1 - bottom left
        (deltaPosX < 0 &&
          deltaPosY > 0 &&
          (board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)]
            .isWall ||
            board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)]
              .isWall)) ||
        // Case 2 - bottom right
        (deltaPosX > 0 &&
          deltaPosY > 0 &&
          (board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)]
            .isWall ||
            board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)]
              .isWall)) ||
        // Case 3 - top right
        (deltaPosX > 0 &&
          deltaPosY < 0 &&
          (board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)]
            .isWall ||
            board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)]
              .isWall)) ||
        // Case 4 - top left
        (deltaPosX < 0 &&
          deltaPosY < 0 &&
          (board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)]
            .isWall ||
            board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)]
              .isWall))
      ) {
        if (Math.abs(deltaPosX) > Math.abs(deltaPosY)) {
          tempBallPositionY = Math.floor(
            initialBallPositionY + deltaPosY / (i + 1)
          );
          tempBallPositionX = ballPositionX - deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
        } else if (Math.abs(deltaPosX) < Math.abs(deltaPosY)) {
          tempBallPositionX = Math.floor(
            initialBallPositionX + deltaPosX / (i + 1)
          );
          tempBallPositionY = ballPositionY - deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
        } else if (Math.abs(deltaPosX) == Math.abs(deltaPosY)) {
          tempBallPositionY = ballPositionY - deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
          tempBallPositionX = ballPositionX - deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
        }
      }
    } catch (error) {
      if (Math.abs(deltaPosX) > Math.abs(deltaPosY)) {
        tempBallPositionY = Math.floor(
          initialBallPositionY + deltaPosY / (i + 1)
        );
        tempBallPositionX = ballPositionX - deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
      } else if (Math.abs(deltaPosX) < Math.abs(deltaPosY)) {
        tempBallPositionX = Math.floor(
          initialBallPositionX + deltaPosX / (i + 1)
        );
        tempBallPositionY = ballPositionY - deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
      } else if (Math.abs(deltaPosX) == Math.abs(deltaPosY)) {
        tempBallPositionY = ballPositionY - deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
        tempBallPositionX = ballPositionX - deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
      }
    } finally {
      if (Math.abs(deltaPosX) > Math.abs(deltaPosY)) {
        ballPositionY = Math.floor(initialBallPositionY + deltaPosY / (i + 1));
        ballPositionX -= deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
      } else if (Math.abs(deltaPosX) < Math.abs(deltaPosY)) {
        ballPositionX = Math.floor(initialBallPositionX + deltaPosX / (i + 1));
        ballPositionY -= deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
      } else if (Math.abs(deltaPosX) == Math.abs(deltaPosY)) {
        ballPositionY -= deltaPosY / Math.abs(deltaPosY); // this is to make sure negative signs are captured
        ballPositionX -= deltaPosX / Math.abs(deltaPosX); // this is to make sure negative signs are captured
      }
      try {
        if (
          Math.floor(ballPositionX) == targetPositionX &&
          Math.floor(ballPositionY) == targetPositionY
        )
          return [targetPositionX, targetPositionY];

        if (
          i == maxDelta - 1 &&
          board[Math.floor(ballPositionY)][Math.floor(ballPositionX)].isWall
        ) {
          return [initialBallPositionX, initialBallPositionY];
        }
      } catch (error) {
        if (i == maxDelta - 1)
          return [initialBallPositionX, initialBallPositionY];
      }
    }
  }
  return [tempBallPositionX, tempBallPositionY];
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
  wind,
  startAboveWall,
  targetPositionX,
  targetPositionY
) => {
  // will use this in the edge case the ball jumps over a wall
  // see case 10
  [ballPositionX, ballPositionY] = findClosestNonWall(
    board,
    initialBallPositionX,
    initialBallPositionY,
    ballPositionX,
    ballPositionY,
    targetPositionX,
    targetPositionY
  );

  // in case balls goes out of range, scale back
  if (ballPositionY <= 1) ballPositionY = 1;
  if (ballPositionY >= board.length - 2) ballPositionY = board.length - 2;
  if (ballPositionX <= 1) ballPositionX = 1;
  if (ballPositionX >= board[0].length - 2) ballPositionX = board[0].length - 2;

  //*** in this board, right / down are positive, up / left are negative ***
  if (
    board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)].isWall ||
    board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)].isWall ||
    board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)].isWall ||
    board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)].isWall ||
    board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX + 1)]
      .isWall ||
    board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX - 1)]
      .isWall ||
    board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX - 1)]
      .isWall ||
    board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX + 1)].isWall
  ) {
    //Case 1: (-x, +y) (bottom-left)
    if (velocityX < 0 && velocityY >= 0) {
      if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)].isWall
      ) {
        // bottom left - wall on both left only, reverse only x velocity and allow to downfall y
        velocityX =
          0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
      } // bottom left - wall on bottom only, reverse y velocity for bounce and allow x to continue left
      else if (
        board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)].isWall
      ) {
        velocityY =
          -0.45 *
          velocityFinal(
            velocityY,
            gravity,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );

        if (velocityX < wind) velocityX = 0;

        // wall on diagonal also will reverse both
        // needs to be last even though first if the same result, needs to check upper case first
      } else if (
        board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX - 1)]
          .isWall
      ) {
        velocityX =
          0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          -0.45 *
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
    else if (velocityX > 0 && velocityY >= 0) {
      // bottom right - wall on right only, reverse x only, y velocity freefall still
      if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)].isWall
      ) {
        velocityX =
          -0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );

        // bottom right - wall on bottom only, reverse y only, x velocity goes same direction
      } else if (
        board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)].isWall
      ) {
        velocityY =
          -0.45 *
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
      } else if (
        board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX + 1)]
          .isWall
      ) {
        velocityX =
          -0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          -0.45 *
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
      // top right - wall on right, reverse x velocity only
      if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)].isWall
      ) {
        velocityX =
          -0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY = -velocityY;
        // top right - wall on top, reverse y velocity only
      } else if (
        board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)].isWall
      ) {
        velocityY =
          0.45 *
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
      else if (
        board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX + 1)]
          .isWall
      ) {
        velocityX =
          -0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          0.45 *
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
      // top left - wall on left, reverse x velocity only
      if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)].isWall
      ) {
        velocityX =
          0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY = -velocityY;
        // top left - wall on left, reverse y velocity only
      } else if (
        board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)].isWall
      ) {
        velocityY =
          0.45 *
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
      } else if (
        board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX - 1)]
          .isWall
      ) {
        velocityX =
          0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          );
        velocityY =
          0.45 *
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
      if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)].isWall
      ) {
        velocityX =
          -0.45 *
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
      if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)].isWall
      ) {
        velocityX =
          0.45 *
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
      if (
        board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)].isWall
      ) {
        velocityY =
          -0.45 *
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
      if (
        board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)].isWall
      ) {
        velocityY =
          0.45 *
          velocityFinal(
            velocityY,
            gravity,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else {
        velocityY =
          -0.45 *
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
      // only reverse y if bottom is wall
      if (
        board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)].isWall
      ) {
        velocityY =
          -0.45 *
          velocityFinal(
            velocityY,
            gravity,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );

        // reverse both if bottom right diagonal edge is wall
      } else if (
        board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX + 1)]
          .isWall
      ) {
        velocityX =
          0.45 *
          velocityFinal(
            velocityX,
            wind,
            initialBallPositionX,
            ballPositionX,
            false,
            startAboveWall
          ); // goes correct direction without -
        velocityY =
          -0.45 *
          velocityFinal(
            velocityY,
            gravity,
            initialBallPositionY,
            ballPositionY,
            true,
            startAboveWall
          );
      } else if (
        board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)].isWall
      ) {
        velocityX =
          -0.45 *
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
      velocityX =
        0.45 *
        velocityFinal(
          velocityX,
          gravity,
          initialBallPositionX,
          ballPositionX,
          false,
          startAboveWall
        );
      velocityY =
        -0.45 *
        velocityFinal(
          velocityY,
          gravity,
          initialBallPositionY,
          ballPositionY,
          true,
          startAboveWall
        );
    }
  } else if (
    !board[Math.floor(ballPositionY)][Math.floor(ballPositionX)].isWall
  ) {
    velocityX = velocityXNoWall;
    velocityY = velocityYNoWall;
  }
  if (
    (board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)].isWall &&
      board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)].isWall) ||
    (board[Math.floor(ballPositionY)][Math.floor(ballPositionX + 1)].isWall &&
      board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)].isWall) ||
    (board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)].isWall &&
      board[Math.floor(ballPositionY + 1)][Math.floor(ballPositionX)].isWall) ||
    (board[Math.floor(ballPositionY)][Math.floor(ballPositionX - 1)].isWall &&
      board[Math.floor(ballPositionY - 1)][Math.floor(ballPositionX)].isWall)
  ) {
    velocityX = 0;
    velocityY = 0;
  }
  return [ballPositionX, ballPositionY, velocityX, velocityY];
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

let position = (initialPosition, initialVelocity, acceleration) => {
  return (
    //assume delta time is 1 as each frame is 1 second, so no time is required in equation
    //in case position is calculated out of bounds, scale back to bound to avoid errors
    initialPosition + initialVelocity + (1 / 2) * acceleration
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
