---
source: sources/kubernetes/20261031/10-exposing-pods-with-services.txt
source_type: text
source_lines: 374
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Exposing pods with Services — after deploying Postgres and the sample app, the lesson runs `kubectl expose deployment postgres` to create a Service, then `kubectl get services` to show the ClusterIP. It explains why pod IPs rotate and ephemeral objects need stable names, what CoreDNS does for service discovery, why ClusterIP is unreachable from the host, and how Ingress, an in-cluster VPN, or a Cloudflare tunnel is what actually gets traffic in.

# L2 detail

- `#L1-L43` — Recap of creating and deleting clusters for CLI comfort; the imperative "slap on the hand" teaching approach; Kubernetes as both dev and ops; deployments with no connections are a black box.
- `#L44-L70` — `kubectl expose deployment postgres` prints "service postgres exposed"; ephemeral means temporary — everything except etcd content rotates, so new IPs and names appear constantly.
- `#L71-L120` — Pod / Deployment / Service triad recap: pod runs a container, deployment manages it, service exposes it; service solves pod IP rotation so the app finds Postgres by name.
- `#L121-L176` — CoreDNS as the service-discovery component that writes a record when a Service is created; `kubectl get services` shows virtual IPs; cluster network (10.96.x) is isolated from the host Wi-Fi (192.168.31.87).
- `#L177-L235` — How netfilter/virtual IPs bridge cluster and host only through Ingress; deploying a VPN container next to the services to reach the cluster network without an Ingress.
- `#L236-L291` — Cloudflare Tunnel for routing traffic in without exposing the public network; in-cluster VPN inherits DNS and container networking; Plex and private game servers as examples.
- `#L292-L325` — Tradeoffs of VPN vs Ingress vs nothing at all; self-hosting on a Raspberry Pi; configuration choice over cluster size.
- `#L326-L374` — Services raise Kubernetes from runtime to platform; ClusterIP is cut off from the outside world, external IP is empty; the real problem solved is app-to-Postgres discovery, not host-to-cluster access.
