---
source: sources/kubernetes/20261031/24-patching-the-control-plane.txt
source_type: text
source_lines: 251
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Control-plane scheduling patch — explains why NodePorts in Kind only open on the control-plane containers under OrbStack, and patches the NGINX Gateway Fabric proxy Deployment with a `nodeSelector` for the control-plane role plus a toleration for the `node-role.kubernetes.io/control-plane:NoSchedule` taint so the gateway can run there; flagged as specific to this Docker-in-Docker setup.
- Gateway API front door — walks through `kubectl apply -f` on the updated services, then a `Gateway` resource under `gateway.networking.k8s.io/v1` and an `HTTPRoute` that maps hostname `sample-app.local` and a path to the sample app's Service port via `backendRefs`.
- Traffic-path mental model — gateway/listener → HTTPRoute → Service → Deployment → Pod, contrasting the Service's IP-based (L4) balancing with the Ingress/gateway's L7 routing, and noting one port can host many hostname/route combinations. Ends with `kubectl get gateway`, a working health check, and a note that Sample App B would repeat deployment, Service, ConfigMap, Secret, HTTPRoute, and an optional gateway.
- Result — a local cluster with container, Ingress, and external access support ready to be treated as a reusable build recipe and liftable to a cloud setup.

# L2 detail

- `#L1-L28` — Opens with yesterday's Ingress failures: OrbStack traffic forwarding, Kind NodePorts only opening on manager/control-plane containers, and NGINX Gateway Fabric failing because it targets non-control-plane nodes; states the fix is patching the NGINX gateway proxy config.
- `#L29-L52` — Explains taints and tolerations in plain terms, the `control-plane` role node selector, and tolerating `NoSchedule`; notes the change is manual and only needed for this Docker-in-Docker lab, not a normal cloud deployment.
- `#L53-L101` — Gateway as a listener backed by NGINX Fabric; Kubernetes receives the request for a Gateway and hands it to the fabric service; runs the `cat`-piped service apply so ports are updated, checks the Service, then creates the `Gateway` resource and reads its `gateway.networking.k8s.io` apiVersion.
- `#L102-L155` — Creates the `HTTPRoute`, explains it as developer-facing ingress: hostname `sample-app.local` plus path routes to the sample app backend port; listener opens a port while many apps can share it via different hostnames and routes; `backendRefs` actually points at the Service even though it is named "backend".
- `#L156-L198` — Load-balancer analogy: the fabric service is a load balancer with no ports until a Gateway opens one; request path is user → gateway → HTTP route → Service → Deployment → Pod; Service does IP-level balancing while the Ingress/gateway does layer-seven balancing.
- `#L199-L251` — Verifies with `kubectl get gateway`, runs the health command successfully, and closes on the cluster being a repeatable local package: good enough for ephemeral web servers or an out-of-cluster database, portable to the cloud, and extensible to Sample App B with its own manifests and gateway route.
