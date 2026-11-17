---
source: sources/real-engineer/20261116/course/063 Speeding Up Our Automated Checks.en.txt
source_type: text
source_lines: 99
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L25
---

# L1 overview

- 多數人看到檢查低於 10 秒就覺得可以接受，但作者認為大家嚴重低估檢查對 agent 執行速度的拖累。
- 兩個優化方向：換成更快的工具（Prettier → Biome、TypeScript 7，原生改寫後快約 10 倍），以及把檢查改成平行執行。
- 序列跑三個命令會慢；同時跑大約只要三分之一的時間。
- 實測：TypeScript 從約 8 秒降到 1.4 秒，但 Dependency Cruiser 無法載入 TS7 API，解法是同時 pin TS 5.9 給它用。
- Biome 檢查 144 個檔案只要 28 毫秒，Prettier 要 2.6 秒。
- 平行化後仍略超 3 秒預算，於是再套快取與增量：DepCruise cache、TS7 `incremental`、Vitest threads pool。
- 最終：format 2.6s→0.03s、typecheck 約 5.9s→0.2s（incremental）、DepCruise 2s→0.45s；測試成為最慢的步驟。
- 結論：測試不適合放 pre-commit（repo 越大一定超時），應移到 CI；hook 只留 lint-staged、typecheck、boundaries 平行執行，小 commit 不到 1 秒。

# L2 detail

- `#L1-L13` — 回顧上一課的耗時表；指出 10 秒內不代表沒問題，檢查會拖慢 agent；本課目標是縮短時間並平行化，目前是三個命令依序執行，若同時跑約可省下三分之二的時間。
- `#L14-L31` — 下 prompt：找更快的替代品（Biome 取代 Prettier、TypeScript 7 快 10 倍），並盡量平行化以塞進 3 秒預算；這題不需要 skill 或 grilling，因為需求單純、改動不大，且 agent 在資訊充足時很擅長加速。
- `#L32-L45` — 先量兩次取 baseline，TypeScript 約 8 秒是瓶頸；TS7 以原生程式碼重寫常快 10 倍，Biome 之於 Prettier 同理；但實際有相容問題：Dependency Cruiser 載不到 TS7 API 而默默失敗，解法是另外 pin 一個 TypeScript 5.9 供它使用。
- `#L46-L53` — Biome 對 144 個檔案只需 28 毫秒，Prettier 需 2.6 秒；單次看差距不大，但檢查跑得頻繁就會累積，在緊縮的 pre-commit 預算下差別巨大。
- `#L54-L65` — 全部同時跑仍需約 3 秒、略超預算，於是找更進一步的優化：Dependency Cruiser 快取、TS7 incremental flag、Vitest threads pool；最終 format 2.6s→0.03s，typecheck 降到 0.2s（incremental），DepCruise 2s→0.45s，測試幾乎沒變、成為最慢步驟。
- `#L66-L85` — 這些時間會隨 repo 與檔案增加而變慢，必須持續監控；Vitest 一定會超時（此 repo 測試還少，之後只會更慢），因此把測試移出 pre-commit、改放 CI；hook 保留 lint-staged、typecheck、boundaries 平行執行，小 commit 不到 1 秒，測試仍在 `npm run check` 中。
- `#L86-L99` — Biome 格式與 Prettier 略有差異，因此又出現一批格式變更並再次被 hook 擋下（quiz 與 request-logger agent 檔太大），照舊跳過 hook 提交；總結：檢查越慢、agent 拿到回饋越慢，加速是必要工作。
