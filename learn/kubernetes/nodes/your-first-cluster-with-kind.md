---
id: your-first-cluster-with-kind
title: "第一個叢集：kind"
subject: kubernetes
tier: 1
order: 2
status: draft
goal: "用 `kind create cluster --config` 建出 1 control plane + 2 worker，並解釋為什麼 30080 這種對外端口必須在建叢集時就決定。"
digests:
  - 3-getting-started-with-kind.md
  - 4-create-a-cluster-from-a-config.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# 第一個叢集：kind

## Lesson

課程在這裡第一次真的動手：從預設的單節點 kind 叢集，換成一份 config 檔描述的 1 control plane + 2 worker。這一步同時決定了後面所有 demo 的前提——對外只有 30080 一個洞。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
