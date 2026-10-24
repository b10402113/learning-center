import { useEffect, useRef } from "react";

const MARK = [
  "....oo....",
  "...oooo...",
  ".oooooooo.",
  "oooooooooo",
  "o.oooooo.o",
  "oooooooooo",
  "oooooooooo",
  "o.oooooo.o",
  ".oooooooo.",
  "....oo....",
];

export default function PixelMark({ size = 28, color = "#ff6b1a" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const px = 4;
    canvas.width = MARK[0].length * px;
    canvas.height = MARK.length * px;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    MARK.forEach((row, y) => {
      [...row].forEach((key, x) => {
        if (key === ".") return;
        ctx.fillStyle = color;
        ctx.fillRect(x * px, y * px, px, px);
      });
    });
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="block"
      style={{
        width: size,
        height: size,
        imageRendering: "pixelated",
      }}
    />
  );
}
