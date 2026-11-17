---
source: sources/real-engineer/20261116/course/035 Grill vs Wayfinder vs Ship First.en.txt
source_type: text
source_lines: 57
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 完整 Wayfinder 流程很重：大量 grilling、prototyping 與思考才動手；所以要判斷何時用 grill with docs、何時用 Wayfinder。
- 第三個選項是 one-shot：完全不規劃，直接叫 agent 做再審查。
- 判斷依據是 diff 大小：tiny diff（換按鈕顏色、讓失敗的測試通過、QA 小修）不值得為失準付代價，直接 one-shot。
- grill with docs 防的是「做出巨大的 diff 卻完全不是你想要的」那種浪費，所以 diff 只要不是 tiny 就值得用。
- 建議所有不 one-shot 的 session 都先從 grill with docs 開始，因為它可以升級（graduate）成 Wayfinder map。
- 反過來從 Wayfinder 起手最難回收：一旦建了大 map 才發現事情很簡單，典禮已經做完了。
- 結論：可以多 one-shot；Wayfinder 是 grill with docs 過載時的逃生艙。

# L2 detail

- `#L1-L10` — 回顧完整流程之重，並提出三個選項：grill with docs、Wayfinder，以及先前提得少的「完全不規劃、直接 one-shot」。
- `#L11-L31` — 決策樹第一問是 diff 是否 tiny（換色、修失敗測試、極小變更）：tiny 就不必擔心與 agent 失準，因為重做成本低；grill 系列防的是巨大又無用的 diff 所浪費的 token 與時間；作者常在 QA 小事（圖示、文案、間距）直接 one-shot 再審。
- `#L32-L49` — diff 只要不是 tiny 就用 grill with docs；並建議所有不打算 one-shot 的 session 都先 grill with docs，因為可以就地升級成 Wayfinder（發現要進 dumb zone、比想像大時）；反之先開 Wayfinder 才發現事情簡單，最難善後，因為資產都已建立。
- `#L50-L57` — 收束成 decision tree：不必什麼都 grill、也不必什麼都 Wayfind，可以比想像中更常 one-shot，並把 Wayfinder 當成 grill with docs 失控時的 escape hatch。
