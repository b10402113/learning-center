---
id: trust-ladder-and-sandbox
title: "trust ladder、沙箱與第一個 implementer"
subject: real-engineer
tier: 6
order: 13
status: written
goal: "能說明五個合併步驟哪些可 AFK、把 agent 丟進遠端沙箱，並用一個 label 跑出第一個 PR。"
digests:
  - 073 Our Factory's Goal.en.md
  - 074 Sandboxing The Factory.en.md
  - 075 Setting Up Secrets And Permissions.en.md
  - 076 Running Your Own Coding Agent.en.md
  - 077 Your First Implementer.en.md
  - 078 Your First Implementer Solution.en.md
  - 079 Splitting Build From Review.en.md
  - 080 Splitting Build From Review Solution.en.md
  - cohort-005-project.1.part.md
  - cohort-005-project.2.part.md
  - cohort-005-project.3.part.md
  - cohort-005-project.4.part.md
  - cohort-005-project.5.part.md
  - cohort-005-project.6.part.md
prerequisites:
  - learn/real-engineer/nodes/automated-review-and-retro.md
  - learn/real-engineer/nodes/automated-checks.md
steps:
  - id: trust-ladder-and-afk
    author: "google/gemini-3.8-flash"
    title: "爬上信任階梯：從手動顧 5 個 Agent 到 50 個並行運作的軟體工廠"
    purpose: "能用 trust ladder 說明同時跑幾個 agent 取決於信任，並指出 merge 五步哪些可 AFK。"
    sources:
      - "[[sources/real-engineer/20261116/course/073 Our Factory's Goal.en.txt#L1-L69]]"
  - id: sandbox-not-local
    author: "google/gemini-3.8-flash"
    title: "為什麼本機撐不住平行 Agent？遠端沙箱架構與 GitHub Actions 的取捨"
    purpose: "能說明為何本機撐不住平行 agent，並指出遠端一 agent 一沙箱的好處與 GitHub Actions 的取捨。"
    sources:
      - "[[sources/real-engineer/20261116/course/074 Sandboxing The Factory.en.txt#L1-L61]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/README.md#L1-L161]]"
  - id: secrets-labels-and-your-agent
    author: "google/gemini-3.8-flash"
    title: "設定 Factory 權限、模型金鑰與切換自訂 Agent"
    purpose: "能設好 factory PAT 與模型 token、守住 label 安全邊界，並在 common.ts 換成自己的 agent。"
    sources:
      - "[[sources/real-engineer/20261116/course/075 Setting Up Secrets And Permissions.en.txt#L1-L79]]"
      - "[[sources/real-engineer/20261116/course/076 Running Your Own Coding Agent.en.txt#L1-L53]]"
      - "[[sources/real-engineer/20261116/supplement/cohort-005-project/README.md#L1-L161]]"
  - id: first-implementer-on-a-label
    author: "google/gemini-3.8-flash"
    title: "讓 Agent 自動改 code：觸發 Implementer 到交出 PR 的完整流程"
    purpose: "能用一個 agent implement label 觸發 implementer，並讀懂它如何撞上自動檢查、交出 PR。"
    sources:
      - "[[sources/real-engineer/20261116/course/077 Your First Implementer.en.txt#L1-L67]]"
      - "[[sources/real-engineer/20261116/course/078 Your First Implementer Solution.en.txt#L1-L83]]"
  - id: split-build-from-review
    author: "google/gemini-3.8-flash"
    title: "用 agent:review 標籤啟動自動審查與結構化行內評論"
    purpose: "能用 agent:review label 接上第二段流程，並說出結構化輸出如何變成 inline comment。"
    sources:
      - "[[sources/real-engineer/20261116/course/079 Splitting Build From Review.en.txt#L1-L13]]"
      - "[[sources/real-engineer/20261116/course/080 Splitting Build From Review Solution.en.txt#L1-L111]]"
created: 2026-11-16
updated: 2026-11-19
---

# trust ladder、沙箱與第一個 implementer

## Lesson

油門只有在煞車踩得住時才安全：trust ladder 說你能同時跑幾個 agent，取決於你多信任它，而合併的五個步驟裡 implement 與 review 幾乎已經可以 AFK。本機撐不住平行執行，所以把 agent 搬進遠端沙箱，用一個 label 觸發第一個 implementer，看它自己撞上你設好的自動檢查。

## Steps

1. [爬上信任階梯：從手動顧 5 個 Agent 到 50 個並行運作的軟體工廠](trust-ladder-and-sandbox/trust-ladder-and-afk.md)
2. [為什麼本機撐不住平行 Agent？遠端沙箱架構與 GitHub Actions 的取捨](trust-ladder-and-sandbox/sandbox-not-local.md)
3. [設定 Factory 權限、模型金鑰與切換自訂 Agent](trust-ladder-and-sandbox/secrets-labels-and-your-agent.md)
4. [讓 Agent 自動改 code：觸發 Implementer 到交出 PR 的完整流程](trust-ladder-and-sandbox/first-implementer-on-a-label.md)
5. [用 agent:review 標籤啟動自動審查與結構化行內評論](trust-ladder-and-sandbox/split-build-from-review.md)
