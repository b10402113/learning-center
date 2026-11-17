---
source: sources/real-engineer/20261116/course/087 What Infrastructure Do I Need.en.txt
source_type: text
source_lines: 139
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L45
---

# L1 overview

- Part 1 的 software factory 全靠 GitHub，但 GitHub 是最佳教學工具、不是最佳生產選擇，尤其私有專案要付 GitHub Actions 的錢；這一課的目的是把概念翻譯到自己的基礎設施。
- 一個能運作的 software factory 需要五個可替換的部件：task tracker、git host、runner、orchestrator、observability platform。
- 每個部件都有明確職責：tracker 管任務與人機溝通，git host 放 branch／PR／review，runner 是執行工作的可丟棄沙箱，orchestrator 追蹤並觸發 runner、處理錯誤，observability 量成本與成功率。
- 決定順序等於優先順序：tracker 與 git host 通常已經存在、遷移成本極高，所以「有什麼用什麼」；runner 與 orchestrator 是 P1，observability 是 P2，可以晚點再上。
- 作者自己的組合：Linear（tracker）、GitHub（git host）、Daytona（runner）、自建 server（orchestrator）、Langfuse（observability），並點出 build vs buy 的取捨。
- 一次 ticket 的完整路徑：ticket 進 tracker → orchestrator 監看到 → 派給 runner → runner 完成 → 開 PR 或回留言到 tracker → 所有資料進 observability。

# L2 detail

- `#L1-L12` — 承接 part 1：工廠已能運作且看得見，但還沒「變成你的」，尤其 GitHub 的一切都是付費服務、多數專案又是私有，因此要把學到的概念翻譯到自己的工作環境；做法是先拆解 GitHub 提供的每個部件，再重組到自己的 stack。
- `#L13-L22` — 全課地圖：把基礎設施拆成五塊講完，接著盤點你現有的基礎設施，再腦力激盪套用到職場，最後定出工廠要做什麼；終點是一份可以直接丟給 agent 開始建置與運行的 working specification。
- `#L23-L36` — 第一塊 task tracker：工廠需要一個人機介面來追蹤任務、收 feedback、進行 agent 與人的溝通；GitHub issues 只是選項之一，Jira、Linear、Trello、Asana 都行，關鍵是有 ticket 清單、可指派、有 labels、有組織結構，且 agent 能存取（CLI、MCP server 皆可）。
- `#L37-L50` — 第二塊 git host：放 branch、PR、做 review、決定是否 merge 的地方；GitHub 之外有 GitLab、Bitbucket（常與 Jira 配對），若程式碼不能出內網則可能是 Forgejo 之類的自架方案。
- `#L51-L66` — 第三塊 runner：agent 實際動手的沙箱環境，GitHub Actions 是一次 run 跑在 disposable machine；新型服務如 E2B、Daytona 可以程式化開關沙箱，也可以自己開 VPS 每次起新容器。重點是可丟棄，狀態只能經由 commit／branch／PR 回到 git host，或寫回 ticket tracker。
- `#L67-L83` — 第四塊 orchestrator：追蹤所有 runner、依事件觸發、處理拋出的錯誤；GitHub Actions 的做法是 label issue 就自動起 runner。替代方案包括全押 CI 平台、自建 server + database（可參考 OpenAI 的 Symphony 規格）、或直接用 Claude Code on the web 這類 hosted agent platform。能力要求：能觸發 runner、能監聽外部資料、能跑 loop 與排程。
- `#L84-L96` — 第五塊 observability：量測成本與成功率、看出哪種做法有效；GitHub Actions 只能鑽進單次 run，沒有全域指標。工具如 LangFuse、LangSmith，或直接用模型供應商的觀測工具；若自建 orchestrator 因為已掌握所有 runner，順便內建觀測最省事。
- `#L97-L112` — 五塊的優先順序即決策順序：tracker 與 git host 幾乎已定（遷移是大工程），真正要做決定的是下面三塊；runner 與 orchestrator 屬 P1，observability 在工廠還沒產生價值前算 P2、甚至可以延後。
- `#L113-L139` — 作者示範自己的組合：Linear + GitHub + Daytona（啟動極快、可客製、沙箱安全）+ 自建 orchestrator（用 Sandcastle，透過排程把工作丟到 Daytona）+ Langfuse；誠實說自維護 server 相當費工、還是有 bug，並點出 build vs buy；最後以 ticket → orchestrator → runner → PR／comment → observability 的資料流收尾。
