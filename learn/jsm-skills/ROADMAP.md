---
subject: jsm-skills
status: draft
path: lifecycle
created: 2026-10-01
---

# ROADMAP — jsm-skills

## Goal

把整套 JSM 工程階段流程真正用在自己的專案上：從一個想法走到出貨，能在真實 repo 上跑 `scope → audit → architect → develop → check verify → test → check review → document → sync`（`debug` 隨時）。終點是「遇到狀況就立刻知道下一步該跑哪個 skill、該做哪個決定」，而不是只讀懂這套系統——尤其補上「卡住時不知道用哪個 skill」與「git / commit 時機」這兩塊。

## Learning path

**照生命週期走一遍（lifecycle）。** 角度：沿 README 那條傳送帶 `idea → /scope → /audit → /architect → /develop → /check verify → /test → /check review → /document → /sync` 推進，`/debug` 當隨時可用的旁支，brownfield 與 monorepo 當變體，最後收在「寫自己的 skill」的後設。它優化的是「照順序不迷路」——每一站都對應一個你實際會跑的 skill，`orchestration-and-git` 節點把「情境→skill 導航」與 commit 節奏先給你，之後每個階段節點再補上各自的 git 動作。

Tier 由一般到具體：Tier 1 建立流程全貌與狀態觀（含導航地圖）→ Tier 2 決策與規劃（閘門、scope、architect、audit）→ Tier 3 建置與驗證尾巴（develop、check verify、test、check review、document、sync）→ Tier 4 旁支、變體與後設（debug、brownfield/monorepo、skill authoring）。

arena build-along **不獨立成節點**，只當 develop / check-verify / check-review 的實例引用。深度不在此標註——留待每個節點的 `/probe` 結果、由 `/nodes` 校準。不刪任何素材。

> **Baseline**：素材總行數約 15,284。`/roadmap` 公式（`/500`）clamp 到 30；本 repo linter 公式（`/1100`）為 14。經學習者確認，採 **16 個節點**（兩支逐字稿的字幕 cue 使行數膨脹約 3–4 倍，16 較貼近實際內容密度）。

## How to use

依序讀節點。每個節點是一個 step-DAG。先跑 `/probe jsm-skills/<node-id>` 量測該節點（硬性閘門），再跑 `/nodes jsm-skills/<node-id>` 確認節點並展開它的 step-DAG，之後由 `/teach` 互動教學。

## Nodes

### Tier 1 — 流程全貌與使用地圖

