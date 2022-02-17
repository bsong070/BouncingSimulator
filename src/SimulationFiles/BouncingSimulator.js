import React, { Component, useEffect, useState } from "react";
import Cell from "./Cell";

import "./cell.css";

const BALL_START_X = 5;
const BALL_START_Y = 0;
const TARGET_X = 20;
const TARGET_Y = 0;
const BOARD_ROW = 40;
const BOARD_COL = 20;

let getBoard = () => {
  let board = [];
  for (let y = 0; y < BOARD_COL; y++) {
    let currentX = [];
    for (let x = 0; x < BOARD_ROW; x++) currentX.push(boardCell(y, x));

    board.push(currentX);
  }
  return board;
};

let boardCell = (x, y) => {
  return {
    x,
    y,
    atStart: x == BALL_START_X && y == BALL_START_Y,
    atTarget: x == TARGET_X && y == TARGET_Y,
    previousPath: false,
    isWall: false,
  };
};

let wallCell = (board, x, y) => {
  let newBoard = board.slice();
  let cell = newBoard[x][y];
  let wall = {
    ...cell,
    isWall: !cell.isWall,
  };
  newBoard[x][y] = wall;
  return newBoard;
};

let BouncingSimulator = () => {
  let [board, setBoard] = useState([]);
  let [mousePressed, setMousePressed] = useState(false);

  useEffect(() => {
    setBoard(getBoard());
  }, []);

  let handleMouseDown = (x, y) => {
    setBoard(wallCell(board, x, y));
  };

  let handleMouseUp = (x, y) => {
    setMousePressed(false);
  };

  let handleMouseEnter = (x, y) => {
    setBoard(wallCell(board, x, y));
    setMousePressed(true);
  };

  // add ball current

  return (
    <div class="container">
      {board.map((x, xIndex) => {
        return (
          <div key={xIndex}>
            {x.map((cell, cellIndex) => {
              let { x, y, previousPath, isWall } = cell;
              return (
                <Cell
                  key={cellIndex}
                  x={x}
                  y={y}
                  previousPath={previousPath}
                  isWall={isWall}
                  mouseIsPressed={mousePressed}
                  onMouseDown={(x, y) => handleMouseDown(x, y)}
                  // onMouseEnter={(x, y) => handleMouseEnter(x, y)}
                  onMouseUp={() => handleMouseUp()}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default BouncingSimulator;
