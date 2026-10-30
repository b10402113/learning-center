---
id: sync
title: "sync：Understand It, Then Automate It"
subject: agentic-engineer
tier: 3
order: 15
status: confirmed
goal: "能用真實 diff 對帳 scope 勾選與 spec 狀態，並用 MCP 讓 migration 打在真的 schema 上。"
digests:
  - ch08-workflow-ship-something-real.1.part.md
  - ch08-workflow-ship-something-real.2.part.md
  - code-jsm-skills-system.md
prerequisites: []
steps:
  - id: code-and-files-tell-different-stories
    title: "Code 說一個專案，檔案說另一個"
    purpose: "能指出 `/sync` 在 merge 前補的漂移缺口，並說明它為何輕到可以每次跑。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/11. sync Understand It Then Automate It.srt#L1-L150]]"
  - id: read-the-git-diff
    title: "讀 git 的真實變更：added、modified、deleted"
    purpose: "能從 `--name-status` 分辨 added、modified、deleted，並排除文件、測試與生成物這些非產品證據。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/11. sync Understand It Then Automate It.srt#L151-L330]]"
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/11. sync Understand It Then Automate It.srt#L331-L526]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/sync/SKILL.md#L58-L96]]"
  - id: surgical-agents-md
    title: "外科式、加法、耐久：AGENTS.md 的維護邊界"
    purpose: "能判斷哪些 AGENTS.md 該做外科式修改、何時只為 net-new 區域建巢狀檔，何時 flag 給 `/audit`。"
    sources:
      - "[[sources/agentic-engineer/20261030/skills/skills/sync/SKILL.md#L21-L51]]"
      - "[[sources/agentic-engineer/20261030/skills/skills/sync/agent-prompt.md#L61-L125]]"
  - id: reconcile-scope-and-spec-status
    title: "對帳 scope 勾選與 spec 的 Status 行"
    purpose: "能依 repo 證據勾 scope 子任務、只改 spec 的 Status 行，並把 `Assumed` 當決策債 flag 出來。"
    sources:
      - "[[sources/agentic-engineer/20261030/skills/skills/sync/agent-prompt.md#L126-L211]]"
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/11. sync Understand It Then Automate It.srt#L331-L526]]"
  - id: supabase-mcp-real-schema
    title: "Install Supabase MCP：讓 migration 打在真的 schema 上"
    purpose: "能把 Supabase MCP 接上，讓 migration 與約束檢查打在真的資料庫，而不是檔案裡的想像。"
    sources:
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/12. Install Supabase MCP.srt#L1-L160]]"
      - "[[sources/agentic-engineer/20261030/8. Workflow Ship Something Real/12. Install Supabase MCP.srt#L161-L424]]"
created: 2026-10-30
updated: 2026-10-30
---

# sync：Understand It, Then Automate It

## Lesson

code 和描述它的檔案會一路漂開，直到 repo 和它的說明變成兩個不同的專案。`/sync` 在 merge 之前讀真實的 diff 與 log，把 scope 勾選與 spec 狀態校正回「實際發生的事」，輕到可以每次都跑。同一個時段也接上 Supabase MCP，讓 migration 與約束檢查打在真的資料庫上。

## Steps

1. [Code 說一個專案，檔案說另一個](sync/code-and-files-tell-different-stories.md)
2. [讀 git 的真實變更：added、modified、deleted](sync/read-the-git-diff.md)
3. [外科式、加法、耐久：AGENTS.md 的維護邊界](sync/surgical-agents-md.md)
4. [對帳 scope 勾選與 spec 的 Status 行](sync/reconcile-scope-and-spec-status.md)
5. [Install Supabase MCP：讓 migration 打在真的 schema 上](sync/supabase-mcp-real-schema.md)
