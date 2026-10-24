import { useEffect, useRef } from "react";

const INK = "rgba(28,26,22,0.88)";
const CREAM = "rgba(232,226,210,0.85)";
const ORANGE = "#ff6b1a";

const HEX = [
  [0.47, 0.12],
  [0.78, 0.22],
  [0.84, 0.5],
  [0.62, 0.8],
  [0.25, 0.74],
  [0.16, 0.38],
];

function inPoly(pts, u, v) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    if (
      pts[i][1] > v !== pts[j][1] > v &&
      u <
        ((pts[j][0] - pts[i][0]) * (v - pts[i][1])) /
          (pts[j][1] - pts[i][1]) +
          pts[i][0]
    ) {
      inside = !inside;
    }
  }
  return inside;
}

function noise(x, y) {
  const v = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

const hexFn = (u, v) =>
  inPoly(HEX, u, v) ? Math.min(1, 0.2 + (u * 0.5 + (1 - v) * 0.6) * 0.85) : 0;

const hexEdge = (u, v) => {
  if (!inPoly(HEX, u, v)) return 0;
  const inner = HEX.map(([x, y]) => [
    0.5 + (x - 0.5) * 0.86,
    0.46 + (y - 0.46) * 0.86,
  ]);
  return !inPoly(inner, u, v) && u + (1 - v) > 1.05 ? 0.95 : 0;
};

const RECIPES = {
  hexagon: { fn: hexFn, fn2: hexEdge },
  sphere: {
    fn: (u, v) => {
      const dx = u - 0.5;
      const dy = v - 0.5;
      const d = Math.hypot(dx, dy);
      if (d > 0.44) return 0;
      const z = Math.sqrt(Math.max(0, 0.44 * 0.44 - d * d)) / 0.44;
      return 0.1 + 0.85 * Math.max(0, -dx * 0.55 - dy * 0.6 + z * 0.62);
    },
    fn2: (u, v) => {
      const dx = u - 0.5;
      const dy = v - 0.5;
      if (Math.hypot(dx, dy) > 0.44) return 0;
      return Math.abs(dy * 0.92 + dx * 0.3) < 0.022 ? 0.9 : 0;
    },
  },
  wave: {
    fn: (u, v) => {
      const crest = 0.42 + 0.2 * Math.sin(u * 9);
      return v < crest ? 0 : Math.min(1, (v - crest) * 2.4);
    },
    fn2: (u, v) => {
      const crest = 0.42 + 0.2 * Math.sin(u * 9);
      return v > crest && v < crest + 0.09 && noise(u * 40, v * 40) > 0.6
        ? 0.8
        : 0;
    },
  },
  bars: {
    fn: (u, v) => {
      const n = 5;
      const col = Math.floor(u * n);
      const g = u * n - col;
      if (g < 0.2 || g > 0.9 || col === 4) return 0;
      const hgt = [0.3, 0.45, 0.6, 0.75][col];
      return v < 1 - hgt ? 0 : 0.3 + ((v - (1 - hgt)) / hgt) * 0.7;
    },
    fn2: (u, v) => {
      const n = 5;
      const col = Math.floor(u * n);
      const g = u * n - col;
      return col === 4 && g >= 0.2 && g <= 0.9 && v > 0.08
        ? 0.35 + v * 0.65
        : 0;
    },
  },
  sunburst: {
    fn: (u, v) => {
      const dx = u - 0.5;
      const dy = v - 0.5;
      const d = Math.hypot(dx, dy);
      if (d > 0.4 || d < 0.1) return 0;
      return (
        ((Math.sin(Math.atan2(dy, dx) * 10) + 1) / 2) *
        Math.max(0, 1 - d * 2.6)
      );
    },
  },
  mountain: {
    fn: (u, v) => {
      const ridge = 0.25 + Math.abs(u - 0.5) * 1.1;
      return v < ridge ? 0 : Math.min(1, (v - ridge) * 1.8 + 0.1);
    },
    fn2: (u, v) => {
      const ridge = 0.25 + Math.abs(u - 0.5) * 1.1;
      return v > ridge && v - ridge < 0.07 && Math.abs(u - 0.5) < 0.18
        ? 0.85
        : 0;
    },
  },
};

export default function DotMatrix({
  variant = "hexagon",
  tone = "light",
  height = 160,
  className = "",
}) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.replaceChildren(canvas);

    const recipe = RECIPES[variant] || RECIPES.hexagon;
    const color = tone === "dark" ? CREAM : INK;

    const draw = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      const dpr = window.devicePixelRatio || 1;
      const ctx = canvas.getContext("2d");
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const step = w < 220 ? 8 : 9;
      const maxR = step * 0.4;
      const size = Math.min(w, h);
      const ox = (w - size) / 2;
      const oy = (h - size) / 2;

      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const u = (x - ox) / size;
          const v = (y - oy) / size;
          if (u < 0 || u > 1 || v < 0 || v > 1) continue;
          let b = recipe.fn(u, v);
          let col = color;
          if (recipe.fn2) {
            const b2 = recipe.fn2(u, v);
            if (b2 > b) {
              b = b2;
              col = ORANGE;
            }
          }
          if (b <= 0.02) continue;
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(x, y, Math.min(maxR, b * maxR), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(host);
    return () => observer.disconnect();
  }, [variant, tone]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ height }}
    />
  );
}
