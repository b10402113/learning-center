import Link from "next/link";
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 / A MISSING BLOCK</p>
      <h1>這一塊，還沒找到。</h1>
      <p>文章可能已移動，或尚未公開。先從首頁找一塊感興趣的知識吧。</p>
      <Link className="button button-dark" href="/">
        回到部落格首頁 →
      </Link>
    </section>
  );
}
