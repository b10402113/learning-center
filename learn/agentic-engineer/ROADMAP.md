---
subject: agentic-engineer
status: confirmed
path: course-order
created: 2026-10-30
---

# ROADMAP — agentic-engineer

## Goal

能在自己的 repo 上，從一句想法或一個 issue 出發，自己跑完整條 `scope → architect → develop → check → test → document → sync`，並且能指著每一個 gate 說出「拿掉它會怎麼壞」。

完成的判準不是「做出一個 demo」，而是交出一個 slice 加上它留下的決策痕跡：scope 裡的 `Done when`、ADR 的 trade-off、`verify.md` 的 PASS/FAIL 與證據、review 的 ranked findings、從真實 diff 寫出來的 PR 描述。第二個判準是：讀任何一個 agent 寫的 codebase，能分辨哪些地方是**被決定的**，哪些是**預設漂出來的**。

## Learning path

**course-order** — 照課程的模組順序走，concept-first。

角度：先建立「agent 是什麼、它為什麼會壞」的心智模型，再學「把紀律寫成檔案」，然後才進工作流的九個階段，最後用一個完整的 greenfield 專案把所有閘門跑一遍。

優化的是**完整跑一遍的保真度**：不重排、不跳段，每個 gate 都在課程安排的位置上出現，所以你會先體驗到問題，才拿到解法。分層邏輯是往外擴：Tier 1 是一個 session 內部的機制，Tier 2 是把紀律寫成跨 session 的檔案，Tier 3 是跨階段的流程，Tier 4 是跨人的交接，Tier 5 是整條流程跑完一次。

適合：已經會叫 agent 寫程式、走過 agent 底層，缺的是中間那層工程判斷的人——也就是這個 subject 的學習者本人。先照老師的步調跑完一遍，再搬回自己的專案。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — 建立心智模型

1. **[Setup & Orientation：這門課會與不會給你什麼](nodes/setup-and-orientation.md)**
   - Goal: 能說出兩個 build 場景（greenfield / brownfield）各自要你交出什麼，並把 Claude Code 裝進自己的 IDE。
