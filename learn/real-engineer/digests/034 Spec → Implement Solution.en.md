---
source: sources/real-engineer/20261116/course/034 Spec → Implement Solution.en.txt
source_type: text
source_lines: 195
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L42
  - cohort-005-project.6.part.md#L1-L105
---

# L1 overview

- to spec 不認識 Wayfinder，但會把所有 decision ticket 拉進來，並提出可測試的 seams（模組接縫）讓你確認。
- 產出 spec：問題陳述、61 條 user stories、實作決策（Knock 為供應商、通知只存在 Knock）、完整通知目錄、發送通知的服務、偏好設定、user sync、client feed port、feed UI，以及 references（含 prototype 分支與整張 map 的 issues）。
- spec 的價值是把 map 壓縮、攤平，「像餵食物給 agent」，比直接丟 map 更好找資訊。
- `/to-tickets` 切成八張 ticket，含一張 tracer bullet，其餘可平行；blocking 關係沿用 decision ticket 的概念。
- `/implement-spec` 無人看管跑了數小時：探索 prototype、寫 exploration notes、tracer bullet、平行實作五張、邊完成邊 merge，最後跑 code review（spec 與 standards 兩軸）找到 15 個問題並派 fix agent 修掉，保留指定不動的五項。
- 卡在 Knock workflows 只能靠 dashboard 建立，於是研究出 Knock management API 與 CLI，改成用程式建立並 push workflow；因為這個新流程容易被忘記，作者請 agent 寫一支簡短 skill（約 25 行）記錄怎麼從程式建立／修改 Knock workflow 與憑證。
- 最後完成 QA：通知鈴、偏好設定、discussion question 通知可點回留言、關閉 discussion reply 後真的不再收到通知；高解析度的部分貼近 prototype，低解析度部分由 agent 自行發揮。

# L2 detail

- `#L1-L10` — 跑 to spec 並傳入 map，觀察它讀所有 decision ticket，雖不懂 Wayfinder 流程但知道要把東西全拉進來；它會提議可測試的 seams（即未來模組），作者認可後讓它產出 spec。
- `#L11-L31` — spec 內容：問題陳述、61 條 user stories、實作決策（Knock 為供應商、通知只活在 Knock）、完整通知目錄、發送服務、偏好設定、user sync、client feed port、feed UI，底部 references 列出 prototype 分支與整張 map；作者認為 spec 把 map 壓縮攤平，等於幫 agent 把資訊處理好。
- `#L32-L50` — 用 `/to-tickets` 切成許多小 ticket；因 implement-spec 會平行跑，作者把數量從 12 降到 8，保留一張 tracer bullet、其餘 3–7 可平行；ticket 沿用 blocking 關係，接著 clear context 跑 `/implement-spec` 傳入 spec 編號，刻意不看管。
- `#L51-L79` — 數小時後回來做 autopsy：先探索 Knock prototype 並存 exploration notes（cohort 0 of 5），建立 implementer 並 merge 第一段實作；orchestrator 發現前一個 agent 的測試重複計數問題，要求後續 agent 在 vitest 設定排除該資料夾；再建 tracer bullet、merger agent 合進 feature notifications，然後一次實作五張 ticket 並邊完成邊 merge；可自動驗證的部分（after cursor 分頁、seen 不是 red）由 agent 自行驗證，其餘需人工在瀏覽器確認。
- `#L80-L99` — 全部 merge 後跑 code review skill（spec review 加 standards review）：抓到兩個硬性違反 coding standards 與 glossary.md（新文案用了 glossary 說要避免的詞、測試 helper 與錯誤訊息用了 seekClaim／coupon 等詞），另有 code smells 與 spec 差異；派一個 fix agent 修完 15 項、保留作者指定不動的五項。
- `#L100-L155` — 還需要一支 wizard 在 Knock 建並 commit 八個 workflow、把 discussion reply 移到自己 category，並跑 `npm run knock:sync-users` 給既有使用者預設偏好；作者不想再手動點 Knock UI，於是問能否程式化，發現 Knock 有 management API 與 CLI 可從 JSON 建 workflow，只需一個 service token（在 Cadence settings → service tokens 建立並放進 .env）；中間 compact session 以保留 PR 記憶、丟掉 subagent 往返細節；push workflows 首次失敗（缺 action URL），讓 agent 自己跑並修，最終八個 workflow 全部建立並 commit；作者強調 agent 有完整資訊並能安全試錯時，才會穩定往可用解爬升。
- `#L156-L195` — 最終 QA：以 Marcus Johnson 登入可見通知與偏好設定（enrollments、discussion questions／replies）；用 Emma Wilson 在課程留言提問，Marcus 收到通知且可點回留言，回覆後 Emma 也收到；關掉 Emma 的 discussion reply 通知後再回覆就不會再收到；作者總結這正是 upfront planning 的回報——通知列設計走高解析度 prototype 並給真回饋，偏好設定與 feed 細節只低解析度討論、由 agent 自行發揮。
