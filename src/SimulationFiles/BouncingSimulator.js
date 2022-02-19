import React, { Component, useEffect, useState } from "react";
import Cell from "./Cell";
import ballPath from "./ballPath";
import angleDropDown from "./AngleDropdrop";

import "./cell.css";

const BOARD_ROW = 40;
const BOARD_COL = 20;
const BALL_START_COL = 10;
const BALL_START_ROW = 18;
const TARGET_COL = 35;
const TARGET_ROW = 18;
const GRAVITY = 1;
const WIND = 2;

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

  useEffect(() => {
    setBoard(getBoard());
  }, []);

  let handleMouseDown = (row, col) => {
    setBoard(wallCell(board, row, col));
    setMousePressed(true);
  };

  let handleMouseUp = () => {
    setMousePressed(false);
  };

  let handleMouseEnter = (row, col) => {
    if (!mousePressed) return;
    setBoard(wallCell(board, row, col));
  };

  let visualizeBall = () => {
    let pathHistory = ballPath(
      board,
      board[BALL_START_COL][BALL_START_ROW],
      board[TARGET_COL][TARGET_ROW],
      GRAVITY,
      WIND
    );
    for (let i = 0; i < pathHistory.length; i++) {
      setTimeout(() => {
        document.getElementById(
          `cell-${pathHistory[i].col}-${pathHistory[i].row}`
        ).className = "ball";
      }, 10 * i);
    }
  };

  let setMultiplier = (event) => {
    let { id, value } = event.target;
    console.log(id, value);
  };

  // add ball current

  return (
    <div class="container">
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex}>
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
            })}
          </div>
        );
      })}
      <label for="customRange2" class="form-label">
        <h3>Gravity: {GRAVITY}</h3>
      </label>
      <input
        type="range"
        class="form-range"
        min="0"
        max="2"
        id="gravity"
        defaultValue="1"
        onChange={() => setMultiplier}
      ></input>

      <label for="customRange2" class="form-label">
        Air
      </label>
      <input
        type="range"
        class="form-range"
        min="-2"
        max="2"
        id="air"
        defaultValue="0"
      ></input>
      <label for="customRange2" class="form-label">
        Frames
      </label>
      <input
        type="range"
        class="form-range"
        min="1"
        max="49"
        id="frames"
        defaultValue="25"
      ></input>
      <label for="customRange2" class="form-label">
        Initial Velocity
      </label>
      <input
        type="range"
        class="form-range"
        min="-2"
        max="2"
        id="velocity"
        defaultValue="0"
      ></input>
      <label for="customRange2" class="form-label">
        Angle
      </label>
      <input
        type="range"
        class="form-range"
        min="0"
        max="6"
        id="angle"
        defaultValue="3"
      ></input>

      <button onClick={() => visualizeBall()}>Start</button>

      <button onClick={() => console.log(board.length, board[0].length)}>
        consolelog
      </button>
    </div>
  );
};

export default BouncingSimulator;
