import React, { useState, useRef } from "react";
import Grid from "./components/Grid";
import { bfs } from "./algorithms/bfs";
import { dfs } from "./algorithms/dfs";
import { dijkstra } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";

export default function App() {
  const rows = 18;
  const cols = 34;
  const [start] = useState([0, 0]);
  const [end] = useState([rows - 1, cols - 1]);

  const [walls, setWalls] = useState(new Set());
  const [visitedSet, setVisitedSet] = useState(new Set());
  const [pathSet, setPathSet] = useState(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(20); // ms per node
  const mouseDownRef = useRef(false);

  // toggle wall
  const toggleWall = (r, c) => {
    const key = `${r},${c}`;
    setWalls((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key);
      else {
        // don't make start/end walls
        if (r === start[0] && c === start[1]) return s;
        if (r === end[0] && c === end[1]) return s;
        s.add(key);
      }
      return s;
    });
  };

  const handleMouseDown = (r, c) => {
    if (isAnimating) return;
    mouseDownRef.current = true;
    toggleWall(r, c);
  };

  const handleMouseEnter = (r, c) => {
    if (!mouseDownRef.current || isAnimating) return;
    toggleWall(r, c);
  };

  const handleMouseUp = () => {
    mouseDownRef.current = false;
  };

  const clearWalls = () => {
    if (isAnimating) return;
    setWalls(new Set());
  };

  const clearPathAndVisited = () => {
    if (isAnimating) return;
    setVisitedSet(new Set());
    setPathSet(new Set());
  };

  // animate helper
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const animate = async (visitedOrder, path) => {
    setIsAnimating(true);
    setVisitedSet(new Set());
    setPathSet(new Set());

    // Animate visited
    for (let i = 0; i < visitedOrder.length; i++) {
      const [r, c] = visitedOrder[i];
      setVisitedSet((prev) => {
        const s = new Set(prev);
        s.add(`${r},${c}`);
        return s;
      });
      await sleep(speed);
    }

    // Animate path
    for (let i = 0; i < path.length; i++) {
      const [r, c] = path[i];
      setPathSet((prev) => {
        const s = new Set(prev);
        s.add(`${r},${c}`);
        return s;
      });
      await sleep(Math.max(25, speed));
    }

    setIsAnimating(false);
  };

  const runAlgo = async (name) => {
    clearPathAndVisited();
    if (isAnimating) return;
    let result;
    if (name === "bfs") result = bfs(rows, cols, start, end, walls);
    else if (name === "dfs") result = dfs(rows, cols, start, end, walls);
    else if (name === "dijkstra") result = dijkstra(rows, cols, start, end, walls);
    else if (name === "astar") result = astar(rows, cols, start, end, walls);
    else return;

    // safety: ensure arrays
    const visitedOrder = result.visitedOrder ?? [];
    const path = result.path ?? [];
    await animate(visitedOrder, path);
  };

  return (
    <div className="app">
      <div className="header">
        <h1 style={{ margin: 0 }}>Pathfinding Visualizer</h1>
        <div style={{ marginLeft: 12, color: "#475569", fontSize: 14 }}>
          Start: {`(${start[0]},${start[1]})`} • End: {`(${end[0]},${end[1]})`}
        </div>
      </div>

      <div className="controls">
        <button className="btn-primary" onClick={() => runAlgo("bfs")} disabled={isAnimating}>Run BFS</button>
        <button className="btn-green" onClick={() => runAlgo("dfs")} disabled={isAnimating}>Run DFS</button>
        <button className="btn-warning" onClick={() => runAlgo("dijkstra")} disabled={isAnimating}>Run Dijkstra</button>
        <button className="btn-danger" onClick={() => runAlgo("astar")} disabled={isAnimating}>Run A*</button>

        <button className="small" onClick={clearWalls} disabled={isAnimating}>Clear Walls</button>
        <button className="small" onClick={clearPathAndVisited} disabled={isAnimating}>Clear Path</button>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          Speed:
          <input
            type="range"
            min="5"
            max="120"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ width: 120 }}
          />
          <span style={{ width: 32 }}>{speed}ms</span>
        </label>
      </div>

      <Grid
        rows={rows}
        cols={cols}
        start={start}
        end={end}
        walls={walls}
        visited={visitedSet}
        path={pathSet}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseUp={handleMouseUp}
      />

      <div className="footer">
        Click cells to add/remove walls. Drag to draw. The visualizer animates visited nodes then the final path.
      </div>
    </div>
  );
}
