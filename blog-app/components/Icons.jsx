export function Icon({ name, size = 18, ...props }) {
  const paths = {
    arrow: "M5 12h14m-6-6 6 6-6 6",
    search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    moon: "M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z",
    close: "m6 6 12 12M6 18 18 6",
    menu: "M4 6h16M4 12h16M4 18h16",
    copy: "M9 9h12v12H9zM5 15H3V3h12v2",
    check: "m5 12 4 4L19 6",
    map: "m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Zm6-3v15m6-12v15",
    book: "M12 5v16M2 3l10 2 10-2v16l-10 2-10-2Z",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0",
    plus: "M12 5v14M5 12h14",
    edit: "m15 4 5 5M4 20l5-1L21 7l-5-5L4 14Z",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
export function BlockMark({ size = 32 }) {
  // Eight equal cubes, spaced along each of the three isometric axes.
  const cubes = [
    [20, 13],
    [11.6, 17.9],
    [28.4, 17.9],
    [20, 3.2],
    [20, 22.8],
    [11.6, 8.1],
    [28.4, 8.1],
    [20, 13],
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
    >
      {cubes.map(([x, y], index) => (
        <g key={index} transform={`translate(${x} ${y})`}>
          <path d="M0 0 6 3.5V10.5L0 14-6 10.5V3.5Z" />
          <path d="M0 0 6 3.5 0 7-6 3.5Z" fill="#fff" opacity=".36" />
          <path d="M0 7 6 3.5V10.5L0 14Z" fill="#000" opacity=".2" />
        </g>
      ))}
    </svg>
  );
}
