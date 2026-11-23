import Link from "next/link";
import { publishedLibrary } from "../../lib/content.mjs";
import { metadataFor } from "../../lib/site.mjs";
import { RoadmapCard } from "../../components/Cards";
export const metadata = metadataFor(
  "學習路線 Roadmap",
  "選擇一條學習路線，透過相互連接的文章與知識塊，建立完整的知識地圖。",
  "/roadmaps/",
);
export default function RoadmapsPage() {
  const { roadmaps } = publishedLibrary();
  return (
    <div className="page-width roadmap-index">
      <header className="page-heading">
        <nav className="breadcrumbs">
          <Link href="/">首頁</Link>
          <span>/</span>
          <span>Roadmap</span>
        </nav>
        <p className="eyebrow">THE BIG PICTURE / 把理解連起來</p>
        <h1>
          學習，也可以有地圖<span className="orange">。</span>
        </h1>
        <p className="lead">
          文章是節點，知識塊是補給。選一個想深入的方向，沿著路線循序前進，也可以隨時走進感興趣的分支。
        </p>
      </header>
      <div className="roadmap-grid">
        {roadmaps.map((r, i) => (
          <RoadmapCard key={r.slug} roadmap={r} index={i} />
        ))}
      </div>
      <aside className="roadmap-note">
        <strong>一張地圖，兩種閱讀方式</strong>
        沿著階段閱讀文章，建立整體理解；遇到不熟悉的概念，點開圓形的知識塊快速補充。每個知識塊也有獨立頁面，方便收藏與分享。
      </aside>
    </div>
  );
}
