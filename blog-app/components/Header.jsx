"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BlockMark, Icon } from "./Icons";

export default function Header({ searchIndex }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef(null);
  const input = useRef(null);
  function openSearch() {
    dialog.current?.showModal();
    setTimeout(() => input.current?.focus(), 0);
  }
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    setMenu(false);
    dialog.current?.close();
  }, [pathname]);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("block-theme", next ? "dark" : "light");
    } catch {}
  }
  const results = searchIndex.filter((d) =>
    `${d.title} ${d.description} ${(d.tags || []).join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  const nav = [
    ["/", "部落格首頁"],
    ["/categories/", "文章分類"],
    ["/roadmaps/", "Roadmap"],
  ];
  return (
    <>
      <header className="topbar">
        <div className="topbar-inner page-width">
          <Link className="brand" href="/" aria-label="塊開發首頁">
            <span className="brand-mark">
              <BlockMark size={28} />
            </span>
            <span className="brand-chinese">塊開發</span>
            <span className="brand-en">
              block devlop<span className="brand-dot">.</span>
            </span>
          </Link>
          <nav
            className={`topnav ${menu ? "is-open" : ""}`}
            aria-label="主要導覽"
          >
            {nav.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  href === "/"
                    ? pathname === "/"
                      ? "page"
                      : undefined
                    : pathname.startsWith(href)
                      ? "page"
                      : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="topbar-tools">
            <button
              className="search-trigger"
              onClick={openSearch}
              aria-label="搜尋文章與知識塊"
            >
              <Icon name="search" size={16} />
              <span>搜尋</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="tool-divider" />
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={dark ? "切換淺色模式" : "切換深色模式"}
            >
              <Icon name={dark ? "sun" : "moon"} size={18} />
            </button>
            <button
              className="icon-button mobile-menu"
              onClick={() => setMenu(!menu)}
              aria-label="開啟導覽"
              aria-expanded={menu}
            >
              <Icon name={menu ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
      <dialog
        aria-label="搜尋文章、知識塊與學習路線"
        className="search-dialog"
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current.close();
        }}
      >
        <div className="search-dialog-inner">
          <div className="search-field">
            <Icon name="search" />
            <input
              ref={input}
              aria-label="搜尋標題、摘要與標籤"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="想了解什麼？搜尋文章、知識塊…"
            />
            <button
              className="icon-button"
              aria-label="關閉搜尋"
              onClick={() => dialog.current.close()}
            >
              <Icon name="close" />
            </button>
          </div>
          <p className="eyebrow search-count">
            {query ? `找到 ${results.length} 筆內容` : "從這些內容開始探索"}
          </p>
          <div className="search-results">
            {results.length ? (
              results.map((d) => (
                <Link
                  href={`/${d.kind}/${d.slug}/`}
                  key={`${d.kind}/${d.slug}`}
                  onClick={() => dialog.current.close()}
                >
                  <span className="eyebrow">
                    {d.kind === "blocks"
                      ? "○ 知識塊"
                      : d.kind === "roadmaps"
                        ? "◇ ROADMAP"
                        : "▢ 文章"}
                  </span>
                  <strong>{d.title}</strong>
                  <small>{d.description}</small>
                  <Icon name="arrow" />
                </Link>
              ))
            ) : (
              <p className="empty-state">
                沒有符合的內容，試試「Agent」或「Context」。
              </p>
            )}
          </div>
          <div className="search-bottom">
            標題、摘要與標籤搜尋 <kbd>esc 關閉</kbd>
          </div>
        </div>
      </dialog>
    </>
  );
}
