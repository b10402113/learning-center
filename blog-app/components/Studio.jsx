"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import matter from "gray-matter";
import Markdown from "./Markdown";
import RoadmapMap from "./RoadmapMap";
import { Icon } from "./Icons";
import { serializeDocument, validateLibrary } from "../lib/schema.mjs";

const kindLabels = { articles: "文章", blocks: "知識塊", roadmaps: "Roadmap" };
const today = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Taipei" }).format(
    new Date(),
  );
const clone = (value) => JSON.parse(JSON.stringify(value));
const move = (array, from, to) => {
  const copy = [...array];
  if (to < 0 || to >= array.length) return copy;
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};
export default function Studio() {
  const [library, setLibrary] = useState(null),
    [kind, setKind] = useState("articles"),
    [doc, setDoc] = useState(null),
    [baseline, setBaseline] = useState(""),
    [message, setMessage] = useState(""),
    [error, setError] = useState(false),
    [busy, setBusy] = useState(false),
    [newSlug, setNewSlug] = useState(""),
    [creating, setCreating] = useState(false),
    [mode, setMode] = useState("form"),
    [raw, setRaw] = useState("");
  const dirty = doc
    ? mode === "raw"
      ? raw !== baseline
      : serializeDocument(doc) !== baseline
    : false;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const docRef = useRef(doc);
  docRef.current = doc;
  function show(text, isError = false) {
    setMessage(text);
    setError(isError);
  }
  const load = useCallback(async () => {
    try {
      const response = await fetch("/__studio/library", { cache: "no-store" });
      if (!response.ok)
        throw new Error("無法連線到本機編輯服務。請使用 npm run dev 啟動。");
      const data = await response.json();
      setLibrary(data);
      return data;
    } catch (e) {
      show(e.message, true);
    }
  }, []);
  useEffect(() => {
    load().then((data) => {
      if (data?.articles[0]) selectDoc(data.articles[0], true);
    });
  }, [load]);
  useEffect(() => {
    const prevent = (e) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, []);
  useEffect(() => {
    const handler = (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (
        !anchor ||
        !dirtyRef.current ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey
      )
        return;
      const url = new URL(anchor.href, location.href);
      if (
        url.pathname !== location.pathname &&
        !window.confirm("這份內容還沒儲存。要放棄修改嗎？")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        document.getElementById("studio-save")?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  function canLeave() {
    return (
      !dirtyRef.current || window.confirm("這份內容還沒儲存。要放棄修改嗎？")
    );
  }
  function selectDoc(next, initial = false) {
    if (!initial && !canLeave()) return;
    const nextDoc = clone(next);
    delete nextDoc.revision;
    setDoc(nextDoc);
    setBaseline(serializeDocument(nextDoc));
    setRaw(next.raw);
    setMode("form");
    setCreating(false);
    show("");
  }
  function changeKind(next) {
    if (!canLeave()) return;
    setKind(next);
    setDoc(null);
    setBaseline("");
    setCreating(false);
    if (library[next][0]) selectDoc(library[next][0], true);
  }
  function update(key, value) {
    setDoc((d) => ({ ...d, [key]: value }));
    show("");
  }
  function create() {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newSlug)) {
      show("檔名請使用小寫英文、數字與連字號，例如 my-first-post。", true);
      return;
    }
    if (library[kind].some((d) => d.slug === newSlug)) {
      show("這個檔名已經存在。", true);
      return;
    }
    if (!canLeave()) return;
    const next = {
      kind,
      slug: newSlug,
      title: kind === "roadmaps" ? "新的學習路線" : "新的文章",
      description: "請填寫這份內容的搜尋摘要。",
      date: today(),
      status: "draft",
      body:
        kind === "roadmaps"
          ? "說明這條路線適合誰，以及讀完能學會什麼。"
          : "# 新的文章\n\n從你想解決的問題開始寫。\n\n## 第一個觀念\n\n在這裡寫下內容。",
      ...(kind === "roadmaps"
        ? {
            subtitle: "這條路線的學習目標",
            level: "入門",
            stages: [{ id: "phase-1", title: "第一階段", items: [] }],
          }
        : {
            category: "ai-development",
            tags: [],
            blocks: [],
            author: "塊開發編輯室",
          }),
    };
    setDoc(next);
    setBaseline("");
    setRaw(serializeDocument(next));
    setMode("form");
    setCreating(false);
    setNewSlug("");
    show("已建立未儲存草稿。填妥內容後按「儲存 Markdown」。");
  }
  async function save() {
    if (!doc || busy) return;
    setBusy(true);
    show("");
    try {
      let saving = doc;
      if (mode === "raw") {
        const parsed = matter(raw);
        saving = {
          ...parsed.data,
          kind,
          slug: doc.slug,
          body: parsed.content.trim(),
        };
      }
      const current = library[kind].find((d) => d.slug === doc.slug);
      const candidate = {
        ...library,
        [kind]: [...library[kind].filter((d) => d.slug !== doc.slug), saving],
      };
      const errors = validateLibrary(candidate);
      if (errors.length) throw new Error(errors.join("\n"));
      const serialized = serializeDocument(saving);
      const response = await fetch("/__studio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          slug: doc.slug,
          raw: serialized,
          revision: current?.revision ?? null,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const next = clone(result);
      delete next.revision;
      setDoc(next);
      setBaseline(serializeDocument(next));
      setRaw(result.raw);
      await load();
      show(
        `已儲存 content/${kind}/${doc.slug}.md · ${new Date().toLocaleTimeString("zh-TW")}`,
      );
    } catch (e) {
      show(e.message, true);
    } finally {
      setBusy(false);
    }
  }
  async function reload() {
    if (!canLeave()) return;
    const latest = await load();
    if (latest) {
      const current = latest[kind].find((d) => d.slug === doc?.slug);
      if (current) selectDoc(current, true);
      show("已重新載入磁碟上的內容。");
    }
  }
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file || !doc) return;
    const target = doc.slug;
    if (file.size > 8 * 1024 * 1024) {
      show("圖片必須小於 8 MB", true);
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/__studio/upload", {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setDoc((current) =>
        current?.slug === target
          ? {
              ...current,
              body:
                current.body + "\n\n![請填寫圖片說明](" + result.url + ")\n",
            }
          : current,
      );
      show(
        "已上傳圖片，並將 Markdown 插入內文末尾。請補上圖片說明，再儲存文章。",
      );
    } catch (e) {
      show(e.message, true);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }
  function switchMode(next) {
    if (next === mode) return;
    if (next === "raw") setRaw(serializeDocument(doc));
    else {
      try {
        const parsed = matter(raw);
        const nextDoc = {
          ...parsed.data,
          kind,
          slug: doc.slug,
          body: parsed.content.trim(),
        };
        const errors = validateLibrary({
          ...library,
          [kind]: [
            ...library[kind].filter((d) => d.slug !== doc.slug),
            nextDoc,
          ],
        });
        if (errors.length) throw new Error(errors.join("\n"));
        setDoc(nextDoc);
      } catch (e) {
        show("YAML 格式錯誤：" + e.message, true);
        return;
      }
    }
    setMode(next);
  }
  function updateRaw(value) {
    setRaw(value);
    try {
      const parsed = matter(value);
      const nextDoc = {
        ...parsed.data,
        kind,
        slug: doc.slug,
        body: parsed.content.trim(),
      };
      const errors = validateLibrary({
        ...library,
        [kind]: [...library[kind].filter((d) => d.slug !== doc.slug), nextDoc],
      });
      if (!errors.length) setDoc(nextDoc);
    } catch {
      /* Retain the last valid preview while YAML is incomplete. */
    }
  }
  const content = doc?.body || "";
  const stageUpdate = (index, key, value) =>
    update(
      "stages",
      doc.stages.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    );
  const selectable = library
    ? [
        ...library.articles.map((d) => ({ ...d, type: "article" })),
        ...library.blocks.map((d) => ({ ...d, type: "block" })),
      ]
    : [];
  const safeStages = Array.isArray(doc?.stages)
    ? doc.stages.filter((s) => s && typeof s === "object")
    : [];
  const resolvedStages = safeStages.map((s) => ({
    ...s,
    items: (Array.isArray(s.items) ? s.items : [])
      .filter((i) => i && typeof i === "object")
      .map((i) => ({
        ...i,
        document: selectable.find((d) => d.type === i.type && d.slug === i.ref),
      })),
  }));
  return (
    <div className="studio-page">
      <header className="studio-header">
        <div>
          <p className="eyebrow">BLOCK DEVLOP / LOCAL CONTENT STUDIO</p>
          <h1>專心寫作，輕鬆整理。</h1>
          <p>直接儲存 Markdown 檔案 · 即時預覽 · 不需要資料庫</p>
        </div>
        <span className="studio-status">
          ● 本機編輯模式 {dirty ? "· 尚未儲存" : "· 已同步"}
        </span>
      </header>
      {!library ? (
        <p className="studio-help">{message || "載入內容中…"}</p>
      ) : (
        <div className="studio-grid">
          <aside className="studio-sidebar">
            <div className="studio-kind-tabs">
              {Object.entries(kindLabels).map(([key, label]) => (
                <button
                  key={key}
                  className={key === kind ? "selected" : ""}
                  onClick={() => changeKind(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            {library[kind].map((d) => (
              <button
                className={`studio-document ${doc?.slug === d.slug ? "current" : ""}`}
                key={d.slug}
                onClick={() => selectDoc(d)}
              >
                {d.title}
                <small>
                  {d.status === "draft" ? "○ 草稿" : "● 公開"} · {d.slug}.md
                </small>
              </button>
            ))}
            <button className="button" onClick={() => setCreating(!creating)}>
              <Icon name="plus" size={14} />
              新增{kindLabels[kind]}
            </button>
            {creating && (
              <div className="studio-new">
                <input
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="英文檔名 my-new-post"
                  aria-label="新增內容檔名"
                />
                <button className="button button-dark" onClick={create}>
                  建立草稿
                </button>
              </div>
            )}
            <p className="studio-help">
              內容位於 blog-app/content/。
              <br />⌘ S 儲存 · 公開狀態會在下次建置時發佈。
            </p>
          </aside>
          <section className="studio-main">
            {message && (
              <p
                role="status"
                className={`studio-message ${error ? "error" : ""}`}
              >
                {message}
              </p>
            )}
            {doc ? (
              <>
                <div className="studio-document-toolbar">
                  <span className="file-path">
                    content/{kind}/{doc.slug}.md{dirty ? " *" : ""}
                  </span>
                  <div>
                    <button className="button" onClick={reload} disabled={busy}>
                      重新載入
                    </button>
                    <button
                      className="button button-dark"
                      id="studio-save"
                      onClick={save}
                      disabled={busy}
                    >
                      {busy ? "儲存中…" : "儲存 Markdown"}
                    </button>
                  </div>
                </div>
                <div className="studio-mode" style={{ marginBottom: 18 }}>
                  <button
                    className={mode === "form" ? "selected" : ""}
                    onClick={() => switchMode("form")}
                  >
                    欄位編輯
                  </button>
                  <button
                    className={mode === "raw" ? "selected" : ""}
                    onClick={() => switchMode("raw")}
                  >
                    完整 Markdown / YAML
                  </button>
                </div>
                {mode === "form" ? (
                  <>
                    <div className="studio-fields">
                      <label className="wide">
                        標題
                        <input
                          value={doc.title || ""}
                          onChange={(e) => update("title", e.target.value)}
                        />
                      </label>
                      <label className="wide">
                        SEO 搜尋摘要
                        <textarea
                          rows={2}
                          value={doc.description || ""}
                          onChange={(e) =>
                            update("description", e.target.value)
                          }
                        />
                      </label>
                      <label>
                        發佈狀態
                        <select
                          value={doc.status}
                          onChange={(e) => update("status", e.target.value)}
                        >
                          <option value="draft">
                            草稿（不會出現在公開網站）
                          </option>
                          <option value="published">
                            公開（下次建置時發佈）
                          </option>
                        </select>
                      </label>
                      <label>
                        發佈日期
                        <input
                          type="date"
                          value={doc.date || ""}
                          onChange={(e) => update("date", e.target.value)}
                        />
                      </label>
                      {kind === "roadmaps" ? (
                        <>
                          <label>
                            路線副標題
                            <input
                              value={doc.subtitle || ""}
                              onChange={(e) =>
                                update("subtitle", e.target.value)
                              }
                            />
                          </label>
                          <label>
                            適合程度
                            <input
                              value={doc.level || ""}
                              onChange={(e) => update("level", e.target.value)}
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            分類 ID（英文，可新增）
                            <input
                              value={doc.category || ""}
                              onChange={(e) =>
                                update("category", e.target.value)
                              }
                              list="categories"
                            />
                            <datalist id="categories">
                              {[
                                "ai-development",
                                "agent-harness",
                                "context-engineering",
                              ].map((c) => (
                                <option key={c} value={c} />
                              ))}
                            </datalist>
                          </label>
                          <label>
                            標籤（以逗號分隔）
                            <input
                              value={
                                Array.isArray(doc.tags)
                                  ? doc.tags.join(", ")
                                  : ""
                              }
                              onChange={(e) =>
                                update(
                                  "tags",
                                  e.target.value
                                    .split(/[,，]/)
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                                )
                              }
                            />
                          </label>
                          {kind === "articles" && (
                            <label className="wide">
                              關聯知識塊（可多選）
                              <select
                                multiple
                                aria-label="關聯知識塊"
                                value={doc.blocks || []}
                                onChange={(e) =>
                                  update(
                                    "blocks",
                                    Array.from(
                                      e.target.selectedOptions,
                                      (o) => o.value,
                                    ),
                                  )
                                }
                              >
                                {library.blocks.map((b) => (
                                  <option value={b.slug} key={b.slug}>
                                    {b.title}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}
                        </>
                      )}
                    </div>
                    {kind === "roadmaps" && (
                      <>
                        <p className="eyebrow">
                          ROADMAP BUILDER / 組合學習路線
                        </p>
                        <p className="studio-help">
                          選取既有文章與知識塊；↑ ↓
                          調整順序。先修關係只能選擇排在前面的項目，儲存時會檢查連結與循環。
                        </p>
                        {(doc.stages || []).map((stage, si) => (
                          <section className="studio-stage" key={stage.id}>
                            <div className="stage-editor-top">
                              <span className="eyebrow">
                                {String(si + 1).padStart(2, "0")}
                              </span>
                              <input
                                aria-label={`階段 ${si + 1} 標題`}
                                value={stage.title}
                                onChange={(e) =>
                                  stageUpdate(si, "title", e.target.value)
                                }
                              />
                              <button
                                aria-label={`階段 ${si + 1} 往前移`}
                                disabled={si === 0}
                                onClick={() =>
                                  update("stages", move(doc.stages, si, si - 1))
                                }
                              >
                                ↑
                              </button>
                              <button
                                aria-label={`階段 ${si + 1} 往後移`}
                                disabled={si === doc.stages.length - 1}
                                onClick={() =>
                                  update("stages", move(doc.stages, si, si + 1))
                                }
                              >
                                ↓
                              </button>
                              <button
                                onClick={() =>
                                  update(
                                    "stages",
                                    doc.stages.filter((_, i) => i !== si),
                                  )
                                }
                              >
                                移除階段
                              </button>
                            </div>
                            {stage.items.map((item, ii) => {
                              const before = doc.stages.flatMap((s, i) =>
                                i < si
                                  ? s.items
                                  : i === si
                                    ? s.items.slice(0, ii)
                                    : [],
                              );
                              const target = selectable.find(
                                (d) =>
                                  d.type === item.type && d.slug === item.ref,
                              );
                              return (
                                <div className="studio-item" key={item.id}>
                                  <span className="item-title">
                                    {item.type === "article" ? "▢" : "○"}{" "}
                                    {target?.title || item.ref}
                                  </span>
                                  <button
                                    disabled={ii === 0}
                                    aria-label={`${item.ref} 往上移`}
                                    onClick={() =>
                                      stageUpdate(
                                        si,
                                        "items",
                                        move(stage.items, ii, ii - 1),
                                      )
                                    }
                                  >
                                    ↑
                                  </button>
                                  <button
                                    disabled={ii === stage.items.length - 1}
                                    aria-label={`${item.ref} 往下移`}
                                    onClick={() =>
                                      stageUpdate(
                                        si,
                                        "items",
                                        move(stage.items, ii, ii + 1),
                                      )
                                    }
                                  >
                                    ↓
                                  </button>
                                  <button
                                    onClick={() =>
                                      stageUpdate(
                                        si,
                                        "items",
                                        stage.items.filter((_, i) => i !== ii),
                                      )
                                    }
                                  >
                                    移除
                                  </button>
                                  <label className="requires-field">
                                    先修項目
                                    <select
                                      multiple
                                      value={item.requires || []}
                                      aria-label={`${item.ref} 先修項目`}
                                      onChange={(e) =>
                                        stageUpdate(
                                          si,
                                          "items",
                                          stage.items.map((it, i) =>
                                            i === ii
                                              ? {
                                                  ...it,
                                                  requires: Array.from(
                                                    e.target.selectedOptions,
                                                    (o) => o.value,
                                                  ),
                                                }
                                              : it,
                                          ),
                                        )
                                      }
                                    >
                                      {[
                                        ...before,
                                        ...(item.requires || [])
                                          .filter(
                                            (id) =>
                                              !before.some((b) => b.id === id),
                                          )
                                          .map((id) => ({
                                            id,
                                            ref: `⚠ 已移除或順序需調整：${id}`,
                                          })),
                                      ].map((prev) => (
                                        <option key={prev.id} value={prev.id}>
                                          {selectable.find(
                                            (d) =>
                                              d.type === prev.type &&
                                              d.slug === prev.ref,
                                          )?.title || prev.ref}
                                        </option>
                                      ))}
                                    </select>
                                  </label>
                                </div>
                              );
                            })}
                            <div className="stage-add">
                              <select
                                aria-label={`新增項目到階段 ${si + 1}`}
                                value=""
                                onChange={(e) => {
                                  if (!e.target.value) return;
                                  const [type, ref] = e.target.value.split(":");
                                  stageUpdate(si, "items", [
                                    ...stage.items,
                                    {
                                      id: `item-${crypto.randomUUID().slice(0, 8)}`,
                                      type,
                                      ref,
                                      requires: [],
                                    },
                                  ]);
                                }}
                              >
                                <option value="">
                                  ＋ 選擇文章或知識塊加入階段
                                </option>
                                {selectable.map((d) => (
                                  <option
                                    key={`${d.type}:${d.slug}`}
                                    value={`${d.type}:${d.slug}`}
                                  >
                                    {d.type === "article"
                                      ? "▢ 文章"
                                      : "○ 知識塊"}{" "}
                                    · {d.title}
                                    {d.status === "draft" ? "（草稿）" : ""}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </section>
                        ))}
                        <button
                          className="button"
                          onClick={() =>
                            update("stages", [
                              ...(doc.stages || []),
                              {
                                id: `phase-${crypto.randomUUID().slice(0, 8)}`,
                                title: "新的階段",
                                items: [],
                              },
                            ])
                          }
                        >
                          <Icon name="plus" size={14} />
                          新增階段
                        </button>
                      </>
                    )}
                    <label className="studio-upload">
                      上傳圖片（插入內文末尾）
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        disabled={busy}
                        onChange={upload}
                      />
                    </label>
                    <div className="editor-split" style={{ marginTop: 16 }}>
                      <div className="editor-pane">
                        <label htmlFor="markdown-body">
                          MARKDOWN /{" "}
                          {kind === "roadmaps" ? "路線說明" : "文章內文"}
                        </label>
                        <textarea
                          id="markdown-body"
                          value={content}
                          onChange={(e) => update("body", e.target.value)}
                          spellCheck={false}
                        />
                      </div>
                      <div className="preview-pane">
                        <p className="eyebrow">LIVE PREVIEW / 即時閱讀預覽</p>
                        <Markdown blockIds={library.blocks.map((b) => b.slug)}>
                          {content}
                        </Markdown>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="editor-split">
                    <div className="editor-pane">
                      <label htmlFor="markdown-raw">
                        完整 MARKDOWN 與 YAML FRONTMATTER
                      </label>
                      <textarea
                        id="markdown-raw"
                        value={raw}
                        onChange={(e) => updateRaw(e.target.value)}
                        spellCheck={false}
                      />
                    </div>
                    <div className="preview-pane">
                      <p className="eyebrow">LIVE PREVIEW</p>
                      <Markdown>{content}</Markdown>
                    </div>
                  </div>
                )}
                {kind === "roadmaps" && safeStages.length > 0 && (
                  <section className="roadmap-editor-preview">
                    <p className="eyebrow" style={{ marginBottom: 15 }}>
                      MAP PREVIEW / 路線圖即時預覽
                    </p>
                    <RoadmapMap stages={resolvedStages} id="studio" />
                  </section>
                )}
              </>
            ) : (
              <p className="empty-state">選擇內容，或新增第一份 Markdown。</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
