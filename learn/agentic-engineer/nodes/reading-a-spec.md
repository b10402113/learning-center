---
id: reading-a-spec
title: "Reading a Spec：The Build Sees 什麼、你留下什麼"
subject: agentic-engineer
tier: 3
order: 13
status: written
goal: "能分辨 spec 給 build 的決策與留給你的理由，並跑一次 `/architect` 產出一份 Accepted 決策。"
digests:
  - ch08-workflow-ship-something-real.1.part.md
  - ch08-workflow-ship-something-real.2.part.md
  - code-jsm-skills-system.md
  - code-reel-agentic-docs.md
prerequisites: []
steps:
  - id: two-shapes-one-rule
    title: "兩種形狀，一條選法"
    purpose: "能依決策大小選單檔或 index／rationale 目錄，並守住目錄帶編號、頂層永遠是 index.md 的命名。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/6. Reading a Spec： What the Build Sees and What You Keep (9_11_2026 1：42：57 PM).txt#L4-L18]]"
  - id: audience-split
    title: "兩個讀者：build 要決定，你要理由"
    purpose: "能說出 index.md 與 rationale.md 各給誰讀，並用 Summary 加 Requirements 在五分鐘內讀完一份 spec。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/6. Reading a Spec： What the Build Sees and What You Keep (9_11_2026 1：42：57 PM).txt#L19-L44]]"
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/6. Reading a Spec： What the Build Sees and What You Keep (9_11_2026 1：42：57 PM).txt#L82-L87]]"
      - "[[sources/agentic-engineer/20261030/reel-agentic_engineering/docs/adr/0001-stack-and-architecture.md#L1-L153]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/architect/spec-template.md#L1-L279]]"
  - id: what-the-status-means
    title: "Status 到底在說什麼"
    purpose: "能分辨 feature spec 的 Accepted 等於 shipped、standalone 的 Accepted 等於 ratify，以及 retro spec 為何一出生就 Accepted。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/6. Reading a Spec： What the Build Sees and What You Keep (9_11_2026 1：42：57 PM).txt#L45-L61]]"
  - id: assumed-specs-block-done
    title: "Assumed spec 為什麼擋住 done"
    purpose: "能解釋 Assumed spec 的四欄與 git 作者為何讓它擋住 done，並知道只有 /architect 能清掉、被推翻時是 superseded 而非改寫。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/6. Reading a Spec： What the Build Sees and What You Keep (9_11_2026 1：42：57 PM).txt#L62-L81]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/develop/SKILL.md#L1-L144]]"
  - id: running-architect
    title: "跑一次 /architect：一次只做一個決策"
    purpose: "能跑完一輪 /architect 訪談，判斷每個建議的推理，並讀出它寫下的 index.md 與 rationale.md。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/7. Demo Running architect.srt#L1-L330]]"
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/7. Demo Running architect.srt#L331-L1050]]"
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/7. Demo Running architect.srt#L1331-L2000]]"
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/8. Challenge： Scope Your Own Real Idea (9_11_2026 1：44：36 PM).txt#L1-L53]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/architect/SKILL.md#L1-L206]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/architect/internal/design-conversation.md#L1-L140]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/architect/internal/after-subagent.md#L1-L90]]"
created: 2026-10-30
updated: 2026-10-30
---

# Reading a Spec：The Build Sees 什麼、你留下什麼

## Lesson

spec 之所以常常要拆成兩個檔，是因為它有兩個讀者：build 要的是決定，你要的是理由。這個 node 講清楚 `Proposed → Accepted` 的狀態機、`Assumed` 為什麼會擋住 done，然後實際跑一次 `/architect`，看它怎麼一次只問一個維度、給出建議而不是中性選單。

## Steps

1. [兩種形狀，一條選法](reading-a-spec/two-shapes-one-rule.md)
2. [兩個讀者：build 要決定，你要理由](reading-a-spec/audience-split.md)
3. [Status 到底在說什麼](reading-a-spec/what-the-status-means.md)
4. [Assumed spec 為什麼擋住 done](reading-a-spec/assumed-specs-block-done.md)
5. [跑一次 /architect：一次只做一個決策](reading-a-spec/running-architect.md)
