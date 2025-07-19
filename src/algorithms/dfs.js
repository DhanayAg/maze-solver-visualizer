export function dfs(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const stack = [];
  const visited = new Set();

  const directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ];

  stack.push({ ...startNode, previous: null });
  visited.add(`${startNode.row}-${startNode.col}`);

  while (stack.length > 0) {
    const current = stack.pop();
    visitedNodesInOrder.push(current);

    if (current.row === endNode.row && current.col === endNode.col) {
      return { visitedNodesInOrder, shortestPath: getShortestPath(current) };
    }

    for (let [dr, dc] of directions) {
      const newRow = current.row + dr;
      const newCol = current.col + dc;

      if (
        newRow >= 0 &&
        newRow < grid.length &&
        newCol >= 0 &&
        newCol < grid[0].length
      ) {
        const neighbor = grid[newRow][newCol];
        if (!neighbor.isWall && !visited.has(`${newRow}-${newCol}`)) {
          visited.add(`${newRow}-${newCol}`);
          stack.push({ ...neighbor, previous: current });
        }
      }
    }
  }

  return { visitedNodesInOrder, shortestPath: [] }; // No path found
}

function getShortestPath(endNode) {
  const path = [];
  let current = endNode;
  while (current) {
    path.unshift(current);
    current = current.previous;
  }
  return path;
}
