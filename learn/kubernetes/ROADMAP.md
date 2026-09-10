---
subject: kubernetes
status: confirmed
path: maturity-climbing
created: 2026-09-10
---

# ROADMAP — kubernetes

## Goal

能夠在 EKS 上部署和操作生產級 Kubernetes 平台——從撰寫宣告式 manifests 到管理 GitOps 工作流程、自動擴縮、安全滾動部署，以及雲端網路。

## Learning path

**成熟度攀升**：沿著「什麼都沒有 → 能跑 → 穩定 → 生產級」的階梯爬升。每一個節點都是一個可運行的里程碑，學完就知道自己「現在在哪裡」。優化目標：最直接對應建構內部平台的需求——從 SSH + Docker Compose 過渡到完整的 K8s 平台，每一步都有明確的「現在比之前好在哪裡」。

## How to use

Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — 心智模型與基礎環境

1. **[[learn/kubernetes/nodes/reconciliation-loop|Kubernetes 核心：Reconciliation Loop]]**
   - Goal: 理解 desired state → actual state → reconcile 的核心循環，並能用日常類比解釋它
   - Sources:
     - [[sources/kubernetes/20260910/1-the-kubernetes-loop.txt]]

2. **[[learn/kubernetes/nodes/kind-cluster|建立本地開發環境]]**
   - Goal: 能用 Kind 建立多節點集群，理解 control-plane 和 worker 的差異
   - Sources:
     - [[sources/kubernetes/20260910/2-local-vs-cloud-clusters.txt]]
     - [[sources/kubernetes/20260910/3-getting-started-with-kind.txt]]
     - [[sources/kubernetes/20260910/4-create-a-cluster-from-a-config.txt]]

3. **[[learn/kubernetes/nodes/first-deployment|第一個應用部署（POC）]]**
   - Goal: 能用 `kubectl run` 和 `kubectl create deployment` 部署一個應用，理解 Pod 是最小單位
   - Sources:
     - [[sources/kubernetes/20260910/5-running-deleting-an-app.txt]]
     - [[sources/kubernetes/20260910/6-creating-deployments.txt]]
     - [[sources/kubernetes/20260910/9-recreating-a-cluster-from-scratch.txt]]

### Tier 2 — 工作負載與網路

4. **[[learn/kubernetes/nodes/scaling-self-healing|擴展與自我修復]]**
   - Goal: 能用 `kubectl scale` 調整副本數，理解 reconciliation loop 如何實現自我修復
   - Sources:
     - [[sources/kubernetes/20260910/7-scaling-deployments.txt]]
     - [[sources/kubernetes/20260910/8-self-healing-reconciliation-loop.txt]]

5. **[[learn/kubernetes/nodes/services|服務發現與網路]]**
   - Goal: 能建立 ClusterIP 和 NodePort Service，理解 CoreDNS 和 Pod 網路的運作
   - Sources:
     - [[sources/kubernetes/20260910/10-exposing-pods-with-services.txt]]
     - [[sources/kubernetes/20260910/11-using-nodeport-vs-port-forwarding.txt]]

6. **[[learn/kubernetes/nodes/gateway-api|Gateway API]]**
   - Goal: 能安裝 NGINX Gateway Fabric，用 Gateway 和 HTTPRoute 暴露服務
   - Sources:
     - [[sources/kubernetes/20260910/18-gateway-api.txt]]
     - [[sources/kubernetes/20260910/19-rebuilding-cluster-with-api-gateway.txt]]
     - [[sources/kubernetes/20260910/23-configuring-the-gateway-api.txt]]
     - [[sources/kubernetes/20260910/24-patching-the-control-plane.txt]]

### Tier 3 — 宣告式管理

