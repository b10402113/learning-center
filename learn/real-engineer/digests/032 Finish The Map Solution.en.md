---
source: sources/real-engineer/20261116/course/032 Finish The Map Solution.en.txt
source_type: text
source_lines: 195
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 實作場，節奏改為「看作者操作」而非逐步解釋；逐張關掉剩餘 ticket。
- 第一張 grilling（各通知走哪些 channel）把範圍收到 version one：所有通知都進 feed，email 與 web push 都不進第一版。
- 退款相關信件改走通知系統，日後再擴充 email；不新造 transactional email 這種術語，避免複雜化；email 記為 out of scope。
- map 是有界的，只涵蓋 version one；舊 map 加上 PR 可以當歷史紀錄，日後把 out of scope 的部分重新 scope in。
- 第二張是 UI prototype：產出三個 variant（bell popover、drawer、inbox 加 toasts），作者選 bell popover，並迭代 pagination、badge、seed 8 與 seed 100、無限捲動；過程中還會降回低 fidelity 討論（例如已讀通知是否消失），最後選 keep all history。
- 最後一張 grilling（偏好設定）加了一條要求：所有碰 Knock 的程式碼要藏在介面後面，方便日後換供應商。
- 收尾：九張 sub-issue 全關後仍有 fog，於是再開一場 grilling 清 not yet specified，全部照建議通過，fog 清空，map 可轉成 spec。

# L2 detail

- `#L1-L8` — 說明本節以實際操作為主、減少講解；從「各通知走哪些 channel」的 grilling 開始，第一問同意所有通知都落進 notification feed。
- `#L9-L24` — 範圍決策：email 不進第一版、web push 也不進，刻意縮小範圍先到終點；第三方服務可日後擴充成所有通知的 hub；退款信不新造 transactional email 術語，改走通知系統再擴充；refund approved／declined 信在通知有 email channel 時才移除。
- `#L25-L50` — refund requested receipt 是少數該主動通知使用者的情形，也改成通知、日後可由 email 擴充（作者稱這是實作打破先前規則的好例子）；email 位置記為 out of scope；map 因此界定在 version one；舊 map 可作為歷史紀錄，之後再把 out of scope 的項目 scope in；剩下三個實作型問題全數同意，無 glossary／ADR 變更，關閉 ticket。
- `#L51-L65` — 下一張是 UI prototype；作者提到真實情境可同時跑兩張獨立 ticket 的 agent，很省時但仍有 context 切換成本；72.9k tokens 時 prototype 已完成並跑起 dev server。
- `#L66-L99` — 檢視三個 variant：A 是 bell popover（列出誰回覆了你的問題、可 mark all as read，位置好）；B 是 drawer，可用 seed my feed 灌入八則，但展開太大不喜歡；C 是 inbox 加 toasts、可篩選、有連結；作者喜歡 A，並注意到 seen 與 read 的差別（刷新後數字消失但仍留點）。
- `#L100-L124` — 追問 100 則通知時怎麼辦，agent 反問 badge 計數與刪除留言是否移除通知；作者決定刪除留言的通知要消失、badge 要能點到最具體位置、refund 確認可自行標記已讀；作者定義 prototyping 等於「有東西可看的高 fidelity grilling」。
- `#L125-L170` — 第二批 variant 提供不同分頁法：seed 8 對比 seed 100（9+ badge、load more）、無限捲動、A3（最新在上加 see all）；作者逐項給視覺回饋（要明確的 mark all as read、icon 要小、不要多餘計數與按鈕），選 A2 為定版；再問已讀通知是否永遠留著，agent 降回低 fidelity 給三個選項，作者選 keep all history（簡單可預測）並關閉 prototype ticket。
- `#L171-L195` — 最後一張 grilling（Cadence 的偏好設定如何運作）幾乎全同意，但新增一項要求：任何碰 Knock 的程式碼都藏在介面後，方便日後換供應商（留待 code base design 章節詳談）；九張 sub-issue 全關後仍有一大塊 not yet specified，於是再跑一場 grilling 清 fog，問題多為收尾確認且全數通過，建立並認領一張 plumbing ticket，fog 清空，map 成為可轉 spec 的詳細索引。
