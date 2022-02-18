import React, { Component, useEffect, useState } from "react";
import "./cell.css";

export default class Cell extends Component {
  render() {
    const {
      row,
      col,
      isWall,
      atStart,
      atTarget,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;

    let classNameMod = atStart
      ? "cell-start"
      : atTarget
      ? "cell-target"
      : isWall
      ? "cell-wall"
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
