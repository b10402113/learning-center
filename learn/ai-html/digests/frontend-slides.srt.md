---
source: frontend-slides.srt
source_type: pdf
source_lines: 998
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — frontend-slides.srt

## Overview (L1)

- Front End Slides 作者（非技术背景）分享如何构建一个 22k+ star 的 HTML slides skill
- 核心观点：HTML 是 AI 模型的原生输出语言，skills 将取代小型 productivity apps
- 涵盖 skill 使用流程、设计哲学、构建方法论

## Sections (L2)

### 产品演示与交互特性

- Locator: `[[sources/ai-html/20260910/frontend-slides.srt#15]]`
- Summary: HTML 演示文稿是网页而非 PPT，支持交互（点击放大、视频嵌入、激光指针、隐藏内容揭示）
- Key claims: 交互性是 HTML slides 相对于 PowerPoint 的核心优势；可发布为独立 URL
- Learner-relevant: 理解 HTML 演示文稿的产品形态和交互能力

### 使用流程

- Locator: `[[sources/ai-html/20260910/frontend-slides.srt#33]]`
- Summary: 安装 skill → 给出大纲或主题 → agent 询问用途/密度 → 生成三个封面选项 → 选定方向后生成全稿
- Key claims: Claude Code 会截图自检每张幻灯片并修正错误；支持直接标注反馈；通过 Vercel 部署为在线链接
- Learner-relevant: 从零到发布的完整工作流

### Skill 构建方法论

- Locator: `[[sources/ai-html/20260910/frontend-slides.srt#95]]`
- Summary: 先做原型 → 反复调优直到满意 → 包装成 skill → 设计 onboarding 体验 → 发布到 GitHub
- Key claims: "You don't start with a skill. You end with a skill."；skill 是把工作流冻结成 agent 可执行的形式
- Learner-relevant: skill 开发的核心理念——先做后封装

### HTML 作为 AI 原生语言

- Locator: `[[sources/ai-html/20260910/frontend-slides.srt#159]]`
- Summary: 模型训练数据充满网页，HTML 是其最强的输出格式；Markdown 是输入侧原生语言，HTML 是输出侧原生语言
- Key claims: HTML 对模型和人都友好；vibe coding 的最大赢家不是程序员而是非技术人员
- Learner-relevant: 理解为什么 AI 特别擅长生成 HTML 内容
