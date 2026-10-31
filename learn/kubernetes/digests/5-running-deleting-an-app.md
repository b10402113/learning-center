---
source: sources/kubernetes/20261031/5-running-deleting-an-app.txt
source_type: text
source_lines: 462
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Pod as the smallest unit — a pod is an abstraction around one or more containers, not a synonym for "one container"; `kubectl get pods --all-namespaces` shows `READY 1/1`, and the lesson reads the `kubectl get pods` columns compared with Docker.
- Imperative CLI vs manifests — runs `kubectl run sample-app --image=... --port=8080`, explains that kubectl turns the command into a manifest and posts it to the API, and frames `kubectl run` as an exploration/debugging tool rather than a deployment method.
- Ports, namespaces, RBAC — the pod listens on 8080 while the cluster exposes 30080, so the pod is unreachable until networking is wired up; namespaces give organization only (no network, security, or scheduling isolation), and RBAC is off by default.
- Delete lifecycle — runs `kubectl delete pod sample-app`, notes the multi-second drain/graceful shutdown, and shows the pod vanishing because nothing controls it.

# L2 detail

- `#L1-L45` — Why Kubernetes calls the unit a "pod"; pod as the smallest deployable abstraction around containers, `kubectl get nodes`, and `kubectl get pods --all-namespaces` with the `READY 1/1` column.
- `#L46-L80` — One container per pod is not enforced; running several containers means creating several pods. Introduces the demo `kubectl run sample-app` with image and port arguments, and that everything doable in a manifest is doable from the CLI.
- `#L81-L130` — How the CLI actually works: kubectl converts arguments into a manifest and submits it, so imperative and declarative paths end in the same API call. Why the imperative path is worth knowing (fast debugging shells) and why it is not for deployments.
- `#L131-L165` — Demo: create the pod, `kubectl get pods` without `--all-namespaces`, and the resulting name/ready/status/restarts/age columns. Frames kubectl as an exploration tool you can jump off from at any point.
- `#L166-L215` — Port confusion: `kubectl get pods` looks Docker-like, but the pod's `--port=8080` does not map to the cluster's exposed 30080. The pod runs in a void ("Schrödinger's cat") — no communication path and no readiness check, so `ready` may not mean the app works.
- `#L216-L277` — Audience question on namespaces: contrast with `kube-system` and `default`; namespaces are organization only, with no networking, security, or scheduling isolation out of the box, and matter more once a service mesh or RBAC is layered on.
- `#L278-L340` — Home-lab side-project discussion (Plex/Jellyfin, running Plex in a deployment): when Kubernetes beats Docker Compose for fun hosting, and the rule that `kubectl` is for exploring, not operating — `kubectl run` is not how you deploy.
- `#L341-L401` — `kubectl delete pod sample-app` and the RBAC aside: namespaces plus RBAC could block the delete, but RBAC is not enabled by default. The delete hangs roughly 10 seconds following the pod lifecycle and confirms only after the pod is truly gone.
- `#L402-L462` — Recreate/get/delete loop again, with `get pods` refreshes while draining; a pod with no controller disappears entirely, so it cannot self-heal — the reason pods are the lowest unit and a poor fit for development or always-on workloads.
