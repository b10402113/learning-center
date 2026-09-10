---
subject: kubernetes
language: zh-Hant
created: 2026-09-10
updated: 2026-09-10
---

# MEMORY — kubernetes

## Goal
能夠在 EKS 上部署和操作生產級 Kubernetes 平台——從撰寫宣告式 manifests 到管理 GitOps 工作流程、自動擴縮、安全滾動部署，以及雲端網路。一個完整的平台工程師能力。

## Why
正在建構公司內部的平台，需要一個標準化的部署流程。從手動 SSH + Docker Compose 過渡到 Kubernetes，讓多個服務的部署有一致、可重複、可自動化的方式。

## Prior experience
- Docker、container images、Dockerfile — 容器化基礎紮實
- SSH、Linux 網路基礎 — 系統管理能力
- Shell 腳本 — 有自動化經驗
- Python、TypeScript — 至少兩門語言
- 尚未接觸過雲端服務（AWS / EKS）
- 尚未接觸過 CI/CD、IaC（Terraform 等）

## Anchors
- 公司內部平台，團隊不大（1-3 人）
- 十幾個服務需要管理，主要用 Python 和 TypeScript
- 目前部署可能靠手動 SSH + Docker Compose 或少量腳本
- EKS 會是第一次接觸雲端 Kubernetes
- 已有 Docker 容器化經驗，Pod / Container 的概念可以從這裡延伸

## Habits & constraints
- 學習時間不固定，看心情和時間
- 無法維持固定的學習節奏，需要按節點進行、可隨時中斷和繼續

## Knowledge type
mixed — 宣告式概念（Pod、Deployment、Service、Operator、GitOps 原理）和操作式技能（寫 manifest、除錯、建構完整平台）兩者都需要

## How to teach me
先看完整範例，再拆解細節。先看到一個完整跑起來的平台，然後再逐個組件解釋是什麼、為什麼這樣設計。不要只丟步驟，要解釋背後的原理；也不要只有理論，每個概念都要有對應的實際操作。
