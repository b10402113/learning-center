---
subject: jsm-skills
status: draft
path: concept-first
created: 2026-09-29
---

# ROADMAP — jsm-skills

## Goal

能當使用者，把 jsm-skills 這套九階段工程工作流（scope → audit → architect → develop → check → test → document → sync，外加 debug）跑在自己的專案上：知道每個階段何時用、何時跳過、輸入輸出是什麼，能在一個新的小 side project 上從一句話跑到可交付的功能。

## Learning path

**概念先行（concept-first）。** 以「先懂這部機器怎麼運轉，再逐階段上工」為主軸：Tier 1 先建立整套工作流的心智模型（九階段 DAG 與資料流、三層知識載體與擁有權、四條設計慣例與 skill 解剖），Tier 2 逐階段學九個 skill 的操作規則與取捨，Tier 3 在自己的練習專案上完整跑一遍並覆盤。它最佳化的是**可對照的系統理解**——先有模型，才比得出 jsm-skills 與自己 SDD 流程的異同與取捨。Tier 由通而專：Tier 1 模型、Tier 2 規則、Tier 3 實作。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe jsm-skills/<node-id>` to measure a node, then `/nodes jsm-skills/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 心智模型：這套工作流是什麼、靠什麼運轉

1. **[[learn/jsm-skills/nodes/workflow-map|工作流總覽]]**
   - Goal: 能畫出九階段的 DAG，說清每階段的輸入/輸出、何時該用與何時可跳過，並對照自己的 SDD 七階段說出差異。
   - Sources:
     - [[sources/jsm-skills/20260929/README.md]]
     - [[sources/jsm-skills/20260929/docs/workflow-guide.md]]

2. **[[learn/jsm-skills/nodes/artifacts-and-ownership|知識載體與擁有權]]**
   - Goal: 能說清 `AGENTS.md` / `docs/scope` / `docs/specs`（＋`design.md`）各自裝什麼、誰擁有、誰能改，以及 acceptance criteria 與 tier 深度（Prototype → GA）如何貫穿整條流程。
   - Sources:
     - [[sources/jsm-skills/20260929/docs/workflow-guide.md]]
     - [[sources/jsm-skills/20260929/README.md]]

3. **[[learn/jsm-skills/nodes/design-ethos-and-skill-anatomy|設計理念與 Skill 解剖]]**
   - Goal: 能用四條核心慣例（engineer decides、suggestions never gates、one recommended option、keep skills lean）與 progressive disclosure／token 預算，解釋一個 skill 為什麼這樣設計、要怎麼拆檔。
   - Sources:
     - [[sources/jsm-skills/20260929/CLAUDE.md]]
     - [[sources/jsm-skills/20260929/docs/conventions.md]]
     - [[sources/jsm-skills/20260929/scripts/check-portability.mjs]]
     - [[sources/jsm-skills/20260929/scripts/analyze-token-usage.mjs]]

### Tier 2 — 階段操作規則：九個 skill 各怎麼跑

4. **[[learn/jsm-skills/nodes/scope|/scope：從點子到計畫]]**
   - Goal: 能用 `/scope` 把一句點子變成有序的 living plan，依情境選對 approach（tracer-bullet / skateboard / facade / journey）與 `plan` / `replan` / `add` 模式。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/scope/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/scope/approaches/tracer-bullet.md]]
     - [[sources/jsm-skills/20260929/skills/scope/approaches/skateboard.md]]
     - [[sources/jsm-skills/20260929/skills/scope/modes/plan.md]]
     - [[sources/jsm-skills/20260929/skills/scope/scope-template.md]]

5. **[[learn/jsm-skills/nodes/audit|/audit：建立 AGENTS.md 與風格底線]]**
   - Goal: 能用 `/audit` 從零或既有 repo 建立並維護 `AGENTS.md`，依 pre-flight 訊號選對 phase（greenfield / whole-repo / area / gap-fill），並選定一套 coding-style preset 當作 Rules。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/audit/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/audit/modes/greenfield.md]]
     - [[sources/jsm-skills/20260929/skills/audit/modes/whole-repo.md]]
     - [[sources/jsm-skills/20260929/skills/audit/modes/gapfill.md]]
     - [[sources/jsm-skills/20260929/skills/audit/patterns/clean-architecture.md]]

