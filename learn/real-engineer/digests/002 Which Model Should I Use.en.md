---
source: sources/real-engineer/20261116/course/002 Which Model Should I Use.en.txt
source_type: text
source_lines: 33
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 這門課的模型選擇比 crash course 更重要：agent 跑得久、常同時多個、還會做高價值且不可逆的自主決策。
- 結論是選 Opus 等級的模型，付費方案至少 $100/月；免費不行，pro 方案會很吃緊。
- 想先省錢可以從 pro 起跑，用量用完再升級，但用 sonnet 等級撐著會處處配額、體驗不到軟體工廠的全貌。
- 不要用 API 按量付費，同樣工作量會比訂閱（個人／team／enterprise）貴得多。
- 用哪個 agent、哪家訂閱不重要，只要模型是 Opus 等級、token 足夠跑完整門課即可；可用 deep SWE benchmark 判斷模型是否在正確區間。

# L2 detail

- `#L1-L6` — 先決定模型與付費方案；理由是本課 agent 執行時間長、常同時多個、之後還會做高價值的重要自主決策，所以太便宜的方案會被吃爆。
- `#L7-L14` — 回顧 crash course 的選方案課：一定要付費方案，免費不可行，pro 大概也不夠，因為本課打算用 Opus 等級模型，因此 $100/月是下限。
- `#L15-L19` — 折衷路線：想先用 pro + sonnet 等級「勉強過關」可以，但會一直配額控管、看不到 software factory 完整威力；不確定就先 pro、用完再升。作者自己每天用的是約 $200/月的 upper max，並強調完全不用 API，因為同工作量用 API 會花遠更多錢，訂閱（個人／team／enterprise）划算得多。
- `#L20-L27` — 工具與模型可自由替換：Claude Code 或 codex 都無所謂，只要是 Opus 等級且 token 夠跑完課程；可用 deep SWE benchmark（作者大致相信）判斷哪些模型在同一水準，他自己用的 Opus 5.5 不在榜上，但重點是落在右上角象限的模型。
- `#L28-L33` — 總結：選 Opus class、至少 $100 方案，也可先買便宜的再升；方案選擇有疑問就到 Discord 問（會在後面幾支影片介紹）。
