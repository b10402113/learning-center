---
id: pods-and-deployments
title: "Pods 與 Deployments：會自我修復的工作負載"
subject: kubernetes
tier: 2
order: 3
status: written
goal: "分辨裸 Pod 與 Deployment，看到刪掉 pod 之後幾毫秒內長回來，並能用 `scale` 與 `get pods -w` 觀察整個過程。"
digests:
  - 5-running-deleting-an-app.md
  - 6-creating-deployments.md
  - 7-scaling-deployments.md
  - 8-self-healing-reconciliation-loop.md
  - 9-recreating-a-cluster-from-scratch.md
prerequisites: []
steps:
  - id: bare-pod-is-not-self-healing
    title: "沒有東西控制 pod，它就會直接消失"
    purpose: "用 kubectl run 起一個裸 pod 並 delete 它，說出沒有 controller 的 pod 為什麼一去不回。"
    sources:
      - "[[sources/kubernetes/20261031/5-running-deleting-an-app.txt#L46-L80]]"
      - "[[sources/kubernetes/20261031/5-running-deleting-an-app.txt#L131-L165]]"
      - "[[sources/kubernetes/20261031/5-running-deleting-an-app.txt#L341-L401]]"
      - "[[sources/kubernetes/20261031/5-running-deleting-an-app.txt#L402-L462]]"
  - id: deployment-owns-the-pod
    title: "Deployment 就是 Pod 的定速巡航"
    purpose: "用 deployment 管 pod，解釋 pod 名稱的亂數後綴，並用 get pods -w 看到刪除後毫秒級長回來。"
    sources:
      - "[[sources/kubernetes/20261031/6-creating-deployments.txt#L35-L74]]"
      - "[[sources/kubernetes/20261031/6-creating-deployments.txt#L75-L124]]"
      - "[[sources/kubernetes/20261031/6-creating-deployments.txt#L125-L165]]"
      - "[[sources/kubernetes/20261031/6-creating-deployments.txt#L166-L215]]"
  - id: scaling-and-where-pods-run
    title: "擴縮只是一個參數，而 node 只是說明 pod 跑在哪"
    purpose: "用 kubectl scale 把 replica 調到 3，在 pod 分佈中說出 node 只是「跑在哪」這個問題的答案。"
    sources:
      - "[[sources/kubernetes/20261031/7-scaling-deployments.txt#L1-L52]]"
      - "[[sources/kubernetes/20261031/7-scaling-deployments.txt#L156-L215]]"
      - "[[sources/kubernetes/20261031/7-scaling-deployments.txt#L261-L298]]"
  - id: reconcile-loop-in-crashloopbackoff
    title: "Reconciliation Loop：修好壞掉的地方就好"
    purpose: "讓 postgres 進 CrashLoopBackOff，用 logs 找原因、改 desired state 修好，說出 reconcile loop 缺什麼。"
    sources:
      - "[[sources/kubernetes/20261031/8-self-healing-reconciliation-loop.txt#L1-L45]]"
      - "[[sources/kubernetes/20261031/8-self-healing-reconciliation-loop.txt#L46-L98]]"
      - "[[sources/kubernetes/20261031/8-self-healing-reconciliation-loop.txt#L99-L156]]"
      - "[[sources/kubernetes/20261031/8-self-healing-reconciliation-loop.txt#L157-L193]]"
  - id: rebuild-the-cluster-from-scratch
    title: "從零重建叢集"
    purpose: "砍掉 kind 叢集重建並重放指令，指出這套流程還缺什麼才不用靠腦子記指令。"
    sources:
      - "[[sources/kubernetes/20261031/9-recreating-a-cluster-from-scratch.txt#L1-L40]]"
      - "[[sources/kubernetes/20261031/9-recreating-a-cluster-from-scratch.txt#L41-L84]]"
      - "[[sources/kubernetes/20261031/9-recreating-a-cluster-from-scratch.txt#L85-L113]]"
created: 2026-10-31
updated: 2026-10-31
---

# Pods 與 Deployments：會自我修復的工作負載

## Lesson

整個 POC 階段都用 imperative 指令：先跑一個裸 pod 再刪掉，看見它不會回來；換成 deployment，同樣的刪除變成幾毫秒的自我修復。中間順便看到 scale、節點是什麼，以及把整個叢集砍掉重來要怎麼接回去。

## Steps

1. [沒有東西控制 pod，它就會直接消失](pods-and-deployments/bare-pod-is-not-self-healing.md)
2. [Deployment 就是 Pod 的定速巡航](pods-and-deployments/deployment-owns-the-pod.md)
3. [擴縮只是一個參數，而 node 只是說明 pod 跑在哪](pods-and-deployments/scaling-and-where-pods-run.md)
4. [Reconciliation Loop：修好壞掉的地方就好](pods-and-deployments/reconcile-loop-in-crashloopbackoff.md)
5. [從零重建叢集](pods-and-deployments/rebuild-the-cluster-from-scratch.md)
