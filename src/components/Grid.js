import {  useRef, useState } from "react";
import Node from "./Node";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { astar } from "../algorithms/astar";

import "./Grid.css";

export default function Grid() {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);

    const isVisualizing = useRef(false);
    const [grid, setGrid] = useState(generateGrid(10, 10));
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);

    function generateGrid(r, c) {
        return Array.from({ length: r }, (_, row) =>
        Array.from({ length: c }, (_, col) => ({
            row,
            col,
            isWall: false,
            isStart: false,
            isEnd: false,
        }))
        );
    }

    const handleGridSizeChange = () => {
        const validRows = Math.max(2, Math.min(rows, 10));
        const validCols = Math.max(2, Math.min(cols, 10));

        setRows(validRows);
        setCols(validCols);

        setStartNode(null);
        setEndNode(null);
        setGrid(generateGrid(validRows, validCols));
    };

    const handleCellClick = (row, col) => {
        const newGrid = grid.map((rowArray) =>
        rowArray.map((node) => ({ ...node }))
        );

        const node = newGrid[row][col];

        if (!node.isStart && !node.isEnd && !startNode) {
        node.isStart = true;
        setStartNode({ row, col });
        } else if (!node.isStart && !node.isEnd && !endNode) {
        node.isEnd = true;
        setEndNode({ row, col });
        } else if (node.isStart) {
        node.isStart = false;
        setStartNode(null);
        } else if (node.isEnd) {
        node.isEnd = false;
        setEndNode(null);
        } else {
        node.isWall = !node.isWall;
        }

        setGrid(newGrid);
    };

    const visualizeBFS = async () => {
        if (!startNode || !endNode) {
        alert("Please set both Start and End nodes!");
        return;
        }
        clearPath();
        isVisualizing.current = true;
        const { visitedNodesInOrder, shortestPath } = bfs(grid, startNode, endNode);
        await animateAlgorithm(visitedNodesInOrder, shortestPath);
        isVisualizing.current = false;

    };

    const visualizeDFS = async () => {
        if (!startNode || !endNode) {
            alert("Please set both Start and End nodes!");
            return;
        }
        clearPath();
        isVisualizing.current = true;
        const { visitedNodesInOrder, shortestPath } = dfs(grid, startNode, endNode);
        await animateAlgorithm(visitedNodesInOrder, shortestPath);
        isVisualizing.current = false;
    };

    const visualizeAStar = async () => {
        if (!startNode || !endNode) {
            alert("Please set both Start and End nodes!");
            return;
        }
        clearPath();
        isVisualizing.current = true;
        const { visitedNodesInOrder, shortestPath } = astar(
            grid,
            startNode,
            endNode
        );

        await animateAlgorithm(visitedNodesInOrder, shortestPath);
        isVisualizing.current = false; 
    };

    const animateAlgorithm = async (visitedNodesInOrder, shortestPath) => {
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            if (!isVisualizing.current) return; // ✅ Stop immediately

            const node = visitedNodesInOrder[i];
            if (!node.isStart && !node.isEnd) {
                await new Promise((res) =>
                    setTimeout(() => {
                        if (isVisualizing.current) {
                            document.getElementById(`node-${node.row}-${node.col}`).className =
                                "node node-visited";
                        }
                        res();
                    }, 10 * i)
                );
            }
        }

        for (let i = 0; i < shortestPath.length; i++) {
            if (!isVisualizing.current) return;

            const node = shortestPath[i];
            if (!node.isStart && !node.isEnd) {
                await new Promise((res) =>
                    setTimeout(() => {
                        if (isVisualizing.current) {
                            document.getElementById(`node-${node.row}-${node.col}`).className =
                                "node node-path";
                        }
                        res();
                    }, 40 * i)
                );
            }
        }
    };

    const clearPath = () => {
        isVisualizing.current = false;
        grid.forEach((row) =>
            row.forEach((node) => {
                if (!node.isWall && !node.isStart && !node.isEnd) {
                const cell = document.getElementById(`node-${node.row}-${node.col}`);
                cell.className = "node";
                }
            })
        );
    };

    const resetGrid = () => {
        clearPath();
        setStartNode(null);
        setEndNode(null);
        setGrid(generateGrid(rows, cols));
    };
    
    return (
        <div className="app-container">
            <h1 className="title">Maze Solver – BFS, DFS & A*</h1>
            <p className="instructions">
            ✅ Click once to set <span className="green">Start</span>, then <span className="red">End</span>.  
            ✅ Click other cells to toggle <span className="black">Walls</span>.  
            ✅ Choose an algorithm to visualize.
            </p>

            <div className="grid-controls">
            <div className="size-inputs">
                <label>
                Rows:
                <input
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(Number(e.target.value))}
                    min="2"
                    max="10"
                />
                </label>
                <label>
                Columns:
                <input
                    type="number"
                    value={cols}
                    onChange={(e) => setCols(Number(e.target.value))}
                    min="2"
                    max="10"
                />
                </label>
                <button className="btn primary" onClick={handleGridSizeChange}>
                Generate Grid
                </button>
            </div>

            <div className="algorithm-buttons">
                <button className="btn bfs" onClick={visualizeBFS}>Visualize BFS</button>
                <button className="btn dfs" onClick={visualizeDFS}>Visualize DFS</button>
                <button className="btn astar" onClick={visualizeAStar}>Visualize A*</button>
                <button className="btn clear" onClick={clearPath}>Clear Path</button>
                <button className="btn reset" onClick={resetGrid}>Reset Grid</button>
            </div>
            </div>

            <div className="grid-container">
                <div className="grid">
                    {grid.map((rowArray, row) => (
                    <div key={row} className="grid-row">
                        {rowArray.map((node, col) => (
                        <Node
                            key={col}
                            row={row}
                            col={col}
                            isWall={node.isWall}
                            isStart={node.isStart}
                            isEnd={node.isEnd}
                            onClick={() => handleCellClick(row, col)}
                        />
                        ))}
                    </div>
                    ))}
                </div>

                <div className="legend-vertical">
                    <h4>Legend</h4>
                    <div><span className="legend-box start"></span> Start</div>
                    <div><span className="legend-box end"></span> End</div>
                    <div><span className="legend-box wall"></span> Wall</div>
                    <div><span className="legend-box visited"></span> Visited</div>
                    <div><span className="legend-box path"></span> Path</div>
                </div>
            </div>

        </div>
    );

}
