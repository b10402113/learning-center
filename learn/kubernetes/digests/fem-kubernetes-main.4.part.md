---
source: sources/kubernetes/20261031/fem-kubernetes-main
source_type: codebase
source_lines: 1641
language: markdown
file_count: 2
part: 4
status: skipped
skip_reason: "投影片是課程的視覺摘要，不提供逐字稿以外的內容。"
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- slides.md — a two-day Marp workshop deck (Erik Reinert / "Blackglasses") that teaches Kubernetes by climbing one app through three maturity stages: POC (bare Pod on `kind`), Stable (declarative manifests, probes, Gateway, CNPG Postgres), Production (HPA, safe rollouts, PDB, RBAC, Argo CD, Sealed Secrets, EKS). The spine is a single mental model — desired state, actual state, reconciliation, forever — reintroduced in every segment as the same loop. The deck runs imperative-first (so the reader feels the absence of a controller) then converts each sin into a declarative fix, and finally repeats the "route is the contract, controller is environmental" idea across storage, networking, and overlays on EKS.
- themes/workshop.css — a light Marp theme (black background, 28px body, 48/34px headings, 22px code) that color-codes stage dividers: foundations purple, POC blue, stable green, production orange, interlude grey, with a matching 12px left border on content slides.

# L2 detail

