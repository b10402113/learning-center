# Skill 格式範本與 AGENTS.md 同步（MDX + type/prerequisites 契約）

Type: task
Status: ready-for-agent
Parent: `.scratch/mdx-checklist-completion/spec.md`

## What to build

讓 writer skills 的產出與網站管線的新契約一致：`/nodes` 與 `/edges` 產出的 node/element 檔案以 **MDX** 編寫，並帶 `type`/`prerequisites`（node）與可選 `videoUrl`/`questions`（element）frontmatter。

- **`/nodes` skill。** element 格式範本新增 `type`（缺省 article；video 需 `videoUrl`、question 需 `questions:` 區塊，含選項與正確答案索引）；node 格式範本新增 `prerequisites` 清單。`examples/NODE.mdx`、`examples/ELEMENT.mdx` 更新為 MDX 範例（含互動元件用法）。
- **`/edges` skill。** 確認產出的 element 連結與 MDX 契約相容，格式範本與之同步。
- **AGENTS.md / 文件同步。** element/node 格式範本加上 `type` 與 `prerequisites`；網站部分改述為 Roadmap + 星雲兩視圖；移除 gating/boss 相關語彙。相關參考文件（skill 內的格式區塊、`docs/reference/` 如有引用）一併對齊。

## Acceptance criteria

- [ ] `/nodes` skill 的 element 範本含 `type`（含 `videoUrl`/`questions` 條件欄位規則）；node 範本含 `prerequisites`
- [ ] `/nodes` skill 的 `examples/NODE.mdx`、`examples/ELEMENT.mdx` 為 MDX 範例
- [ ] `/edges` skill 格式與 MDX 契約相容（element 連結、從/到 id）
- [ ] AGENTS.md 的格式範本與網站描述同步（兩視圖、無 gating/boss 語彙）
- [ ] 由 skill 產出的範例檔案能通過 generator 的 frontmatter 解析（對照 T3 的型別契約）

## Reference files

- [ ] `.opencode/skills/nodes/SKILL.md`、`.opencode/skills/nodes/examples/NODE.mdx`、`.opencode/skills/nodes/examples/ELEMENT.mdx`
- [ ] `.opencode/skills/edges/SKILL.md`
- [ ] `AGENTS.md`（Formats 段）
- [ ] `.scratch/mdx-checklist-completion/spec.md` Implementation Decisions（skill 契約更新）

## Blocked by

03 — Generator：結構化輸出 + type/prerequisites/videoUrl/questions（expand，暫留 HTML）
04 — MDX 管線 + 互動元件 + generator HTML 收縮
