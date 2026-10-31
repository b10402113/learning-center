---
source: sources/kubernetes/20261031/9-recreating-a-cluster-from-scratch.txt
source_type: text
source_lines: 113
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Wipe and rebuild — `kind delete cluster --name kind` then `kind create cluster` reproduces the "start over" workflow after a patched container image, and `kubectl get pods` confirms a brand-new cluster (21 seconds).
- Replaying the lesson commands — creates the deployment, adds Postgres, and applies the `kubectl set env` password fix again, ending with `kubectl get pods` showing both pods running.
- Cluster access details — `kubectl cluster-info` shows the API on localhost with a random Kind-assigned port (e.g. 56404) rather than the earlier 30080 forwarding, and a forgotten `--image` produces `required flag(s) "image" not set`.

# L2 detail

- `#L1-L40` — Motivation: the container image had to be patched, so the cluster is thrown away. Runs `kind delete cluster kind`, notes the "deleted nodes" output as proof nodes existed, then `kind create cluster` to rebuild; `kubectl get pods` shows a fresh 21-second-old cluster.
- `#L41-L84` — Replays the prior workflow on the new cluster: check nodes, rerun `kubectl create deployment sample-app` (skipping the bare pod and scaling), recreate Postgres, and points to the docs/workshop repo for the command list. `kubectl cluster-info` reveals the API on localhost with a random Kind-assigned port unique to that machine.
- `#L85-L113` — Error walkthrough: `kubectl create deployment` fails with `required flag(s) "image" not set` when the second line is dropped. Then the full replay again — create deployment, create Postgres, apply the `set env` fix — and `kubectl get pods` shows Postgres and sample-app both running successfully.
