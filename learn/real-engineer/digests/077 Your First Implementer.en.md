---
source: sources/real-engineer/20261116/course/077 Your First Implementer.en.txt
source_type: text
source_lines: 67
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L48
---

# L1 overview

- 黃金鐵律：workflow 從 GitHub 執行，所以先確認推到 GitHub 的內容與本機同步。
- 本機比 origin/main 多 90 個 commit，用 `git push --force-with-lease` 覆寫遠端，之後 workflow 才存在於 GitHub。
- 測試入口是 dev UI 的 send feedback 按鈕：填表就會在 repo 開一張 GitHub issue，模擬外部使用者回饋。
- 練習要求用非開發者的語言寫 issue（模糊、難指定），例如「lesson notes 看起來像垃圾」。
- 一次貼上腳本建立往後兩節需要的全部 label，其中包含 `agent implement`。
- 動作只有一個：替 issue 貼上 `agent implement`，然後到 Actions 觀察整個執行過程。
- 觀摩重點是讀 workflow 裡實際跑的 prompt，並確認 harness 的 API key 是否設對——這裡是第一個會爆設定的地方。

# L2 detail

- `#L1-L6` — 設定都完成後，先記住黃金鐵律：workflow 是從 GitHub 執行，所以必須確認推上 GitHub 的內容正確；用 VS Code 的 source control 面板（CTRL-SHIFT-G）檢查。
- `#L7-L18` — 本機 main 與 origin/main 差 90 個 commit（fork 還停在 initial commit）；執行 `git push --force-with-lease` 用本機覆寫遠端，之後最新 commit 變成 add factory workflows，`.github/workflows` 裡也出現 agent explore、agent implement 等檔案。
- `#L19-L34` — 測試方式：作者在 dev UI 加了 send feedback 按鈕，登入為 Emma Wilson，點擊開啟表單並在 repo 開 issue；要把這個表單想像成真實使用者送進來的外部回饋；回饋內容是 your notes 按鈕很醜、頂部 padding 怪、沒有字數顯示、位置不對，整體 UI 太雜亂。
- `#L35-L46` — 示範以講師（非 dev team）身分開 issue，標題「lesson notes look like garbage」，語句模糊、情緒化；按下 file an issue 後 issue 出現在專案上，帶有「sent from the feedback button on courses introduction to TypeScript」與備註。
- `#L47-L56` — 複製貼上腳本建立往後兩節需要的所有 GitHub label；完成後回到 issue 的 labels，可以看到 `agent implement`。
- `#L57-L67` — 練習本體很簡單：貼上 `agent implement`，然後到 Actions 分頁觀察這個 action 走完，邊看邊推敲正在發生什麼、讀其中的 prompt；這同時也是第一次真正驗證 harness 的 API key 是否設對，出問題就上 Discord。
