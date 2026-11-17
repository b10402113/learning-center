---
source: sources/real-engineer/20261116/course/094 The Ratchet Solution.en.txt
source_type: text
source_lines: 55
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 骨架沿用 improve-codebase-architecture：orchestrator 每天起一次 loop → 從 git host 抓出所有帶 ratchet label 的 PR → 超過 5 個就停 → runner 跑嚴格 lint 找出失敗 → 修其中一個 → 開帶 ratchet label 的 PR → 人 review。
- 可調變數很多：一天跑四次、門檻放寬到 10 個 PR、一次修五個失敗（各自用 sub-agent、各自成 PR）。
- 另一種加速器是事件觸發：PR merge 時由 orchestrator 監聽到並立刻再 spawn 一台 runner，節奏自動跟著當天開發者的意願走。
- 這條流程的關鍵在「兩桶 lint rule」：`lint:all` 含已知會失敗的規則，`lint:strict` 只跑預期會過的；ratchet 的本質就是把規則從前者搬到後者。
- 因此需要 graduation 步驟：當某條規則跑起來零失敗，就把它升級進 strict 集合，開一個 graduation PR 讓人 merge。
- 長期效果是 all 與 strict 終將相等，`lint:all` 可以直接刪掉；再搭配 PR merge 前掛自動 review 就更完整。
- 學到的通用能力：orchestrator 能跑 loop、能監聽 git host 幾乎任何事件、runner 內也能依「失敗是否都一樣」做條件判斷。

# L2 detail

- `#L1-L12` — 以上一課的結構起步：orchestrator 每日 loop → spawn runner → 先抓所有帶 ratchet label 的 PR，超過 5 個就停 → 跑嚴格 lint 規則找出失敗 → 修一個 → 在 git host 開帶 label 的 PR → 人工 review；並強調圖上每個數字都是可調的。
- `#L13-L24` — 加速器的具體形式：一天跑四次、門檻放寬到 10、一次修五個失敗（各用 sub-agent、各開 PR 逐一 review）；另一種是把 merge 當觸發事件，merge 後 orchestrator 立刻再起 runner，等於讓節奏貼合開發者當天想推進的速度，是很漂亮的加速器。
- `#L25-L39` — ratchet 的核心機制：lint 規則分成 `lint:all`（含已知失敗）與 `lint:strict`（預期全過）兩桶，ratchet 就是不斷把規則從前者搬到後者；因此要有 graduation 步驟——某規則跑起來零失敗就升級進 strict 並開 graduation PR；久而久之兩桶相等、可以刪掉 `lint:all`。
- `#L40-L55` — 通用心得：orchestrator 能跑 loop，也能監聽 git host 幾乎所有事件（例如 merge 觸發重跑），runner 內也能依失敗型態做條件判斷，把彈性寫進工廠；長期想像是一個會自我收緊的 codebase，若再加上 PR 前的自動 review 就接近理想。
