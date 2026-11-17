---
source: sources/real-engineer/20261116/course/029 Prototype Ticket.en.txt
source_type: text
source_lines: 33
status: absorbed
absorbed_at: 2026-11-16
created: 2026-11-16
updated: 2026-11-16
---

# L1 overview

- 進入 prototype ticket（「Knock 是否撐得住 Cadence」），API keys 已就位，可以開始 prototyping。
- prototype 的價值是把東西拉到高 fidelity，fidelity 越高回饋品質越好。
- 關 ticket 的時機不是做出 prototype，而是所有決策都整合進去、成品長成你要的樣子。
- 這種 session 應該刻意花 token：真槍實彈 vibe coding，反覆「不要這個、給我那個」，直到決策落進程式碼。
- prototype 像 research 一樣存放：resolution 是 comment，完整成果存在一個 throwaway branch 的檔案，agent 可存取但不在主 checkout。
- 目的：agent 能引用它，又不會誤以為那是真正的程式碼。

# L2 detail

- `#L1-L6` — 目前已五之九，預期不會再加太多 ticket；點名下一張是 prototype（Knock 是否撐得住 Cadence），keys 已備妥可開始。
- `#L7-L13` — 定義 prototype 是拉高 fidelity 的機會，fidelity 越高回饋品質越好；關 ticket 的時機不是做出 prototype，而是所有決策都整合、成品長成你要的樣子。
- `#L14-L20` — 這類 session 應刻意花 token：大量 vibe coding、反覆「不要這個、給我那個」，直到決策落進程式碼；操作方式為回 agent、clear context、用 Wayfinder 傳入 ticket。
- `#L21-L33` — prototype 沿用 research 的存放法：resolution 留在 comment，完整成果存在隨機分支的檔案，agent 能探索與拉檔但不在主 checkout，避免被誤認為正式程式碼。
