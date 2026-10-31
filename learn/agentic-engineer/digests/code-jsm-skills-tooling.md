---
source: sources/agentic-engineer/20261030/skills
source_type: codebase
source_lines: 1150
language: Markdown
file_count: 12
status: absorbed
absorbed_at: 2026-10-30
created: 2026-10-30
updated: 2026-10-30
---

# L1 overview

- `docs` — 一份規範（`conventions.md`）加一份完整導覽（`workflow-guide.md`）。規範的核心主張：skill 每次執行都整份載入，因此每一行都是重複付出的成本，寫最少而仍能產生行為的內容；導覽則把九個階段的檔案所有權、`Assumed` spec 與驗收準則的追蹤線講清楚。
- `scripts` — `check-portability.mjs` 是零依賴的跨工具移植性與預算守門員，`analyze-token-usage.mjs` 拆解一份 session transcript 的 token 流向。兩者都把「skill 發佈」當成可量測的工程問題，而非寫作問題。
- `agents` — 兩個 read-only 子代理定義（`researcher.md`、`scout.md`），用 `tools:` 白名單與 `model: haiku` 把探索成本壓在低階模型上，並在 description 裡就規定「只回摘要、不回原始內容」。
- `ci` — `.github/workflows/check.yml` 在每次 push 與 PR 上跑 `npm run check`，把預算與移植性從口頭約定變成 merge 前的硬性檢查。

# L2 detail

- `#L1-L40` — `docs/conventions.md` — skill 撰寫規範：因為 skill 每次執行都整份載入，每一行都是成本，所以「一行必須改變 agent 的行為」、指令不寫理由、用概念名取代解釋、規則只說一次（唯一例外是為分散式安裝而刻意重複的共用輸出風格區塊）；最後要求 commit 前跑 `npm run check`，預算接近上限時應先修剪而不是調高上限。
- `#L1-L252` — `docs/workflow-guide.md` — 完整工作流程導覽：四種載體檔案（`AGENTS.md`、`docs/scope/`、`docs/specs/`、`design.md`）的建立者／讀者／修改者所有權表，spec 的 `Proposed → In Progress → Accepted` 生命週期與 `Assumed` 特例，四段驗收準則如何從決策一路串到測試，以及 Prototype/Alpha/Beta/GA 四種工作深度只是建議的檢查尾巴、`done` 永遠由工程師宣告。
- `#L1-L424` — `scripts/check-portability.mjs` — 跨工具移植性守門員，共十一條規則：每個 skill 必須宣告 `allowed-tools`、不得把 `haiku|sonnet|opus` 這類 Claude 專屬別名寫成 spawn 指令（改用角色詞，且明確設定子代理模型以免繼承昂貴的主 session 模型）、散文不得指名 `Agent`/`Task` 工具、不得用 PowerShell 會壞掉的 shell glue、`SKILL.md` 與支援檔有 byte 預算並在 90% 時預警、frontmatter `description` 上限 400 字（因為每個已安裝 skill 的 description 都載入每個 session）、每個 skill 要附 `agents/openai.yaml` Codex 介面卡、`allowed-tools` 要用 `Agent` 而非舊名 `Task`、跨 skill 重複的 contract 區塊必須逐 byte 相同、禁止 em/en dash 與散文中的連字號；另有 `HOT_PATH_BUDGETS` 把「一次真實執行會載入哪些檔案」加總後與預算對比。
- `#L1-L177` — `scripts/analyze-token-usage.mjs` — 唯讀、零依賴的 token 帳本：讀 `~/.claude/projects/<encoded-cwd>/<session>.jsonl`，用 `isSidechain` 把主執行緒與子代理成本分開，再把 token 拆成 fresh input / cache-write / cache-read / output，並以權重 `{input 1.0, cacheWrite 1.25, cacheRead 0.1, output 5.0}` 換算成可比較的 cost-units；結論是原始總量會高估成本（多為便宜的 cache read），該優先砍的是 output 與 fresh input。
- `#L1-L13` — `.claude/agents/researcher.md` — 唯讀研究子代理：`tools: Read, Bash, WebSearch, WebFetch`、`model: haiku`，只做三件事（Agent Skill／MCP 發現、當前用法 doc-check、來源驗證），明訂只回濃縮答案不回原始頁面、搜尋量要收斂、不得憑空造 URL，且無寫檔與安裝權限。
- `#L1-L13` — `.claude/agents/scout.md` — 唯讀程式碼偵察子代理：`tools: Read, Grep, Glob`、`model: haiku`，只回一份約 1–2k token 的精簡地圖（要建／改的檔案路徑、可沿用的 `file:line` 樣式、符號與 helper、地雷），明確禁止貼檔案內容與長引用，理由是不要撐爆呼叫端 context。
- `#L1-L21` — `.github/workflows/check.yml` — CI 只做一件事：Node 20 上跑 `npm run check`。註解點出檢查器零依賴、無需 `npm install`，把移植性與預算規範變成 push/PR 的強制門檻。
- `#L1-L121` — `README.md` — 對外的產品說明與安裝入口：九個階段 skill 的職責表、`idea → /scope → … → /sync` 主線與 `/debug` 支線、`npx skills@latest add … -a claude-code`（裝到 `.claude/skills`）與不帶 `-a` 的通用 `.agents/skills`（Codex 等）兩條安裝路徑、工作深度四級，以及「狀態存在檔案而非聊天」這個讓跨 session、跨團隊可續作的設計前提。
- `#L1-L30` — `package.json` — 套件 `@jsmastery/skills` v2.0.0，`"type": "module"`、Node ≥18；三個 script 就是整條工具鏈：`check` 跑移植性檢查、`test` 別名到 `check`、`tokens` 跑 token 分析；keywords 直接標明 `claude-code`、`cursor`、`agent-skills`，宣告多客戶端定位。