7. **[[learn/kubernetes/nodes/declarative-manifests|從命令式到宣告式]]**
   - Goal: 能撰寫 Deployment YAML manifest，理解 `kubectl apply` vs `kubectl create`
   - Sources:
     - [[sources/kubernetes/20260910/13-raft-consensus-algorithm.txt]]
     - [[sources/kubernetes/20260910/14-manifests.txt]]
     - [[sources/kubernetes/20260910/15-deployment-manifest-labels.txt]]
     - [[sources/kubernetes/20260910/20-migrating-to-manifests.txt]]

8. **[[learn/kubernetes/nodes/configmaps-secrets|配置管理]]**
   - Goal: 能建立 ConfigMap 和 Secret，在 Deployment 中引用它們
   - Sources:
     - [[sources/kubernetes/20260910/17-configmaps-secrets-namespaces.txt]]
     - [[sources/kubernetes/20260910/22-service-configmap-secret.txt]]

9. **[[learn/kubernetes/nodes/kustomize|Kustomize 組織]]**
   - Goal: 能用 `kustomization.yaml` 合併多個 manifest，理解 base 的概念
   - Sources:
     - [[sources/kubernetes/20260910/27-organizing-manifests-with-kustomize.txt]]

### Tier 4 — 健康與穩定性

10. **[[learn/kubernetes/nodes/health-probes|健康檢查三兄弟]]**
    - Goal: 能在 Deployment 中設定 startup / readiness / liveness probe，解釋它們的差異
    - Sources:
      - [[sources/kubernetes/20260910/16-readiness-liveness-startup.txt]]
      - [[sources/kubernetes/20260910/21-health-checks.txt]]

11. **[[learn/kubernetes/nodes/safe-rollouts|安全滾動部署與回滾]]**
    - Goal: 能設定 rolling update 策略，用 `kubectl rollout undo` 回滾
    - Sources:
      - [[sources/kubernetes/20260910/30-safe-rollouts-rollbacks.txt]]

12. **[[learn/kubernetes/nodes/pdb-node-drains|中斷預算與節點維護]]**
    - Goal: 能建立 PodDisruptionBudget，理解 drain / uncordon 的操作流程
    - Sources:
      - [[sources/kubernetes/20260910/31-poddisruptionbudgets-node-drains.txt]]

### Tier 5 — 資料持久化

13. **[[learn/kubernetes/nodes/operators-crds|Operator 與 CRD 模式]]**
    - Goal: 理解 CRD 和 Operator 的運作原理，能安裝 CloudNativePG Operator
    - Sources:
      - [[sources/kubernetes/20260910/25-installing-the-cloudnativepg-operator.txt]]

14. **[[learn/kubernetes/nodes/cloudnativepg|持久化 Postgres]]**
    - Goal: 能用 CloudNativePG 部署一個持久化的 Postgres 集群，驗證資料在 Pod 刪除後存活
    - Sources:
      - [[sources/kubernetes/20260910/12-testing-postgres-persistence.txt]]
      - [[sources/kubernetes/20260910/26-durable-postgres-with-cloudnativepg.txt]]

### Tier 6 — 安全與 GitOps

15. **[[learn/kubernetes/nodes/rbac|最小權限原則]]**
    - Goal: 能建立 ServiceAccount、Role、RoleBinding，用 `kubectl auth can-i` 測試權限
    - Sources:
      - [[sources/kubernetes/20260910/32-rbac-least-privilege.txt]]

16. **[[learn/kubernetes/nodes/gitops-argo-cd|GitOps 與 Argo CD]]**
    - Goal: 能安裝 Argo CD，建立 Application 資源同步 manifest 到集群
    - Sources:
      - [[sources/kubernetes/20260910/33-gitops-with-argo-cd.txt]]
      - [[sources/kubernetes/20260910/34-synchronizing-manifests.txt]]

17. **[[learn/kubernetes/nodes/sealed-secrets|密鑰管理]]**
    - Goal: 能用 `kubeseal` 加密 Secret，讓密鑰可以安全地存入 git
    - Sources:
      - [[sources/kubernetes/20260910/36-sealed-secrets.txt]]

### Tier 7 — 雲端遷移

