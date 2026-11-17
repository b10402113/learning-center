---
source: sources/real-engineer/20261116/course/074 Sandboxing The Factory.en.txt
source_type: text
source_lines: 61
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L39
  - cohort-005-project.6.part.md#L1-L21
---

# L1 overview

- Agent 只有兩個執行位置：本機（適合 human in the loop）與遠端伺服器沙箱（適合 AFK）。
- 本機難以擴充：多個 agent 搶 CPU、要各自管理 work tree，一個 agent 出錯可能拖垮其他 agent 的成果。
- 遠端可每個 agent 一台伺服器，用完就關；這既好擴充，也把危險限制在單一伺服器。
- 遠端沙箱是團隊基礎設施，大家都能觀察、貢獻，協作優於只有一位 dev 能碰的本機環境。
- 任何遠端伺服器都能跑 agent：自架 AWS EC2／Kubernetes，或 Daytona、E2B、Vercel 等託管服務。
- 課程選 GitHub Actions：public repo 免費、天然能存取同在 GitHub 的 specs 與 tickets。
- 沙箱內用 Sandcastle 以 TypeScript 執行 coding agent，包裝 Claude Code、OpenCode、Codex 等 CLI。

# L2 detail

- `#L1-L6` — 承接上一節「把人從更多環節拿掉」的目標，提出實際基礎設施問題：怎麼擴到大量 agent？全跑在本機會吃資源、危害系統，還要處理 work tree 等複雜設定。
- `#L7-L12` — 兩種執行位置：本機（agent 就在旁邊，可隨時中斷、提問，適合 human in the loop）與遠端（通常跑在沙箱化的伺服器，適合 AFK）。
- `#L13-L22` — 本機難擴充且難管理：多個 agent 搶 CPU、要管各自的 work tree；遠端是一台伺服器配一個 agent，需要時開、結束就關，且出錯只影響單一伺服器，不會像本機那樣毀掉所有 agent 的進度。
- `#L23-L28` — 遠端也讓協作變容易：本機通常只有一位 dev 能存取，遠端沙箱則是團隊共用基礎設施，大家都能觀察、貢獻、改善整個系統。
- `#L29-L34` — 基礎設施設計自由：agent 可跑在任何遠端伺服器，例如直接用 AWS 開 EC2、Kubernetes，或 Daytona、E2B、Vercel 等託管服務；作者的問題是不想讓學員註冊第三方服務。
- `#L35-L40` — 因此選 GitHub Actions：public repo 免費、可盡量用；每個步驟都開一個 GitHub Action 跑 agent 並輸出資訊給下一步，且能直接存取同在 GitHub 的 specs 與 tickets。
- `#L41-L52` — 作者在開源 repo（尤其 Sandcastle）用得很成功；Sandcastle 就是沙箱內跑 agent 的工具，可用 TypeScript 執行 coding agent，包裝 Claude Code、OpenCode、Codex 等 CLI，所以換什麼 agent 都能跑；示範 `run` 與 `Claude Code` 函式，把 prompt file 傳給 sandbox 內的 agent。
- `#L53-L61` — 這套設定用來示範搬到遠端的好處；本機不會被淘汰，做 prototype 或需要緊密 human in the loop 時仍很好用，但想要快速 software factory，遠端不可或缺；GitHub Actions 只是最佳示範工具，本質只需要一台能跑 agent 的遠端伺服器。
