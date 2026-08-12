# AGENTS.md + lint 同步

Type: task
Status: ready-for-agent
Parent: `.scratch/learning-climb/spec.md`

## What to build

把 learning-climb 引入的新契約寫回倉庫的「單一來源」文檔，讓後續 skill 與 lint 都知道這些東西存在：

- **Architecture**：`learn/<subject>/` 新增 `prepares/` 資料夾；sources 支援整個資料夾作為 `source_type: codebase`。
- **Skills**：新增 `/quiz <subject>[/<tier>]` 條目（知識驗證，不出決策樹）。
- **Lint**：新增檢查項——prepare 引用是否存在、codebase 來源是否有 digest、tier 解鎖資料的 progress schema 相容（01 的遷移契約）、codebase path 計數基準線。

不新增或改寫任何 subject 的 path/node/edge；prepare 與 digest 均為增量新增。

## Acceptance criteria

- [ ] AGENTS.md Architecture 記錄 `prepares/` 資料夾
- [ ] AGENTS.md 記錄 `source_type: codebase`
- [ ] AGENTS.md Skills 記錄 `/quiz` skill
- [ ] Lint 段落新增：prepare 引用、codebase digest、progress schema 相容、codebase path 基準線檢查

## Reference files

- [ ] `AGENTS.md`
- [ ] `.scratch/learning-climb/spec.md` Further Notes

## Blocked by

- 01 — 進度 schema 三層化 + 相容遷移 + tierIsUnlocked 純函式
- 03 — 預習筆記：artifact + 生成器 + 面板呈現 + /nodes 產出
- 04 — CodeBase 來源：source-reading 擴展 + digest + 生成器分類
- 05 — /quiz skill：頭目戰出題判答
