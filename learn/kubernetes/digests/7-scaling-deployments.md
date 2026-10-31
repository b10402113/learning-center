---
source: sources/kubernetes/20261031/7-scaling-deployments.txt
source_type: text
source_lines: 298
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- What a node is — nodes are only "where workloads are allocated"; they can be bare metal, EC2-style VMs, or containers, because a node identifies itself by the node API running there, and that API reports its own RAM and CPU limits.
- Kubernetes as a plain orchestrator — the runtime under it is swappable: containers, VMs via KubeVirt, even functions; the cluster is just a set of APIs talking to each other, and custom APIs or extra node APIs can be added.
- Scaling a deployment — `kubectl scale deployment sample-app --replicas 3` while `kubectl get pods -w` runs, showing pending → container creating → running, and scaling back down showing terminating pods and a harmless exit error.
- Placement and K9s — pods spread across nodes as best Kubernetes can, but there is no rebalancing (it would break deployments); K9s is shown as a TUI over the same kubectl commands.

# L2 detail

- `#L1-L52` — Nodes as the "where do things run" descriptor. Nodes may be bare metal, Amazon EC2 instances, or even containers with a mounted container runtime, and Kubernetes accepts any of them as a node.
- `#L53-L100` — How a node reports itself: it deploys node APIs that answer "how much RAM/CPU do I have" and admit it cannot schedule more. Even a container posing as a node only sees its own 2-core/4GB limits. Kubernetes does not care about the technology beneath it.
- `#L101-L155` — Orchestration beyond containers: KubeVirt runs VMs in the same resource pool as containers, volumes can move between them, and custom APIs can be added at cluster creation. The hypothetical of running nine worker APIs on one node to appear as nine nodes.
- `#L156-L215` — Scaling intro with a `README`/Docker Compose comparison. Runs `kubectl scale deployment sample-app --replicas 3` with pods watched in another tab; observes the new pods go pending, created, then running, and scale-down starting terminations.
- `#L216-L260` — Second scale-up/scale-down round, faster this time; the `error` on terminating pods is just a failed container exit and can be ignored. Introduces K9s, a terminal UI that runs the same kubectl commands behind a nicer interface, with `:nodes` and `:pods` views.
- `#L261-L298` — Pod distribution: two pods on kind-worker, one on kind-worker-2, showing best-effort spreading. Explains that Kubernetes has no rebalancing because moving pods means restarting them and breaking deployments; rebalancing requires rolling updates or other tooling.
