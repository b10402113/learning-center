---
source: sources/kubernetes/20261031/28-stable-phase-review.txt
source_type: text
source_lines: 168
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- What got fixed — every manually created resource is now a declarative manifest organized as a Kustomize base and reusable for other apps; it ships readiness, liveness, and startup probes, resource requests and limits (e.g. 0.5 CPU / 256Mi request up to 1 CPU / 2Gi limit), a real Ingress with a domain and route, and durable CloudNativePG Postgres whose data survives restarts.
- What is still wrong — it runs on exactly one local Kind cluster on a laptop; scaling is manual; there is no safe rollout or rollback discipline; the default service account is over-permissioned; and there is no story for provisioning or removing nodes.
- Halfway framing — foundations → proof of concept → stable, all local; the cluster can already run containers, databases, and external traffic, so it is a legitimate platform to build on.
- Next step — production hardening and Amazon EKS: more local work on configuration and manifests, then a managed cluster where you neither create nor manage nodes, closing the left-hand local column of the course diagram and moving to the right-hand cloud column.

# L2 detail

- `#L1-L51` — Recap of the stable state: declarative manifests replacing imperative commands, Kustomize base for reuse, probes out of the box, resource requests versus limits explained, an Ingress front door, and durable Postgres data surviving restarts.
- `#L52-L77` — Remaining gaps enumerated: single local cluster, manual scaling, no rollout or rollback discipline, an over-permissioned default service account that could harm the cluster, and no node provisioning or removal story.
- `#L78-L106` — Places the learner at the halfway mark: foundations and proof of concept are done, local cluster already has volumes, Ingress, and container support; the arc runs imperative proof of concept → declarative stable Kind cluster → production on EKS.
- `#L107-L168` — Says the cluster is ready for development on top of, notes more local Kind work on configuration and manifests before cloud, and closes on the diagram's left local column being complete while production hardening and the EKS cluster occupy the right.
