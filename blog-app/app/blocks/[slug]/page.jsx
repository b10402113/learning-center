import { notFound } from "next/navigation";
import {
  publishedLibrary,
  publicDocument,
  readingMinutes,
} from "../../../lib/content.mjs";
import { metadataFor } from "../../../lib/site.mjs";
import Reader from "../../../components/Reader";
export const dynamicParams = false;
export function generateStaticParams() {
  return publishedLibrary().blocks.map((b) => ({ slug: b.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const block = publishedLibrary().blocks.find((b) => b.slug === slug);
  return block
    ? metadataFor(block.title, block.description, `/blocks/${slug}/`)
    : {};
}
export default async function BlockPage({ params }) {
  const { slug } = await params;
  const library = publishedLibrary();
  const block = library.blocks.find((b) => b.slug === slug);
  if (!block) notFound();
  return (
    <Reader
      document={publicDocument(block)}
      blocks={[]}
      siblings={library.blocks.map(({ slug, title }) => ({ slug, title }))}
      roadmaps={library.roadmaps
        .filter((r) =>
          r.stages.some((s) =>
            s.items.some((i) => i.type === "block" && i.ref === slug),
          ),
        )
        .map(({ slug, title }) => ({ slug, title }))}
      categoryLabel="知識塊"
      minutes={readingMinutes(block.body)}
    />
  );
}
