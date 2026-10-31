---
id: workspace-setup-and-github-tools
title: "Workspace 設定與 GitHub 工具"
subject: claude-code-master
tier: 1
order: 2
status: written
goal: "從空資料夾建出第一個 workspace，並用 `/personalize` 安全評估 GitHub 上的工具。"
digests:
  - 2-Module_A2_-_My_VS_Code_x_Claude_Code_Setup.md
  - 8-Module_A8_-_Github_for_Agents.md
prerequisites: []
created: 2026-10-31
updated: 2026-10-31
steps:
  - id: install-extension-and-open-workspace
    title: "我的 VS Code x Claude Code 設定"
    purpose: "在 VS Code 裝好 Claude Code extension，並用一個空資料夾當作 workspace 邊界。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/2-Module A2 - My VS Code x Claude Code Setup/2-Module_A2_-_My_VS_Code_x_Claude_Code_Setup.en.vtt#L1-L110]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/2-Module A2 - My VS Code x Claude Code Setup/2-Module_A2_-_My_VS_Code_x_Claude_Code_Setup.en.vtt#L111-L230]]"
  - id: run-init-to-scaffold-workspace
    title: "用 /init 把 workspace 設定好"
    purpose: "跑 `/init` 回答設定問題，讓空 workspace 長出 claude.md、README、.gitignore 與基本資料夾。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/2-Module A2 - My VS Code x Claude Code Setup/2-Module_A2_-_My_VS_Code_x_Claude_Code_Setup.en.vtt#L231-L340]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/2-Module A2 - My VS Code x Claude Code Setup/2-Module_A2_-_My_VS_Code_x_Claude_Code_Setup.en.vtt#L341-L430]]"
  - id: claude-md-is-always-preloaded
    title: "每次 session 都從預先注入 claude.md 開始"
    purpose: "用「名字與城市」實驗解釋 claude.md 為何每次 session 都被預先注入 context。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/2-Module A2 - My VS Code x Claude Code Setup/2-Module_A2_-_My_VS_Code_x_Claude_Code_Setup.en.vtt#L431-L529]]"
  - id: install-a-github-tool-by-url
    title: "把 GitHub 連結貼進 Claude Code，叫它安裝這個 repo"
    purpose: "貼上 GitHub repo URL，讓 Claude 讀 README、判斷安全後安裝，缺 Git 時一併補上。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/8-Module A8 - Github for Agents/8-Module_A8_-_Github_for_Agents.en.vtt#L1-L100]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/8-Module A8 - Github for Agents/8-Module_A8_-_Github_for_Agents.en.vtt#L201-L300]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/8-Module A8 - Github for Agents/8-Module_A8_-_Github_for_Agents.en.vtt#L371-L433]]"
  - id: judge-a-repo-with-personalize
    title: "不要只是盲目安裝"
    purpose: "用 `/personalize` 取得工具描述、take rate 與建議，判斷新 repo 值不值得裝進 workspace。"
    sources:
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/8-Module A8 - Github for Agents/8-Module_A8_-_Github_for_Agents.en.vtt#L101-L200]]"
      - "[[sources/claude-code-master/20261031/2-Volume A - Setup and Fundamentals/8-Module A8 - Github for Agents/8-Module_A8_-_Github_for_Agents.en.vtt#L301-L370]]"
---

# Workspace 設定與 GitHub 工具

## Lesson

Workspace 就是 context 的邊界；先建一個空資料夾，讓 `/init` 長出 `claude.md`、README 與 `.gitignore`，再從 GitHub 安全地拉工具進來。這一層做完，你才有一個 agent 認得的家。

## Steps

1. [我的 VS Code x Claude Code 設定](workspace-setup-and-github-tools/install-extension-and-open-workspace.md)
2. [用 /init 把 workspace 設定好](workspace-setup-and-github-tools/run-init-to-scaffold-workspace.md)
3. [每次 session 都從預先注入 claude.md 開始](workspace-setup-and-github-tools/claude-md-is-always-preloaded.md)
4. [把 GitHub 連結貼進 Claude Code，叫它安裝這個 repo](workspace-setup-and-github-tools/install-a-github-tool-by-url.md)
5. [不要只是盲目安裝](workspace-setup-and-github-tools/judge-a-repo-with-personalize.md)
