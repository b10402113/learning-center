import "./globals.css";
import "katex/dist/katex.min.css";
import Link from "next/link";
import Header from "../components/Header";
import { BlockMark, Icon } from "../components/Icons";
import { publishedLibrary } from "../lib/content.mjs";
import { site, jsonLd } from "../lib/site.mjs";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "塊開發 block devlop — 將複雜知識拆成小塊來學習",
    template: "%s | 塊開發 block devlop",
  },
  description: site.description,
  applicationName: site.name,
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};
export default function RootLayout({ children }) {
  const library = publishedLibrary();
  const searchIndex = Object.values(library)
    .flat()
    .map(({ title, description, slug, kind, tags }) => ({
      title,
      description,
      slug,
      kind,
      tags: tags || [],
    }));
  return (
    <html lang="zh-Hant" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{const t=localStorage.getItem('block-theme');document.documentElement.classList.toggle('dark',t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: site.name,
              url: site.url,
              description: site.description,
              inLanguage: "zh-Hant",
            }),
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          跳至主要內容
        </a>
        <Header searchIndex={searchIndex} />
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="footer-top">
            <div>
              <Link href="/" className="footer-brand">
                <BlockMark size={23} /> 塊開發 <span>block devlop.</span>
              </Link>
              <p>把知識拆小，把理解連起來。</p>
            </div>
            <nav aria-label="頁尾導覽">
              <Link href="/">部落格首頁</Link>
              <Link href="/categories/">文章分類</Link>
              <Link href="/roadmaps/">Roadmap</Link>
              <Link href="/blocks/">
                知識塊 <Icon name="arrow" size={13} />
              </Link>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} 塊開發 · Stay curious. Build in
              blocks.
            </span>
            <div>
              <a href="/feed.xml">RSS</a>
              {process.env.NEXT_PUBLIC_LOCAL_STUDIO === "true" && (
                <Link href="/studio/">內容編輯器 ↗</Link>
              )}
              <a href="#main">回到頂端 ↑</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
