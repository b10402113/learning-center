import matter from "gray-matter";

export const kinds = ["articles", "blocks", "roadmaps"];
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function parseDocument(raw, slug, kind) {
  const { data, content } = matter(raw);
  return { ...data, slug, kind, body: content.trim(), raw };
}
export function validateLibrary(library) {
  const errors = [];
  for (const kind of kinds) {
    const seen = new Set();
    for (const doc of library[kind] || []) {
      const name = `${kind}/${doc.slug}`;
      const fail = (text) => errors.push(`${name}: ${text}`);
      if (!slugPattern.test(doc.slug) || seen.has(doc.slug))
        fail("slug 必須是唯一的小寫英文、數字與連字號");
      seen.add(doc.slug);
      if (typeof doc.title !== "string" || !doc.title.trim())
        fail("缺少 title");
      if (typeof doc.description !== "string" || !doc.description.trim())
        fail("缺少 description（搜尋摘要）");
      if (!["draft", "published"].includes(doc.status))
        fail("status 必須為 draft 或 published");
      const date = Date.parse(doc.date);
      if (
        typeof doc.date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(doc.date) ||
        !Number.isFinite(date) ||
        new Date(date).toISOString().slice(0, 10) !== doc.date
      )
        fail("date 必須為有效的 YYYY-MM-DD 字串（YAML 日期請加引號）");
      if (
        doc.updated !== undefined &&
        (typeof doc.updated !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(doc.updated) ||
          !Number.isFinite(Date.parse(doc.updated)))
      )
        fail("updated 必須為 YYYY-MM-DD 字串");
      if (doc.author !== undefined && typeof doc.author !== "string")
        fail("author 必須是字串");
      if (!doc.body.trim()) fail("Markdown 內容不可為空");
      if (kind === "roadmaps") {
        if (!Array.isArray(doc.stages) || !doc.stages.length) {
          fail("至少需要一個 stages 階段");
          continue;
        }
        const itemIds = new Set();
        const stageIds = new Set();
        for (const stage of doc.stages) {
          if (!stage || typeof stage !== "object") {
            fail("階段必須是物件");
            continue;
          }
          if (
            typeof stage.title !== "string" ||
            !stage.title.trim() ||
            !slugPattern.test(stage.id) ||
            stageIds.has(stage.id)
          )
            fail("階段需要標題與唯一 id");
          stageIds.add(stage.id);
          if (!Array.isArray(stage.items) || !stage.items.length) {
            fail(`階段 ${stage.id} 需要至少一個項目`);
            continue;
          }
          for (const item of stage.items) {
            if (!item || typeof item !== "object") {
              fail("路線項目必須是物件");
              continue;
            }
            if (!slugPattern.test(item.id) || itemIds.has(item.id))
              fail(`重複或無效的項目 id: ${item.id}`);
            if (!["article", "block"].includes(item.type))
              fail(`未知項目類型: ${item.type}`);
            const target = library[
              item.type === "article" ? "articles" : "blocks"
            ]?.find((d) => d.slug === item.ref);
            if (!target) fail(`找不到 ${item.type}: ${item.ref}`);
            if (
              doc.status === "published" &&
              target &&
              target.status !== "published"
            )
              fail(`公開 Roadmap 不可引用草稿: ${item.ref}`);
            if (item.requires !== undefined && !Array.isArray(item.requires))
              fail(`requires 必須是陣列: ${item.id}`);
            else if (
              new Set(item.requires || []).size !== (item.requires || []).length
            )
              fail(`requires 不可重複: ${item.id}`);
            else
              for (const dependency of item.requires || []) {
                if (!itemIds.has(dependency))
                  fail(
                    `${item.id} 的先修 ${dependency} 必須放在前面（不可循環）`,
                  );
              }
            itemIds.add(item.id);
          }
        }
      } else {
        if (typeof doc.category !== "string" || !slugPattern.test(doc.category))
          fail("缺少有效 category");
        if (
          doc.tags !== undefined &&
          (!Array.isArray(doc.tags) ||
            doc.tags.some((t) => typeof t !== "string"))
        )
          fail("tags 必須是字串陣列");
        if (
          doc.blocks !== undefined &&
          (!Array.isArray(doc.blocks) ||
            doc.blocks.some(
              (id) =>
                !(library.blocks || []).some(
                  (b) =>
                    b.slug === id &&
                    (doc.status !== "published" || b.status === "published"),
                ),
            ))
        )
          fail("blocks 引用了不存在或未公開的知識塊");
      }
    }
  }
  return errors;
}
export function serializeDocument(doc) {
  const { slug, kind, body, raw, ...data } = doc;
  return matter.stringify(body.trim() + "\n", data, { lineWidth: -1 });
}
