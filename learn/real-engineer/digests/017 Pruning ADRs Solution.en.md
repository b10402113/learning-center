---
source: sources/real-engineer/20261116/course/017 Pruning ADRs Solution.en.txt
source_type: text
source_lines: 89
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.3.part.md#L1-L370
---

# L1 overview

- agent 先確認 ADR 是否仍對得上程式碼，然後問 delete 與 deprecate 的差別；作者選 **B**：不再適用或從未夠格的直接刪，被推翻的決策改寫進新 ADR 的 considered options，不保留舊檔——因為留在 `docs/adr` 的 superseded ADR 是陷阱，agent 與新讀者會當成現行決策。
- 刪 007 `Lucide React`（圖示庫，不 surprising、易換）與 011 `Prettier`（只是沿用 repo 設定，太 trivial）。
- 008 IP API 國別查詢已被推翻（現在直接收全額）→ 移除 008，改寫成新 ADR 012，並把舊做法放進 considered options。
- 010「refund email 先寫 server log」已被 Postmark / mail transport interface 取代，且本身不夠格 → 刪。
- 005、006、009 通過三段檢驗，保留；同時把 ADR 內文改用 glossary 詞（platform admin、instructor）。
- 順手刪掉 agent 加進 `AGENTS.md` 的「所有 icon 都用 Lucide React」；最終 ADR 清單剩 8–9 份。

# L2 detail

- `#L1-L16` — prompt 要求以刪除或 deprecate 方式修剪 ADR。agent 沒有派 sub-agent，而是逐一比對 ADR 與現行程式碼。Q1 定義二選項：A 是「從未夠格就刪、被推翻就 deprecate」；B 是「一律刪掉不再適用或未夠格的，把推翻記錄放進新 ADR 的 considered options」。建議 B，理由是留在 `docs/adr` 的 superseded ADR 會被當成現行決策；作者同意 B。
- `#L17-L32` — Q2 點名 007 `Lucide React` 與 011 `Prettier` 都不到門檻。Prettier 那份極短：「Use Prettier and leave its settings alone」，各檔用 repo 起始的 `.prettierrc` 格式化——trivial、不 surprising、多數 repo 都這樣、也容易回頭。Lucide 那份比較過 Hero icons、Phosphor、Lucide，因圖示最全且搭配 ShadCN UI，結論是 icons 來自 `lucide-react`——同樣不 surprising、易換。兩份都同意刪。
- `#L33-L48` — Q3：008 屬「已被推翻」。它說 request 沒帶國家時用 IP API 查，而其中一個 considered option 現在成了實際做法：程式不再查 IP API，直接收全額。建議寫一份新 ADR 並移除 008，作者同意；並補充刪掉的 ADR 仍在 commit history 裡，需要時查得到。
- `#L49-L66` — Q4：010「退款 email 先進 server log 直到選定 mail provider」已過時，現在有 mail transport interface 且用 Postmark。作者說這本來就不值得 ADR——換 provider 就又不相關了，尤其已包在可替換介面後面，同意不留。Q5：005、006、009 通過門檻，作者直接信任。Q6：有些 ADR 用詞與 glossary 衝突，同意順手改成 glossary 語言。
- `#L67-L89` — 實作：agent 在 `AGENTS.md` 加了「all icons come from Lucide React」，作者判斷 agent 自己能看出來，刪掉。共移除四份 ADR（007 Lucide、011 Prettier、008 過時 IP API、010 log email），並把數份改成 platform admin / instructor 等 glossary 用詞。新的 012 是對 008 的推翻，considered options 記錄舊做法「用 `x-forwarded-for` 第一段查 ipapi.com」，並說明當初用過、後來放棄——作者稱這是很好的 ADR，因為「決定不做某事」根本無法從程式碼看出來，有了它 agent 就不會再重試。最終約 8–9 份 ADR，清單健康。
