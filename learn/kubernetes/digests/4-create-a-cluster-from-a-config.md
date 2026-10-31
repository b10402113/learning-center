---
source: sources/kubernetes/20261031/4-create-a-cluster-from-a-config.txt
source_type: text
source_lines: 273
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Creating a cluster from a config — runs `kind create cluster --config config/day-one-kind.yaml` from the repo root to build a planned cluster with one control plane and two workers instead of the default single-node setup.
- Why cluster-level config matters — Ingress needs a single exposed host port (30080) decided at creation time, because a brand-new cluster is completely closed and pods are unreachable without port-forwarding or many ad-hoc ports; one hole plus path/host-based routing standardizes how traffic enters.
- Verifying the result — `kubectl get nodes` shows the control plane and two workers (nodes as containers), and `kubectl get namespaces` shows what comes out of the box; the lesson also recommends Talos Linux for real bare-metal/home Kubernetes.

# L2 detail

- `#L1-L54` — Home-lab context: he runs Kubernetes at home with Talos Linux, an open-source project for managing bare-metal Kubernetes, recommended as the next step after Kind for learning where provisioning actually starts; then runs `kind create cluster --config Manifest day one Kind cluster`, noting he invokes it through `vorl run` and that it should be run from the repo root.
- `#L55-L102` — Why the course spends time on cluster configuration: managing Kubernetes includes deciding cluster settings, and a manifest is applied so the cluster knows where it is being provisioned (Amazon or Kind) before it creates nodes; skip this only if you just want a pod, otherwise you will hit a limitation and get frustrated.
- `#L103-L133` — The second and bigger reason for a custom config: pod access. Naively opening many ports turns Kubernetes into "just Docker"; the standardized way in is Ingress, which uses one exposed port for all traffic.
- `#L134-L203` — Spoiler of the design: give the whole cluster one literal hole on the host (port 30080) that the outside world can reach; a brand-new cluster is closed by default and you cannot access pods; Ingress routes everything through that single port and disambiguates pods by path (/api, /web, /v1, /v2) or host name, mapping a container's port 80 without opening it; poking the hole without using it is also a valid state — it is one piece of a larger assembly.
- `#L204-L254` — Creates the cluster as "one chef and two stations" — one control plane node plus two workers — and Kind sets the kubeconfig context; notes Kind runs each node as a container and all commands should run from the repo root; demo `kubectl get nodes` (virtualized multi-node on a laptop) and `kubectl get namespaces`.
- `#L255-L273` — Closes by emphasizing how much orchestration you get out of the box, and that this works only because Kubernetes knows where it runs: on Kind a node becomes a container, on Amazon a node becomes an EC2 instance, so the same abstraction scales from tiny to huge.
