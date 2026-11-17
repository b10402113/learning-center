---
source: sources/real-engineer/20261116/course/011 ADRs _ Domain Language.en.txt
source_type: text
source_lines: 83
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- ADR = Architectural Decision Record：程式碼只告訴你「最後長成什麼」，說不出「你決定不做什麼」——程式碼是答案，算式被擦掉。
- ADR 格式極短：一到三句話講「決定了什麼、為什麼」，considered options 與 consequences 都是選配。
- 新增 ADR 的三段式檢驗：**hard to reverse**、**surprising without context**、**result of a real trade-off**，三者都要成立。
- 反例：用 Recharts 或 Sonner 做 toast 不值得寫 ADR（容易換掉）；React 換 Vue 才值得。
- 正例：`courses.slug.ts` 的 `asDayString` 用「整天」而非精確到小時計算退款窗口，午夜截止讓 learner 多一段時間——不寫下來 agent 很容易在 hours / days 間亂切。
- ADR 與 glossary 都只是 secondary source，不是 source of truth，只補程式碼無法自述的缺口；ADR 放在全域 `docs/adr/` 讓 agent 找得到。

# L2 detail

- `#L1-L19` — 介紹 domain modeling skill 的另一半：編輯與建立 ADR。為什麼需要：程式碼能說明它做什麼、回傳什麼、用你的領域語言，但說不出「被否決的做法」，就像答案留著、算式被擦掉。ADR 格式極小，一到三句講決定與理由，considered options 與 consequences 可選。
- `#L20-L34` — 擔心 markdown 資料夾會無限膨脹，因此 skill 規定「offers ADRs sparingly」，門檻是 hard to reverse、surprising、real trade-off 三者兼具。用 Recharts 或 Sonner 做 toast 不值得；從 React 搬到 Vue 這種要花大量工時回頭的才值得。
- `#L35-L57` — 具體例子：`courses.slug.ts` 的 `asDayString` 在 `get refund offer` 內被呼叫，回傳 learner 可獲得的退款 offer 或 null。若按小時算，9/20 購買者會在 10/4 上午 9 點截止；改用整天則到午夜截止，多給一大段時間。這種決策 agent 很容易在 hours 與 days 間自由切換而踩壞，所以放進全域 `docs/adr` 便於找到與凸顯；grilling 當下正是做決策的時刻，順手記下來最合理。
- `#L58-L83` — 對「用 markdown 描述程式碼」保持高度警戒：這違反 primary/secondary source 的區分——程式碼是 primary，體積大；規格文件是 secondary，較小但不是真相來源、容易過時並誤導 agent。ADR 只在補程式碼看不到的縫隙，不當新真相來源；glossary 同理，先懂 glossary 反而更好讀程式碼。
