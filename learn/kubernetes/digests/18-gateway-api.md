---
source: sources/kubernetes/20261031/18-gateway-api.txt
source_type: text
source_lines: 212
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Ingress to Gateway API — the lesson explains that every ingress controller used to define its own route resources, so Kubernetes standardised routing: a Gateway and an HTTPRoute declare how traffic reaches the app, and any supporting controller works without learning vendor resources.
- Route is portable, controller is local — swap the controller freely because everything lives in Kubernetes manifests; the `GatewayClass` name is the one-line pointer that selects the implementation.
- Ingress NGINX retirement and NGINX Gateway Fabric — Ingress NGINX was retired in March, so the demo installs NGINX Gateway Fabric by `kubectl apply` against a literal URL from `stable.md`.
- Wiring the old NodePort — after applying CRDs and the NodePort deployment, `kubectl wait` confirms the two gateway Pods, then a patch sets the gateway proxy NodePort to 30080 and the container listener port to 80.

# L2 detail

- `#L1-L42` — Frames the shift: older Kubernetes relied on Ingress, where each controller shipped its own routing definitions; the Gateway API standardises route definition the way `kubectl get node` standardised nodes, so he teaches the forward-looking path rather than the deprecated one.
- `#L43-L94` — Explains the contract: the Gateway and HTTPRoute describe traffic reaching the app, "the route is the contract and the controller is local", the controller watches those objects and makes them real, the route is portable across environments, and `GatewayClass` is just the one line naming the implementation.
- `#L95-L122` — Announces Ingress NGINX is retired (as of March) and that courses still teaching it are setting learners up for failure; introduces NGINX Gateway Fabric, which should work out of the box because it relies on Gateway API rather than custom resources.
- `#L123-L156` — Copies the customisation files from the gateway API section of `stable.md` and applies them, pointing `kubectl` at a literal URL so it downloads and applies the YAML; the result is a set of custom resource definitions, which he then applies separately.
- `#L157-L186` — Applies the NodePort deployment, opens K9s to show two NGINX Gateway Pods running/completed, reads controller-runtime metrics and control-plane reconfiguration logs as a healthy start, and confirms readiness with a namespaced `kubectl wait` on the deployment.
- `#L187-L212` — Closes the loop on the NodePort 30080 seen at the start of the course: a `kubectl patch` updates the NGINX Gateway proxy spec so the NodePort becomes 30080 and the listener port in the container becomes 80, mapping gateway port 80 to 30080 for a full connection.
