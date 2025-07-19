export function astar(grid, startNode, endNode) {
  const visitedNodesInOrder = [];
  const openSet = [];
  const closedSet = new Set();

  // Helper functions
  const manhattanDistance = (nodeA, nodeB) =>
    Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);

  const directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ];

  // Initialize start node
  openSet.push({
    ...startNode,
    g: 0,
    h: manhattanDistance(startNode, endNode),
    f: manhattanDistance(startNode, endNode),
    previous: null,
  });

  while (openSet.length > 0) {
    // Sort by f value (lowest first)
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    visitedNodesInOrder.push(current);
    closedSet.add(`${current.row}-${current.col}`);

    // If reached the end
    if (current.row === endNode.row && current.col === endNode.col) {
      return {
        visitedNodesInOrder,
        shortestPath: getShortestPath(current),
      };
    }

    // Explore neighbors
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
        const neighborKey = `${newRow}-${newCol}`;

        if (neighbor.isWall || closedSet.has(neighborKey)) continue;

        const gScore = current.g + 1;
        const hScore = manhattanDistance(neighbor, endNode);
        const fScore = gScore + hScore;

        const existingNode = openSet.find(
          (node) => node.row === newRow && node.col === newCol
        );

        if (!existingNode || gScore < existingNode.g) {
          if (existingNode) {
            existingNode.g = gScore;
            existingNode.h = hScore;
            existingNode.f = fScore;
            existingNode.previous = current;
          } else {
            openSet.push({
              ...neighbor,
              g: gScore,
              h: hScore,
              f: fScore,
              previous: current,
            });
          }
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
