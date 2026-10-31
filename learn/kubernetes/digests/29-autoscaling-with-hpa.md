---
source: sources/kubernetes/20261031/29-autoscaling-with-hpa.txt
source_type: text
source_lines: 356
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Horizontal Pod Autoscaler — the lesson frames HPA as the control loop applied to capacity: you declare a CPU target and HPA changes the replica count to hit it. It installs metrics-server (the cluster ships no metrics by default), patches it for kubelet insecure TLS, then runs `kubectl autoscale` to create an HPA, inspects it in K9s, and drives load with a BusyBox pod running `while true` against the Service so the CPU target of 50% is breached and replicas climb from 1 to 2 to 3 and back down after the load stops.
- Honest caveat — the demo runs on a laptop inside Docker, so scaling spreads across local cores rather than physical hosts; the lesson also notes HPA out of the box only scales on CPU and that memory, queue size, or request count need other metrics.

# L2 detail

- `#L1-L31` — Recap of where the course left off: manifests declarative in a customized base, probes, resource bounds, gateway frontend, durable database with operator-generated credentials, all local. States the goal app: identical locally but autoscaling, safely rolling out with rollback, RBAC-scoped, secrets-safe, Git-driven via Argo CD, running on EKS. Introduces HPA.
- `#L32-L74` — HPA as a control loop over capacity: it only changes the `scale` value based on a metric you care about. Explains that Kubernetes ships no metrics-server because not everyone wants metrics, that installing it exposes per-pod CPU/RAM so scaling is possible, and that the percentage target is measured against the CPU `requests` set earlier (e.g. one core) rather than limits.
- `#L75-L134` — Installing metrics-server: applies it from a URL, then discusses why URL installs are risky (man-in-the-middle injection of a pod, upstream breakage, `latest` changing) and recommends downloading and committing every manifest into the repo so the cluster can be rebuilt from one apply. Applies the guide's patch so metrics-server talks to kubelet over insecure TLS, since no client certificates are in play yet.
- `#L135-L196` — `kubectl autoscale` as a command whose name differs from the resource it creates (like `kubectl expose` producing a Service); it yields a HorizontalPodAutoscaler. Uses `:hpa` in K9s to show the created object and reads its fields: namespace, name, scale target reference, current vs target percentage (7% of 50%), min/max pods, and current replicas. Reiterates that every Kubernetes operation lands on a manifest.
- `#L197-L242` — Prepping the live demo: notes the autoscaler runs in a local Docker container, fetches the HPA with `kubectl get hpa`, and opens two terminal tabs so the metric target and the HPA response can be watched side by side.
- `#L243-L279` — Generating load with the guide's BusyBox pod, which runs `while true` in a loop hitting the Service from inside the cluster (a deliberate DDoS-by-bash). CPU jumps to 71% against the 50% target, and the HPA adds replicas (1 → 2 → 3) to bring the average back down.
- `#L280-L321` — Why the local demo is limited: scaling on one laptop spreads a process across local cores rather than multiple physical hosts, and more pressure would eventually freeze the machine. Stopping the load drops the registered usage under 50%, and the HPA scales back down toward one replica.
- `#L322-L356` — Wrap-up: autoscaling used to be a hard problem and the original Google demo of thousands of VMs from one request impressed people. HPA can scale on any metric (queue size, request count) but only CPU is supported out of the box.
