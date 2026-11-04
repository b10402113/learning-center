---
id: boundary-engineering
title: "Boundary engineering"
subject: ai-agent-engineer
tier: 1
order: 7
status: written
goal: "用 box 的 Dockerfile、devcontainer 與 firewall 畫出檔案與網路邊界，並用 trifecta 檢查最壞情況。"
digests:
  - agentic-coding-handbook.1.part.md
  - agentic-coding-handbook.2.part.md
  - course-kit.md
  - ticket-bay.1.part.md
  - ticket-bay.2.part.md
  - ticket-bay.3.part.md
  - ticket-bay.4.part.md
prerequisites:
  - "learn/ai-agent-engineer/nodes/harness-engineering.md"
steps:
  - id: trifecta-not-approval
    author: "gpt-6-luna"
    title: "核准不會保護你"
    purpose: "用 lethal trifecta 三要素說出一次 run 的最壞情況，並解釋為何核准不能當邊界。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L597-L637]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L13-L68]]"
  - id: box-writes-boundary-in-files
    author: "gpt-6-luna"
    title: "box 是 repo 裡幾個檔案組出來的 dev container"
    purpose: "說出 box 的 Dockerfile、devcontainer.json 與 box script 各自負責哪一段邊界。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.1.part.txt#L597-L637]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/README.md#L19-L24]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/box#L1-L77]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m1/box-setup.md#L1-L65]]"
  - id: default-deny-allowlist
    author: "gpt-6-luna"
    title: "像攻擊者那樣檢查 box"
    purpose: "讀懂 init-firewall.sh 的 default-deny 與白名單，並用攻擊者視角驗證 box。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L1-L12]]"
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L13-L68]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/README.md#L19-L24]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/box#L1-L77]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m1/box-setup.md#L1-L65]]"
  - id: beyond-box-secrets-and-injection
    author: "gpt-6-luna"
    title: "盒子沒有做的事"
    purpose: "指出 box 不保護什麼，並用 secrets、reset 與 prompt injection 說明盒外仍要自己負責的部分。"
    sources:
      - "[[sources/ai-agent-engineer/20261103/The Agentic Coding Handbook.2.part.txt#L13-L68]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/README.md#L19-L24]]"
      - "[[sources/ai-agent-engineer/20261103/resources/repos/ticket-bay/box#L1-L77]]"
      - "[[sources/ai-agent-engineer/20261103/resources/course-kit/m1/box-setup.md#L1-L65]]"
created: 2026-11-03
updated: 2026-11-04
---

# Boundary engineering

## Lesson

沒有 boundary，agent 的環境就是整台機器：所有 repo、SSH key、雲端 token 與整個網路。核准不能當邊界，因為大多數權限提示都會被按下同意。Box 把邊界寫成 Dockerfile、devcontainer.json 與 init-firewall.sh 三個檔案，讓 agent 在裡面可以全權限執行。

## Steps

1. [核准不會保護你](boundary-engineering/trifecta-not-approval.md)
2. [box 是 repo 裡幾個檔案組出來的 dev container](boundary-engineering/box-writes-boundary-in-files.md)
3. [像攻擊者那樣檢查 box](boundary-engineering/default-deny-allowlist.md)
4. [盒子沒有做的事](boundary-engineering/beyond-box-secrets-and-injection.md)
