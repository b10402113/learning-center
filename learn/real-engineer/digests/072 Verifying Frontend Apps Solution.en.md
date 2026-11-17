---
source: sources/real-engineer/20261116/course/072 Verifying Frontend Apps Solution.en.txt
source_type: text
source_lines: 45
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.5.part.md#L1-L903
---

# L1 overview

- Prompt：dev UI selector 選完使用者後面板不關，點外面也關不掉；請開 PR 修好並用截圖當 evidence。
- 因為 commit history 有點亂，agent 先挑 base branch，再用 agent-browser click 成功重現 bug。
- agent 讀了 `AGENTS.md` 的內容，因此知道怎麼操作瀏覽器。
- 修完後在瀏覽器驗證；這類驗證常被說很吃 token，這次約 38.1k，沒有想像中糟。
- 驗證很適合用較高的 effort level：驗證本質是「製作檢查有效的證據」，投入越多得到越好。
- PR 的 diff 顯示新增 `useRef` 與 `useEffect`，並附上 before / after 截圖。
- Before：選完使用者後清單仍開著、點外面仍開著；After：選完就關、點外面也關。
- 作者強調 before 截圖同樣重要：能確認 agent 正確辨識了 bug。
- 這是 two-way door、blast radius 僅限 dev UI，可放心合併；實測分支也確實正常。
- 有人把截圖加上 TTS 旁白做成影片，證據更豐富、review 更快；當軟體工廠加速、PR 量暴增時這種證據會是必需品。

# L2 detail

- `#L1-L9` — 下 prompt 描述 dev UI selector 的兩個異常並要求以截圖為 evidence 開 PR；agent 因 commit history 較亂先選 base branch，接著用 `agent-browser click` 操作，成功重現第一個 bug（因為讀了 `AGENTS.md` 的設定）。
- `#L10-L17` — 修好後在瀏覽器驗證；這類驗證常被認為非常耗 token，但此次約 38.1k 尚可接受；驗證很受益於較高 effort level，因為驗證等於製作「檢查確實有效」的證據，模型投入越多證據品質越好。
- `#L18-L31` — PR 建立，diff 新增 `useRef` 與 `useEffect`；附上 before / after 截圖：before 是選完使用者清單仍開、點外面仍開，after 是選完即關、點外面也關；這是 two-way door、影響範圍僅 dev UI；在分支上自行驗證也確認選不同 instructor 會關閉。
- `#L32-L45` — 接上前端等於讓 agent 更有效自我驗證，也能在 PR 提供更豐富的證據；作者認為 before 截圖同樣令人安心，因為可確認 bug 被正確辨識；有人把截圖加 TTS 旁白做成影片，讓證據更豐富、review 更快；在軟體工廠加速、PR 量大增時，這類證據將成必要。
