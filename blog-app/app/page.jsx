import Link from "next/link";
import { publishedLibrary, readingMinutes } from "../lib/content.mjs";
import { metadataFor } from "../lib/site.mjs";
import BlockArt from "../components/BlockArt";
import ArticleFeed from "../components/ArticleFeed";
import { RoadmapCard } from "../components/Cards";
import { Icon } from "../components/Icons";
export const metadata = metadataFor(
  "塊開發 block devlop — 將複雜知識拆成小塊來學習",
  "關於 AI 開發、Agent 工程與 Context Engineering。從一篇文章理解一個問題，再用 Roadmap 把知識連起來。",
  "/",
);
export default function Home() {
  const { articles, blocks, roadmaps } = publishedLibrary();
  return (
    <div className="page-width">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> A LITTLE KNOWLEDGE, A BETTER BUILDER.
          </p>
          <h1>
            複雜的知識，
            <br />一<span className="title-block">塊</span>一塊理解
            <span className="orange">。</span>
          </h1>
          <p className="hero-description">
            寫給持續學習的開發者。
            <br />從 AI 開發到 Agent 工程，把零散的知識，
            <br className="desktop-br" />
            連成真正能用的理解。
          </p>
          <div className="hero-actions">
            <a href="#latest" className="button button-dark">
              開始閱讀 <Icon name="arrow" size={16} />
            </a>
            <Link href="/roadmaps/" className="text-link">
              探索學習路線 <Icon name="map" size={16} />
            </Link>
          </div>
        </div>
        <BlockArt />
      </section>
      <div className="intro-strip">
        <span>
          <span className="tiny-block" /> SMALL BLOCKS. BIG PICTURE.
        </span>
        <p>
          一篇文章，釐清一個問題。<span>一張路線圖，串起整體視野。</span>
        </p>
        <div>
          <strong>{String(articles.length).padStart(2, "0")}</strong> 文章{" "}
          <b>/</b> <strong>{String(blocks.length).padStart(2, "0")}</strong>{" "}
          知識塊
        </div>
      </div>
      <section id="latest" className="latest-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE LATEST / 最新筆記</p>
            <h2>最近在想的事</h2>
          </div>
          <Link href="/categories/" className="text-link small">
            所有分類 <Icon name="arrow" size={15} />
          </Link>
        </div>
        <ArticleFeed
          articles={articles.map(
            ({ slug, title, description, category, tags, date, body }) => ({
              slug,
              title,
              description,
              category,
              tags,
              date,
              minutes: readingMinutes(body),
            }),
          )}
        />
      </section>
      <section className="paths-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LEARN WITH A MAP / 有方向地學習</p>
            <h2>把知識連成一條路</h2>
            <p className="section-description">
              不知道從哪開始？選一條路線，讓文章與知識塊帶你往前走。
            </p>
          </div>
          <Link href="/roadmaps/" className="text-link small">
            所有 Roadmap <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="roadmap-grid">
          {roadmaps.map((roadmap, i) => (
            <RoadmapCard key={roadmap.slug} roadmap={roadmap} index={i} />
          ))}
        </div>
      </section>
      <section className="manifesto">
        <span className="eyebrow">THE IDEA BEHIND BLOCK DEVLOP</span>
        <p>
          知識不用一次讀完。
          <br />
          今天多懂一塊，明天就能多做一點。
        </p>
        <span className="manifesto-mark">▦</span>
      </section>
    </div>
  );
}
