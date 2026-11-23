import { site } from "../lib/site.mjs";
export const dynamic = "force-static";
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio/", "/__studio/"] },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
