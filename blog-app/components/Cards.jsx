import Link from "next/link";
import { categoryLabel, readingMinutes } from "../lib/content.mjs";
import { Icon } from "./Icons";
export function ArticleCard({ article, number, featured = false }) {
  return (
    <Link
      className={`article-card ${featured ? "featured-card" : ""}`}
      href={`/articles/${article.slug}/`}
    >
      <div className="card-meta">
        <span className="category-dot">{categoryLabel(article.category)}</span>
        <span className="card-number">
          {String(number || 1).padStart(2, "0")}
        </span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.description}</p>
      <div className="card-bottom">
        <span>
          <time dateTime={article.date}>
            {article.date.replaceAll("-", ".")}
          </time>
          <span className="meta-separator">/</span>
          {readingMinutes(article.body)} 分鐘閱讀
        </span>
        <span className="card-arrow">
          <Icon name="arrow" size={17} />
        </span>
      </div>
    </Link>
  );
}
export function RoadmapCard({ roadmap, index = 0 }) {
  const items = roadmap.stages.flatMap((s) => s.items);
  return (
    <Link href={`/roadmaps/${roadmap.slug}/`} className="roadmap-card">
      <div className="roadmap-card-top">
        <span className="eyebrow">
          PATH {String(index + 1).padStart(2, "0")}
        </span>
        <span className="small-badge">{roadmap.level}</span>
      </div>
      <div className="mini-map" aria-hidden="true">
        {roadmap.stages.map((stage, i) => (
          <span className="mini-stage" key={stage.id}>
            <i className={i === 0 ? "hot" : ""} />
            <span>
              {stage.items.slice(1, 3).map((item) => (
                <b key={item.id} className={item.type} />
              ))}
            </span>
          </span>
        ))}
      </div>
      <h3>{roadmap.title}</h3>
      <p>{roadmap.subtitle}</p>
      <div className="card-bottom">
        <span>
          {items.filter((i) => i.type === "article").length} 篇文章{" "}
          <span className="meta-separator">·</span>{" "}
          {items.filter((i) => i.type === "block").length} 個知識塊
        </span>
        <Icon name="arrow" size={17} />
      </div>
    </Link>
  );
}
