---
source: sources/real-engineer/20261116/course/033 Spec → Implement.en.txt
source_type: text
source_lines: 15
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
supplements:
  - cohort-005-project.6.part.md#L1-L75
  - cohort-005-project.6.part.md#L1-L105
---

# L1 overview

- map 完成後的第一步是把 map 轉成 spec，指令是 to spec 並傳入 map。
- spec 出來後用 `/to-tickets` 從 spec 切出實作 ticket。
- 再 clear context、跑 `/implement-spec`，讓 agent 依 ticket 實作。
- 終點是一個已實作、已開 PR、可 QA 的通知功能，理想上第一次就成功。
- 成功條件是 context 極其完整：map、spec、ticket、prototype 互相連結，一次餵給 agent。

# L2 detail

- `#L1-L3` — map 完成後第一步行動：跑 to spec 並傳入 Wayfinder map，把整張決策圖轉成 spec。
- `#L4-L7` — spec 出來後用 `/to-tickets` 切出實作 ticket，再 clear context 跑 `/implement-spec`；終點是已實作、已開 PR、可 QA 的通知功能。
- `#L8-L11` — 成功條件是 context 完整：agent 能讀 map 與 spec，spec 反向連結 map，ticket 也連結回 map 與 prototype，理論上應一次就成功。
- `#L12-L15` — 收束：這是一份極其詳細的 context，交給 agent 應該就能直接做出來。
