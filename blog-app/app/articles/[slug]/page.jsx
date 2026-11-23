import { notFound } from "next/navigation";
import {
  publishedLibrary,
  publicDocument,
  categoryLabel,
  readingMinutes,
} from "../../../lib/content.mjs";
import { metadataFor, site, jsonLd } from "../../../lib/site.mjs";
import Reader from "../../../components/Reader";
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedLibrary().articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = publishedLibrary().articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    ...metadataFor(
      article.title,
      article.description,
      `/articles/${slug}/`,
      "article",
    ),
    openGraph: {
      ...metadataFor(
        article.title,
        article.description,
        `/articles/${slug}/`,
        "article",
      ).openGraph,
      publishedTime: article.date,
      authors: [article.author || site.author],
    },
  };
}
export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const library = publishedLibrary();
  const article = library.articles.find((a) => a.slug === slug);
  if (!article) notFound();
  const blocks = library.blocks.filter((b) => article.blocks?.includes(b.slug));
  const roadmaps = library.roadmaps.filter((r) =>
    r.stages.some((s) =>
      s.items.some((i) => i.type === "article" && i.ref === slug),
    ),
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            dateModified: article.updated || article.date,
            author: {
              "@type": "Organization",
              name: article.author || site.author,
              url: site.url,
            },
            publisher: {
              "@type": "Organization",
              name: site.name,
              url: site.url,
            },
            image: `${site.url}/og.png`,
            mainEntityOfPage: `${site.url}/articles/${slug}/`,
            inLanguage: "zh-Hant",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "首頁",
                item: site.url,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: categoryLabel(article.category),
                item: `${site.url}/categories/${article.category}/`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: article.title,
                item: `${site.url}/articles/${slug}/`,
              },
            ],
          }),
        }}
      />
      <Reader
        document={publicDocument(article)}
        blocks={blocks.map(publicDocument)}
        siblings={library.articles
          .filter((a) => a.category === article.category)
          .map(({ slug, title }) => ({ slug, title }))}
        roadmaps={roadmaps.map((r) => ({
          slug: r.slug,
          title: r.title,
          articles: [
            ...new Set(
              r.stages.flatMap((s) =>
                s.items.filter((i) => i.type === "article").map((i) => i.ref),
              ),
            ),
          ].map((slug) => ({
            slug,
            title: library.articles.find((a) => a.slug === slug).title,
          })),
        }))}
        categoryLabel={categoryLabel(article.category)}
        minutes={readingMinutes(article.body)}
      />
    </>
  );
}
