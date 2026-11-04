---
id: end-to-end-and-quicke2e
title: "End-to-end testing"
subject: ai-agent-engineer
tier: 3
order: 14
status: written
goal: "用 Playwright、Testcontainers 與 decision LLM 驗證使用者可見行為，並判斷 QuickE2E 的發現是不是真 bug。"
digests:
  - agentic-coding-handbook.3.part.md
  - quicke2e.1.part.md
  - quicke2e.2.part.md
  - ticket-bay.1.part.md
  - ticket-bay.2.part.md
  - ticket-bay.3.part.md
  - ticket-bay.4.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/tests-that-lie.md"
  - "learn/ai-agent-engineer/nodes/tools-and-mcp.md"
steps:
  - id: playwright-and-testcontainers
    title: "Playwright 只測關鍵流程，Testcontainers 給你一個真資料庫"
    purpose: "用 Playwright 只測關鍵流程並斷言使用者可見行為，用 Testcontainers 讓每次執行從乾淨的真資料庫開始。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L505-L535]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/server.ts#L1-L43]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/seed.ts#L1-L37]]"
  - id: ticketbay-e2e-specs
    title: "斷言使用者看得見的東西：金額、座位與退款行"
    purpose: "把商業承諾寫成畫面上的斷言：金額、座位與退款行，並用固定時鐘測退款視窗邊界。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/book-and-pay.spec.ts#L1-L21]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/booking-discount.spec.ts#L1-L35]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/refund-window.spec.ts#L1-L52]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/env.ts#L1-L50]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/e2e/support/app.ts#L1-L93]]"
  - id: decision-llm-quicke2e-loop
    title: "Decision LLM 與 QuickE2E：模型只做選擇，判定交給程式"
    purpose: "用 decision LLM 只從合法選項中做選擇，並走 QuickE2E 的快照→候選→選擇→程式判定迴圈。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.3.part.txt#L536-L569]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L49-L75]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L936-L1120]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/src/loop.mjs#L479-L608]]"
  - id: judge-quicke2e-findings
    title: "讀 outcome 判斷真 bug，把通過的 run 變成 Playwright spec"
    purpose: "依 outcome 分類與 precheck 判斷 QuickE2E 的發現是不是真 bug，並把通過的 run 變成可重播的 Playwright 資產。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/bin/quicke2e.mjs#L108-L261]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/skill/quicke2e/SKILL.md#L47-L80]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/skill/quicke2e/SKILL.md#L82-L162]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/examples/ticketbay/precheck.mjs#L1-L29]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/examples/ticketbay/attacks.mjs#L1-L30]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/quicke2e/codegen/replay-or-heal.mjs#L1-L31]]"
created: 2026-11-03
updated: 2026-11-04
---

# End-to-end testing

## Lesson

單元與整合測試都過，頁面仍可能是空白；end-to-end 測試用真瀏覽器走關鍵流程。Testcontainers 提供拋棄式資料庫，讓每次執行都從乾淨狀態開始。Decision LLM 與 QuickE2E 把每一步的成本壓到毫秒與極低費用，但發現的問題仍要人判斷。

## Steps

1. [Playwright 只測關鍵流程，Testcontainers 給你一個真資料庫](end-to-end-and-quicke2e/playwright-and-testcontainers.md)
2. [斷言使用者看得見的東西：金額、座位與退款行](end-to-end-and-quicke2e/ticketbay-e2e-specs.md)
3. [Decision LLM 與 QuickE2E：模型只做選擇，判定交給程式](end-to-end-and-quicke2e/decision-llm-quicke2e-loop.md)
4. [讀 outcome 判斷真 bug，把通過的 run 變成 Playwright spec](end-to-end-and-quicke2e/judge-quicke2e-findings.md)
