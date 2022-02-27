import React, { Component, useEffect, useState } from "react";
import "./cell.css";

export default class Cell extends Component {
  render() {
    const {
      row,
      col,
      isWall,
      isBall,
      atTarget,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isStart,
    } = this.props;

    let classNameMod = isBall
      ? "cell-ball"
      : atTarget
      ? "cell-target"
      : isWall
      ? "cell-wall"
      : isStart
      ? "cell-start"
      : "";

    return (
      <div
        id={`cell-${row}-${col}`}
        className={`cell ${classNameMod}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
