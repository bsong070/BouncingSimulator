import React, { Component, useEffect, useState } from "react";
import Cell from "./Cell";
import ballPath from "./ballPath";

import "./cell.css";

const BALL_START_COL = 5;
const BALL_START_ROW = 10;
const TARGET_COL = 1;
const TARGET_ROW = 30;
const BOARD_ROW = 40;
const BOARD_COL = 20;
const GRAVITY = 1;
const WIND = 2;

let getBoard = () => {
  let board = [];
  for (let row = 0; row < BOARD_COL; row++) {
    let currentArray = [];
    for (let col = 0; col < BOARD_ROW; col++)
      currentArray.push(boardCell(row, col));

    board.push(currentArray);
  }
  return board;
};

let boardCell = (col, row) => {
  return {
    col,
    row,
    atStart: col == BALL_START_COL && row == BALL_START_ROW,
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

  // add ball current

  return (
    <div class="container">
      {board.map((row, rowIndex) => {
        return (
          <div key={rowIndex}>
            {row.map((cell, cellIndex) => {
              let { row, col, previousPath, isWall, atStart, atTarget } = cell;
              return (
                <Cell
                  key={cellIndex}
                  row={row}
                  col={col}
                  atStart={atStart}
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
      <button
        onClick={() =>
          ballPath(
            board,
            board[BALL_START_COL][BALL_START_ROW],
            board[TARGET_COL][TARGET_ROW],
            GRAVITY,
            WIND
          )
        }
      >
        Start
      </button>

      <button onClick={() => console.log(board.length, board[0].length)}>
        consolelog
      </button>
    </div>
  );
};

export default BouncingSimulator;
