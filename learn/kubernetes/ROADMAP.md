---
subject: kubernetes
status: draft
path: course-order
created: 2026-10-31
---

# ROADMAP — kubernetes

## Goal

能把一個自己寫的服務（Node／TypeScript API + Postgres）從本機搬到叢集上跑，而且搬兩次：一次在 laptop 的 kind，一次在真的雲上（EKS），中間只改 overlay 的那幾行。判準不是「知道有哪些物件」，而是：給我一個壞掉的叢集，我能自己看出是哪一層斷掉（image、probe、Service selector、PVC、GatewayClass、IAM），說得出下一步要打哪個指令；最後能把整個環境拆乾淨、不留帳單。

## Learning path

**course-order** — 照課程自己的順序走：同一個 app 先在 laptop 上從裸 pod 玩到 POC，再重寫成 manifest 變成 Stable，最後搬到 EKS 變成 Production。

- 角度：guided tour。每個階段都先讓你看到「現在這樣會壞」，下一段才補機制；順序就是課程作者排的因果鏈。
- 最佳化：少走冤枉路。你不需要先決定要學哪些物件，照著做就會撞到每一個概念，而且撞到的時候就有對應的解法。
- 適合：第一次碰 Kubernetes、想有一個「跟著做完就有一整套」的人（也就是 MEMORY.md 描述的狀況）。
- 代價：不會一開始就看到全貌；tier 1 只有兩個節點，因為課程也是先花兩段把心智模型跟第一個叢集講完才開始動手。

四個 tier 對應課程自己的階段名：

- **Tier 1 — Foundations**：心智模型與第一個叢集（Segment 1–3）。
- **Tier 2 — Proof of Concept**：用指令把 app、Service、資料庫跑起來，然後看它壞（Segment 4–6）。
- **Tier 3 — Stable**：把指令換成 manifest，加 probe、設定、Gateway、operator、Kustomize（Segment 8–15）。
- **Tier 4 — Production**：容量、上線紀律、權限、GitOps，然後整個搬到 EKS 再拆掉（Segment 16–32）。

節點數 16：digest 的總行數是 13,176（46 篇逐字稿 12,431 + manifests 745），公式 baseline 是 12。這裡刻意多留一點，因為課程本身有 29 個 segment，16 個節點剛好是「每 2–3 集一個學習目標」，不會把不同階段的東西塞進同一篇。

## How to use

Read the nodes in order. Each node is a Markdown container whose `steps` array sets the teaching order. Run `/nodes <subject>/<node-id>` to confirm a node and write its steps.

## Nodes

### Tier 1 — Foundations：心智模型與第一個叢集

1. **[Why Kubernetes：心智模型](nodes/why-kubernetes.md)**
   - Goal: 說出這門課要做的三件事（POC、Stable、Production），並用 desired state 對 actual state 的 reconcile loop 解釋 Kubernetes 到底在做什麼。
2. **[第一個叢集：kind](nodes/your-first-cluster-with-kind.md)**
   - Goal: 用 `kind create cluster --config` 建出 1 control plane + 2 worker，並解釋為什麼 30080 這種對外端口必須在建叢集時就決定。

### Tier 2 — Proof of Concept：用指令跑起來

3. **[Pods 與 Deployments：會自我修復的工作負載](nodes/pods-and-deployments.md)**
   - Goal: 分辨裸 Pod 與 Deployment，看到刪掉 pod 之後幾毫秒內長回來，並能用 `scale` 與 `get pods -w` 觀察整個過程。
4. **[Services 與 Postgres Persistence](nodes/services-and-persistence.md)**
   - Goal: 用 Service 給會換 IP 的 Pod 一個穩定名字，並用「刪掉 Postgres pod 資料就歸零」證明沒有 PVC 就沒有持久化。

### Tier 3 — Stable：Manifest 化

