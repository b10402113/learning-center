"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";
import { BlockPopup } from "./Reader";

export default function RoadmapMap({ stages, id = "roadmap", roadmapSlug }) {
  const [view, setView] = useState("map");
  const [hovered, setHovered] = useState(null);
  const [block, setBlock] = useState(null);
  const articleHref = (ref) =>
    `/articles/${ref}/${roadmapSlug ? `?roadmap=${roadmapSlug}` : ""}`;
  const layout = useMemo(() => {
    const nodes = stages.flatMap((s, column) =>
      s.items.map((item, row) => ({
        ...item,
        x: 32 + column * 268,
        y: 127 + row * 149,
      })),
    );
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const edges = nodes.flatMap((n) =>
      (n.requires || [])
        .filter((r) => byId.has(r))
        .map((r) => ({ from: byId.get(r), to: n })),
    );
    const neighbors = new Set(
      hovered
        ? [
            hovered,
            ...edges
              .filter((e) => e.from.id === hovered || e.to.id === hovered)
              .flatMap((e) => [e.from.id, e.to.id]),
          ]
        : [],
    );
    return {
      nodes,
      edges,
      neighbors,
      width: Math.max(900, stages.length * 268 + 6),
      height: Math.max(395, ...stages.map((s) => s.items.length * 149 + 139)),
    };
  }, [stages, hovered]);
  const itemContent = (item) => (
    <>
      <span>{item.type === "article" ? "▢ ARTICLE" : "○ BLOCK"}</span>
      <strong>{item.document?.title || item.ref}</strong>
      <Icon name="arrow" size={13} />
    </>
  );
  return (
    <>
      <div className="map-toolbar">
        <div className="map-legend">
          <span>
            <i className="legend-square" />
            文章
          </span>
          <span>
            <i className="legend-circle" />
            知識塊
          </span>
          <span>→ 先修關係</span>
        </div>
        <div
          className="map-view-buttons"
          role="group"
          aria-label="Roadmap 檢視方式"
        >
          <button aria-pressed={view === "map"} onClick={() => setView("map")}>
            路線圖
          </button>
          <button
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            清單
          </button>
        </div>
      </div>
      {view === "map" ? (
        <>
          <div
            className="roadmap-canvas"
            tabIndex={0}
            role="region"
            aria-label="學習路線圖，可水平捲動；也可切換清單檢視"
          >
            <div
              className="map-inner"
              style={{ width: layout.width, height: layout.height }}
            >
              <svg
                width={layout.width}
                height={layout.height}
                aria-hidden="true"
                style={{ position: "absolute", inset: 0 }}
              >
                <defs>
                  <marker
                    id={`arrow-${id}`}
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M0 0 10 5 0 10"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="1.3"
                    />
                  </marker>
                </defs>
                {layout.edges.map(({ from, to }) => {
                  const same = from.x === to.x;
                  const x1 = from.x + (same ? 105 : 210),
                    y1 =
                      from.y + (same ? (from.type === "block" ? 86 : 112) : 55),
                    x2 = to.x + (same ? 105 : 0),
                    y2 = to.y + (same ? 0 : 55);
                  return (
                    <path
                      key={`${from.id}-${to.id}`}
                      markerEnd={`url(#arrow-${id})`}
                      className={`map-edge ${hovered && (from.id === hovered || to.id === hovered) ? "hot" : ""}`}
                      d={
                        same
                          ? `M${x1} ${y1} L${x2} ${y2 - 3}`
                          : `M${x1} ${y1} C${x1 + 35} ${y1},${x2 - 35} ${y2},${x2 - 3} ${y2}`
                      }
                    />
                  );
                })}
              </svg>
              {stages.map((stage, i) => (
                <div
                  className="map-stage-label"
                  style={{ left: 32 + i * 268 }}
                  key={stage.id}
                >
                  <span className="eyebrow">
                    PHASE {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                </div>
              ))}
              {layout.nodes.map((item) => {
                const props = {
                  className: `map-node ${item.type} ${hovered === item.id ? "highlight" : ""} ${hovered && !layout.neighbors.has(item.id) ? "dim" : ""}`,
                  style: { left: item.x, top: item.y },
                  onMouseEnter: () => setHovered(item.id),
                  onMouseLeave: () => setHovered(null),
                  onFocus: () => setHovered(item.id),
                  onBlur: () => setHovered(null),
                };
                return item.type === "article" ? (
                  <Link key={item.id} href={articleHref(item.ref)} {...props}>
                    {itemContent(item)}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    {...props}
                    onClick={() => setBlock(item.document)}
                  >
                    {itemContent(item)}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="map-caption">
            <span>依階段由左至右閱讀 · 點選文章開啟閱讀</span>
            <span>知識塊可隨時展開 ○</span>
          </p>
        </>
      ) : (
        <div className="roadmap-list">
          {stages.map((stage, i) => (
            <section className="roadmap-list-stage" key={stage.id}>
              <div>
                <span className="eyebrow">
                  PHASE {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{stage.title}</h3>
              </div>
              <div className="stage-items">
                {stage.items.map((item) =>
                  item.type === "article" ? (
                    <Link
                      className="list-item"
                      href={articleHref(item.ref)}
                      key={item.id}
                    >
                      <span>▢</span>
                      {item.document?.title || item.ref}
                      <Icon name="arrow" size={14} />
                    </Link>
                  ) : (
                    <button
                      className="list-item"
                      key={item.id}
                      onClick={() => setBlock(item.document)}
                    >
                      <span>○</span>
                      {item.document?.title || item.ref}
                      <Icon name="plus" size={14} />
                    </button>
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      )}
      <BlockPopup block={block} onClose={() => setBlock(null)} />
    </>
  );
}
