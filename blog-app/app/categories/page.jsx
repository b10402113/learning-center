import Link from "next/link";
import { publishedLibrary, categoryLabel } from "../../lib/content.mjs";
import { metadataFor } from "../../lib/site.mjs";
import { ArticleCard } from "../../components/Cards";
import { Icon } from "../../components/Icons";
export const metadata = metadataFor(
  "文章分類",
  "依主題探索 AI 開發、Agent 工程與 Context Engineering 的文章。",
  "/categories/",
);
const descriptions = {
  "ai-development": "從工具定義到可靠的應用，逐步理解 AI 開發實務。",
  "agent-harness": "模型之外，讓 Agent 真正運作的控制、工具與執行框架。",
  "context-engineering": "整理歷史、狀態與記憶，給模型剛好足夠的資訊。",
};
export default function CategoriesPage() {
  const { articles } = publishedLibrary();
  const categories = [...new Set(articles.map((a) => a.category))];
  return (
    <div className="page-width">
      <header className="page-heading">
        <nav className="breadcrumbs">
          <Link href="/">首頁</Link>
          <span>/</span>
          <span>文章分類</span>
        </nav>
        <p className="eyebrow">FIND YOUR INTEREST / 依主題探索</p>
        <h1>
          從你在意的問題開始<span className="orange">。</span>
        </h1>
        <p className="lead">
          每一篇文章處理一個具體問題。選擇你感興趣的領域，找到下一塊值得理解的知識。
        </p>
      </header>
      <div className="category-grid">
        {categories.map((category, i) => (
          <Link
            href={`/categories/${category}/`}
            className="category-card"
            key={category}
          >
            <Icon name={["grid", "book", "map"][i % 3]} size={27} />
            <h2>{categoryLabel(category)}</h2>
            <p>
              {descriptions[category] ||
                `探索${categoryLabel(category)}的文章與實作。`}
            </p>
            <span>
              {articles.filter((a) => a.category === category).length} 篇文章{" "}
              <Icon name="arrow" size={15} />
            </span>
          </Link>
        ))}
      </div>
      <section className="category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ALL ARTICLES</p>
            <h2>所有文章</h2>
          </div>
          <span className="eyebrow">{articles.length} ARTICLES</span>
        </div>
        <div className="article-grid">
          {articles.map((a, i) => (
            <ArticleCard article={a} key={a.slug} number={i + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
