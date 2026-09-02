# Learning Path Notes

> Turn raw learning material into customized lessons, reusable concept pages, and high-value relationships.

This repo is a personal learning system. You put raw material in `sources/`; the agent uses your learner profile to plan lesson **nodes**, extract reusable **elements**, and connect them with **edges** that make you compare, contrast, and judge.

## Structure

| Path | What it is |
| --- | --- |
| `sources/<subject>/` | Raw, immutable learning material. |
| `learn/<subject>/MEMORY.md` | Learner profile from `/learn-init`. |
| `learn/<subject>/ROADMAP.md` | Tiered subject-level index of lesson nodes. It does not list elements. |
| `learn/<subject>/nodes/` | One node container per node — a step-DAG of step articles. |
| `learn/<subject>/elements/` | Canonical concept pages with detailed explanations. |
| `learn/<subject>/edges/` | Relationship pages between elements. |
| `wiki/` | Legacy, no longer maintained. |

## Pipeline

```text
/learn-init <subject>
    → /roadmap <subject>
    → /nodes <subject>/<node-id>
    → /edges <subject>/<node-id>
```

1. **`/learn-init`** — Interview the learner and write `MEMORY.md`.
2. **`/roadmap`** — Propose ≥5 learning paths for you to pick one, then partition the source material into nodes (each a step-DAG) along it. Write `ROADMAP.md` and one skeleton in `nodes/` per node.
3. **`/nodes`** — Invoking `/nodes <subject>/<node-id>` confirms that node and starts work. It extracts core concepts, creates or progressively updates canonical elements, and writes the complete node article with element links.
4. **`/edges`** — For one node, propose a small set of strong relationships, including justified cross-node edges. Confirm the edge set before finalizing.

## Node, Element, Edge

- **Node** — A tiered container with one learning goal, traceable sources, and a step-DAG of readable step articles.
- **Element** — A reusable concept identified by an immutable ID. Its detailed page grows incrementally as later nodes add supported explanations, examples, connections, and sources.
- **Edge** — A relationship page that makes the learner compare, contrast, or judge two elements. It records every node that uses the relationship.

Element links use stable, node-qualified IDs with display aliases:

```markdown
[[learn/<subject>/elements/<element-id>|<Element title>]]
```

Source links include the subject and, when available, a section or page locator:

```markdown
[[sources/<subject>/<file>#<section>]]
```

## Status

The subject roadmap uses `draft → confirmed`. Each node uses:

```text
draft → confirmed → nodes-written → content-written → edges-written
```

## Design Principles

- **Sources are immutable.** Never modify files in `sources/`.
- **Nodes teach.** A node has one outcome; each step fits a lesson.
- **Elements crystallize.** The element carries the detailed, self-contained explanation; the node carries the teaching narrative.
- **Elements compound.** Later nodes deepen canonical elements without erasing useful earlier material.
- **Edges interleave.** A few strong comparisons are better than a dense graph.
- **Everything is cited.** Substantive claims trace back to immutable source material.

## Quick Start

1. Put material in `sources/<subject>/`.
2. Run `/learn-init <subject>` and complete the learner interview.
3. Run `/roadmap <subject>` and review the proposed nodes.
4. Run `/nodes <subject>/<node-id>` to confirm and process each node.
5. Run `/edges <subject>/<node-id>` for each node whose elements are ready.
6. Read the node article first, then open its element pages for depth and answer their retrieval questions.

## 学习路径笔记

这个仓库把原始材料转换成基于学习者经验的短课程、可复用概念页，以及帮助比较和判断的关系页。

### 目录结构

| 路径 | 说明 |
| --- | --- |
| `sources/<subject>/` | 原始且不可修改的学习材料。 |
| `learn/<subject>/MEMORY.md` | `/learn-init` 生成的学习者档案。 |
| `learn/<subject>/ROADMAP.md` | 学科级课程索引，不直接列出 elements。 |
| `learn/<subject>/nodes/` | 每个 node 一个容器，其中每个 step 是一篇 10–15 分钟课程文章。 |
| `learn/<subject>/elements/` | 可复用、渐进式更新的概念页。 |
| `learn/<subject>/edges/` | 连接两个 elements 的关系页。 |

### 工作流程

```text
/learn-init <subject>
    → /roadmap <subject>
    → /nodes <subject>/<node-id>
    → /edges <subject>/<node-id>
```

`/roadmap` 只负责拆分课程目标、顺序和来源；`/nodes` 才负责从指定 node 萃取关键词概念、更新 canonical elements，并写出完整白话文章；`/edges` 负责生成少量高价值的关系页。

### 关键定义

- **Node**：一个单一学习目标的容器，其 step 是约 10–15 分钟可读完的课程。
- **Element**：具有 immutable ID 的可复用概念页，详细内容会随着后续 node 渐进式更新。
- **Edge**：迫使学习者比较、对比或判断两个 elements 的关系页。

指令必须明确指定 subject 与 node，例如：

```text
/nodes vibe-engineering/agent-planning
/edges vibe-engineering/agent-planning
```

原始材料永远不修改；所有课程、概念和关系都必须保留可追溯的 source links。
