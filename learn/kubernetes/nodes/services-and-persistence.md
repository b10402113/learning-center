---
id: services-and-persistence
title: "Services 與 Postgres Persistence"
subject: kubernetes
tier: 2
order: 4
status: confirmed
goal: "用 Service 給會換 IP 的 Pod 一個穩定名字，並用「刪掉 Postgres pod 資料就歸零」證明沒有 PVC 就沒有持久化。"
digests:
  - 10-exposing-pods-with-services.md
  - 11-using-nodeport-vs-port-forwarding.md
  - 12-testing-postgres-persistence.md
  - 13-raft-consensus-algorithm.md
prerequisites: []
steps:
  - id: service-gives-pods-a-stable-name
    purpose: "能解釋 Service 與 CoreDNS 如何讓 app 用固定名字連到一直換 IP 的 Postgres。"
    sources:
      - "[[sources/kubernetes/20261031/10-exposing-pods-with-services.txt#L44-L70]]"
      - "[[sources/kubernetes/20261031/10-exposing-pods-with-services.txt#L71-L120]]"
      - "[[sources/kubernetes/20261031/10-exposing-pods-with-services.txt#L121-L176]]"
      - "[[sources/kubernetes/20261031/10-exposing-pods-with-services.txt#L326-L374]]"
  - id: wiring-the-app-to-postgres
    purpose: "能用 set env 接上資料庫，並用 NodePort 與 port-forward 讓 curl 打進 app、看到 counter 增加。"
    sources:
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L1-L45]]"
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L46-L80]]"
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L81-L175]]"
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L351-L398]]"
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L457-L498]]"
  - id: nodeport-port-forward-or-ingress
    purpose: "能依可達範圍與維護成本，選出 NodePort、port-forward 或 Ingress 這三種進站方式。"
    sources:
      - "[[sources/kubernetes/20261031/10-exposing-pods-with-services.txt#L177-L235]]"
      - "[[sources/kubernetes/20261031/10-exposing-pods-with-services.txt#L236-L291]]"
      - "[[sources/kubernetes/20261031/10-exposing-pods-with-services.txt#L292-L325]]"
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L176-L253]]"
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L254-L350]]"
      - "[[sources/kubernetes/20261031/11-using-nodeport-vs-port-forwarding.txt#L399-L456]]"
      - "[[sources/kubernetes/20261031/12-testing-postgres-persistence.txt#L1-L63]]"
  - id: delete-the-postgres-pod
    purpose: "能刪掉 Postgres pod 並用 curl 的 database unavailable 說明沒有 volume 就沒有持久化。"
    sources:
      - "[[sources/kubernetes/20261031/12-testing-postgres-persistence.txt#L64-L117]]"
      - "[[sources/kubernetes/20261031/12-testing-postgres-persistence.txt#L118-L160]]"
  - id: one-replica-is-not-persistence
    purpose: "能用 quorum 解釋為什麼多開幾個副本不算持久化，以及等狀態一致為什麼難查。"
    sources:
      - "[[sources/kubernetes/20261031/13-raft-consensus-algorithm.txt#L1-L102]]"
      - "[[sources/kubernetes/20261031/13-raft-consensus-algorithm.txt#L103-L253]]"
      - "[[sources/kubernetes/20261031/13-raft-consensus-algorithm.txt#L254-L345]]"
      - "[[sources/kubernetes/20261031/13-raft-consensus-algorithm.txt#L346-L421]]"
created: 2026-10-31
updated: 2026-10-31
---

# Services 與 Postgres Persistence

## Lesson

app 跟 Postgres 都跑起來了，但 pod IP 會換，所以需要 Service 給一個穩定名字：ClusterIP 只在叢集內、NodePort 開一個 host port、port-forward 從 CLI 穿進去。curl 得到 counter 之後，再把 Postgres pod 刪掉——資料歸零，這是課程刻意留下的坑；Raft 那段補上「一個副本為什麼不夠」。

## Steps

1. [service-gives-pods-a-stable-name](services-and-persistence/service-gives-pods-a-stable-name.md)
2. [wiring-the-app-to-postgres](services-and-persistence/wiring-the-app-to-postgres.md)
3. [nodeport-port-forward-or-ingress](services-and-persistence/nodeport-port-forward-or-ingress.md)
4. [delete-the-postgres-pod](services-and-persistence/delete-the-postgres-pod.md)
5. [one-replica-is-not-persistence](services-and-persistence/one-replica-is-not-persistence.md)
