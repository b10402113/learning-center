---
source: Jacky-motion
source_type: codebase
source_lines: 6499
language: markdown
file_count: 68
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — Jacky-motion

## Overview (L1)

- Jacky Motion 2.0 SRT：面向中文内容创作者的 Agent Skill，把口播稿+SRT 变成可录屏的16:9信息动画 HTML
- 混合架构：固化运行时基座 + 可注入风格层 + 登记制版式骨架 + SRT 主时钟时间线
- 6阶段4确认门工作流：审稿→分镜→锁风格→锁时间轴→装配HTML→验收

## Structure (L2)

### SKILL.md — 核心流程与规则

- Locator: `[[sources/ai-html/20260910/Jacky-motion/SKILL.md]]`
- Purpose: 定义6阶段流水线、18条不可违背规则、6个重点风格方向、风格选择矩阵
- Key exports: 风格选择输出格式、beat五问、四段式镜头编排（glance→reconstruct→push→lock）
- Dependencies: references/ 下所有文档、assets/ 下模板和CSS、scripts/ 下校验脚本
- Learner-relevant: skill 设计的完整范本——流程+规则+质量门禁+交付标准

### references/ — 10份专业文档

- Locator: `[[sources/ai-html/20260910/Jacky-motion/references/]]`
- Purpose: 每个阶段的单一入口文档，渐进加载避免注意力稀释
- Key exports: script-audit.md（审稿标准）、storyboard.md（分镜契约）、srt-autoplay.md（时间轴）、beat-contract.md（beat合同）、hybrid-quality-gate.md（审美门禁）、information-primitives.md（信息原语）、layout-skeletons.md（版式骨架L01-L10）、motion-language.md（运动语法）、html-production.md（装配规范）、quality-check.md（验收清单）
- Dependencies: 各文档相互引用，形成完整的质量约束网络
- Learner-relevant: 复杂任务的文档分层设计——每个阶段只读一份入口文件

### styles/ — 9套视觉风格

- Locator: `[[sources/ai-html/20260910/Jacky-motion/styles/]]`
- Purpose: 每套风格包含CSS（assets/styles/）和风格说明卡（styles/*.md），定义颜色、字体、间距、签名组件
- Key exports: apple-tech-gradient、finance-studio-cards、editorial-magazine、newspaper-evidence、paper-collage、sketch-note（6个重点）；apple-light-blue-glass、ink-framework、manifesto-poster（3个保留但不推荐）
- Dependencies: CSS变量系统被beat CSS消费，风格DNA被hybrid-quality-gate检查
- Learner-relevant: 主题系统设计——样式约束+AI说明双重约束

### scripts/ — 校验工具链

- Locator: `[[sources/ai-html/20260910/Jacky-motion/scripts/]]`
- Purpose: parse-srt.mjs（SRT→毫秒JSON）、validate-motion-html.mjs（静态校验）、check-layout-browser.mjs（Playwright浏览器检查）
- Key exports: 三个可独立运行的校验脚本
- Dependencies: validate-motion-html.mjs 检查beat属性、时间覆盖、重叠、空档
- Learner-relevant: 自动化质量保障——静态校验+浏览器校验双保险
