---
subject: real-engineer
status: draft
path: concept-first
created: 2026-11-16
---

# ROADMAP — real-engineer

## Goal

完整理解這套方法論的每個環節，之後再決定要採用哪幾段。

## Learning path

**Concept-first：先裝煞車，再踩油門。**

這條路徑沿用課程自己的論證順序。Tier 1 先建立心智模型與環境：為什麼信任才是 agent 出貨的瓶頸、為什麼要先學會停下來。Tier 2 到 Tier 5 依序補上四層煞車——共享語言、規劃、審查、codebase 設計、回饋迴路——每一層都讓 agent 的產出更可預測。Tier 6 到 Tier 7 才把油門踩下去：先在 GitHub Actions 上跑出一條最小的 software factory，再把它搬到自己挑的基礎設施上。它優化的是「一次讀完一個完整論證」：每一層都為下一層鋪路，讀者不會在還不信任 agent 時就被丟去平行跑五十個。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 心智模型與環境

1. **[煞車與加速器](nodes/brakes-and-accelerators.md)**
   - Goal: 能用「先裝煞車、再踩油門」說出這門課的順序，並把 Cadence 跑在自己的 fork 上、用 reset 與 cherry-pick 跟上課程。

2. **[共享語言與 GLOSSARY.md](nodes/shared-language.md)**
   - Goal: 能為一個概念找出正確的字、寫進 glossary，並把程式碼、UI 與文案統一成同一套說法。

3. **[ADR：留下被否決的決策](nodes/adrs.md)**
   - Goal: 能用「難以回頭、無脈絡會意外、是真取捨」三問判斷該不該寫 ADR，並修剪過期的那一份。

### Tier 2 — 規劃

4. **[Wayfinder：地圖、霧與 frontier](nodes/wayfinder-map.md)**
   - Goal: 能為一塊充滿未知的工作畫出 map、定出 destination，並認出第一個可動工的 frontier。

5. **[四種 ticket：grilling、research、task、prototype](nodes/ticket-types.md)**
   - Goal: 能依決策性質選對 ticket 類型，把一張 map 走完並清空 fog of war。

6. **[從 map 到 spec，再一次平行實作](nodes/spec-to-implement.md)**
   - Goal: 能把清完霧的 map 壓成 spec、切成 ticket，並判斷何時該 grill、Wayfinder 或直接 one-shot。

### Tier 3 — 審查

7. **[三道煞車與 PR 的呈現方式](nodes/three-kinds-of-review.md)**
   - Goal: 能說明 automated checks／automated review／human review 的分工，並用 PR skill 讓 diff 被快速讀懂與排序。

8. **[automated review 與 retro](nodes/automated-review-and-retro.md)**
   - Goal: 能用兩軸 code review 在人工介入前把 PR 拉起來，並用 retro 把每次教訓沉澱成系統規則。

### Tier 4 — Codebase 設計

9. **[好 codebase 的語言](nodes/good-codebases.md)**
   - Goal: 能用 leverage、locality 與 deep／shallow module 診斷 codebase，找出該加深的模組。

10. **[seam、adapter 與讓 legacy 可測](nodes/seams-and-adapters.md)**
    - Goal: 能替難測的 legacy 找 seam、插 adapter，用自動檢查釘住模組邊界，並走完 refactor 的 spec 流程。

### Tier 5 — 回饋迴路

11. **[把 coding standards 變成 automated checks](nodes/automated-checks.md)**
    - Goal: 能把確定性規則從散文搬進 pre-commit 與 CI，並把檢查壓進三秒預算。

12. **[自訂 lint rule、mutation testing 與 data sources](nodes/lint-mutation-and-data-sources.md)**
    - Goal: 能為 linter 抓不到的問題寫規則、用 mutation 找測試缺口，並把缺的資料源接給 agent。

### Tier 6 — Factory Part One

13. **[trust ladder、沙箱與第一個 implementer](nodes/trust-ladder-and-sandbox.md)**
    - Goal: 能說明五個合併步驟哪些可 AFK、把 agent 丟進遠端沙箱，並用一個 label 跑出第一個 PR。

14. **[把 build 與 review 拆開，串起整條工廠](nodes/chaining-the-factory.md)**
    - Goal: 能用 review label 接第二段流程、對遠端 run 做 retro，串成 explore → implement → review。

### Tier 7 — Factory Part Two

15. **[選自己的基礎設施，白板你的 task](nodes/choosing-infrastructure.md)**
    - Goal: 能選出 tracker、git host、runner、orchestrator、observability，並把工廠要跑的 task 畫成一張圖。

16. **[orchestrator 的 loop：改善、ratchet、rebase、慢查詢](nodes/orchestrator-loops.md)**
    - Goal: 能設計自己排程的 loop，用門檻與 label 控制節奏，讓失敗走回人手上。

17. **[prototyping、implement spec 與收尾](nodes/prototyping-and-implement-spec.md)**
    - Goal: 能把 prototype 接進工廠迭代迴圈、用 orchestrator 跑完整份 spec，並說出每一章如何餵養工廠。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
