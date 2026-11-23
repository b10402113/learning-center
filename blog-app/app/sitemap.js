import { publishedLibrary } from "../lib/content.mjs";
import { site } from "../lib/site.mjs";
export const dynamic = "force-static";
export default function sitemap() {
  const library = publishedLibrary();
  return [
    "",
    "/categories",
    "/blocks",
    "/roadmaps",
    ...[...new Set(library.articles.map((a) => a.category))].map(
      (c) => `/categories/${c}`,
    ),
  ]
    .map((path) => ({
      url: `${site.url}${path}/`,
      changeFrequency: "weekly",
      priority: path ? 0.7 : 1,
    }))
    .concat(
      Object.values(library)
        .flat()
        .map((d) => ({
          url: `${site.url}/${d.kind}/${d.slug}/`,
          lastModified: d.updated || d.date,
          changeFrequency: "monthly",
          priority: d.kind === "articles" ? 0.8 : 0.7,
        })),
    );
}
