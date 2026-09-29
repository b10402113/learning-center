---
subject: jsm-skills
language: zh-Hant
created: 2026-09-29
updated: 2026-09-29
---

# MEMORY — jsm-skills

## Goal
能當使用者，把 jsm-skills 這套九階段工程工作流（scope → audit → architect → develop → check → test → document → sync，外加 debug）跑在自己的專案上：知道每個階段何時用、何時跳過、輸入輸出是什麼，能在一個新的小 side project 上從一句話跑到可交付的功能。

## Why
對照並升級自己已有的 SDD 流程（`ai-coding-for-real-engineer` 的 grill → spec → issues → implement → review、`geek-ai-agent` 的 Loop/Harness）。想知道 jsm-skills 這套多／少哪些環節、偷哪些巧，用來補自己的流程。

## Prior experience
- Claude Code / opencode 重度使用。
- 自己寫／改過 SKILL.md（frontmatter、skill 資料夾結構）——skill 機制已熟，不重教。
- 會刻意維護 AGENTS.md / CLAUDE.md（寫規則、拆 nested 檔）。
- 派過並設計過 subagent prompt（唯讀探索／審查）。
- 已跑過 SDD 流程與 OryxOS 的 Loop/Harness。
- Java 21 / Spring Boot、Node/Express、MySQL、git、HTML/CSS/JS、Vue、LangGraph。
- **尚未做過**：cross-model review（用不同模型交叉驗證）。

## Anchors
- **開一個新的小 side project** ── 本課的實戰載體，每個階段都在它上面真實跑一次。
- **learning-center 自己的 `.opencode/skills/`**（absorb / teach / nodes…）── 對照 jsm-skills 的 skill 寫法，同一件事兩種風格。
- **`ai-coding-for-real-engineer` 的 SDD 七階段** ── 持續對照「同一個環節，兩套流程怎麼解」。
- **OryxOS / geek-ai-agent 的 Java/Spring 實戰** ── 把 scope / architect / check 對回真實後端功能。
- **公司 Java 平台** ── 最終要導入的地方（現階段不拿來練）。

## Habits & constraints
- 每週 1–3 小時，碎片化；長段落在週末或晚間。
- Mac 環境；可自行安裝工具（`npx skills` 等）。
- 無硬性 deadline，中等壓力。
- 節奏：**讀一個階段 → 當週在同一個練習專案上跑一次**；寧可慢，但每階段都真的動手。

## Knowledge type
mixed，**procedural 為主**。核心是「會跑流程、會判斷何時用／何時跳過」；但 skill 設計原理（progressive disclosure、token 預算、subagent 唯讀分工、one-recommended-option、spec lifecycle）要用「取捨」深講——因為懂了才能改。

## How to teach me
- 每階段先給**完整實跑**：真實情境 → 提示詞 → agent 行為 → 產出，再讓我在練習專案上重現。
- 密度高、不鋪陳；**跳過 Claude Code / git / basics 與工具安裝**。
- 講「**為什麼**」的機制（為什麼 progressive disclosure 能省 context、為什麼 subagent 要唯讀、為什麼 one-recommended-option 能防呆、為什麼 spec 要分 Proposed → Accepted）。
- 特別標記**失敗模式與風險**：假綠測試、agent 留死碼不刪、自己審自己的盲點、context 變笨、curated prose 被覆寫。
- 每篇能**碎片化讀完**，結尾落在「真的能跑或真的能決定」的事上。
- 輸出語言 **zh-Hant**；程式碼、識別字、API／Git／指令名稱、skill 名稱、frontmatter 鍵值保持英文。