2. **[Agentic Mindset：Direct the AI, Don't Rely on Hope](nodes/agentic-mindset.md)**
   - Goal: 能用「模型只讀得到公開程式碼」與「它替你填空」解釋 30 分鐘後崩壞，並把自己放回架構師的位置。
3. **[The Agent Loop：它看得到什麼、怎麼讀你的 codebase](nodes/the-agent-loop.md)**
   - Goal: 能用 read → decide → act → observe 解釋一次任務，並指出允許它讀什麼、講清楚決定、檢查觀察結果這三個槓桿。
4. **[Context Rot：品質在窗口滿之前就先掉](nodes/context-rot.md)**
   - Goal: 能分辨長度衰退與位置衰退、認出 topic switching，並用 clear / compact 判準決定一段 session 該怎麼收。
5. **[The Four Primitives：tools、skills、MCP、subagents](nodes/the-building-blocks.md)**
   - Goal: 能用四個 primitive 認出新工具是哪一個換了名字，並判斷 subagent 什麼時候值得花、什麼時候只是多一層。
6. **[Context Engineering：always-on、on-demand、reference](nodes/context-engineering.md)**
   - Goal: 能把「它應該知道」翻譯成三層 context 的配置，並用 `/context` 驗證 AGENTS.md 是真的被載入。

### Tier 2 — 把紀律寫成檔案

7. **[Skills：你本來用手做的紀律](nodes/skills-the-discipline-you-did-by-hand.md)**
   - Goal: 能用 name/description 誘發、body 延遲載入的結構，解釋 skill 為什麼省 context 又不讓模型變聰明。
8. **[Build Your Own Skill：以及 Skills vs. MCP](nodes/build-your-own-skill.md)**
   - Goal: 能做出一個會正確觸發的 SKILL.md、選對安裝位置，並用 Supabase 判斷何時該用 skill、何時該接 MCP。
9. **[The Experiment：One App, Two Builds](nodes/the-experiment.md)**
   - Goal: 能讀出 vibe build 的四個 killer，並說明每一個為什麼是「沒被決定」而不是「寫壞了」。
10. **[Workflow-First：先決定再建，與 The Two Bills](nodes/the-two-bills.md)**
    - Goal: 能對照兩個 codebase 的同一個功能，算出 build bill 與 runtime bill 為什麼反向走，並說出各自的代價來源。

### Tier 3 — 工作流骨架

11. **[Nine Skills：Finding Your Entry Point](nodes/nine-skills.md)**
    - Goal: 能背出九個 skill 的順序，並依手上的材料（greenfield / 既有 repo / 小改動）選出正確的入口。
12. **[scope：Challenge the Idea Before Any Code](nodes/scope-challenge-the-idea.md)**
    - Goal: 能跑一次 `/scope`，把隱形的預設換成寫下來的 MVP 邊界、`Done when` 與 tracer bullet 切片。
13. **[Reading a Spec：The Build Sees 什麼、你留下什麼](nodes/reading-a-spec.md)**
    - Goal: 能分辨 spec 給 build 的決策與留給你的理由，並跑一次 `/architect` 產出一份 Accepted 決策。
14. **[Demo: Planning a Feature with develop](nodes/develop-and-audit.md)**
    - Goal: 能說明 plan 上沒有的工作怎麼被 gate 成一張 `Assumed` spec，並用 `/audit` 寫出短而有用的 AGENTS.md。
15. **[sync：Understand It, Then Automate It](nodes/sync.md)**
    - Goal: 能用真實 diff 對帳 scope 勾選與 spec 狀態，並用 MCP 讓 migration 打在真的 schema 上。
16. **[Two Kinds of Proof](nodes/two-kinds-of-proof.md)**
    - Goal: 能分清「今天能用」與「以後還會能用」，並說出 alpha 與 beta 各自的閘門與順序。
17. **[Demo: Running check verify](nodes/check-verify.md)**
    - Goal: 能讀一份 `verify.md`，把每條 AC 判成 met / missing / not-applied / blocked 並附上證據。

### Tier 4 — 品質與交接

18. **[A Second Mind：review 與 document](nodes/a-second-mind.md)**
    - Goal: 能用不同模型做出 rank findings 的 review，並只從真實 diff 寫出 PR 描述。
19. **[The Three Kinds of Broken](nodes/the-three-kinds-of-broken.md)**
    - Goal: 能先分類是三種壞掉的哪一種，再用一次一個可證偽的假設找出根因，而不是改到紅燈變綠。
20. **[Debugging Code You Didn't Write](nodes/debugging-code-you-didnt-write.md)**
    - Goal: 能從 spec 的 AC、周邊慣例與執行行為三處還原意圖，並認出 session 已經壞掉、知道該 compact 還是 clear。
21. **[Code You Didn't Write：brownfield 的一天](nodes/code-you-didnt-write.md)**
    - Goal: 能在沒有 AGENTS.md 的 repo 上跑 `/audit`，再用 scope → architect → develop 改一個既有流程而不弄壞它。

### Tier 5 — 端到端交付

22. **[Scope Architecture Skills](nodes/scope-architecture-skills.md)**
    - Goal: 能從一句想法跑完整 kickoff，交出一份被第二個模型挑過錯的 Accepted spec。
23. **[Data Model：先寫 spec，再跑 migration](nodes/data-model.md)**
    - Goal: 能先把九張表寫成 spec 才動 migration，並用 verify 與 review 抓到只存在於應用層的約束缺口。
24. **[Architect the Movie Catalog and Cache](nodes/movie-catalog-and-cache.md)**
    - Goal: 能用「miss 幾乎不發生」推出 ingest job 加 Postgres 當 cache，並用 document 收掉一個 feature。
25. **[Setup Design System and UI Foundation](nodes/design-system.md)**
    - Goal: 能把視覺願望談成一份 design spec，並在感覺太樸素時重新 architect 而不是打補丁。
26. **[First Slice：Core taste loop](nodes/first-slice.md)**
    - Goal: 能交付一個 walking skeleton：真帳號、真儲存、每則 pick 一句理由，並知道哪些步驟 agent 無法替你做。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
