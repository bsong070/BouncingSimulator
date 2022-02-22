import React, { Component, useEffect, useState } from "react";
import Cell from "./Cell";
import ballPath from "./ballPath";

import "./cell.css";

const BOARD_ROW = 40;
const BOARD_COL = 40; //20
const BALL_START_COL = 10;
const BALL_START_ROW = 18;
const TARGET_COL = 35;
const TARGET_ROW = 18;

const GRAVITY = 1; // using 1 instead of 9.8 to for cleaner visualization
const WIND = 0; // will act as horizontal acceleration
const FRAME = 25; // will act as time
const VELOCITYX = 0;
const VELOCITYY = 0;
// const INITIALANGLEMULTIPLIER = 3; // to set initial angle to 90
// const DEGREETORADIAN = Math.PI / 180;
// const ANGLE = 30;

let visualizationDelay;

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
      previousPath: false,
      isWall: true,
    };
  }
  return {
    col,
    row,
    isBall: col == BALL_START_COL && row == BALL_START_ROW,
    atTarget: col == TARGET_COL && row == TARGET_ROW,
    previousPath: false,
    isWall: false,
  };
};

//change a cell to a wall
let wallCell = (board, row, col) => {
  let newBoard = board.slice();
  let cell = newBoard[row][col];
  let wall = {
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
    setBoard(wallCell(board, row, col));
    setMousePressed(true);
    console.log("x:", col, "y:", row);
  };

  let handleMouseUp = () => {
    setMousePressed(false);
  };

  let handleMouseEnter = (row, col) => {
    if (!mousePressed) return;
    setBoard(wallCell(board, row, col));
  };

  //need to see order of board
  let startAboveWall =
    board[BALL_START_ROW + 1][BALL_START_COL].isWall && increment.velocityY == 0
      ? true
      : false;

  let visualizeBall = () => {
    let pathHistory = ballPath(
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
      startAboveWall
    );
    for (let i = 0; i < pathHistory.length; i++) {
      visualizationDelay = setTimeout(() => {
        document.getElementById(
          `cell-${pathHistory[i].row}-${pathHistory[i].col}`
        ).className = "cell cell-ball";
      }, 300 * i);
    }
  };

  let setSlider = (event) => {
    let { id, value } = event.target;
    console.log(value);

    // if (id == "angle") {
    //   setIncrement((prevState) => ({
    //     ...prevState,
    //     [id]: value * ANGLE,
    //   }));
    // } else {
    setIncrement((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // clear states to initial and stops visualize if in progress
  let reset = () => {
    setIncrement({
      gravity: GRAVITY,
      wind: WIND,
      frames: FRAME,
      velocityX: VELOCITYX,
      velocityY: VELOCITYY,
      // angle: ANGLE * INITIALANGLEMULTIPLIER,
    });
    getBoard();
    setMousePressed(false);
    clearTimeout(visualizationDelay);
  };

  // add ball current

  return (
    <div class="container">
      {" "}
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex}>
            {" "}
            {row.map((cell, cellIndex) => {
              let { row, col, previousPath, isWall, isBall, atTarget } = cell;
              return (
                <Cell
                  key={cellIndex}
                  row={row}
                  col={col}
                  isBall={isBall}
                  atTarget={atTarget}
                  previousPath={previousPath}
                  isWall={isWall}
                  mouseIsPressed={mousePressed}
                  onMouseDown={(row, col) => handleMouseDown(row, col)}
                  onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                  onMouseUp={() => handleMouseUp()}
                />
              );
            })}{" "}
          </div>
        );
      })}{" "}
      <label for="customRange2" class="form-label">
        <h3> Gravity: {increment.gravity} </h3>{" "}
      </label>{" "}
      <input
        type="range"
        class="form-range"
        min="0"
        max="3"
        id="gravity"
        defaultValue="1"
        onChange={setSlider}
      ></input>
      <label for="customRange2" class="form-label">
        <h3> Wind: {increment.wind} </h3>{" "}
      </label>{" "}
      <input
        type="range"
        class="form-range"
        min="-2"
        max="2"
        id="wind"
        defaultValue="0"
        onChange={setSlider}
      ></input>{" "}
      <label for="customRange2" class="form-label">
        <h3> Frames: {increment.frames} </h3>{" "}
      </label>{" "}
      <input
        type="range"
        class="form-range"
        min="1"
        max="49"
        id="frames"
        defaultValue="25"
        onChange={setSlider}
      ></input>{" "}
      <label for="customRange2" class="form-label">
        <h3> Velocity X: {increment.velocityX} </h3>{" "}
      </label>{" "}
      <input
        type="range"
        class="form-range"
        min="-2"
        max="2"
        id="velocityX"
        defaultValue="0"
        onChange={setSlider}
      ></input>{" "}
      <label for="customRange2" class="form-label">
        <h3> Velocity Y: {increment.velocityY} </h3>{" "}
      </label>{" "}
      <input
        type="range"
        class="form-range"
        min="-2"
        max="2"
        id="velocityY"
        defaultValue="0"
        onChange={setSlider}
      ></input>
      <button
        type="button"
        class="btn btn-primary"
        onClick={() => visualizeBall()}
      >
        Start{" "}
      </button>{" "}
      <button type="button" class="btn btn-primary" onClick={() => reset()}>
        Reset{" "}
      </button>{" "}
    </div>
  );
};

export default BouncingSimulator;
