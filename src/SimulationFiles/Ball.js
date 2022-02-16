import React, { useEffect, useState } from "react";
import "./ball.css";

let Ball = (
  x,
  y,
  isWall,
  atStart,
  atTarget,
  onMouseDown,
  onMouseEnter,
  onMouseUp
) => {
  let classNameMod = atStart
    ? "start"
    : atTarget
    ? "target"
    : isWall
    ? "wall"
    : "";

  return (
    <div
      id={`cell-${x}-${y}`}
      className={`cell ${classNameMod}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Ball;
