---
source: sources/real-engineer/20261116/course/102 Implement Spec Solution.en.txt
source_type: text
source_lines: 93
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L42
  - cohort-005-project.6.part.md#L1-L105
---

# L1 overview

- 入口：spec 存在 ticket tracker，被貼上 agent implement（或指派給 agent）後 orchestrator 收到通知。
- 作者很喜歡加一個「spec 沒有 ticket 就自動開票」的 runner，因為定了目的地之後就不想再手動拆票；這對來自 improve-codebase-architecture loop 的 spec 特別有用。
- exploration runner 讀 spec 與 repo，把筆記寫成 markdown；存放方式是放到一個遠端 branch（打算之後再清），而不是開一個要關掉的 draft PR，然後在 spec ticket 上留言指向這些檔案。
- 之後每台 runner 都同時拿到完整 spec、自己的那張票、以及 exploration markdown，靠 ticket 上的留言找到它們。
- frontier 的計算是確定性的，不需要 agent：票之間有 blocking 關係，找出所有未被 block 的票即可。
- 設計一（one runner per frontier）：orchestrator 抓出整個 frontier，交給一台 runner 內用 sub-agent 全部做完、合併、關票、push；未完成就回到迴圈，完成就跑 agent review。
- 設計二（one runner per ticket）：每張 frontier 票各一台 runner，各自把程式碼 push 到遠端 branch，再由另一台 runner 收齊所有 branch 合併；之後邏輯相同。
- 為何選設計二：一台 runner 很難同時跑五份 app 與五份測試，通常只夠跑一份；設計二較複雜但對單台 runner 負擔小得多。作者最後也承認「自動開票」那段其實可刪，但留著能省掉人的無聊雜活。

# L2 detail

- `#L1-L16` — 入口與自動開票：spec 存在 tracker，被貼 label 或指派給 agent 後觸發；作者偏好加一段「若 spec 沒有票就排 runner 去開票」的便利流程，因為一旦定好目的地就不想再手動拆票，對來自 improve-codebase-architecture 的 spec 特別有用。
- `#L17-L30` — exploration：先跑 exploration runner 讀 spec 與 repo，把資訊存成 markdown；存放方式是遠端 branch（未來再清理）而非要關閉的 draft PR，並在 spec ticket 留言指向這批檔案；此後每台 runner 都同時擁有完整 spec、自己的票與 exploration markdown，透過 ticket 留言得知位置。
- `#L31-L39` — frontier 計算：票之間有 blocking 關係，可由 blocking 關係確定性地算出 frontier，不需要 agent（如同 Wayfinder 的 blocking 票）；做法就是對每張未被 block 的票觸發 runner。
- `#L40-L50` — 設計一 one runner per frontier：orchestrator 取得 frontier，一台 runner 內用 sub-agent 把整個 frontier 做完、合併所有分支、關掉票並 push 合併結果；若還有未完成的票就回到迴圈，全部完成就跑 agent review 走後續鏈路。
- `#L51-L56` — 設計一的限制：只有在 runner 很強大（能同時跑五份 app 與五份測試）時才可行，但現實中 runner 通常不夠力，最好 Spec 成只跑一份 app。
- `#L57-L76` — 設計二 one runner per ticket：上方流程相同，差別是每張 frontier 票各有一台 runner 在獨立沙箱建置，複雜度落在 orchestrator 要追蹤它們全數完成；每張票必須把程式碼存到（遠端）branch，再由另一台 runner 收齊所有 branch 合併，之後回到相同的「完成或回到 frontier、完成則 agent review」邏輯。
- `#L77-L93` — 選擇與收束：設計二較複雜但對單台 runner 負擔小，作者會選它；這是第一次真的平行 spawn runner，因此狀態存放要特別小心（branch、不屬於 ticket 的探索資訊）；「自動開票」段落其實可刪，但這種體貼的捷徑會隨時間累積價值；最終產出是一台能吃任何 spec、盡量平行展開、最後交出已 review PR 的機器。
