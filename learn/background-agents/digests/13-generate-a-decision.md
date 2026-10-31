---
source: sources/background-agents/20261027/13-generate-a-decision.md
source_type: text
source_lines: 103
status: skipped
skip_reason: "not taught by any current node"
created: 2026-10-27
updated: 2026-10-27
---

# L1 overview

- **decision 必進 step** — 三個理由：省錢、避免延遲、確保重播拿到同一個答案。
- **LLM 是 stochastic** — 把 LLM 呼叫放在 workflow 最上層會破壞 deterministic 假設，連帶讓後續 step 的快取失效。
- **step 就是 useMemo** — workflow 重跑等於 React re-render；step 內的值被 memoize，其餘每次重算。
- **iteration 與 decision 記錄** — `set-iteration`、`recordDecision` 都需進 step；相近的小型寫入可考慮合併以降低計費。
- **Inngest 的 state 只是快取** — 只保存 step 的 return 值，應用程式仍需自己的資料庫 state。

# L2 detail

- `#L1-L6` — 提問 decision 是否該進 step；表面上 decision 取決於當下 state，但需實際推演。
- `#L7-L14` — server 在 decision 執行前掛掉：decision 不在 step 也能正確重算，情況沒問題。
- `#L15-L28` — server 在 decision 執行後掛掉：workflow 從頭重播，非 step 程式碼會再執行，decision 將再次呼叫 LLM。
- `#L29-L44` — 三個理由（成本、延遲、答案一致性）；LLM 非 deterministic，重跑會讓依賴其結果的 step 全部改變。
- `#L45-L56` — 以 React `useMemo` 比喻 step：memoized 區塊不重算，且沒有自訂變更偵測；`createFunction` 是最上層 component。
- `#L57-L62` — 以 `step.run("choose-action" + cycle)` 包住 `chooseAction(run, goal, state)`。
- `#L63-L68` — `set-iteration` 必須進 step，否則計數會被重算成不同數字。
- `#L69-L84` — 記錄 decision 也進 step；討論把 iteration 與 decision 合併成同一 step 的權衡與計費考量。
- `#L85-L96` — Inngest 只快取 step return 值，像 Redis 般供 replay 使用，不能當應用程式查詢用的 state。
- `#L97-L103` — 呼叫 `recordDecision` 寫入 `environmentId`、`runId`、`cycle`、action 與 `reason`。
