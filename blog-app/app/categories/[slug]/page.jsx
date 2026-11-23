import Link from "next/link";
import { notFound } from "next/navigation";
import { publishedLibrary, categoryLabel } from "../../../lib/content.mjs";
import { metadataFor } from "../../../lib/site.mjs";
import { ArticleCard } from "../../../components/Cards";
export const dynamicParams = false;
export function generateStaticParams() {
  return [...new Set(publishedLibrary().articles.map((a) => a.category))].map(
    (slug) => ({ slug }),
  );
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return metadataFor(
    categoryLabel(slug),
    `探索${categoryLabel(slug)}的文章、觀念與實作。`,
    `/categories/${slug}/`,
  );
}
export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const articles = publishedLibrary().articles.filter(
    (a) => a.category === slug,
  );
  if (!articles.length) notFound();
  return (
    <div className="page-width">
      <header className="page-heading">
        <nav className="breadcrumbs">
          <Link href="/">首頁</Link>
          <span>/</span>
          <Link href="/categories/">文章分類</Link>
          <span>/</span>
          <span>{categoryLabel(slug)}</span>
        </nav>
        <p className="eyebrow">
          TOPIC / {slug.toUpperCase().replaceAll("-", " ")}
        </p>
        <h1>
          {categoryLabel(slug)}
          <span className="orange">。</span>
        </h1>
        <p className="lead">
          {articles.length} 篇文章，從一個問題開始，逐步建立你的理解。
        </p>
      </header>
      <div className="article-grid category-section">
        {articles.map((a, i) => (
          <ArticleCard key={a.slug} article={a} number={i + 1} />
        ))}
      </div>
    </div>
  );
}
