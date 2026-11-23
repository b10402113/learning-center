"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";
const labels = {
  "ai-development": "AI 開發",
  "agent-harness": "Agent 工程",
  "context-engineering": "Context 工程",
};
export default function ArticleFeed({ articles }) {
  const [category, setCategory] = useState("all");
  const filtered = articles.filter(
    (a) => category === "all" || a.category === category,
  );
  return (
    <>
      <div className="filter-row" role="group" aria-label="篩選文章分類">
        {[
          ["all", "全部文章"],
          ...[...new Set(articles.map((a) => a.category))].map((id) => [
            id,
            labels[id] || id,
          ]),
        ].map(([id, label]) => (
          <button
            key={id}
            className={category === id ? "selected" : ""}
            aria-pressed={category === id}
            onClick={() => setCategory(id)}
          >
            {label}
            {id === "all" && <span>{articles.length}</span>}
          </button>
        ))}
        <span className="filter-count">{filtered.length} ARTICLES</span>
      </div>
      <div className="article-grid">
        {filtered.map((article, i) => (
          <Link
            className="article-card"
            href={`/articles/${article.slug}/`}
            key={article.slug}
          >
            <div className="card-meta">
              <span className="category-dot">
                {labels[article.category] || article.category}
              </span>
              <span className="card-number">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <div className="card-tags">
              {article.tags?.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="card-bottom">
              <span>
                <time dateTime={article.date}>
                  {article.date.replaceAll("-", ".")}
                </time>
                <span className="meta-separator">/</span>
                {article.minutes} 分鐘閱讀
              </span>
              <span className="card-arrow">
                <Icon name="arrow" size={17} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
