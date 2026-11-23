import { publishedLibrary } from "../../lib/content.mjs";
import { site } from "../../lib/site.mjs";
export const dynamic = "force-static";
const escape = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export function GET() {
  const { articles } = publishedLibrary();
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(site.name)}</title><link>${site.url}</link><description>${escape(site.description)}</description><language>zh-TW</language>${articles.map((a) => `<item><title>${escape(a.title)}</title><link>${site.url}/articles/${a.slug}/</link><guid>${site.url}/articles/${a.slug}/</guid><description>${escape(a.description)}</description><pubDate>${new Date(a.date + "T00:00:00+08:00").toUTCString()}</pubDate></item>`).join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
