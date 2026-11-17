---
source: sources/real-engineer/20261116/course/099 Prototyping.en.txt
source_type: text
source_lines: 29
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L75
---

# L1 overview

- 前面都在處理 bug 與 codebase 改善，還沒談工廠如何幫忙「做功能」，這一課要把 prototyping 接進工廠。
- 起點是既有的 feature-request 探索：複雜的就留言在 ticket 上等討論，簡單的就直接進 implement runner 再走 implement/review 流程。
- 新增第三種 verdict：不簡單也不複雜，而是「需要看得到的東西」，要靠 prototype 才能推進討論。
- 早早產出 prototype 價值極高，agent 尤其擅長，而且由 exploration 自己觸發最順；比起來只留一段留言，prototype 是能看到、能點擊的豐富資產。
- 真正的難點不是產生 prototype，而是 iteration：orchestrator 要接住 prototype 上的留言，並轉成 prototype 的更新。
- 這條路同時讓非技術人員透過 ticket tracker 做出可丟棄的 prototype，成為工廠後續流程的高品質輸入。
- 起手式仍是 Agent Explore，只是新增一個模式；難題是那個迭代迴圈。

# L2 detail

- `#L1-L8` — 切入點：先前都在談 bug report 與 codebase 改善，還沒談如何用工廠做功能；既有設計是在 feature request 的 exploration 中，複雜的留言到 ticket 等討論，簡單的直接啟動 implement runner，走完 implement/review 流程。
- `#L9-L14` — 新增第三種 verdict：不簡單也不複雜，而是「視覺性、需要 prototype 才能推進討論」；越早拿到 prototype 越有價值、agent 特別擅長，而且由 exploration 自行觸發最順，因為它給的是能看能點的豐富資產，而不只是一段留言。
- `#L15-L29` — 真正的難點與價值：難的不是產生 prototype，而是迭代——orchestrator 要接住針對 prototype 的留言並轉成更新，讓使用者在 tracker 上反覆調整，也讓非技術人員能做出可丟棄的 prototype 當作後續流程的輸入；本題以 Agent Explore 起手、新增一個模式，重點在設計那個迭代迴圈。
