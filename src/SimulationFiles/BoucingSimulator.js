import React, { Component, useEffect, useState } from "react";
import Ball from "./Ball";

import "./ball.css";

const BALL_START_X = 5;
const BALL_START_Y = 0;
const TARGET_X = 100;
const TARGET_Y = 0;

let getBoard = () => {
  let board = [];
  for (let y = 0; y < 120; y++) {
    let currentX = [];
    for (let x = 0; x < 100; x++) currentX.push(boardCell(x, y));

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
  let wallCell = {
    ...cell,
    isWall: True,
  };
  newBoard[x][y] = wallCell;
  return newBoard;
};

let BouncingSimulator = () => {
  let [board, setBoard] = useState([]);
  let [mousePressed, setMousePressed] = useState(false);

  useEffect(() => {
    setBoard(getBoard());
  }, []);

  return (
    <div class="container">
      {board.map((x, xIndex) => {
        return (
          <div key={xIndex}>
            {x.map((cell, cellIndex) => {
              let { x, y, previousPath, isWall } = cell;
              return (
                <Ball
                  key={cellIndex}
                  x={x}
                  y={y}
                  previousPath={previousPath}
                  isWall={isWall}
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
