---
source: garden-skills-1.srt
source_type: pdf
source_lines: 1251
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — garden-skills-1.srt

## Overview (L1)

- 花园老师教程：BeautifulArticle skill 将任何文字编辑为精美 HTML 文章
- 核心创新：Reacticle 组件协议（React + Article）让 AI 可控生成长文 HTML
- 完整工作流：素材整理 → 方案确认 → 手评验证 → 多章节开发 → 三维度质检 → 导出

## Sections (L2)

### HTML 作为内容载体的优势

- Locator: `[[sources/ai-html/20260910/garden-skills-1.srt#13]]`
- Summary: HTML 信息密度高（表格/SVG/代码/公式可组合）、视觉结构化、可交互、分享简单（一个文件即可）
- Key claims: HTML 很强但不应让 AI 裸写 HTML；长内容需要系统来驾驭
- Learner-relevant: 理解为什么选择 HTML 而非 Markdown 作为内容载体

### Reacticle 组件协议

- Locator: `[[sources/ai-html/20260910/garden-skills-1.srt#66]]`
- Summary: Reacticle = React + Article，为 AI 定义语义化文章组件；AI 只负责组合组件，结构和排版由库保证
- Key claims: 三个关键设计——文章组件平替 Markdown、RAW 逃生舱（任意 HTML 但必须遵循主题）、11 套主题（样式约束 + AI 说明）
- Learner-relevant: 组件协议如何约束 AI 输出质量

### 工作流与检查点

- Locator: `[[sources/ai-html/20260910/garden-skills-1.srt#30]]`
- Summary: 四步流程——整理素材 → 编辑方案 → 手评验证 → 全文开发；三个检查点（方案确认、手评确认、最终交付）
- Key claims: 不直接替用户做决定；先做一小块验证再展开；多 agent 并行开发；三维度质检（内容/视觉/技术）
- Learner-relevant: 复杂内容生产的流程设计模式

### Harness 六层架构

- Locator: `[[sources/ai-html/20260910/garden-skills-1.srt#230]]`
- Summary: 上下文管理（渐进加载）、工具系统（统一输入+一节一文件）、执行编排、状态和记忆（文件化工作记忆）、评估与观测（检查点+独立质检）、约束与恢复（组件协议+最小切片修复）
- Key claims: 视频 Skill 和文章 Skill 股价几乎一样；做 Harness 不一定要从零搭建 agent
- Learner-relevant: Harness 架构的通用设计原则
