---
source: sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.11.part.txt
source_type: text
source_lines: 170
part: 11
status: skipped
skip_reason: "純來源清單與引用對照，無獨立教學內容；各章主張已由對應章節 digest 承載"
created: 2026-11-03
updated: 2026-11-03
---

# L1 overview

- Appendix C：Sources — 全書引用與數據的來源清單，分成作者自家文章與外部來源兩張表，逐條把「主張」對到「出處」。
- 前半是 Daniel Moka 在 Craft Better Software 的電子報文章，標註各自被用在第幾章（Chapter 1–7），主題涵蓋 agentic engineering、Claude Code skills、mutation testing、測試生成、legacy 重構、mocks、抓 AI 錯誤、code review、loop engineering。
- 後半外部來源表把書中數字與引文一一掛回原始出處，例如 Terminal Bench 換 harness 就從前 30 衝到前 5、93% 權限提示被核准、lethal trifecta、dev container 擋不住容器內竊取、91/100 熱門 repo 指令檔有缺陷、多 agent 吃 3–10 倍 token、Meta 行數翻倍且 80% 成長來自 agent、verification tax、EchoLeak（CVE-2025-32711）。
- 文末註明：會隨工具版本變動的事實（版本、stars、額度）最後於 2026 年 10 月核實。

# L2 detail

- `#L1-L8` — 附錄標題（APPENDIX C）與前言：這是支撐書中數字與引文的文章、研究與文件清單。
- `#L9-L52` — 作者自家文章表：文章標題、網址與對應章節；含 Agentic Engineering 101（Ch1）、Master Claude Code Skills（Ch2）、mutation testing／1000s tests／legacy refactor／5 types of mocks／catch AI mistakes／Jev Engineering 101（Ch3）、Human Code Reviews Are Dead（Ch4）、Loop Engineering 101（Ch1、7）。
- `#L53-L74` — 外部來源表開頭：表頭 CLAIM/SOURCE，以及 harness 與 agent 定義類主張——Terminal Bench 只換 harness 就從前 30 進前 5、agent 是在迴圈中跑工具以達成目標、約 93% 權限提示被使用者核准、lethal trifecta。
- `#L75-L108` — 隔離、指令檔與 context 類來源：dev container 擋不住容器內惡意 repo、100 個熱門 repo 中 91 個指令檔至少一處缺陷且 62% 把 lint 規則寫成指令、瑣碎規則只被遵守約三分之二、hooks 能阻擋或提示並可依 .env.example 調整、無作用的一行只耗 context 不改行為、sub-agent 是為了 context 控制；結尾為頁碼 89。
- `#L109-L145` — 第二頁來源：乾淨 context 的 reviewer 能抓出 coder 看不到的 bug、多 agent 用 3–10 倍 token 且單 agent 好提示即可匹敵、GitHub 規劃容量從 10x 到 30x、Meta 每次變更行數一年翻倍且 80% 成長來自 agent、verification tax、標註 AI 撰寫不會讓 reviewer 更謹慎而是改變閱讀順序、EchoLeak 的 CVE 與論文編號。
- `#L146-L163` — 工具與文件來源：Decision LLMs／Jev（TypeSafe AI）、Hermes（功能、config keys、memory 上限、fallback 行為）與 Nous Research 文件、OpenRouter 免費模型限制與隱私設定、Claude Code 的 AGENTS.md 載入／imports／skills／hooks／sub-agents／routines 與官方文件網址。
- `#L164-L170` — 結語註記：會隨工具發布變動的事實最後於 2026 年 10 月核實；以及書名與頁碼 90 的頁尾。