1. **[[learn/jsm-skills/nodes/workflow-overview|工程工作流全貌]]**
   - Goal: 用一句話講出九個 skill 各自的職責與整條 pipeline，並為專案選一個 depth（Prototype / Alpha / Beta / GA）。
   - Sources:
     - [[sources/jsm-skills/20261001/README.md#the-skills]]
     - [[sources/jsm-skills/20261001/README.md#the-feature-loop]]
     - [[sources/jsm-skills/20261001/docs/workflow-guide.md#the-workflows]]
     - [[sources/jsm-skills/20261001/docs/workflow-guide.md#a-worked-example-from-idea-to-shipped]]

2. **[[learn/jsm-skills/nodes/state-in-files|狀態在檔案：四種檔與固定擁有權]]**
   - Goal: 說出 AGENTS.md（巢狀）/ scope / specs / design.md 各由誰建立、誰讀、誰改，並解釋「狀態放檔案」為何可跨 session、跨團隊。
   - Sources:
     - [[sources/jsm-skills/20261001/docs/workflow-guide.md#who-owns-which-file]]
     - [[sources/jsm-skills/20261001/README.md#what-gets-written-and-where]]
     - [[sources/jsm-skills/20261001/docs/workflow-guide.md#the-workflows]]

3. **[[learn/jsm-skills/nodes/orchestration-and-git|情境→skill 導航與 git/commit 節奏]]**
   - Goal: 卡住時能從狀況判斷該跑哪個 skill；知道哪些階段是天然 commit 點、skill 何時碰 git、何時不碰。
   - Sources:
     - [[sources/jsm-skills/20261001/README.md#the-feature-loop]]
     - [[sources/jsm-skills/20261001/README.md#the-skills]]
     - [[sources/jsm-skills/20261001/skills/develop/flow/git.md#Branch (before building, in the freshness & collaboration check)]]
     - [[sources/jsm-skills/20261001/skills/develop/SKILL.md#Before you build: freshness & collaboration (don't build on stale state or over a teammate)]]

### Tier 2 — 決策與規劃

4. **[[learn/jsm-skills/nodes/decision-gate|決策閘門與 acceptance-criteria 主線]]**
   - Goal: 解釋「沒決定就別蓋」的閘門、`Assumed` spec 的意義與 ratification，以及一條需求如何從 spec → code → verify → test 一路追。
   - Sources:
     - [[sources/jsm-skills/20261001/docs/workflow-guide.md#the-one-thread-that-ties-the-stages-together]]
     - [[sources/jsm-skills/20261001/skills/architect/SKILL.md#Ratify an assumed decision]]
     - [[sources/jsm-skills/20261001/skills/architect/spec-template.md#Status values]]
     - [[sources/jsm-skills/20261001/skills/develop/SKILL.md#Step 0: The spec gate (always first)]]

5. **[[learn/jsm-skills/nodes/scope|把想法變成活著的計畫]]**
   - Goal: 跑 `/scope` 產出 `docs/scope/`（plan / replan / add），選 delivery style 與 depth，並解釋為何 `index.md` 有時沒打勾。
   - Sources:
     - [[sources/jsm-skills/20261001/skills/scope/SKILL.md#what-this-skill-does]]
     - [[sources/jsm-skills/20261001/skills/scope/modes/plan.md#step-1-locate-the-scope-greenfield-brownfield-monorepo]]
     - [[sources/jsm-skills/20261001/skills/scope/modes/replan.md#replan-the-living-rhythm-run-after-a-feature-or-phase-ships]]
     - [[sources/jsm-skills/20261001/skills/scope/scope-template.md#what-keeps-it-readable-the-format-rules]]

6. **[[learn/jsm-skills/nodes/architect|把決策寫成 spec]]**
   - Goal: 跑 `/architect` 四種模式，把決策寫成 `Proposed` spec，並說明 spec 生命週期與 ownership。
   - Sources:
     - [[sources/jsm-skills/20261001/skills/architect/SKILL.md#What this skill does]]
     - [[sources/jsm-skills/20261001/skills/architect/spec-template.md#Status values]]
     - [[sources/jsm-skills/20261001/skills/architect/internal/design-conversation.md#Staged design conversation: gated, acceptance criteria first (main model)]]
     - [[sources/jsm-skills/20261001/skills/architect/agent-modes/feature.md#FEATURE mode]]

7. **[[learn/jsm-skills/nodes/audit|寫 AGENTS.md context 檔]]**
   - Goal: 跑 `/audit`（greenfield / brownfield / area / gap-fill）產出巢狀 AGENTS.md + CLAUDE.md pointer，並知道 root 為何要精簡。
   - Sources:
     - [[sources/jsm-skills/20261001/skills/audit/SKILL.md#pre-flight-main-thread-does-this-before-anything-else]]
     - [[sources/jsm-skills/20261001/skills/audit/SKILL.md#context-file-convention-agentsmd-is-canonical]]
     - [[sources/jsm-skills/20261001/skills/audit/modes/greenfield.md#audit-mode-greenfield-setup-phase-1]]
     - [[sources/jsm-skills/20261001/skills/audit/modes/whole-repo.md#audit-mode-whole-repo-scan-phase-2-root-judged-nested]]

### Tier 3 — 建置與驗證尾巴

8. **[[learn/jsm-skills/nodes/develop|從 spec 蓋出 UI/backend]]**
   - Goal: 過 spec 閘門、分流 track、走後端六階段與 UI 四種設計來源、寫 verify.md、把 spec 推到 In Progress。
   - Sources:
     - [[sources/jsm-skills/20261001/skills/develop/SKILL.md#Step 0: The spec gate (always first)]]
     - [[sources/jsm-skills/20261001/skills/develop/flow/build.md#Step 1: Classify the track]]
     - [[sources/jsm-skills/20261001/skills/develop/logical-guide.md#Phases]]
     - [[sources/jsm-skills/20261001/skills/develop/ui-guide.md#Design source (route by what you were given)]]
     - [[sources/jsm-skills/20261001/skills/develop/checklist.md#Colour contrast (required)]]

9. **[[learn/jsm-skills/nodes/check-verify|跑真 app 對 spec 證明]]**
   - Goal: 跑 `/check verify` 用真實操作證明行為，守住 evidence gate（沒實證不能給 PASS）。
   - Sources:
     - [[sources/jsm-skills/20261001/skills/check/modes/verify.md#What this skill does]]
     - [[sources/jsm-skills/20261001/skills/check/modes/verify.md#Step 0b: Load the spec contract (if a governing spec exists)]]
     - [[sources/jsm-skills/20261001/skills/check/modes/verify.md#Step 4c: The evidence gate (a verdict you cannot fabricate)]]

10. **[[learn/jsm-skills/nodes/test|為改動寫測試]]**
    - Goal: 跑 `/test` 分類檔案、選框架、trace 到 acceptance criteria，且不靠弱化斷言讓測試過。
    - Sources:
      - [[sources/jsm-skills/20261001/skills/test/SKILL.md#What this skill does]]
      - [[sources/jsm-skills/20261001/skills/test/SKILL.md#1b. Classify each scoped file]]
      - [[sources/jsm-skills/20261001/skills/test/writing-guide.md#Strategy per file class]]
      - [[sources/jsm-skills/20261001/skills/test/writing-guide.md#Expert rules (all tools)]]

11. **[[learn/jsm-skills/nodes/check-review|換模型做資深審查]]**
    - Goal: 跑 `/check review`，用不同模型家族審查、把 findings 依嚴重度寫到 `docs/reviews/`、只讀不改。
    - Sources:
      - [[sources/jsm-skills/20261001/skills/check/modes/review.md#1. Determine the author model, then pick a DIFFERENT reviewer]]
      - [[sources/jsm-skills/20261001/skills/check/modes/review.md#4. Spawn the review subagent: on the contrasting Claude model]]
      - [[sources/jsm-skills/20261001/skills/check/review-guide.md#Severity scale]]

12. **[[learn/jsm-skills/nodes/document|從真 diff 寫人話]]**
    - Goal: 跑 `/document` 產出 PR / changelog / release note / postmortem，每句都來自真 commit 或 diff。
    - Sources:
      - [[sources/jsm-skills/20261001/skills/document/SKILL.md#1. Determine the document type]]
      - [[sources/jsm-skills/20261001/skills/document/agent-prompt.md#Honesty & safety rules (do not break)]]
      - [[sources/jsm-skills/20261001/skills/document/templates/pr.md#PR Template]]

13. **[[learn/jsm-skills/nodes/sync|知識回灌對齊]]**
    - Goal: 跑 `/sync` 只做外科手術式編輯，reconcile AGENTS.md / scope / spec 狀態，且誠實標 skipped。
    - Sources:
      - [[sources/jsm-skills/20261001/skills/sync/SKILL.md#What this skill does]]
      - [[sources/jsm-skills/20261001/skills/sync/SKILL.md#Boundaries]]
      - [[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#4. Reconcile linked specs' Status line (edit ONLY the `**Status**:` line, never spec content)]]
      - [[sources/jsm-skills/20261001/skills/sync/agent-prompt.md#6. Reconcile the feature scope (only if SCOPE_PATH_OR_NONE is a path)]]

### Tier 4 — 旁支、變體與後設

14. **[[learn/jsm-skills/nodes/debug|根因迴圈]]**
    - Goal: 跑 `/debug`（reproduce → localize → hypothesize → test → fix），把 regression test 交給 `/test`。
    - Sources:
      - [[sources/jsm-skills/20261001/skills/debug/SKILL.md#What this skill does]]
      - [[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 1: Reproduce reliably]]
      - [[sources/jsm-skills/20261001/skills/debug/SKILL.md#Step 3: Hypothesize (one at a time)]]
      - [[sources/jsm-skills/20261001/docs/workflow-guide.md#when-something-breaks-the-debug-loop]]

15. **[[learn/jsm-skills/nodes/brownfield-and-monorepo|同一套流程的變體]]**
    - Goal: 說明 brownfield 要先 `/audit`、monorepo 每個 workspace 各自 scope / AGENTS.md / commands。
    - Sources:
      - [[sources/jsm-skills/20261001/skills/scope/modes/plan-brownfield.md#scope-plan-route-brownfield]]
      - [[sources/jsm-skills/20261001/skills/scope/modes/plan-monorepo.md#scope-plan-route-monorepo]]
      - [[sources/jsm-skills/20261001/The Engineering System for AI Agents..srt#17:25]]

16. **[[learn/jsm-skills/nodes/capstone-skill-authoring|寫精簡、可攜的 skill]]**
    - Goal: 用這套規範寫或改一個自己的 skill，跑 `npm run check`（portability + hot-path 預算），並用 token 分析看成本。
    - Sources:
      - [[sources/jsm-skills/20261001/docs/conventions.md#what-earns-a-line]]
      - [[sources/jsm-skills/20261001/CLAUDE.md#conventions-every-skill-follows]]
      - [[sources/jsm-skills/20261001/scripts/check-portability.mjs#check]]
      - [[sources/jsm-skills/20261001/scripts/analyze-token-usage.mjs#resolveTranscript]]

## Status

- [ ] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
