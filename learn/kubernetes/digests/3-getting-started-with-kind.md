---
source: sources/kubernetes/20261031/3-getting-started-with-kind.txt
source_type: text
source_lines: 460
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Installing and driving Kind — install from kind.sigs.k8s.io quickstart (Homebrew/Chocolatey), then run `kind get clusters`, `kind create cluster --name k8s-2`, and `kind delete cluster`; Kind auto-detects Docker, Podman, or nerdctl.
- First kubectl contact — `kubectl get pods` returns "No resources found in the default namespace" while `kubectl get pods -A` reveals the kube-system namespace running CoreDNS, etcd, kindnet, kube-apiserver, controller-manager, proxy, scheduler, and local-path storage.
- Cluster shape and limits — a default Kind cluster is too plain (no way to expose pods without port-forwarding/Ingress), so the lesson inspects a Kind cluster config manifest that declares 3 nodes (one control plane, two workers) existing as containers inside a container; it also covers quorum, Minikube, and why not to run a full dev environment on laptop Kubernetes.

# L2 detail

- `#L1-L51` — Install Kind from kind.sigs.k8s.io via the Quickstart page, source, or package managers (Homebrew, Chocolatey); explains why his commands appear as `vorl run kind ...` — his Vorl-based dev shell only exposes tools on demand, and it is equivalent to running `kind` directly.
- `#L52-L75` — The Kind CLI surface: build, completion, create, export, get, help, version; points to the docs section on creating a cluster and notes Kind auto-detects Docker, Podman, or nerdctl so any container runtime works.
- `#L76-L111` — Demo: `kind get clusters` (he already has one, a fresh machine shows none), `kind create cluster --name k8s-2` builds the whole cluster and writes kubeconfig so it is usable immediately; `kubectl get pods` answers "No resources found in the default namespace" — proof the API server responds even with nothing deployed.
- `#L112-L151` — `kubectl get pods -A` exposes the kube-system namespace and the control-plane processes Kind starts inside Docker: CoreDNS, etcd, kindnet networking, kube-apiserver, controller, proxy, scheduler, and local-path provisioning for local storage; by default Kubernetes hides system pods.
- `#L152-L187` — Why the out-of-the-box cluster is insufficient: cluster-level decisions must be made at initialization or you restart; on a laptop the only way to expose pods is port forwarding, which is painful, so the course needs a real solution in the form of Ingress.
- `#L188-L235` — Kind's trick of expressing cluster config as a Kubernetes manifest with a Kind-specific API version; walks through a config that creates 3 nodes and asks the audience to identify the roles (one control plane, two workers) — Kubernetes only sees nodes, Kind abstracts them into containers.
- `#L236-L285` — Nodes-inside-a-container model: Kind runs its own image in Docker and the 3 nodes are containers within it, yet Kubernetes does not care what responds; you can run multi-node deployments on a single host, and Minikube solves the same problem differently.
- `#L286-L341` — Q&A: control plane is the supervisor and workers are the employees; reconciliation happens in the control plane while workers are isolated places for work; 3 nodes are not mandatory — you can run 1, 2, or 3, and running workloads on the control plane means system failure takes workloads with it.
- `#L342-L371` — Explains quorum (needing at least 3 for consensus) and why 3 nodes is a production argument, not a laptop requirement; reiterates that Kind simply turns whatever node configuration it is given into containers.
- `#L372-L408` — Demo cleanup: `kind get clusters` again then `kind delete cluster` for k8s-2; the ease of create/delete makes local Kubernetes the right beginner entry point, and starting on Google or Amazon is compared to learning to build cars on a Ferrari — it is just APIs at the end of the day.
- `#L409-L460` — Argues against running a full dev environment on laptop Kubernetes: at his workplace 300+ services across tiers make it unrealistic, and the burden is knowledge (restarting pods, pushing changes) rather than resources; Kubernetes is not meant to be used like Docker, so let developers ship and let ops own the cluster.