18. **[[learn/kubernetes/nodes/eks-cluster|建立 EKS 集群]]**
    - Goal: 能用 `eksctl` 建立 EKS 集群，理解 managed control plane 的概念
    - Sources:
      - [[sources/kubernetes/20260910/35-create-a-cluster-on-eks.txt]]

19. **[[learn/kubernetes/nodes/eks-exploration|探索 EKS]]**
    - Goal: 能比較 Kind 和 EKS 的差異，理解 EC2 節點、managed add-ons
    - Sources:
      - [[sources/kubernetes/20260910/37-exploring-the-eks-cluster.txt]]

20. **[[learn/kubernetes/nodes/ebs-csi|雲端儲存]]**
    - Goal: 能安裝 EBS CSI driver，建立 GP3 StorageClass
    - Sources:
      - [[sources/kubernetes/20260910/38-cluster-storage-ebs-csi.txt]]

21. **[[learn/kubernetes/nodes/cloud-networking|雲端網路]]**
    - Goal: 能安裝 AWS Load Balancer Controller，用 Gateway 建立真實的 ALB
    - Sources:
      - [[sources/kubernetes/20260910/39-cloud-networking.txt]]

22. **[[learn/kubernetes/nodes/exposing-cluster|暴露服務到互聯網]]**
    - Goal: 能端到端測試：curl → ALB → Service → Pod → Database
    - Sources:
      - [[sources/kubernetes/20260910/40-exposing-the-cluster.txt]]

23. **[[learn/kubernetes/nodes/kustomize-overlays|環境疊加]]**
    - Goal: 能用 Kustomize overlay 管理 Kind 和 EKS 兩個環境的差異
    - Sources:
      - [[sources/kubernetes/20260910/41-environment-overlays-with-kustomize.txt]]

24. **[[learn/kubernetes/nodes/gitops-eks|GitOps on EKS]]**
    - Goal: 能在 EKS 上部署 Argo CD + Sealed Secrets，實現完整的 GitOps 工作流
    - Sources:
      - [[sources/kubernetes/20260910/42-gitops-on-eks.txt]]

### Tier 8 — 生產級操作

25. **[[learn/kubernetes/nodes/hpa-autoscaling|自動擴縮]]**
    - Goal: 能設定 HPA，理解 Metrics Server 的運作，用負載測試驗證自動擴縮
    - Sources:
      - [[sources/kubernetes/20260910/29-autoscaling-with-hpa.txt]]

26. **[[learn/kubernetes/nodes/observability|平台可觀測性]]**
    - Goal: 能用 `kubectl top`、events、rollout status 監控集群狀態
    - Sources:
      - [[sources/kubernetes/20260910/43-platform-observability.txt]]

27. **[[learn/kubernetes/nodes/teardown|資源清理]]**
    - Goal: 能按照正確順序刪除 EKS 資源，避免孤立資源
    - Sources:
      - [[sources/kubernetes/20260910/44-deleting-cloud-resources.txt]]

28. **[[learn/kubernetes/nodes/stable-review|穩定階段回顧]]**
    - Goal: 能複習從 POC 到 Stable 的所有改進，確認所有 POC sins 都已修復
    - Sources:
      - [[sources/kubernetes/20260910/28-stable-phase-review.txt]]

29. **[[learn/kubernetes/nodes/capstone-platform|建構完整平台]]**
    - Goal: 能從零開始建構一個完整的 K8s 平台（本地 + 雲端），包含所有生產級組件
    - Sources:
      - [[sources/kubernetes/20260910/fem-kubernetes-main/manifests/]]

30. **[[learn/kubernetes/nodes/capstone-review|完整回顧]]**
    - Goal: 能回顧從 Foundations 到 Production 的完整旅程，理解每個決策的原因
    - Sources:
      - [[sources/kubernetes/20260910/0-introduction.txt]]
      - [[sources/kubernetes/20260910/45-wrapping-up.txt]]

## Status

- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
