import Link from "next/link";
import { publishedLibrary } from "../../lib/content.mjs";
import { metadataFor } from "../../lib/site.mjs";
import { Icon } from "../../components/Icons";
export const metadata = metadataFor(
  "知識塊",
  "一個知識塊，釐清一個核心概念。獨立閱讀或搭配文章，一塊一塊建立理解。",
  "/blocks/",
);
export default function BlocksPage() {
  const { blocks } = publishedLibrary();
  return (
    <div className="page-width">
      <header className="page-heading">
        <nav className="breadcrumbs">
          <Link href="/">首頁</Link>
          <span>/</span>
          <span>知識塊</span>
        </nav>
        <p className="eyebrow">SMALL BLOCKS / 核心概念</p>
        <h1>
          一次，弄懂一小塊<span className="orange">。</span>
        </h1>
        <p className="lead">
          每個知識塊都能獨立閱讀。不用先讀完整篇文章，也能理解一個概念的定義、用途與邊界。
        </p>
      </header>
      <div className="block-list">
        {blocks.map((block, i) => (
          <Link
            href={`/blocks/${block.slug}/`}
            className="block-index-card"
            key={block.slug}
          >
            <span className="block-circle">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2>{block.title}</h2>
            <p>{block.description}</p>
            <span className="text-link">
              展開這一塊 <Icon name="arrow" size={15} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
