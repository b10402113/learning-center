---
id: gateway-api
title: "Gateway API"
subject: kubernetes
tier: 3
order: 7
status: draft
goal: "用 Gateway + HTTPRoute 開一扇對外的門，並解釋「route 是契約，controller 是環境」。"
digests:
  - 18-gateway-api.md
  - 19-rebuilding-cluster-with-api-gateway.md
prerequisites: []
steps: []
created: 2026-10-31
updated: 2026-10-31
---

# Gateway API

## Lesson

進來的流量最後要有一個前門。Ingress 是各家 controller 各自定義資源，Gateway API 把它標準化成 Gateway + GatewayClass + HTTPRoute。這一節裝 NGINX Gateway Fabric，把課程開頭那個 30080 接回 Gateway。

## Steps

<!-- /nodes fills this ordered list — one link per step entry. -->
