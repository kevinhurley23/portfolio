export default function TextCircle({ index, line, diameter }) {
  const lineLength = line.length;
  const radius = diameter / 2;
  const direction = index % 2 ? "clockwise" : "counterclockwise";
  const duration = (index + 2) * 10 + "s";
  const opacity = 1 - (index + 1) / 20;
  // const color = index % 2 ? "green" : "blue";

  return (
    <div
      className={`circle ${direction}`}
      style={{
        height: diameter,
        width: diameter,
        animationDuration: duration,
        opacity: opacity,
        // color: color,
      }}
    >
      {line.split("").map((char, i) => (
        <span
          style={{
            transform: `rotate(${i * (360 / lineLength)}deg)`,
            transformOrigin: `0 ${radius}px`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
