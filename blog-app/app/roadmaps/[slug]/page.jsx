import Link from "next/link";
import { notFound } from "next/navigation";
import { publishedLibrary, resolveRoadmap } from "../../../lib/content.mjs";
import { metadataFor, site, jsonLd } from "../../../lib/site.mjs";
import RoadmapMap from "../../../components/RoadmapMap";
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedLibrary().roadmaps.map((r) => ({ slug: r.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = publishedLibrary().roadmaps.find((r) => r.slug === slug);
  return r
    ? metadataFor(`${r.title} 學習路線`, r.description, `/roadmaps/${slug}/`)
    : {};
}
export default async function RoadmapPage({ params }) {
  const { slug } = await params;
  const library = publishedLibrary();
  const roadmap = library.roadmaps.find((r) => r.slug === slug);
  if (!roadmap) notFound();
  const stages = resolveRoadmap(roadmap, library);
  const items = stages.flatMap((s) => s.items);
  return (
    <div className="page-width roadmap-index">
      <nav
        className="breadcrumbs"
        style={{ marginTop: 32 }}
        aria-label="麵包屑"
      >
        <Link href="/">首頁</Link>
        <span>/</span>
        <Link href="/roadmaps/">Roadmap</Link>
        <span>/</span>
        <span>{roadmap.title}</span>
      </nav>
      <nav className="roadmap-switcher" aria-label="選擇學習路線">
        {library.roadmaps.map((r) => (
          <Link
            href={`/roadmaps/${r.slug}/`}
            key={r.slug}
            aria-current={r.slug === slug ? "page" : undefined}
          >
            {r.title}
          </Link>
        ))}
      </nav>
      <header className="roadmap-heading">
        <div>
          <p className="eyebrow">YOUR LEARNING PATH / {roadmap.level}</p>
          <h1>
            {roadmap.title}
            <span className="orange">.</span>
          </h1>
          <h2>{roadmap.subtitle}</h2>
          <p>{roadmap.description}</p>
        </div>
        <div className="roadmap-stats">
          <div>
            <strong>{stages.length}</strong>學習階段
          </div>
          <div>
            <strong>{items.filter((i) => i.type === "article").length}</strong>
            篇文章
          </div>
          <div>
            <strong>{items.filter((i) => i.type === "block").length}</strong>
            個知識塊
          </div>
        </div>
      </header>
      <RoadmapMap stages={stages} id={slug} roadmapSlug={slug} />
      <aside className="roadmap-note">
        <strong>讀文章，搭配知識塊，把路線走成自己的理解。</strong>
        {roadmap.body} 可以用觸控板左右捲動路線圖，或切換為清單檢視。
      </aside>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: roadmap.title,
            description: roadmap.description,
            itemListElement: items.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: item.document.title,
              url: `${site.url}/${item.type === "article" ? "articles" : "blocks"}/${item.ref}/`,
            })),
          }),
        }}
      />
    </div>
  );
}