- `#L1-L57` — slides.md — deck title and teacher introduction: Erik Reinert's background, work history, social links, and prior DevOps/cloud courses.
- `#L58-L81` — slides.md — course introduction: one app (Bun/TypeScript API + Postgres), two days, three scenarios (POC / Stable / Production), and the day-shape diagram.
- `#L82-L120` — slides.md — Kubernetes mental model: the reconciliation loop defined plainly, then two analogies (cruise control, kitchen line) — desired state, actual state, self-healing.
- `#L121-L190` — slides.md — your first cluster: Kubernetes as a portable standard rather than a place, `kind` cluster config with one control-plane and two workers, port 30080 mapping, cluster creation, node check.
- `#L191-L234` — slides.md — running an app: `kubectl run` a bare Pod, delete it, and watch nothing recreate it — the lesson that bare Pods have no controller.
- `#L235-L291` — slides.md — Deployments and self-healing: Deployment holds N replicas, deleted Pods are replaced, scaling is one flag, Postgres added deliberately without a volume.
- `#L292-L354` — slides.md — Services and wiring: a stable name instead of rotating Pod IPs, the plaintext-password anti-pattern named out loud, NodePort + port-forward probe, counter reset proving ephemerality, POC recap.
- `#L355-L469` — slides.md — imperative to declarative: what a manifest is, the four universal fields, the full `deployment.yaml`, `diff` + `apply` idempotence, labels/selectors as the actual wiring.
- `#L470-L513` — slides.md — health checks and resource management: readiness vs liveness vs startup, requests vs limits, breaking `/healthz` on purpose and reading the kubelet events that explain the restart.
- `#L514-L552` — slides.md — ConfigMaps, Secrets, and Namespaces: sensitivity split, creating the `app` namespace, and proof that Secret values are base64-encoded, not encrypted.
- `#L553-L630` — slides.md — Gateway API: Gateway + HTTPRoute as portable contract, installing NGINX Gateway Fabric in three pinned steps, pinning the data plane to the mapped host port, and the resulting `localhost:30080` curl.
- `#L631-L661` — slides.md — Operators and CRDs: a CRD adds a kind to the API server, an operator is the loop reconciling it; install CloudNativePG and observe the kind exists with zero instances.
- `#L662-L724` — slides.md — durable Postgres with CloudNativePG: declaring a `Cluster` yields StatefulSet-grade management plus failover/backups and operator-generated credentials; deleting the Pod proves the PVC outlives it and the counter continues.
- `#L725-L798` — slides.md — organizing with Kustomize: a base `kustomization.yaml` applied with `apply -k`, the Stable recap of every fixed POC sin, what is still wrong, and the Day-1 half-way marker.
- `#L799-L816` — slides.md — interlude before Production: where Day 1 left off and what the finished app will do (autoscale, roll safely, RBAC-scoped, git-driven on EKS).
- `#L817-L867` — slides.md — autoscaling with HPA: metrics-server first (including the `kind`-only insecure-TLS concession), CPU-percent target measured against requests, load generator, replicas climbing then settling.
- `#L868-L913` — slides.md — safe rollouts and rollbacks: maxSurge/maxUnavailable, readiness as the interlock, a bad image stalling the rollout while old Pods keep serving, `rollout undo` to the last good ReplicaSet.
- `#L914-L964` — slides.md — PodDisruptionBudgets and node drains: voluntary vs involuntary disruption, min-available budget, `drain` cordoning and evicting politely, CNPG's single-instance PDB forcing the drain onto the other worker.
- `#L965-L1011` — slides.md — RBAC and least privilege: ServiceAccount, Role, RoleBinding, disabling token automount, then `auth can-i` proving the blast radius is exactly that Role.
- `#L1012-L1065` — slides.md — GitOps with Argo CD: git as desired state, selfHeal, one Argo CD per cluster, the `--server-side` reason for oversized CRDs, and a hand-edit drift demo reverted by the loop.
- `#L1066-L1133` — slides.md — GitOps secrets with Sealed Secrets: starting EKS provisioning in the background, installing the controller on `kind`, sealing a throwaway Secret, and committing only ciphertext.
- `#L1134-L1176` — slides.md — going to the cloud: what EKS manages vs what you own, migrating rather than federating, switching context, and naming the gaps (no local-path, no Gateway controller, no Sealed Secrets).
- `#L1177-L1227` — slides.md — cluster storage and the EBS CSI driver: PVC as stable contract vs environmental provisioner, driver as a managed add-on, a gp3 StorageClass with `WaitForFirstConsumer`, unchanged CNPG manifest binding to real EBS.
- `#L1228-L1303` — slides.md — cloud networking and the AWS Load Balancer Controller: IAM policy + IRSA, cert-manager, Gateway API CRDs, type-safe `LoadBalancerConfiguration` replacing Ingress annotations, same Gateway/HTTPRoute becoming a real ALB via `gatewayClassName: alb`.
- `#L1304-L1352` — slides.md — environment overlays with Kustomize: two overlays patching an untouched base, the eks overlay's patches list, and a `kubectl kustomize` diff showing the handful of lines that are the entire kind-to-cloud delta.
- `#L1353-L1405` — slides.md — GitOps on EKS: a second Argo CD because keys are per-cluster, sealing the EKS copy via stdin pipe, and an Application pointing at the eks overlay rather than the base.
- `#L1406-L1447` — slides.md — built-in and platform observability: `kubectl top`, events as the cluster's narration, `rollout status`, CloudWatch Container Insights, and the deliberate stop before a Prometheus/Grafana/Loki stack.
- `#L1448-L1509` — slides.md — tearing it down: what bills hourly, orphan sources, ordering (stop Argo CD, delete the Gateway so the LBC deprovisions the ALB, scale the controller to zero, then `eksctl delete cluster`), tag-based orphan verification, and final `get cluster` proof.
- `#L1510-L1541` — slides.md — end of Production recap: hardening (HPA, safe rollouts, drain survival, least privilege) plus cloud-native/git-driven work (GitOps, sealed secrets, EKS migration), and the theme paid off end to end.
- `#L1542-L1576` — slides.md — wrap-up: the full day-shape redrawn, further reading (Kubernetes, CloudNativePG, Argo CD, Sealed Secrets docs, stage branches), thanks, and author links.
- `#L1577-L1641` — themes/workshop.css — Marp theme: imported default, black background, type scale for headings/body/code, and per-stage divider and left-border colors (foundations, poc, stable, production, interlude).
