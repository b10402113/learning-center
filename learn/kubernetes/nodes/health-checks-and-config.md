---
id: health-checks-and-config
title: "Health Checks、ConfigMap 與 Secret"
subject: kubernetes
tier: 3
order: 6
status: draft
goal: "用 readiness／liveness／startup 回答「這個 Pod 現在該不該收流量」，並把設定與密碼從 image 裡拆到 ConfigMap 與 Secret。"
digests:
  - 16-readiness-liveness-startup.md
  - 17-configmaps-secrets-namespaces.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Health Checks、ConfigMap 與 Secret

## Lesson

一個 running 的 Pod 不代表它會服務。probe 回答「現在該不該送流量」與「是不是該重啟」，request/limit 決定排程與保護；設定與密碼則拆到 ConfigMap 與 Secret，Namespace 當邊界——但 Secret 只是 base64，不是加密。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
