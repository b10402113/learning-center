---
source: sources/real-engineer/20261116/course/058 Making Bad Code (Nearly) Impossible.en.txt
source_type: text
source_lines: 17
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 軟體工廠有三層剎車：automated review、human review、automated checks；這一節終於要談第三層。
- automated checks 的目標是讓 agent 的產出在進入 automated review 之前就先被擋下或修正。
- 本節分成兩半：automated checks 與 data sources。
- data sources 的核心是：多數人給 agent 的資訊太少，它無法驗證自己的成果。
- 資訊越多、品質越高，agent 的結果就越好。
- 兩者都在強化 agent 的 feedback loop：一邊是檢查失敗的訊號，一邊是更高品質的環境資訊。
- 結果是一個更可信的 agent：會自己檢查、也有 guardrails 讓它不偏離軌道。

# L2 detail

- `#L1-L3` — 回顧已講過的 automated review 與 human review，指出 automated checks 一直沒深入，現在正式進場。
- `#L4-L13` — automated checks 是一組雜項技巧，用來在 automated review 之前提升產出品質；本節分 automated checks 與 data sources 兩部分，後者要解決「agent 資訊不足無法自我驗證」的問題，兩者共通點是提升 feedback loop 的品質。
- `#L14-L17` — 本節結束時會得到更可信的 agent：它會檢查自己的工作，並有 guardrails 維持在正軌上。
