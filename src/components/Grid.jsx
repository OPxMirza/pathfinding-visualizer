import React from "react";
import Node from "./Node";

export default function Grid({
  rows,
  cols,
  start,
  end,
  walls,
  visited,
  path,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) {
  return (
    <div className="grid" onMouseLeave={() => onMouseUp()}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="row">
          {Array.from({ length: cols }).map((_, c) => {
            const key = `${r},${c}`;
            return (
              <Node
                key={key}
                row={r}
                col={c}
                isStart={r === start[0] && c === start[1]}
                isEnd={r === end[0] && c === end[1]}
                isWall={walls.has(key)}
                isVisited={visited.has(key)}
                isPath={path.has(key)}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
