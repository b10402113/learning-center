# 預習筆記：artifact + 生成器 + 面板呈現 + /nodes 產出

Type: task
Status: ready-for-agent
Parent: `.scratch/learning-climb/spec.md`

## What to build

每條 path 新增一篇**可選**的預習筆記 `learn/<subject>/prepares/<path-id>.md`：比 Lesson 短（3–5 分鐘可讀）、只建立「讀文章前該有的初步概念」，降低認知負荷。frontmatter 含 `path: <subject>/<path-id>`、`tier`、`duration`（3–5 分鐘）、`sources`、`created`/`updated`；正文為 2–4 個 key idea 的白話預告、要留意的術語清單（gloss）、相關既有概念連結。

生成器掃描 `learn/<subject>/prepares/`，把 `prepareHtml`（與 `hasPrepare` 旗標）寫進 `PathNode`；缺省為 null，所以既有 subject 不需改動也能正常渲染。App 在 DetailPane 中先呈現「預習」區塊、再展開 Lesson；沒有預習筆記的 path 該區塊顯示為可選或隱藏。

`/nodes` skill 在寫 Lesson 前自動檢查並寫出 prepare 筆記（可選，不強制）。生成器以 fixture 測試覆蓋：prepare 帶進 PathNode、缺省 null、確定性輸出。

## Acceptance criteria

- [ ] `prepares/<path-id>.md` 格式與 frontmatter 契約成立
- [ ] 生成器輸出 `prepareHtml`/`hasPrepare`；無 prepare 的 path 為 null
- [ ] DetailPane 中「先預習 → 再讀 Lesson」先後呈現；無預習時該區塊可選或隱藏
- [ ] `/nodes` 寫 Lesson 前自動檢查並寫出 prepare 筆記（可選）
- [ ] generator fixture 測試：prepare 帶進 PathNode、缺省 null、確定性輸出

## Reference files

- [ ] `scripts/generate-data.mjs`
- [ ] `knowledge-map/src/lib/types.ts`
- [ ] `knowledge-map/src/components/DetailPane.tsx`
- [ ] `knowledge-map/src/__tests__/generator.test.ts`
- [ ] `.opencode/skills/nodes/SKILL.md`
- [ ] `.scratch/learning-climb/spec.md` Implementation Decisions（prepare 筆記）

## Blocked by

None — can start immediately.
