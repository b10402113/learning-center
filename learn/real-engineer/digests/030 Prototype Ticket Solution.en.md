---
source: sources/real-engineer/20261116/course/030 Prototype Ticket Solution.en.txt
source_type: text
source_lines: 193
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 實作場：prototype skill 在真實 app 裡開一條 throwaway route 測四個檢查，先讀 Knock docs、裝 SDK，並透過 map 取回先前的 research。
- Wayfinder 的 token 效率來自決策都回到 map，新 session 只拉需要的部分，不必手動保 context。
- 檢查一（signed user token、使用者只讀自己的 feed）直接通過；檢查二到四需要進 Knock dashboard 設定，作者請 agent 產生第二個 wizard。
- 過程中卡在 Knock 的 preference 與 defaults UI 很久，作者把整段畫面貼回 agent 求救；這段挫折本身就是 product fit 的驗證。
- 關鍵發現：不需要在 Knock 設預設值，Cadence 同步講師時可寫入 enrollment off，opt-in 再翻成 on——這是 resolution 的主要結論。
- 測試中還發現 seen 與 read 的語意衝突、mark all seen 失效等 bug，修掉後以「夠 robust」收尾。
- 最後把學習寫回 map：prototype ticket 關閉，附上給後續實作者的 gotchas；本質上就是傳統 agile 的 spike。

# L2 detail

- `#L1-L20` — 作者自陳最愛 Wayfinder 的 prototyping；觀察它 claim prototype skill、在真實 app 開 throwaway route 測四個檢查、查 Knock docs、裝 Node SDK，並透過 map 取回先前 research；對比手動 grilling／prototyping 要一直擔心 context 保存，Wayfinder 把決策放回 map 更省 token。
- `#L21-L35` — 產出 Knock spike 分支與 dev server（localhost 5199）；check one 以 public key 簽 token、user 2 只讀自己的 feed 通過；check 二到四待作者處理，於是請 agent 造一個 wizard（model-invoked 的好處）。
- `#L36-L63` — 執行 Knock wizard：建 discussion reply workflow、加 discussion category、在 workflow builder 加 in-app feed 步驟並選 cadence feed channel、貼上 markdown 模板、commit 到 development；wizard 會驗證並觸發，接著建 new enrollment workflow 並比照處理。
- `#L64-L112` — 卡在 platform preferences 與 defaults：作者找不到 enrollment category、亂點、坦承完全迷失，把整段貼回 agent；agent 找到解法——不必在 Knock 設預設值，Cadence 同步講師時寫入 enrollment off，opt-in 時翻成 on，所以可跳過 wizard 第三階段；作者坦承這段體驗很糟，但這正是 prototype 要驗證的 product fit。
- `#L113-L141` — prototype skill 被告知走捷徑、不寫 production-ready 程式碼（如 catch null 吞錯），這是刻意的；prototype 是「行為對不對」型：可切換登入使用者、按鈕觸發事件；依檢查清單測試時發現回覆按鈕無效，回報後拿到更新版操作序列。
- `#L142-L175` — 改測 notify Olivia 後 feed 確實收到通知，可標記已讀／未讀與 mark all seen；mark all seen 失效回報；check four 驗證 enrollment 通知在 opt-in 前不來、opt-in 後 James Park 的新選課通知會到；作者指出 UI 很亂是刻意的，目的就是讓你亂按、把它弄壞。
- `#L176-L193` — 約 107k tokens 後作者認為已證明該證的事，請 agent 把學習寫回 map；prototype ticket 關閉，resolution 記錄主要發現（off by default 由 Cadence 設定而非 Knock）與給後續 ticket 的 gotchas；作者稱這等於傳統 agile 的 spike，先做掉苦工讓後續開發變簡單。
