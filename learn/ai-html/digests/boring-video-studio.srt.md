---
source: boring-video-studio.srt
source_type: pdf
source_lines: 567
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — boring-video-studio.srt

## Overview (L1)

- 小木头分享的视频制作 skill（Very Small Words Video），基于 Hyperframes 官方流程之上的编排层
- 解决两个缺口：发布物料自动生成（封面、文案、博客、推广）和真人录音无缝接入工作流
- Skill 本身 60 行 MD，细节下沉到 references，硬性规则只留最关键几条

## Sections (L2)

### 官方流程的不足

- Locator: `[[sources/ai-html/20260910/boring-video-studio.srt#10]]`
- Summary: Hyperframes 官方 Faceless Explainer 已能生成讲解视频，但出片只是自媒体内容创作的一环
- Key claims: 封面（5种比例）、平台文案（YouTube/B站各一套）、博客、推广文都需要手工重走
- Learner-relevant: 理解为什么官方 skill 不够用，需要自定义编排层

### TTS vs 真人录音

- Locator: `[[sources/ai-html/20260910/boring-video-studio.srt#40]]`
- Summary: TTS 能模拟音色但缺少情绪起伏，真人录音是刚需；但录音后节奏由音频决定而非脚本
- Key claims: 音频录制后画面必须跟随音频时间点，这是官方流程未解决的痛点
- Learner-relevant: 理解 audio-driven visual sync 的需求场景

### Skill 架构设计

- Locator: `[[sources/ai-html/20260910/boring-video-studio.srt#61]]`
- Summary: Very Small Words Video 不重做出片，是架在官方 skill 之上的一层编排
- Key claims: 输入主题/文章/口播稿 → 产出全套物料（视频+封面+文案+博客+推广）；设计由用户选、旁白支持自己录、发布物料一次补齐
- Learner-relevant: skill 作为编排层的设计模式

### Skill 编写原则

- Locator: `[[sources/ai-html/20260910/boring-video-studio.srt#96]]`
- Summary: Skill MD 60 行，只讲何时用、开局问什么、交付什么；细节下沉到 references；硬性规则只留最关键几条，其余交给模型判断
- Key claims: 不为每件小事写规矩；context caching 新规则；skill 是根据实际制作经历整理出来的
- Learner-relevant: skill 编写的最佳实践——简洁、分层、信任模型判断
