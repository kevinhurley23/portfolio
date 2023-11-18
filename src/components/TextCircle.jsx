export default function TextCircle({
  index,
  line,
  diameter,
  numCircles,
  prefersReducedMotion,
}) {
  const lineLength = line.length;
  const radius = diameter / 2;
  const direction = index % 2 ? "clockwise" : "counterclockwise";
  const duration = (index + 2) * 10 + "s";
  const opacity = 1 - (index + 1) * (1 / (numCircles + 1));

  return (
    <div
      className={`circle ${direction}`}
      style={{
        height: diameter,
        width: diameter,
        animationDuration: prefersReducedMotion ? "0s" : duration,
        opacity: opacity,
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
