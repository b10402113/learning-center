---
source: sources/real-engineer/20261116/course/022 Chart The Map Solution.en.txt
source_type: text
source_lines: 143
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 實作場：對 Cadence 的 in-app notifications 建出第一張 map，約七張 ticket，四種類型全員到齊（grilling、prototype、task、research）。
- grilling 一開始先問「這個 map 的 done 長什麼樣」，作者選 spec（另一個選項是 working build）。
- 早期最關鍵的是 scope：in-app feed 確定要，push 與 email 待研究；沒有手機 app，所以 out-of-app 管道要重新想。
- 供應商選擇被留在 map 裡，由 research ticket 驅動；偏好 hosted 第三方、不自架。
- 兩張 research ticket 在 map 建立後立刻派給 subagent，回來後把 resolution 放進 ticket、完整研究放進一個 throwaway branch 的檔案。
- 研究結論：選用 Knock；email 當預設的 out-of-app 管道，web push 只當使用者自行 opt-in 的額外管道，且所有推播都要同時落進 feed。
- destination 被寫成「production grade 通知、透過單一 hosted 第三方供應商、交付一份 spec」。

# L2 detail

- `#L1-L15` — 開場 prompt 刻意不過度指定（in-app notifications 是常見功能）；載入 grilling 與 domain modeling skills，等於帶 wayfinding 的 grill with docs；第一問是 done 的定義，作者選 spec。
- `#L16-L30` — scope 是這階段最重要的問題：in-app feed 要、push 想試、email 也許可探索；Cadence 沒有手機 app，因此 app 通知可行性存疑；供應商選擇留在 map 內由 research 驅動，偏好 hosted 不自架。
- `#L31-L50` — 確認要做 production grade（現況只是 dev 的 user switcher、不是真 auth）；第二輪問題決定第二管道先開 research ticket；角色範圍涵蓋 glossary 裡四種角色（student、instructor、platform admin、team admin），並顯示范疇建模的複利。
- `#L51-L77` — 供應商需求：作者不在乎 prebuilt 的 React feed 元件（自己會寫），最重要是開發可用的免費方案；不想為了比較而分別註冊多家，先挑一家再 prototype 驗證；偏好設定要 per channel／per category？作者同意建議；術語定為 notification 與 notification feed，並寫進 glossary.md。
- `#L78-L113` — 建立 map 後立刻派出兩個 research subagent（通知供應商、web push 觸及範圍）；map 內容包含 destination、筆記、decisions so far（空）、not yet specified（霧）、out of scope（不做原生 app、不自架、不自建投遞基礎設施）與 ticket 清單（可見 open、blocked、已派給 agent 者）。
- `#L114-L143` — 作者會保存一份 map 與所有更新供對照；兩張 research 回來並關閉：第一張比較 Knock、NovoCloud、MagicBell 後 resolution 選 Knock，完整研究存在 throwaway branch 的檔案並附原始連結；第二張結論是 email 為預設 out-of-app 管道、web push 僅 opt-in 額外管道、所有訊息也要落進 feed。
