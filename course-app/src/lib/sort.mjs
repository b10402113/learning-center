const collator = new Intl.Collator("zh-Hant");

export const SUBJECT_SORTS = [
  { id: "default", label: "預設" },
  { id: "title", label: "名稱" },
  { id: "nodes", label: "節點數" },
  { id: "steps", label: "步驟數" },
  { id: "updated", label: "最近更新" },
];

/**
 * Return a sorted copy of the subject index. `default` keeps the generated
 * order; the numeric and date sorts are descending with a title tie-break.
 */
export function sortSubjects(subjects, sort) {
  const list = [...subjects];
  if (sort === "title") {
    return list.sort(
      (a, b) =>
        collator.compare(a.title || "", b.title || "") ||
        collator.compare(a.id, b.id)
    );
  }
  if (sort === "updated") {
    return list.sort(
      (a, b) =>
        String(b.updated || "").localeCompare(String(a.updated || "")) ||
        collator.compare(a.title || "", b.title || "")
    );
  }
  if (sort === "nodes" || sort === "steps") {
    return list.sort(
      (a, b) =>
        (b[sort] || 0) - (a[sort] || 0) ||
        collator.compare(a.title || "", b.title || "")
    );
  }
  return list;
}
