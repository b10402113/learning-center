# Learning Path Notes

> Turn raw learning material into customized 10–15 minute lessons, reusable concept pages, and high-value relationships.

This repo is a personal learning system. You put raw material in `sources/`; the agent uses your learner profile to plan lesson **paths**, extract reusable **nodes**, and connect them with **edges** that make you compare, contrast, and judge.

## Structure

| Path | What it is |
| --- | --- |
| `sources/<subject>/` | Raw, immutable learning material. |
| `learn/<subject>/MEMORY.md` | Learner profile from `/learn-init`. |
| `learn/<subject>/ROADMAP.md` | Tiered subject-level index of lesson paths. It does not list nodes. |
| `learn/<subject>/paths/` | One 10–15 minute lesson article per path. |
| `learn/<subject>/nodes/` | Canonical concept pages with detailed explanations. |
| `learn/<subject>/edges/` | Relationship pages between nodes. |
| `wiki/` | Legacy, no longer maintained. |

## Pipeline

```text
/learn-init <subject>
    → /roadmap <subject>
    → /nodes <subject>/<path-id>
    → /edges <subject>/<path-id>
```

1. **`/learn-init`** — Interview the learner and write `MEMORY.md`.
2. **`/roadmap`** — Partition the source material into 10–15 minute lessons. Write `ROADMAP.md` and one skeleton in `paths/` per lesson.
3. **`/nodes`** — Invoking `/nodes <subject>/<path-id>` confirms that path and starts work. It extracts core concepts, creates or progressively updates canonical nodes, and writes the complete path article with node links.
4. **`/edges`** — For one path, propose a small set of strong relationships, including justified cross-path edges. Confirm the edge set before finalizing.

## Path, Node, Edge

- **Path** — A tiered, complete lesson with one learning goal, traceable sources, an ordered node list, and a readable 10–15 minute article.
- **Node** — A reusable concept identified by an immutable ID. Its detailed page grows incrementally as later paths add supported explanations, examples, connections, and sources.
- **Edge** — A relationship page that makes the learner compare, contrast, or judge two nodes. It records every path that uses the relationship.

Node links use stable, path-qualified IDs with display aliases:

```markdown
[[learn/<subject>/nodes/<node-id>|<Node title>]]
```

Source links include the subject and, when available, a section or page locator:

```markdown
[[sources/<subject>/<file>#<section>]]
```

## Status

The subject roadmap uses `draft → confirmed`. Each path uses:

```text
draft → confirmed → nodes-written → content-written → edges-written
```

## Design Principles

- **Sources are immutable.** Never modify files in `sources/`.
- **Paths teach.** A path has one outcome and fits a 10–15 minute lesson.
- **Nodes crystallize.** The node carries the detailed, self-contained explanation; the path carries the teaching narrative.
- **Nodes compound.** Later paths deepen canonical nodes without erasing useful earlier material.
- **Edges interleave.** A few strong comparisons are better than a dense graph.
- **Everything is cited.** Substantive claims trace back to immutable source material.

## Quick Start

1. Put material in `sources/<subject>/`.
2. Run `/learn-init <subject>` and complete the learner interview.
3. Run `/roadmap <subject>` and review the proposed paths.
4. Run `/nodes <subject>/<path-id>` to confirm and process each path.
5. Run `/edges <subject>/<path-id>` for each path whose nodes are ready.
6. Read the path article first, then open its node pages for depth and answer their retrieval questions.

## 学习路径笔记

这个仓库把原始材料转换成基于学习者经验的短课程、可复用概念页，以及帮助比较和判断的关系页。

### 目录结构

| 路径 | 说明 |
| --- | --- |
| `sources/<subject>/` | 原始且不可修改的学习材料。 |
| `learn/<subject>/MEMORY.md` | `/learn-init` 生成的学习者档案。 |
| `learn/<subject>/ROADMAP.md` | 学科级课程索引，不直接列出 nodes。 |
| `learn/<subject>/paths/` | 每条 path 一篇 10–15 分钟课程文章。 |
| `learn/<subject>/nodes/` | 可复用、渐进式更新的概念页。 |
| `learn/<subject>/edges/` | 连接两个 nodes 的关系页。 |

### 工作流程

```text
/learn-init <subject>
    → /roadmap <subject>
    → /nodes <subject>/<path-id>
    → /edges <subject>/<path-id>
```

`/roadmap` 只负责拆分课程目标、顺序和来源；`/nodes` 才负责从指定 path 萃取关键词概念、更新 canonical nodes，并写出完整白话文章；`/edges` 负责生成少量高价值的关系页。

### 关键定义

- **Path**：一堂有单一学习目标、约 10–15 分钟可读完的课程。
- **Node**：具有 immutable ID 的可复用概念页，详细内容会随着后续 path 渐进式更新。
- **Edge**：迫使学习者比较、对比或判断两个 nodes 的关系页。

指令必须明确指定 subject 与 path，例如：

```text
/nodes vibe-engineering/agent-planning
/edges vibe-engineering/agent-planning
```

原始材料永远不修改；所有课程、概念和关系都必须保留可追溯的 source links。
