---
source: sources/real-engineer/20261116/course/073 Our Factory's Goal.en.txt
source_type: text
source_lines: 69
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L48
---

# L1 overview

- 前面所有 lessons 都在踩煞車，目的是換取品質；這一部開始踩油門，把更多工作推過工廠並自主排程。
- Lauren Tan（P-Stack 作者）的 trust ladder：你越信任 agent，就能同時跑越多個 agent。
- 目前多數人只敢同時跑 1–5 個 agent，隨著信任提升可以堆到 50、100 個，每月推出驚人的 PR 數量。
- 落點取決於公司願意燒多少 token，以及你心中「出貨夠快、token 對價值的比例正確」的甜蜜點。
- 要拿到 merge 的五個步驟目前全是 human in the loop（HITL）：explore → approve → implement → review → merge。
- 把其中幾步翻成 AFK（away from keyboard）就是 software factory；implement 與 review 幾乎已經適合 AFK。
- 只有能同時踩煞車時，加速才顯得安全；少了人工守品質，這種設定很容易變成 slop cannon。

# L2 detail

- `#L1-L9` — 回顧前段全部在學如何讓 agent 變慢、提高品質、加上人工與自動審查；現在要反過來加速，並引用 Lauren Tan 的 trust ladder：信任越多、可同時執行的 agent 越多。
- `#L10-L17` — 多數人起步只能同時跑 1–5 個 agent，之後可堆到 50、100 個，換來每月極高的 PR 產量；最終停在哪裡取決於 token 花費意願，理想是出貨速度與 token 價值比都正確的位置。
- `#L18-L23` — 預期疑問：同時 50 個 agent 要怎麼 prompt 才不會瘋掉；作者預告要示範幾個 mechanics。
- `#L24-L39` — 列出目前把工作 merge 進 main 的步驟：先 explore（grilling 或讓 agent 查 bug），再 approve 要做什麼，然後 implement，接著 review（agent 一部分、人一部分），最後由人按下 merge；這些全是 HITL。
- `#L40-L47` — 把 implement 改成 AFK：人 explore、人 approve，agent 自己去 implement，人再回來 review；review 也幾乎可以 AFK，因為它只是用來改進流程與攔下 one-way door 的危險。
- `#L48-L55` — 連 explore 也能自動化：agent 自己找問題、驗證是否成立、做 reproduction；回應 feature request 並評估要改什麼；bug report 可自動核准 reproduction 再交給 implementer，人只在 merge 時回來。
- `#L56-L65` — merge 也可部分自動：two-way door、blast radius 小、沒有 data migration 的 PR 可自動 merge；把人工關卡逐一拿掉就是 software factory，但必須有人守住品質，否則會變成 slop cannon；做起來後是最快產出高品質程式碼的方式。
- `#L66-L69` — 預告接下來幾節會 demo 這個工廠長什麼樣，並提供打造自己工廠的工具。
