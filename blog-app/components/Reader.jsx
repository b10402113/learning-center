"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Markdown from "./Markdown";
import { extractHeadings } from "../lib/heading-anchor.mjs";
import { BlockMark, Icon } from "./Icons";

export function BlockPopup({ block, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (block) ref.current?.showModal();
    else ref.current?.close();
  }, [block]);
  return (
    <dialog
      aria-labelledby="block-popup-title"
      ref={ref}
      className="block-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onClose={onClose}
    >
      {block && (
        <>
          <div className="block-dialog-toolbar">
            <span className="eyebrow orange">○ KNOWLEDGE BLOCK / 知識塊</span>
            <button
              className="icon-button"
              onClick={onClose}
              aria-label="關閉知識塊"
            >
              <Icon name="close" />
            </button>
          </div>
          <h2 id="block-popup-title">{block.title}</h2>
          <Markdown>{block.body.replace(/^#\s+.*\n+/, "")}</Markdown>
          <Link
            className="button"
            href={`/blocks/${block.slug}/`}
            onClick={onClose}
          >
            閱讀完整知識塊 <Icon name="arrow" size={15} />
          </Link>
        </>
      )}
    </dialog>
  );
}
function Toc({ headings, active }) {
  return (
    <nav className="toc" aria-label="文章目錄">
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`${active === h.id ? "active" : ""} ${h.depth === 3 ? "subheading" : ""}`}
          aria-current={active === h.id ? "location" : undefined}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
export default function Reader({
  document: doc,
  blocks,
  siblings,
  roadmaps,
  categoryLabel,
  minutes,
}) {
  const headings = extractHeadings(doc.body);
  const [active, setActive] = useState(headings[0]?.id);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState("");
  const [block, setBlock] = useState(null);
  const [fontSize, setFontSize] = useState(17);
  const [roadmapSlug, setRoadmapSlug] = useState(null);
  const articleRef = useRef(null);
  const copyTimer = useRef(null);
  const activeRoadmap = roadmaps.find((r) => r.slug === roadmapSlug);
  const readingOrder = activeRoadmap?.articles || siblings;
  const articleHref = (slug) =>
    `/${doc.kind}/${slug}/${activeRoadmap ? `?roadmap=${activeRoadmap.slug}` : ""}`;
  const index = readingOrder.findIndex((a) => a.slug === doc.slug);
  const previous = readingOrder[index - 1],
    next = readingOrder[index + 1];
  useEffect(() => {
    setRoadmapSlug(new URLSearchParams(window.location.search).get("roadmap"));
  }, [doc.slug]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const article = articleRef.current;
      if (!article) return;
      const rect = article.getBoundingClientRect();
      setProgress(
        Math.min(
          1,
          Math.max(
            0,
            (90 - rect.top) /
              Math.max(1, rect.height - window.innerHeight + 90),
          ),
        ),
      );
      let current = headings[0]?.id;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el?.getBoundingClientRect().top <= 135) current = h.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [doc.slug]);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  async function copy() {
    clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText(doc.body);
      setCopied("已複製");
    } catch {
      setCopied("複製失敗");
    }
    copyTimer.current = setTimeout(() => setCopied(""), 2000);
  }
  const openBlock = (id) => setBlock(blocks.find((b) => b.slug === id));
  const isBlock = doc.kind === "blocks";
  return (
    <>
      <div
        className="reading-progress"
        style={{ transform: `scaleX(${progress})` }}
      />
      <div className="reader-layout">
        <aside className="reader-left" aria-label="相關文章導覽">
          <Link
            href={
              activeRoadmap
                ? `/roadmaps/${activeRoadmap.slug}/`
                : isBlock
                  ? "/blocks/"
                  : "/categories/"
            }
            className="back-link"
          >
            ←{" "}
            {activeRoadmap
              ? activeRoadmap.title
              : isBlock
                ? "所有知識塊"
                : "所有文章"}
          </Link>
          <p className="eyebrow">
            {activeRoadmap
              ? "IN THIS ROADMAP"
              : isBlock
                ? "KNOWLEDGE BLOCKS"
                : "IN THIS CATEGORY"}
          </p>
          <nav>
            {readingOrder.map((a) => (
              <Link
                href={articleHref(a.slug)}
                key={a.slug}
                className={a.slug === doc.slug ? "current" : ""}
                aria-current={a.slug === doc.slug ? "page" : undefined}
              >
                {a.title}
              </Link>
            ))}
          </nav>
          {roadmaps.length > 0 && (
            <>
              <div className="rail-divider" />
              <p className="eyebrow">CONTINUE WITH A MAP</p>
              <nav>
                {roadmaps.map((r) => (
                  <Link href={`/roadmaps/${r.slug}/`} key={r.slug}>
                    ◇ {r.title} ↗
                  </Link>
                ))}
              </nav>
            </>
          )}
        </aside>
        <article ref={articleRef} className="reader-article">
          <header className="reader-header">
            <nav className="breadcrumbs" aria-label="麵包屑">
              <Link href="/">首頁</Link>
              <span>/</span>
              <Link
                href={isBlock ? "/blocks/" : `/categories/${doc.category}/`}
              >
                {isBlock ? "知識塊" : categoryLabel}
              </Link>
              <span>/</span>
              <span>{isBlock ? "Block" : "Article"}</span>
            </nav>
            <div className="article-meta">
              <span className="category-dot">
                {isBlock ? "KNOWLEDGE BLOCK" : categoryLabel}
              </span>
              <span className="dot">·</span>
              <time dateTime={doc.date}>{doc.date.replaceAll("-", ".")}</time>
              <span className="dot">·</span>
              <Icon name="clock" size={12} />
              <span>{minutes} 分鐘閱讀</span>
            </div>
            <h1>{doc.title}</h1>
            <p className="reader-description">{doc.description}</p>
            <div className="author-line">
              <span className="author-avatar">
                <BlockMark size={18} />
              </span>
              <span>{doc.author || "塊開發編輯室"}</span>
              <div className="reader-toolbar">
                <button
                  onClick={() =>
                    setFontSize((s) => (s === 17 ? 19 : s === 19 ? 16 : 17))
                  }
                  aria-label="調整閱讀字級"
                >
                  Aa
                </button>
                <button onClick={copy}>
                  <Icon
                    name={copied === "已複製" ? "check" : "copy"}
                    size={12}
                  />
                  <span aria-live="polite">{copied || "複製全文"}</span>
                </button>
              </div>
            </div>
          </header>
          {headings.length > 0 && (
            <details className="mobile-toc">
              <summary>本篇目錄 · {headings.length} 個段落</summary>
              <Toc headings={headings} active={active} />
            </details>
          )}
          <div
            className="reading-body"
            style={{ "--reading-size": `${fontSize}px` }}
          >
            <Markdown
              blockIds={blocks.map((b) => b.slug)}
              onOpenBlock={openBlock}
            >
              {doc.body.replace(/^#\s+.*\n+/, "")}
            </Markdown>
          </div>
          {blocks.length > 0 && (
            <section className="related-blocks-inline" aria-label="本篇知識塊">
              <p className="eyebrow">TAKE A CLOSER LOOK / 本篇知識塊</p>
              {blocks.map((b) => (
                <button
                  className="rail-block"
                  key={b.slug}
                  onClick={() => setBlock(b)}
                >
                  <span className="circle">○</span>
                  <span>{b.title}</span>
                  <Icon name="arrow" size={14} />
                </button>
              ))}
              <p className="rail-note">點開知識塊補充理解，關閉後繼續閱讀。</p>
            </section>
          )}
          <footer className="article-end">
            <p>把這一塊，放進你的理解裡。</p>
            <span className="eyebrow">STAY CURIOUS. BUILD IN BLOCKS.</span>
            <div className="tags">
              {doc.tags?.map((t) => (
                <Link href={`/categories/${doc.category}/`} key={t}>
                  # {t}
                </Link>
              ))}
            </div>
          </footer>
          <nav className="article-pagination" aria-label="前後篇文章">
            {previous ? (
              <Link href={articleHref(previous.slug)}>
                <span className="eyebrow">← 上一篇</span>
                {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={articleHref(next.slug)}>
                <span className="eyebrow">下一篇 →</span>
                {next.title}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>
        <aside className="reader-rail" aria-label="閱讀輔助">
          <p className="eyebrow">ON THIS PAGE / 本篇目錄</p>
          <Toc headings={headings} active={active} />
          {blocks.length > 0 && (
            <>
              <div className="rail-divider" />
              <p className="eyebrow">BUILDING BLOCKS</p>
              {blocks.map((b) => (
                <button
                  key={b.slug}
                  className="rail-block"
                  onClick={() => setBlock(b)}
                >
                  <span className="circle">○</span>
                  <span>{b.title}</span>
                </button>
              ))}
              <p className="rail-note">
                遇到不熟悉的概念？
                <br />
                點開知識塊，補一塊再繼續。
              </p>
            </>
          )}
        </aside>
      </div>
      <BlockPopup block={block} onClose={() => setBlock(null)} />
    </>
  );
}
