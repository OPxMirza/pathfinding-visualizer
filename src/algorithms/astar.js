function heuristic(a, b) {
  // Manhattan distance
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function astar(rows, cols, start, end, walls) {
  const startKey = `${start[0]},${start[1]}`;
  const endKey = `${end[0]},${end[1]}`;
  const gScore = {};
  const fScore = {};
  const parent = {};
  const visitedSet = new Set();
  const visitedOrder = [];

  gScore[startKey] = 0;
  fScore[startKey] = heuristic(start, end);
  const open = [[fScore[startKey], start[0], start[1]]];
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (open.length) {
    open.sort((a, b) => a[0] - b[0]);
    const [, r, c] = open.shift();
    const key = `${r},${c}`;
    if (visitedSet.has(key)) continue;
    visitedSet.add(key);
    visitedOrder.push([r, c]);

    if (r === end[0] && c === end[1]) break;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      const nKey = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nc >= 0 &&
        nr < rows &&
        nc < cols &&
        !walls.has(nKey) &&
        !visitedSet.has(nKey)
      ) {
        const tentativeG = (gScore[key] ?? Infinity) + 1;
        if (tentativeG < (gScore[nKey] ?? Infinity)) {
          parent[nKey] = key;
          gScore[nKey] = tentativeG;
          fScore[nKey] = tentativeG + heuristic([nr, nc], end);
          open.push([fScore[nKey], nr, nc]);
        }
      }
    }
  }

  const path = [];
  if (visitedSet.has(endKey)) {
    let cur = endKey;
    while (cur !== startKey) {
      const [cr, cc] = cur.split(",").map(Number);
      path.unshift([cr, cc]);
      cur = parent[cur];
      if (!cur) break;
    }
    path.unshift([start[0], start[1]]);
  }

  return { visitedOrder, path };
}
