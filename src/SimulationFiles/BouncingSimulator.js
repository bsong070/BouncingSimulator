import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import ballPath from "./ballPath";
import "./cell.css";

let randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const BOARD_ROW = 40;
const BOARD_COL = 30; //20

// const BALL_START_COL = 10;
// const BALL_START_ROW = 18;
// const TARGET_COL = 35;
// const TARGET_ROW = 18;
const BALL_START_COL = randomInt(1, 9);
const BALL_START_ROW = randomInt(1, 19);
const TARGET_COL = randomInt(30, 38);
const TARGET_ROW = randomInt(1, 28);

const GRAVITY = 1; // using 1 instead of 9.8 to for cleaner visualization
const WIND = 0; // will act as horizontal acceleration
const FRAME = 100; // will act as time
const VELOCITYX = 0;
const VELOCITYY = 0;

let visualizationDelay = [];
let pathHistory;

// creates the board
let getBoard = () => {
  let board = [];
  for (let col = 0; col < BOARD_COL; col++) {
    let currentArray = [];
    for (let row = 0; row < BOARD_ROW; row++) {
      if (col == 0 || col == BOARD_COL - 1 || row == 0 || row == BOARD_ROW - 1)
        currentArray.push(boardCell(row, col, true));
      else currentArray.push(boardCell(row, col, false));
    }

    board.push(currentArray);
  }
  return board;
};

//sets properties for each cell on board
let boardCell = (col, row, isEdge) => {
  if (isEdge) {
    return {
      col,
      row,
      isBall: col == BALL_START_COL && row == BALL_START_ROW,
      atTarget: col == TARGET_COL && row == TARGET_ROW,
      isWall: true,
      isStart: col == BALL_START_COL && row == BALL_START_ROW,
    };
  }
  return {
    col,
    row,
    isBall: false,
    atTarget: col == TARGET_COL && row == TARGET_ROW,
    isWall: false,
    isStart: col == BALL_START_COL && row == BALL_START_ROW,
    aboveWall: false, // will use this to determine if ball stays at 0 velocity permanently
  };
};

//change a cell to a wall
let wallCell = (board, row, col) => {
  let newBoard = board.slice();
  let cell = newBoard[row][col];
  let wall =
    row == BALL_START_ROW + 1
      ? {
          ...cell,
          isWall: !cell.isWall,
          aboveWall: true,
        }
      : {
          ...cell,
          isWall: !cell.isWall,
        };
  newBoard[row][col] = wall;
  return newBoard;
};

