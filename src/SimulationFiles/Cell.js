import React, { Component, useEffect, useState } from "react";
import "./cell.css";

export default class Cell extends Component {
  render() {
    const {
      x,
      y,
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
        id={`cell-${x}-${y}`}
        className={`cell ${classNameMod}`}
        onMouseDown={() => onMouseDown(x, y)}
        onMouseEnter={() => onMouseEnter(x, y)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
