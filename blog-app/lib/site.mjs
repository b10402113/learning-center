export const site = {
  name: "塊開發",
  english: "block devlop",
  description:
    "將複雜知識拆成小塊來學習。關於 AI 開發、Agent 工程與 Context Engineering 的文章、知識塊與學習路線。",
  url: (
    process.env.SITE_URL ||
    "https://block-devlop-knowledge.andycheng0804.chatgpt.site"
  ).replace(/\/$/, ""),
  author: "塊開發編輯室",
};
export function metadataFor(title, description, path, type = "website") {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      locale: "zh_TW",
      siteName: site.name,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "塊開發 — 將複雜知識拆成小塊來學習",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}
export function jsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