5. **[從指令到宣告式](nodes/from-imperative-to-declarative.md)**
   - Goal: 把一個 imperative 指令變成進 git 的 manifest，說出 `create` 與 `apply` 的差別，以及為什麼 label/selector 是 Service 找到 Pod 的方式。
6. **[Health Checks、ConfigMap 與 Secret](nodes/health-checks-and-config.md)**
   - Goal: 用 readiness／liveness／startup 回答「這個 Pod 現在該不該收流量」，並把設定與密碼從 image 裡拆到 ConfigMap 與 Secret。
7. **[Gateway API](nodes/gateway-api.md)**
   - Goal: 用 Gateway + HTTPRoute 開一扇對外的門，並解釋「route 是契約，controller 是環境」。
8. **[從零重建 Stable 叢集](nodes/rebuilding-cluster-from-scratch.md)**
   - Goal: 不靠任何舊資源，只用 manifest 把 namespace、設定、probe、Gateway 重建一次，並在重建過程中看懂每個欄位為什麼在那裡。
9. **[Durable Postgres 與 Kustomize](nodes/durable-postgres-and-kustomize.md)**
   - Goal: 用 CloudNativePG 的 `Cluster` 換掉臨時 Postgres 並證明資料會活下來，再用 Kustomize 把 manifest 收成一個 base，清算 Stable 還缺什麼。

### Tier 4 — Production：EKS 與 GitOps

10. **[HPA 自動擴縮與安全上線](nodes/autoscaling-and-safe-rollouts.md)**
    - Goal: 用 CPU target 驅動 replica 數量，並用 readiness 當護欄做出「壞掉的版本進不了流量」的 rolling update 與 rollback。
11. **[PodDisruptionBudgets、Node Drains 與 RBAC](nodes/disruption-and-least-privilege.md)**
    - Goal: 在主動維護（drain）時保住可用 replica 的下限，並把 Pod 的權限收斂到「只能讀自己 namespace 的 ConfigMap」。
12. **[用 Argo CD 做 GitOps](nodes/gitops-with-argo-cd.md)**
    - Goal: 讓 git 成為 desired state，用 Argo CD 的 Application 自動 sync 與 self-heal，並說出「部署」變成「同步」之後差在哪。
13. **[Going to the Cloud：EKS 叢集與 Sealed Secrets](nodes/eks-and-sealed-secrets.md)**
    - Goal: 用 eksctl 建出受管叢集、切 context 進去，並用 SealedSecret 讓密碼可以安全進 git。
14. **[Cluster Storage、Cloud Networking 與 Exposing](nodes/cloud-storage-and-networking.md)**
    - Goal: 把本機的 local-path 換成 gp3 EBS，把 NGINX Gateway 換成 AWS Load Balancer Controller，讓同一份 Gateway/HTTPRoute 變成真的 ALB。
15. **[Environment Overlays 與 EKS 上的 GitOps](nodes/environment-overlays.md)**
    - Goal: 用 overlays 讓同一份 base 同時服務 kind 與 EKS，只改 class、replica、hostname，並讓 EKS 上的 Argo CD 同步自己的 overlay。
16. **[Observability、Tearing It Down 與 Wrap-Up](nodes/observability-and-teardown.md)**
    - Goal: 先用 `kubectl top`/`events` 這種內建訊號看平台，再照順序拆掉 Argo CD、Gateway、cluster，並確認沒有孤兒資源繼續計費。

## Skipped digests

- `fem-kubernetes-main.2.part.md` — 課程的書面大綱、agenda 與講師手冊；內容與 46 篇逐字稿重複，節點一律以逐字稿為教材。
- `fem-kubernetes-main.3.part.md` — Stable／Production 講師手冊是同一批 segment 的書面版；逐字稿才是學習者會看的聲音來源。
- `fem-kubernetes-main.4.part.md` — 投影片是課程的視覺摘要，不提供逐字稿以外的內容。

## Status

- [x] Roadmap confirmed
- [ ] Node step lists written
- [ ] Articles written
