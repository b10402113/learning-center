---
source: garden-skills-2.srt
source_type: pdf
source_lines: 1383
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — garden-skills-2.srt

## Overview (L1)

- 花园老师教程：Web Video Presentation skill 将文章转为讲解视频
- 核心方法：HTML 网页作为视频画面（可控性远超 AI 视频生成模型）
- 涵盖 harness 设计拆解、多 agent 并行开发、TTS 音频合成、录屏出片

## Sections (L2)

### 为什么用网页而非视频模型

- Locator: `[[sources/ai-html/20260910/garden-skills-2.srt#9]]`
- Summary: 网页可控性极高——字体、配色、每帧停留时间、精确数字都可精确控制；比视频模型抽卡更稳定、成本更低
- Key claims: Notebook LLM 做不了动画演示；Remotion 反而限制模型发挥
- Learner-relevant: 理解 HTML-based video 的核心优势

### Skill 工作流四阶段

- Locator: `[[sources/ai-html/20260910/garden-skills-2.srt#66]]`
- Summary: 阶段一（内容编写：口播稿+开发计划）→ 人工检查点 → 阶段二（章节开发，先做第一章验收）→ 阶段三（TTS 音频合成）→ 阶段四（录屏出片）
- Key claims: 第一章是后续所有章节的基准；支持单 agent 顺序和多 agent 并行两种模式
- Learner-relevant: 从文章到视频的完整生产流程

### Harness 设计六层

- Locator: `[[sources/ai-html/20260910/garden-skills-2.srt#97]]`
- Summary: 执行编排（4阶段+2检查点）、上下文管理（渐进加载）、状态和记忆（开发计划+口播稿+原文章三文档分工）、工具系统（物理隔离+独立CSS前缀）、评估与观测（自检→修复→汇报+agent teams 独立质检）、约束与恢复（最小切片修复）
- Key claims: 文件化工作记忆是跨步骤稳定性的关键；最小切片修复避免连锁反应
- Learner-relevant: Harness 在视频生产场景的具体实践

### 多 Agent 并行开发

- Locator: `[[sources/ai-html/20260910/garden-skills-2.srt#129]]`
- Summary: subagent（子进程，结果导向）vs agent teams（项目小组，可讨论反馈）；最多同时3个 agent 较合适
- Key claims: 物理隔离（独立文件夹+CSS前缀）是并行前提；agent teams 适合需要来回反馈的质检环节
- Learner-relevant: 多 agent 调度策略和适用场景
