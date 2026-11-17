---
source: sources/real-engineer/20261116/course/010 Using Grill with Docs Solution.en.txt
source_type: text
source_lines: 189
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.1.part.md#L1-L237
  - cohort-005-project.4.part.md#L1-L13
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- 開始時其實有四個名字：程式碼、schema、root file、commit message 用 `refund`；按鈕與表單用 `cancel my purchase`、email 用 `reversal`、settings 用 `pending chargeback`，錯誤訊息還有一個 `cancel`。
- 決策：這概念叫 **refund**；而且要拆成 **refund request** 與 **refund** 兩個詞，靠 scenario table 證明一句話會講不清。
- 其他決策：一律全額、拒絕後可再申請、chargeback 不納入 glossary、status 用 `open` / `approved` / `declined`、refund 有 `pending` → `issued` / `failed` 生命週期。
- 畫面文案也變成 glossary 詞：`Request a refund`、email 主旨 `Refund requested`、settings 標題 `Refund requests`。
- 程式落地：schema enum 由 `requested` 改 `open` 並產生 migration，路由與變數改 `open refund requests`、`get refund offer`。
- 收尾觀察：glossary 裡已冒出未被正式定義的 `learner`，下一個問題可能是 user / instructor / learner / admin 的區分。

# L2 detail

- `#L1-L20` — 開始口述 prompt：應用對 `pending chargeback` / `reversal` 的意義很混亂，email 與畫面用語不一致，想先把這個範圍的 glossary 建起來。`grilling` 與 `domain-modeling` 兩個 skill 載入成功；agent 讀完 refund 程式後回報其實有四個名字，並強調「錯誤訊息也算」。
- `#L21-L30` — 第 1 題問這概念叫什麼，建議 `refund`；作者同意，理由是站在 learner 角度是想 refund 而不是 cancel。第 2 題立刻問：需要一個詞還是兩個，因為「learner 提出」與「錢真的退回」是兩個事件。
- `#L31-L46` — 作者要求先做 scenario testing，因為 `refund request` 與 `refund` 本身也很像。第 3 題問 bank-initiated chargeback 是否在 scope 內；決定把 chargeback 留在 scope 外，先替 glossary 劃界。
- `#L47-L61` — 情境表出爐：Liam 要求退 $79 沒人處理 → `Liam has an open refund request`；管理員拒絕 → `refund request declined, no refund issued`。若只有 `refund` 一詞，會變成「一次購買、兩次 refund、兩次都沒 refunded」，講不通。
- `#L62-L72` — 另一組情境：管理員只退 $40 而非 $79。只有 `refund` 就得另外造 requested amount / refunded amount；有 `refund request` 就能說 request 是 $79、refund 是 $40。結論：用兩個詞，`refund request` 成立。
- `#L73-L88` — 第 4 題決定一律全額（不做 partial）；第 5 題允許被拒後再申請；第 6 題「approved 是否等於錢已退回」——目前沒接 Stripe，但若接上就需要 `pending refund` 與 `issued refund`，因此要求再跑一輪情境測試。
- `#L89-L113` — 此時 `GLOSSARY.md` 已寫入 `refund`、`refund request`，但 agent 自行加了 `chargeback`（作者不喜歡，下一輪要求移除）。生命週期情境：週一核准、週四處理器確認，週二只寫 refunded 就是「連三天說謊」；處理器因卡片關閉拒絕則 request approved 但 refund failed。結論：refund 與 refund request 都要有 status，選 refund lifecycle。
- `#L114-L141` — 第 7 題發現 page 與 route 的 eligibility 不一致（作者說是刻意埋的 bug，要求這次忽略、另開 session）；`amount paid` 可用。glossary 增為 `pending` / `issued` / `failed refund`；未決的是「沒人處理的 request」叫什麼——否決 `requested`（會變成 "a requested refund request"），採 `open refund request`，status 為 `approved` / `declined`；畫面文案定為 `Request a refund`、主旨 `Refund requested`、settings 標題 `Refund requests`。
- `#L142-L156` — 第 12 題「refund 是否改變 purchase、learner 是否失去課程存取」列為 out of scope，之後再做；補答漏掉的第 9 題。glossary 再更新，出現 `open refund request`、`approved`、`declined` 與最後的 shared-understanding 摘要。
- `#L157-L189` — 實作：`schema.ts` 的 refund status enum 由 `requested` 改 `open`，產生 DB migration（把 status `requested` 的 refund 改成 `open`）；settings route 由 `pending chargebacks` 改 `open refund requests`，區域變數同步；`courses.slug` 的 `get requested refund` 改 `get open refund request`，註解 `get cancellation offer` 改 `get refund offer`。結尾點出 glossary 裡尚未定義的 `learner`，並鼓勵拿自己的 repo 重做一次。
