export function bfs(rows, cols, start, end, walls) {
  const startKey = `${start[0]},${start[1]}`;
  const endKey = `${end[0]},${end[1]}`;
  const queue = [[start[0], start[1]]];
  const visitedSet = new Set([startKey]);
  const visitedOrder = [[start[0], start[1]]];
  const parent = {}; // childKey -> parentKey

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (queue.length) {
    const [r, c] = queue.shift();
    if (r === end[0] && c === end[1]) break;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      const key = `${nr},${nc}`;
      if (
        nr >= 0 &&
        nc >= 0 &&
        nr < rows &&
        nc < cols &&
        !walls.has(key) &&
        !visitedSet.has(key)
      ) {
        visitedSet.add(key);
        parent[key] = `${r},${c}`;
        queue.push([nr, nc]);
        visitedOrder.push([nr, nc]);
      }
    }
  }

  // reconstruct path
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
