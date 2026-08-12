export function MapDefs() {
  return (
    <defs>
      <radialGradient id="skyGrad" cx="50%" cy="18%" r="120%">
        <stop offset="0%" stopColor="oklch(0.24 0.05 275)" />
        <stop offset="42%" stopColor="oklch(0.18 0.03 268)" />
        <stop offset="100%" stopColor="oklch(0.12 0.02 265)" />
      </radialGradient>

      <radialGradient id="vignette" cx="50%" cy="46%" r="75%">
        <stop offset="55%" stopColor="oklch(0 0 0)" stopOpacity="0" />
        <stop offset="100%" stopColor="oklch(0.08 0.02 265)" stopOpacity="0.85" />
      </radialGradient>

      <linearGradient id="tileDim" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.24 0.028 265)" />
        <stop offset="100%" stopColor="oklch(0.19 0.024 265)" />
      </linearGradient>

      <linearGradient id="tileLit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.28 0.04 90)" />
        <stop offset="100%" stopColor="oklch(0.2 0.03 80)" />
      </linearGradient>

      <marker
        id="arrowSpine"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-muted)" />
      </marker>

      <marker
        id="arrowExplicit"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-beacon)" />
      </marker>

      <filter id="beaconGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}
