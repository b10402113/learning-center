---
source: sources/kubernetes/20261031/40-exposing-the-cluster.txt
source_type: text
source_lines: 250
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Same manifests, new provider — applies the identical Gateway and HTTPRoute used on Kind, and the AWS Load Balancer Controller turns the Gateway into a real ALB with port 80, a rule, and a target group; an ALB is AWS's implementation of the Kubernetes interface.
- First failure — curl returns 500 because the application was never deployed; the fix is a sequence of `kubectl apply -f k8s/base` steps: ConfigMap with DB config, the CloudNativePG operator, then the Postgres cluster.
- Porting detail — the Postgres manifest's Kind-specific `storageClassName` must be removed because EKS only has gp2/gp3, otherwise the cluster hangs; the result is a 1Gi EBS PersistentVolume, a bound PVC, and the init container rebuilding the database.
- Routing fix — applying only the Deployment leaves the HTTPRoute reporting "Backend not found"; applying the Service flips it to resolved, and both the counter endpoint and the database work end to end.
- Closing frame — local Kind and cloud EKS now run the same stack side by side; typed CRDs plus Gateway + route equal a live ALB returning 200 OK.

# L2 detail

- `#L1-L40` — Reapplies the Gateway and HTTPRoute manifests unchanged, noting only small adjustments would be needed if applying the earlier files directly, and observes that a load balancer appears in the console.
- `#L41-L63` — Explains that the Gateway becomes an ALB with port 80, a rule, and a target group, because Kubernetes APIs are interfaces and the ALB is AWS's implementation of that interface.
- `#L64-L101` — Curling the Amazon URL fails with a 500 rather than a connection error, and the diagnosis is that the application was never deployed to the cluster.
- `#L102-L171` — Deploys the base manifests: the DB ConfigMap, then CloudNativePG so an operator appears, then the Postgres cluster with its Kind-specific storage class removed so it binds to gp2/gp3; shows a 1Gi EBS PersistentVolume, a bound PVC, and the init container initializing the database.
- `#L172-L202` — Applies the Deployment, then uses `kubectl describe` on the HTTPRoute to read "Backend not found"; applying the Service resolves the route, teaching that route and Service are separate objects.
- `#L203-L250` — Tests the counter endpoint and the database in the browser, traces the path ALB to Service to Deployment to pod, celebrates local and cloud parity, and closes with typed CRDs and "Gateway plus route equals a real ALB" returning 200 OK.
