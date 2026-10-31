---
source: sources/kubernetes/20261031/6-creating-deployments.txt
source_type: text
source_lines: 300
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Deployment as a wrapper — a deployment watches a pod for you ("cruise control": keep this many running), and the lesson creates one with `kubectl create deployment sample-app --image=...`, reusing the same image argument a bare pod needs.
- Reading two resources at once — `kubectl get deployments,pods` returns both kinds in one call, so you can check the deployment's `READY/UP-TO-DATE/AVAILABLE` columns and the pod's `STATUS` together.
- Self-healing demo — with `kubectl get pods -w` in a second tab, deleting the deployment-owned pod (the one with the hashed suffix) shows terminating → pending → container creating → running in milliseconds, with a new pod name and age.
- Loop caveats — after a power outage every pod restarts at once, and a saturated reconciliation loop can freeze/deadlock, so startup ordering and alerting matter.

# L2 detail

- `#L1-L34` — Pods were unit one; deployments are unit two. Why pod-vs-deployment confuses newcomers, framing it as domain-specific language learned over time rather than a personal failing.
- `#L35-L74` — Deployment definition: it watches the pod so it does not vanish like the earlier bare pod; cruise control for "keep N running". Runs `kubectl create deployment sample-app --image=...`, noting the argument set is shared because a deployment must know how to build its pod.
- `#L75-L124` — Hidden CLI trick: `kubectl get deployments,pods` queries multiple resource types at once. Reads deployment status (`1/1`, up-to-date, available, age) and explains the deployment as a "magical wrapper" whose extra behavior depends on its type.
- `#L125-L165` — Two-tab test: `kubectl get pods -w` streams every pod event in the namespace. Notices the deployment-created pod carries a long random suffix, unlike the manual `sample-app` pod, and asks the audience why.
- `#L166-L215` — Answer: the deployment owns the pod's lifecycle and needs a unique identity across restarts, so you own the deployment, not the pod. Deleting the pod triggers a millisecond-scale heal: terminating, then pending, container creating, running.
- `#L216-L250` — Plex-in-Kubernetes anecdote: a pod blowing past memory limits and crashing repeatedly still comes back because a deployment manages it. Confirms via `kubectl get pods` that the healed pod has a new age and ID and `1/1` ready.
- `#L251-L300` — Power-outage question: everything restarts simultaneously, which can look like a self-inflicted DDoS. Explains the reconciliation loop can freeze/deadlock when it cannot keep up, the enterprise-grade assumption behind it, and a 300-pod/6-node cluster where ~70 containers start at once unless startup is written to stagger.
