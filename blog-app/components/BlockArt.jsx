export default function BlockArt({ variant = "hero" }) {
  return (
    <div className={`block-art ${variant}`} aria-hidden="true">
      <svg viewBox="0 0 520 350" fill="none">
        <defs>
          <pattern
            id={`dots-${variant}`}
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="currentColor" opacity=".18" />
          </pattern>
          <pattern
            id={`dense-${variant}`}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1.5" cy="1.5" r="1" fill="currentColor" opacity=".6" />
          </pattern>
        </defs>
        <rect
          x="26"
          y="8"
          width="470"
          height="330"
          fill={`url(#dots-${variant})`}
        />
        <g stroke="currentColor" strokeWidth="1.3">
          <path d="M110 97 251 16l140 81-140 81Z" />
          <path d="m110 97 141 81v153l-141-81Z" />
          <path d="m251 178 140-81v153l-140 81Z" />
          <path
            d="m180 56 141 81v153M321 56 180 137v153M110 174l141 81 140-81M251 16v162"
            opacity=".28"
          />
        </g>
        <path d="m260 186 61-35v68l-61 35Z" fill="#ff6b1a" />
        <path d="m330 145 61-35v68l-61 35Z" fill={`url(#dense-${variant})`} />
        <path d="m119 111 54 31v65l-54-31Z" fill={`url(#dense-${variant})`} />
        <path d="m181 222 62 36v63l-62-35Z" fill="currentColor" opacity=".86" />
        <path d="m181 57 62-36 62 36-62 36Z" fill={`url(#dense-${variant})`} />
        <path d="m260 264 61-35v61l-61 35Z" fill={`url(#dense-${variant})`} />
        <g stroke="currentColor" opacity=".4">
          <path d="M50 260h33m-16-16v33M416 62h25m-12-12v25M416 282h50M441 257v50" />
          <circle cx="92" cy="51" r="3" />
          <circle cx="429" cy="207" r="3" />
        </g>
        <text
          x="355"
          y="322"
          fill="currentColor"
          fontSize="9"
          fontFamily="monospace"
          letterSpacing="2"
          opacity=".6"
        >
          BUILD IN BLOCKS ↗
        </text>
      </svg>
      <span className="art-coordinate">FIG. 001 / KNOWLEDGE, CONNECTED</span>
    </div>
  );
}
