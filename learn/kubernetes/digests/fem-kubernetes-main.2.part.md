---
source: sources/kubernetes/20261031/fem-kubernetes-main
source_type: codebase
source_lines: 1577
language: markdown
file_count: 15
part: 2
status: skipped
skip_reason: "課程的書面大綱與講師手冊，內容與 46 篇逐字稿重複；節點一律以逐字稿為教材。"
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- `AGENDA.md` — the clock: Day 1 runs intro → Foundations → POC → lunch → Stable, Day 2 runs Production on kind → lunch → Sealed Secrets → EKS capstone → teardown → recap, 9:30-4:30 both days.
- `FOUNDATIONS.md` — segments 2-3 taught in full: the control loop via cruise control and a restaurant kitchen, then a live three-node `kind` build (`docker info`, `kind create cluster`, `get nodes`, kube-context) plus the "resource is a contract, controller is environmental" preview.
- `OUTLINE.md` — the master spine: 32 segments tagged Foundations / POC / Stable / Production / interlude, the binding design choices (CNPG over StatefulSet, full follow-along EKS, one cluster at a time, Kustomize bases vs overlays), branch map, pre-flight checklist, and a per-segment brief.
- `POC.md` — segments 4-6 in full: bare Pod → Deployment with visible self-healing → ClusterIP + NodePort wiring, then a recap that names six deliberately-wrong choices Stable will fix.
- `diagrams/` — nine Mermaid files; `day-shape` shows the two-day arc, `seg02-*` and `lego-*` the mental models and the nine-layer cluster comparison, `seg03-kind-vs-cloud` the local/cloud contrast.
- `themes/workshop.css` — presentation styling only: stage colour coding (Foundations purple, POC blue, Stable green, Production orange, interlude grey) as slide borders.

# L2 detail

