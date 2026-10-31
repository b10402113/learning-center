---
source: sources/kubernetes/20261031/23-configuring-the-gateway-api.txt
source_type: text
source_lines: 312
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Gateway API concepts before touching YAML — Gateway API as the emerging standard that plugs an existing proxy into Kubernetes; a Gateway owns listeners (any port, TCP/UDP), an HTTPRoute does HTTP path routing (`/`, `/api`, `/v1`) to services; "route is the contract, controller is per-environment."
- Installing NGINX Gateway Fabric by applying three remote manifests with `kubectl apply -f <url>`, watching the pods come up (including a `Completed` init pod), and using `kubectl wait` for the deployment condition.
- Controllers, operators and Helm as context — what a controller really is inside the cluster, criticism of Helm as an abstraction layer with an export-the-raw-manifests workaround, operators as the same idea for custom resources, Argo CD mentioned, and apply-plus-wait as a CI deployment pattern.

# L2 detail

- `#L1-L30` — Gateway API is new but becoming the standard: Kubernetes sits on top of existing open source projects for traffic and routing, and NodePort's forwarded host port does not scale to routing millions of requests across services.
- `#L31-L70` — the model: route is the contract and portable, controller is local and provider-specific; a Gateway creates listeners on any port and protocol, an HTTPRoute maps paths to services; Amazon, Azure and self-hosted each supply their own controller.
- `#L71-L124` — installing the controller: what a controller is (an API inside Kubernetes that controls resources, requests or events), the Helm detour (a CLI templating layer that creates its own resources on top), and the preferred practice of exporting raw manifests and applying them directly.
- `#L125-L180` — Helm as a plain template engine once exported, large installs becoming one huge manifest, the operator pattern that keeps a resource looking a certain way, the thought experiment of a custom controller for your own app, and the Argo CD mention.
- `#L181-L215` — applying the three Gateway Fabric manifests straight from URLs with `kubectl apply`, pods lighting up, and the `Completed` pod explained: a short-lived init pod that ran its command and cleaned itself up.
- `#L216-L263` — why completed pods still count against host resources, the optional cleanup, and the important consequence that pod logs disappear with the pod, which is why clusters ship logs elsewhere.
- `#L264-L312` — running the guide's condition check and `kubectl wait` to block until a deployment is available, why CI must deploy by `apply` on git-stored manifests, and how a sequence of wait commands can pause a pipeline or bootstrap a cluster.
