---
source: sources/kubernetes/20261031/19-rebuilding-cluster-with-api-gateway.txt
source_type: text
source_lines: 598
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Rebuild the POC cluster with CLI only — deletes and recreates the kind cluster, then walks the whole ad hoc build again in `POC.md`: `kubectl run`, `describe`, `logs`, `exec -it`, deployment create, `kubectl scale`, `expose deployment` for Postgres, a NodePort service plus `kubectl port-forward` for the app, and a curl test through both services.
- Debugging commands and their limits — `describe` (spec, container ID, last events), `get -w`, piping multiple resource types, pod name suffixes as a sign of a managing controller, terminating/hung pods eating cluster capacity.
- Why CLI-only work stays in the POC phase — deleting the Postgres pod recreates it empty, so the counter resets; no persistent volume means no data beyond the pod lifecycle, which is what the move to manifests in the stable phase fixes.

# L2 detail

- `#L1-L21` — `kind delete cluster`, `kind create cluster`, `kubectl get nodes` showing three nodes, and K9s showing only the minimal `kube-system` (CoreDNS and friends) on a bare cluster.
- `#L22-L73` — switching from `foundations.md` to `POC.md`; running an ad hoc pod, deleting it manually, and using `kubectl describe` to read spec, image, container ID and the Events section when a pod fails.
- `#L74-L129` — `kubectl logs` on the sample app ("listening on 8080"), then `kubectl exec -it` into the pod (lands in the Orbstack environment) to curl the app internally and catch containers that only listen on localhost.
- `#L130-L172` — deleting the unmanaged pod makes it vanish with nothing to recreate it; creating a deployment instead, the random `sample-app-xxxxx` suffix that signals a managing resource, and `kubectl get deployments` alongside pods.
- `#L173-L211` — fetching several resource types in one `kubectl get`, and `kubectl get -w` showing the full event flow when a deployment-managed pod is deleted: Terminating, Pending, ContainerCreating, Running.
- `#L212-L286` — `kubectl scale deployment sample-app --replicas 3` (then 10), pods piling into Pending at extreme counts, round-robin request distribution across replicas, and scaling back down.
- `#L287-L360` — terminating pods with hung processes still consuming cluster capacity (a CI pipeline war story); the Postgres deployment that fails for a missing password, fixed imperatively with `kubectl set env` for `POSTGRES_PASSWORD`/`POSTGRES_DB`, ending with two deployments and two pods.
- `#L361-L425` — pods cannot talk to each other until exposed; `kubectl expose deployment` gives Postgres a ClusterIP (`10.96.6.136`) reachable by the cluster-internal DNS name `postgres`, then the app gets the database host as an env var.
- `#L426-L523` — exposing the app with a NodePort service (`8080:31345`), the kind-inside-Docker caveat that breaks `curl localhost:8080/counter` on Orbstack, and `kubectl port-forward` on the service as the workaround (service, not pod, so replacement pods keep working).
- `#L524-L547` — curling `/counter` through the port-forward to prove end-to-end routing: host → NodePort service → app pod → Postgres service → database pod.
- `#L548-L598` — deleting the Postgres pod is healed by the deployment but data is lost (no persistent volume), so `/counter` returns "database unavailable" then restarts at 1; closing argument that this CLI workflow is developer-grade, not stable or shareable.
