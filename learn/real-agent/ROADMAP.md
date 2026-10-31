---
subject: real-agent
status: confirmed
path: systems
created: 2026-10-30
---

# ROADMAP — real-agent

## Goal

能在自己的 repo 上用一組檔案把「跟 agent 合作」變成可重複的流程：`GLOSSARY.md`／ADR 先釘住語言與決策，`/grill-with-docs` 把模糊需求問到能動工，Wayfinder 的 map 把大功能拆成一個 session 吃得下的 ticket，`/to-spec` → `/to-tickets` → `/implement-spec` 壓成可執行清單，三種 review 把關，`/retro` 把 review 意見變回規則。判準是能指出每一段痕跡擋掉了什麼，並分辨 agent 產出裡哪些是「被決定的」、哪些是預設漂出來的。

## Learning path

**systems** — 不照課程播出順序，而是照這套系統**咬合的方式**分層。

角度：先建基座（系統靠什麼記住東西），再建規劃圖（怎麼把超出一個 session 的工作拆成可累積的決策），接著是壓縮鏈（怎麼把決策壓成工單），然後是選路（這件工作該不該進這套系統），再來是煞車（三種 review 的疊法），最後是回饋（把 review 變成下一輪的規則）。

優化的是**機制之間的接口**：每一層都回答「上一層的產出交給下一層時長什麼樣子」——glossary 條目交給 ADR、ticket 的 resolution 交給 spec、PR 的 Merge Danger 交給 review 優先序、review 留言交給 retro。代價是前期會先花四個 node 在語言與決策上，看不到「跑完一個功能」的快感。

適合：已經會叫 agent 寫程式、也走過單一 slice 的 gate（agentic-engineer），真正卡在規模與跨 session 的人。跟 agentic-engineer 重疊的部分（ADR、code review、skills）一句話帶過，篇幅留給剪枝、四種 ticket、Merge Danger、retro。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 基座：語言與決策

1. **[Domain Language：一個概念，一個名字](nodes/domain-language.md)**
   - Goal: 用 GLOSSARY.md 把散在 UI、email 與識別字的三種叫法收斂成一種，並在程式裡改到一致。
2. **[ADRs：把被否掉的選項留下來](nodes/adrs.md)**
   - Goal: 用難回頭、會意外、真取捨三問判斷哪些決策值得留下，並寫出一頁以內的 ADR。
3. **[Pruning is an art：修剪 glossary 與 ADR](nodes/pruning-glossary-and-adrs.md)**
   - Goal: 用同一套判準剪掉 glossary 的實作細節與 ADR 的過期決策，並分辨 delete 與 deprecate。
4. **[Q&A：一個 glossary 夠不夠？](nodes/glossary-q-and-a.md)**
   - Goal: 用前綴、bounded context 與 GLOSSARY-MAP 處理兩套詞彙相撞，並決定何時更新 glossary。

### Tier 2 — 規劃圖：把工作拆成可跨 session 的決策

5. **[The Limits Of One Session：一個 session 撐不住的時候](nodes/limits-of-one-session.md)**
   - Goal: 說出 dumb zone 與 fidelity ladder，並解釋為什麼要把規劃拆成跨 session 的產物。
6. **[Charting The Way：地圖、霧與 frontier](nodes/charting-the-way.md)**
   - Goal: 讀懂 map issue、blocking 表、fog of war、frontier，並認出四種 ticket 各自回答什麼。
7. **[Grilling Ticket：一個 session 解一個決策](nodes/grilling-ticket.md)**
   - Goal: 從 ticket URL 開場、問到決策收斂、把 resolution 寫回 issue 並關票。
8. **[Task Ticket：只有人能做的步驟](nodes/task-ticket.md)**
   - Goal: 判斷哪些步驟該交給人加 wizard，讓 API key 只留在本機 `.env`。
9. **[Prototype Ticket：用會跑的程式回答問題](nodes/prototype-ticket.md)**
   - Goal: 在 throwaway branch 上把 ticket 要求的多項檢查跑出來，並把 pitfalls 寫回地圖。
10. **[Finish The Map：把霧清到可以寫 spec](nodes/finish-the-map.md)**
    - Goal: 平行關掉剩下的 ticket、砍掉 v1 範圍，把 Not yet specified 清空成 spec-ready 的地圖。

### Tier 3 — 壓縮鏈：從地圖到工單

11. **[Spec → Implement：把地圖壓成工單](nodes/spec-to-implement.md)**
    - Goal: 用 `/to-spec`、`/to-tickets`、`/implement-spec` 把決策壓成可執行、可回溯、能平行跑的工單。

### Tier 4 — 選路：這件工作該走哪條

12. **[Grill vs Wayfinder vs Ship First：選一條路](nodes/grill-wayfinder-ship-first.md)**
    - Goal: 用 diff 大小與不對稱性決定一次改完、grill 或 Wayfinder，並說出升級方向的代價。

### Tier 5 — 煞車：三種 review

13. **[The Three Kinds Of Review：三種煞車](nodes/the-three-kinds-of-review.md)**
    - Goal: 說出自動檢查、自動 review、人 review 各擋什麼、成本差在哪，並排出疊法。
14. **[The PR Skill：讓 PR 值得人看](nodes/the-pr-skill.md)**
    - Goal: 用 Summary、Evidence、Merge Danger（door × blast radius）寫出讓 reviewer 三十秒進入狀況的 PR。
15. **[The /code-review Skill：在人的前面先審一次](nodes/the-code-review-skill.md)**
    - Goal: 用 CODING_STANDARDS.md 與 spec 跑 sub-agent review，並判斷哪些 finding 要修、哪些是判斷題。

### Tier 6 — 回饋：把 review 變成規則

16. **[Retro：把 review 意見變成規則](nodes/retro.md)**
    - Goal: 跑 `/retro` 讀 session 與 PR 留言，挑出該變成標準的候選並只套用真正值得的那些。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
