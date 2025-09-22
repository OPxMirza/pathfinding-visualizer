import React from "react";

export default function Node({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  let className = "node";
  if (isStart) className += " start";
  else if (isEnd) className += " end";
  else if (isWall) className += " wall";
  else if (isPath) className += " path";
  else if (isVisited) className += " visited";

  return (
    <div
      className={className}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      role="button"
      aria-label={`node-${row}-${col}`}
    />
  );
}
