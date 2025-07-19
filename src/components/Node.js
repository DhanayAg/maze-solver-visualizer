
export default function Node({ row, col, isWall, isStart, isEnd, onClick }) {
  let extraClass = "";
  if (isWall) extraClass = "node-wall";
  if (isStart) extraClass = "node-start";
  if (isEnd) extraClass = "node-end";

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClass}`}
      onClick={onClick}
    ></div>
  );
}