6. **[[learn/jsm-skills/nodes/architect|/architect：從請求到規格]]**
   - Goal: 能跑 `/architect` 的 staged design conversation，選對四模式，把模糊請求變成一紙 ratified spec，並用 spec lifecycle 管理它。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/architect/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/architect/spec-template.md]]
     - [[sources/jsm-skills/20260929/skills/architect/agent-modes/feature.md]]
     - [[sources/jsm-skills/20260929/skills/architect/internal/design-conversation.md]]

7. **[[learn/jsm-skills/nodes/develop|/develop：依規格實作]]**
   - Goal: 能在已核准 spec 與專案慣例上分軌實作（UI track vs logical track），選對 UI 的四條來源與 build/git 流程，並貫徹「刪除被取代的碼」。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/develop/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/develop/flow/build.md]]
     - [[sources/jsm-skills/20260929/skills/develop/flow/git.md]]
     - [[sources/jsm-skills/20260929/skills/develop/ui-guide.md]]
     - [[sources/jsm-skills/20260929/skills/develop/logical-guide.md]]

8. **[[learn/jsm-skills/nodes/check|/check：合併前的驗證與審查]]**
   - Goal: 能用 `/check verify` 實跑證明行為符合規格、用 `/check review` 讓不同模型對 diff 做資深審查，並知道兩者都不改碼、失敗時該丟回哪裡。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/check/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/check/modes/verify.md]]
     - [[sources/jsm-skills/20260929/skills/check/modes/review.md]]
     - [[sources/jsm-skills/20260929/skills/check/review-guide.md]]

9. **[[learn/jsm-skills/nodes/test|/test：為變更寫回歸測試]]**
   - Goal: 能用 `/test` 為本次變更寫出真正會抓到 bug 的回歸測試，依檔案分類選對策略，維護 `test-preferences.json`，且不以改原碼換過關。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/test/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/test/writing-guide.md]]
     - [[sources/jsm-skills/20260929/skills/test/modes/setup.md]]

10. **[[learn/jsm-skills/nodes/document|/document：把變更寫成人話]]**
   - Goal: 能從真 commits 與 diff 寫出 PR 描述、changelog、release note 與 blameless postmortem，選對文件型別與受眾，且不編造、不漏密。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/document/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/document/agent-prompt.md]]
     - [[sources/jsm-skills/20260929/skills/document/templates/pr.md]]
     - [[sources/jsm-skills/20260929/skills/document/templates/postmortem.md]]

11. **[[learn/jsm-skills/nodes/sync|/sync：把知識對回 repo]]**
   - Goal: 能用 `/sync` 外科手術式地把 `AGENTS.md`、feature scope、spec status 對回 repo 現在的樣子，並守住 boundaries（flag 而不覆寫）與 idempotent。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/sync/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/sync/agent-prompt.md]]

12. **[[learn/jsm-skills/nodes/debug|/debug：根因除錯迴圈]]**
   - Goal: 能跑 reproduce → localize → hypothesize → test → fix → verify 的根因迴圈，一次只測一個可否證假設、套最小修補並加回歸測試，且拒絕偷做功能與症狀補丁。
   - Sources:
     - [[sources/jsm-skills/20260929/skills/debug/SKILL.md]]

### Tier 3 — 整合實作

13. **[[learn/jsm-skills/nodes/end-to-end-run|端到端實跑與覆盤]]**
   - Goal: 能在自己的練習專案上完整跑一遍九階段（含 spec lifecycle 流轉與何時跳過），並覆盤 jsm-skills 與自己 SDD 流程的取捨。
   - Sources:
     - [[sources/jsm-skills/20260929/docs/workflow-guide.md]]
     - [[sources/jsm-skills/20260929/README.md]]
     - [[sources/jsm-skills/20260929/skills/scope/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/architect/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/develop/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/check/SKILL.md]]
     - [[sources/jsm-skills/20260929/skills/sync/SKILL.md]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