let BouncingSimulator = () => {
  let [board, setBoard] = useState([]);
  let [mousePressed, setMousePressed] = useState(false);

  let [increment, setIncrement] = useState({
    gravity: GRAVITY,
    wind: WIND,
    frames: FRAME,
    velocityX: VELOCITYX,
    velocityY: VELOCITYY,
    // angle: ANGLE * INITIALANGLEMULTIPLIER,
  });

  useEffect(() => {
    setBoard(getBoard());
  }, []);

  let handleMouseDown = (row, col) => {
    if (
      row == "0" ||
      col == "0" ||
      col == BOARD_ROW - 1 ||
      row == BOARD_COL - 1 ||
      (row == BALL_START_ROW && col == BALL_START_COL) ||
      (row == TARGET_ROW && col == TARGET_COL)
    )
      return;

    setBoard(wallCell(board, row, col));
    setMousePressed(true);
  };

  let handleMouseUp = (row, col) => {
    // prevents removing walls at edge
    if (
      row == "0" ||
      col == "0" ||
      col == BOARD_ROW - 1 ||
      row == BOARD_COL - 1 ||
      (row == BALL_START_ROW && col == BALL_START_COL) ||
      (row == TARGET_ROW && col == TARGET_COL)
    )
      return;
    setMousePressed(false);
  };

  let handleMouseEnter = (row, col) => {
    if (
      row == "0" ||
      col == "0" ||
      col == BOARD_ROW - 1 ||
      row == BOARD_COL - 1 ||
      row == BALL_START_ROW ||
      col == BALL_START_COL ||
      (row == BALL_START_ROW && col == BALL_START_COL) ||
      (row == TARGET_ROW && col == TARGET_COL)
    )
      return;
    if (!mousePressed) return;
    setBoard(wallCell(board, row, col));
  };

  let visualizeBall = () => {
    pathHistory = ballPath(
      board,
      BALL_START_COL,
      BALL_START_ROW,
      TARGET_COL,
      TARGET_ROW,
      increment.gravity,
      increment.wind,
      increment.frames,
      increment.velocityX,
      increment.velocityY,
      board[BALL_START_ROW + 1][BALL_START_COL].aboveWall
    );

    for (let i = 0; i < pathHistory.length; i++) {
      visualizationDelay.push(
        setTimeout(() => {
          document.getElementById(
            `cell-${pathHistory[i - 1].row}-${pathHistory[i - 1].col}`
          ).className = "cell cell-previous";

          document.getElementById(
            `cell-${pathHistory[i].row}-${pathHistory[i].col}`
          ).className = "cell cell-ball";
        }, 300 * i)
      );
    }
  };

  let setSlider = (event) => {
    let { id, value } = event.target;
    setIncrement((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // one reset was not clearing all of the previous classnames, needed to call multiple times
  let reset = () => {
    for (let i = 0; i < 10; i++) resetReset();
  };

  // clear states to initial and stops visualize if in progress
  let resetReset = () => {
    const elementsPrev = document.getElementsByClassName("cell cell-previous");
    for (let i = 0; i < elementsPrev.length; i++)
      elementsPrev[i].className = "cell";

    const elementBall = document.getElementsByClassName("cell cell-ball");
    for (let i = 0; i < elementBall.length; i++)
      elementBall[i].className = "cell";

    visualizationDelay.forEach((timer) => clearTimeout(timer));

    setBoard(getBoard());

    setMousePressed(false);
  };

  // add ball current

  return (
    <div class="container">
      <div class="row align-items-center h-100">
        <div class="col-10">
          {board.map((row, rowIndex) => {
            return (
              <div className="board" key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  let { row, col, isWall, isBall, atTarget, isStart } = cell;
                  return (
                    <Cell
                      key={cellIndex}
                      row={row}
                      col={col}
                      isBall={isBall}
                      atTarget={atTarget}
                      isWall={isWall}
                      isStart={isStart}
                      mouseIsPressed={mousePressed}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                      onMouseUp={(row, col) => handleMouseUp(row, col)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
        <div class="col-2">
          <label for="velocityX" class="form-label">
            <h5> Initial Velocity X: {increment.velocityX} </h5>
          </label>
          <input
            type="range"
            class="form-range"
            min="-3"
            max="3"
            id="velocityX"
            defaultValue="0"
            onChange={setSlider}
          ></input>
          <label for="velocityY" class="form-label">
            <h5> Initial Velocity Y: {increment.velocityY} </h5>
          </label>
          <input
            type="range"
            class="form-range"
            min="-3"
            max="3"
            id="velocityY"
            defaultValue="0"
            onChange={setSlider}
          ></input>
          <label for="wind" class="form-label">
            <h5> Acceleration X: {increment.wind} </h5>
          </label>
          <input
            type="range"
            class="form-range"
            min="-2"
            max="2"
            id="wind"
            defaultValue="0"
            onChange={setSlider}
          ></input>
          <label for="gravity" class="form-label">
            <h5> Acceleration Y: {increment.gravity} </h5>
          </label>
          <input
            type="range"
            class="form-range"
            min="0"
            max="2"
            id="gravity"
            defaultValue="1"
            onChange={setSlider}
          ></input>
          <label for="frames" class="form-label">
            <h5> Time: {increment.frames} </h5>
          </label>
          <input
            type="range"
            class="form-range"
            min="1"
            max="200"
            id="frames"
            defaultValue="100"
            onChange={setSlider}
          ></input>
          <br></br>
          <br></br>
          <div class="container">
            <div class="row justify-content-start">
              <button
                type="button"
                class="col 1 btn btn-secondary"
                onClick={() => visualizeBall()}
              >
                Start
              </button>
              <button
                type="reset"
                class="col btn btn-danger"
                onClick={() => reset()}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BouncingSimulator;