- `#L1-L51` — docs/workshop/AGENDA.md — hour-by-hour timetable for both days with lunch and wrap-up slots; the timing backbone every guide's "Duration" line obeys.
- `#L52-L76` — docs/workshop/FOUNDATIONS.md — stage framing: workshop promise, the sample app's ride from bare Pod to GitOps-managed EKS, and POC → Stable → Production named before any YAML; scope guard (no Helm, no hand-written StatefulSet, no observability stack, no mesh, no custom operator, one cluster).
- `#L77-L128` — docs/workshop/FOUNDATIONS.md — Segment 2: cruise control (desired/actual/reconciliation, hill = disturbance = self-healing) then the kitchen (rail tickets, head chef = control plane, stations = worker nodes, dishes = containers, scheduling, reassignment); two mermaid models, zero syntax.
- `#L129-L273` — docs/workshop/FOUNDATIONS.md — Segment 3: `kind` as nodes-in-containers, kube-context as "which kitchen", kind-vs-EKS table of the same four parts, the live build script with representative output, three failure modes, and the Q&A on kind vs Minikube and what local clusters lack.
- `#L274-L306` — docs/workshop/OUTLINE.md — frontmatter and stage banner: POC = imperative/ephemeral, Stable = declarative/durable, Production = autoscaled/GitOps/EKS; the two-endpoint Node/TypeScript + Postgres sample app and its anti-scope-creep rule.
- `#L307-L340` — docs/workshop/OUTLINE.md — design choices part 1: CloudNativePG instead of a hand-written StatefulSet (concept budget, operator pattern), EKS as full follow-along with `eksctl` started early and a mandatory teardown segment, and one-cluster-at-a-time so Day 2 afternoon is a migration not a fleet.
- `#L341-L384` — docs/workshop/OUTLINE.md — design choices part 2: the secrets thread across all three stages (plaintext → `kubectl create secret` → CNPG-owned → `SealedSecret` per cluster), why segments 2-3 are tagged Foundations, Kustomize bases in Stable vs overlays in Production, two Gateway controllers by `GatewayClass`, and the branch map (`workshop` → `poc` → `stable` → `production`).
- `#L385-L416` — docs/workshop/OUTLINE.md — the in-document day-shape mermaid: Day 1 segments 1-15 on kind, Day 2 segments 16-32 with Production and the EKS capstone; the canonical picture of the stage progression with one cluster per day.
- `#L417-L477` — docs/workshop/OUTLINE.md — pre-flight checklist grouped by show-stoppers (container runtime, pinned kubectl, AWS IAM, public pinned image), sample app, kind, EKS/LBC versions, Argo CD, kubeseal, screenshare legibility, and failure-mode fallbacks.
- `#L478-L606` — docs/workshop/OUTLINE.md — Day 1 segment index 1-6: intro framing, the mental model, kind, bare Pod deleted for good, Deployment self-healing plus ephemeral Postgres, Services and the end-of-POC recap.
- `#L607-L684` — docs/workshop/OUTLINE.md — segments 7-15: lunch, the 45-minute imperative-to-declarative hinge, probes and resources, ConfigMaps/Secrets/namespaces, Gateway API, operators and CRDs, CNPG durability, Kustomize base, Day 1 close.
- `#L685-L746` — docs/workshop/OUTLINE.md — Day 2 segments 16-22: kickoff, HPA + metrics-server, rolling updates and `rollout undo`, PDBs and drains, RBAC least privilege, Argo CD, and the lunch where `eksctl create cluster` gets kicked off.
- `#L747-L841` — docs/workshop/OUTLINE.md — segments 23-32: Sealed Secrets as the background-provisioning window, EKS tour, EBS CSI and gp3, AWS Load Balancer Controller, eks overlay, GitOps on EKS, built-in observability, mandatory teardown, Production recap, and the wrap-up resource list.
- `#L842-L867` — docs/workshop/POC.md — POC framing: what the stage delivers, how to read the guide (representative output, fake secrets), and the stage-binding rules (imperative only, no volume for Postgres, password wrong on purpose).
- `#L868-L997` — docs/workshop/POC.md — Segment 4: Pod as the smallest scheduled unit, `run`/`get`/`describe`/`logs`/`exec` as the exploration verbs, the Events block as first debugging stop, then delete with nothing rescheduling it.
- `#L998-L1146` — docs/workshop/POC.md — Segment 5: Deployment owns a ReplicaSet whose hash shows in pod names; watch-and-delete self-healing, `scale` as one flag, Postgres as a second Deployment with no volume and a password passed via `set env`; CrashLoop and "wrong object" pitfalls.
- `#L1147-L1288` — docs/workshop/POC.md — Segment 6: Services as stable VIP + DNS over churning pod IPs, ClusterIP for Postgres, NodePort plus `port-forward` for the app, `/counter` climbing as proof of wiring, and a pod delete dropping the count back to 1.
- `#L1289-L1300` — docs/workshop/POC.md — end-of-POC recap: nothing in git, NodePort access, no probes, no limits, ephemeral database, exposed secret — the six-item debt list Stable pays off in order.
- `#L1301-L1321` — docs/workshop/diagrams/day-shape.mmd — two subgraphs, one per day, each stage as a single node in order; Foundations → POC → Stable, then Production → EKS.
- `#L1322-L1342` — docs/workshop/diagrams/lego-cloud-cluster.mmd — the nine-layer cloud stack (control plane, node group, VPC CNI, EBS CSI, ALB, CoreDNS, secrets, HPA, app+CNPG); DNS and app+DB are the thick-bordered anchors that never change.
- `#L1343-L1363` — docs/workshop/diagrams/lego-edge-cluster.mmd — same nine layers on a one-box ARM device: flannel, local-path, no external LB, autoscaling drawn dashed because it is absent.
- `#L1364-L1418` — docs/workshop/diagrams/lego-matrix-three-builds.mmd — the comparison grid: edge, self-hosted, cloud across all nine layers, cells marked D/P/A (different, portable, absent) — the single picture of what is a contract and what is environmental.
- `#L1419-L1439` — docs/workshop/diagrams/lego-selfhosted-cluster.mmd — the middle column of the matrix filled in: Calico/Cilium CNI, Ceph/Longhorn storage, MetalLB, etcd encryption you wire yourself, HPA only if you install metrics-server.
- `#L1440-L1449` — docs/workshop/diagrams/seg02-cruise-control-loop.mmd — the looping desired → actual → reconcile graph with the hill as an external disturbance arrow into reconciliation.
- `#L1450-L1460` — docs/workshop/diagrams/seg02-kitchen-control-loop.mmd — kitchen version: rail tickets → head chef → cook stations → dishes, with scheduling on the solid edge and reassignment on the dashed self-healing edge.
- `#L1461-L1470` — docs/workshop/diagrams/seg02-loop-defined.mmd — the analogy-free restatement (declare / is real / close the gap / drift) used once the vocabulary is established.
- `#L1471-L1492` — docs/workshop/diagrams/seg03-kind-vs-cloud.mmd — local vs cloud in four rows (control plane, workers, storage, Gateway+HTTPRoute) with dashed mapping arrows; the storage and front-door rows carry the contract-vs-controller lesson.
- `#L1493-L1512` — docs/workshop/diagrams/mermaid.json — dark/deck Mermaid theme: transparent backgrounds and clusters, white node/label text so diagrams sit on black slides.
- `#L1513-L1577` — docs/workshop/themes/workshop.css — Marp theme: black 28px slides, smaller code, and per-stage left border/divider colours so students always know which stage they are in.
