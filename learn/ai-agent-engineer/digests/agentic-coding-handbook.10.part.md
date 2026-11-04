---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.10.part.txt
source_type: text
source_lines: 221
part: 10
status: absorbed
absorbed_at: 2026-11-03
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- **Appendix B — Your Toolkit** — 全書附錄，集中列出課程用到的每一個 repo、skill、guide 與工具，讓讀者不必回頭翻章節找連結。
- **The course repos** — 四個 GitHub repo：`dmoka/ticket-bay`（Next.js + Postgres 練習專案，含 `./box`、CI gate、MCP server、`lesson/<n>-start` 與 `-solution` 分支）、`dmoka/skills`（課程 skill 集）、`dmoka/quicke2e`（以 decision LLM 為核心的 E2E 測試庫與其 agent skill）、`dmoka/braintemplate`（second brain 範本，含 `install.mjs`、`sync.mjs` 與 capture／triage／lint／ask-brain 四個 skill）。
- **Skill 安裝指令** — `npx -y skills add dmoka/skills --skill <name> --agent claude-code -y`，任何專案皆可執行；這是把單一 skill 裝進 Claude Code 的標準路徑。
- **dmoka/skills 的八個 skill** — write-great-skill、mutation-testing、legacy-testing、grill-me、adversarialtester、pr-tour、pr-triage、bug-triage、agent-safetyaudit，各自對應章節（2、3、4、7、8），涵蓋 skill 撰寫、測試補強、計畫詰問、PR 導讀／分流、bug 轉測試與 agent 安全審查。
- **The course kit** — 課程頁下載的 ZIP，每個 guide 都是寫給 agent 讀的：把檔案丟給 agent 說「set this up」即可。模組 M0–M8 分別提供 setup guide、七層地圖、context 習慣與 handoff prompt、box 啟動、五個 hooks、新增 MCP server 的 skill、email loop routine、以及 AI employee（Hermes）的設定包。
- **其他工具** — Claude Code 為全書的 coding agent；Hermes 是 AI employee 的 harness；三個必備 MCP server（Context7、Playwright、Chrome DevTools）；各語言 mutation／property testing 工具；Playwright、Testcontainers、Better Auth、OpenRouter、Ollama、Tailscale、gitleaks、Squawk／strong_migrations。

# L2 detail

- `#L1-L4` — 附錄 B 標題與導言：本章是「你的工具箱」，彙整課程用到的所有 repo、skill 與 guide。
- `#L5-L30` — 課程 repo 清單：ticket-bay（練習 app 與 lesson 分支）、skills、quicke2e、braintemplate，以及把 dmoka/skills 單一 skill 裝進 Claude Code 的 `npx skills add` 指令。
- `#L31-L95` — dmoka/skills 的 skill 對照表：每個 skill 的名稱、功能一句話、對應章節；涵蓋 skill 撰寫、mutation／legacy 測試、grill-me、adversarial tester、PR tour／triage、bug triage、agent 安全稽核（lethal trifecta）。
- `#L96-L160` — The course kit：ZIP 形式、以 agent 為讀者；M0–M8 模組清單，逐一說明 setup guide、七層地圖、context 重置規則、box 設定、五個 hooks、MCP server skill、routine guide、Hermes config pack 各自是什麼。
- `#L161-L217` — 其他工具表：Claude Code、Hermes、三個 MCP server、各語言 mutation testing 與 property testing 工具、Playwright、Testcontainers、Better Auth API key plugin、OpenRouter、Ollama、Tailscale、gitleaks、Squawk／strong_migrations，以及各自用途。
- `#L218-L221` — 頁尾：書名與頁碼 87。
