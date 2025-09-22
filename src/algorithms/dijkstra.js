export function dijkstra(rows, cols, start, end, walls) {
  const startKey = `${start[0]},${start[1]}`;
  const endKey = `${end[0]},${end[1]}`;
  const dist = {};
  const visitedSet = new Set();
  const visitedOrder = [];
  const parent = {};

  dist[startKey] = 0;
  const pq = [[0, start[0], start[1]]]; // [dist, r, c]
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, r, c] = pq.shift();
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
        const nd = d + 1; // cost 1 per move
        if (nd < (dist[nKey] ?? Infinity)) {
          dist[nKey] = nd;
          parent[nKey] = key;
          pq.push([nd, nr, nc]);
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
