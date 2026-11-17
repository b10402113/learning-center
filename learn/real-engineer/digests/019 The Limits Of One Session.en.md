---
source: sources/real-engineer/20261116/course/019 The Limits Of One Session.en.txt
source_type: text
source_lines: 69
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L75
---

# L1 overview

- 瓶頸已經從「把工作做完」移到「把工作規劃好」：要能一次規劃夠大的工作，才餵得飽手上的多個 agent。
- grilling 的致命限制是它只有一個 session，問答一多就進 dumb zone；compact 又會丟掉很豐富的資訊。
- 把 grilling 拆成多個 session 很痛：session 之間的追問互相牽連，prototype 還要另外開 session 再交棒回去，而且你得先知道整體形狀才能決定要拆幾個 session。
- 借鏡 Shape Up：規劃有所謂 fidelity 階梯，從純討論、breadboarding、wireframe、prototype 一路到 production code；fidelity 越低承諾越少，越高越花 token 也越慢，但越知道自己在往哪走。
- agent 讓高 fidelity 變便宜（prototype 幾乎免費），所以真正的問題是「何時該拉高 fidelity」，而不是能不能。
- Wayfinder 同時解掉兩個問題：跨 session 規劃任意大小的工作，並為計畫的每個部分挑對 fidelity。
- 它特別適合充滿 unknown unknowns、大量待驗證、還不知道怎麼整合進應用程式的工作。

# L2 detail

- `#L1-L9` — 自動化做完工作之後，作者發現瓶頸轉移到規劃端；目標是做出一個能規劃「大到足以吃滿所有 agent」的工作量的規劃流程。
- `#L10-L23` — grilling 只有一個 session，越問越深就進 dumb zone；200k、300k tokens 的 session history 很有價值，compact 會丟失豐富資訊，因此不是解法。
- `#L24-L33` — 把 grilling 拆成多個 session 的痛點：session 1 的問題可能牽動 session 2、prototype 要另開 session 再交回、需要大量 context 管理；最糟的是必須先知道整體形狀才能決定拆幾個 session。
- `#L34-L53` — 回到 pre-AI 找答案：Shape Up 講的是找到對的工作形狀、在對的 fidelity 討論、再出對的東西；並定義 fidelity 階梯（討論 → breadboarding → wireframe → prototype → production code），低 fidelity 低承諾、高 fidelity 更花 token 更慢但方向更清楚。
- `#L54-L69` — agent 讓高 fidelity 變便宜，但仍要刻意選擇何時拉高；於是把「session 管理」與「隨時處在正確 fidelity」兩個問題合起來解，Wayfinder 就是能跨多個 session 規劃任意大小工作、並為每部分挑對 fidelity 的 planning skill。
