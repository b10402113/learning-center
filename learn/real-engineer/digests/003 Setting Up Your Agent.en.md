---
source: sources/real-engineer/20261116/course/003 Setting Up Your Agent.en.txt
source_type: text
source_lines: 25
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 課前準備有兩件事：你用哪個 agent，以及你的 agent 已經背著哪些全域設定。
- 任何能在 terminal 執行並使用 skills 的 agent 都可以，不必更換成作者用的那一套。
- 課程會用到的 skills 全都放在課程 repo 裡，不需要從作者的全域 skills 安裝任何東西。
- 真正要提防的是你機器上全域安裝的 skills、settings、config，它們會干擾結果。
- 做法是拿課程提供的 prompt 暫時把全域設定重設回預設，讓 agent 從乾淨狀態開始，並附帶一個確定性的還原步驟把東西收回來。

# L2 detail

- `#L1-L8` — 進入練習與課程 repo 之前先設定 agent；兩部分是「用哪個 agent」與「agent 從你的環境帶了什麼」；本課適用於任何跑在 terminal 且使用 skills 的 agent。
- `#L9-L16` — 課程中要用的 skills 全部由 repo 提供、不需安裝全域版本；要留意的是你全域安裝的 skills／settings／configuration，因此作者提供一段 prompt 讓你暫時把全域 config 重設為預設值、清掉複雜設定，從乾淨起點開始。
- `#L17-L25` — 好處是結果更接近作者示範（環境裡干擾更少）；prompt 內含確定性的還原步驟，課程結束後可把所有東西還原並清掉課程期間新增的東西；這課本身很簡單，設定完就進下一課。
