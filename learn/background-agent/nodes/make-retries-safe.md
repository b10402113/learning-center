---
id: make-retries-safe
title: "讓重試安全"
subject: background-agent
tier: 3
order: 10
status: written
goal: "能用 derived action ID、expectedVersion 與 cancelOn，讓遺失回應的重試不重複執行效果。"
digests:
  - 23-safe-retries-with-derived-ids.md
  - lessons-05-safe-retries.md
  - server.md
  - service.md
  - shared.md
prerequisites:
  - learn/background-agent/nodes/test-human-in-the-loop.md
steps:
  - id: lost-acknowledgement-window
    author: "z-ai/glm-5.3-flash"
    title: "重試的陷阱：為什麼收到 503 不代表動作失敗"
    purpose: "能說明回應遺失時 503 不代表失敗，並指出重試為何可能重複已落地的效果。"
    sources:
      - "[[sources/background-agent/20261109/course/23-safe-retries-with-derived-ids.txt#L1-L12]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L6-L13]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L21-L30]]"
      - "[[sources/background-agent/20261109/supplement/service/checkout.ts#L168-L180]]"
  - id: one-effect-per-step
    author: "z-ai/glm-5.3-flash"
    title: "把副作用拆成獨立 Step：讓重跑的程式自動跳過已完成的工作"
    purpose: "能把多個非同步副作用拆成獨立 step，並讓重跑的程式跳過已完成的工作。"
    sources:
      - "[[sources/background-agent/20261109/course/23-safe-retries-with-derived-ids.txt#L13-L16]]"
      - "[[sources/background-agent/20261109/course/23-safe-retries-with-derived-ids.txt#L17-L32]]"
  - id: service-side-action-ledger
    author: "z-ai/glm-5.3-flash"
    title: "用同一個 actionId 讓重試不會做兩次"
    purpose: "能說明 checkout service 如何用 actionId 記錄結果，讓同一個 intent 的重試回傳原結果。"
    sources:
      - "[[sources/background-agent/20261109/course/23-safe-retries-with-derived-ids.txt#L33-L48]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L72-L81]]"
      - "[[sources/background-agent/20261109/supplement/service/checkout.ts#L123-L171]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-data.ts#L156-L174]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L20-L46]]"
      - "[[sources/background-agent/20261109/supplement/shared/types.ts#L1-L13]]"
  - id: derived-deterministic-action-id
    author: "z-ai/glm-5.3-flash"
    title: "用 run、cycle 與 action 推導出確定性的 action ID"
    purpose: "能用 run、cycle 與 action 推導出確定性的 action ID，讓重播重建同一個 intent。"
    sources:
      - "[[sources/background-agent/20261109/course/23-safe-retries-with-derived-ids.txt#L65-L79]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L31-L40]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L55-L70]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L82-L92]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L141-L160]]"
  - id: cancel-version-fence-unknown-outcome
    author: "z-ai/glm-5.3-flash"
    title: "用 cancelOn 擋下重複 run：兩道防線與它們的極限"
    purpose: "能用 cancelOn 擋下重複 run，並說明版本圍欄與取消為何都無法處理未知結果。"
    sources:
      - "[[sources/background-agent/20261109/course/23-safe-retries-with-derived-ids.txt#L49-L64]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L14-L20]]"
      - "[[sources/background-agent/20261109/supplement/lessons/05-safe-retries/index.md#L41-L54]]"
      - "[[sources/background-agent/20261109/supplement/service/checkout.ts#L134-L150]]"
      - "[[sources/background-agent/20261109/supplement/server/agent-workflow.ts#L58-L70]]"
created: 2026-11-09
updated: 2026-11-10
---

# 讓重試安全

## Lesson

重試真正危險的地方，是效果已經落地但回應遺失：代理看到 503，卻無法判斷要不要再做一次。這個節點用 run + cycle + action 推導穩定的 action ID，讓 checkout service 記得同一個 intent 的結果，並用 expectedVersion 與 cancelOn 把重複執行與重複 run 擋在外面。

## Steps

1. [重試的陷阱：為什麼收到 503 不代表動作失敗](make-retries-safe/lost-acknowledgement-window.md)
2. [把副作用拆成獨立 Step：讓重跑的程式自動跳過已完成的工作](make-retries-safe/one-effect-per-step.md)
3. [用同一個 actionId 讓重試不會做兩次](make-retries-safe/service-side-action-ledger.md)
4. [用 run、cycle 與 action 推導出確定性的 action ID](make-retries-safe/derived-deterministic-action-id.md)
5. [用 cancelOn 擋下重複 run：兩道防線與它們的極限](make-retries-safe/cancel-version-fence-unknown-outcome.md)
