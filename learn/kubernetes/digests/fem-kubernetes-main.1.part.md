---
source: sources/kubernetes/20261031/fem-kubernetes-main
source_type: codebase
source_lines: 745
language: yaml
file_count: 33
part: 1
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- `app/server.ts` — Bun/TypeScript service with `/healthz` and `/counter`; every probe and Service target in the manifests ultimately hits this file, and `SIGUSR1` can fake an unhealthy pod so learners can watch readiness/liveness actually fire.
- `app/Dockerfile` + `.github/workflows/build-image.yml` + `app/Makefile` — one build artifact path (non-root `bun` user, `EXPOSE 8080`, multi-arch push to `docker.io/altf4llc/fem-kubernetes:v1`); teaches why an image coordinate and port are the contract between app and cluster.
- `manifests/day-one/deployment.yaml` vs `manifests/day-one/k8s/base/deployment.yaml` — the POC-to-Stable diff: plaintext env, no probes, `default` namespace versus ConfigMap + `secretKeyRef`, three probes, resources, namespace `app`.
- `manifests/day-one/k8s/base/*` — a complete Kustomize base: Deployment, ClusterIP Service, ConfigMap, CloudNativePG `Cluster`, Gateway, HTTPRoute, all collected by one `kustomization.yaml`.
- `manifests/day-one/kind-cluster.yaml` + `manifests/day-one/README.md` — local cluster shape (1 control-plane, 2 workers, host port 30080) and the NodePort/`externalTrafficPolicy: Local` pinning needed to reach a Gateway from the host.
- `manifests/day-two/*` — cluster and delivery layer: EKS via eksctl, Argo CD Applications pointing at a repo path, ALB GatewayClass, gp3 StorageClass, and Kustomize overlays that swap Gateway class, replicas, and storage per environment.
- `overlays/eks` vs `overlays/kind` — the same base rendered two ways; the diff is the whole lesson in environment-specific patching, including a SealedSecret overlay and an HTTPRoute with hostnames stripped.

# L2 detail

- `#L1-L121` — app/server.ts — Bun server; `/healthz` returns 200 or 500 from an in-memory `healthy` flag toggled by `SIGUSR1`, `/counter` runs a bounded CPU burn and writes/reads a Postgres `visits` table, returning 503 on DB failure; shows what readiness vs liveness probes observe and why a pod can fail independently of the process being alive.
- `#L122-L142` — app/Dockerfile — single-stage `oven/bun:1.3.10-slim`, dependency layer cached before source copy, runs as the non-root `bun` user, `EXPOSE 8080`; the container port and PID-1 behavior that containerPort, Service `targetPort`, and probe ports must agree with.
- `#L143-L198` — app/Makefile — `push` builds `linux/amd64,linux/arm64` through a docker-container buildx builder and pushes `:v1` plus the git SHA, `build` loads single-arch into the local daemon; teaches immutable per-commit tags and why a multi-arch image cannot `--load`.
- `#L199-L212` — app/package.json — name/version, `type: module`, `start` and `typecheck` scripts; the minimal manifest a `bun install --frozen-lockfile` in the Dockerfile depends on.
- `#L213-L219` — app/.dockerignore — excludes `node_modules`, `.git`, Dockerfile, docs; shows build-context hygiene so the image layer set stays reproducible.
- `#L220-L233` — app/tsconfig.json — strict ESNext/bundler-mode TypeScript with `noEmit`; explains why there is no build stage in the image.
- `#L234-L257` — Makefile (repo root) — Marp slides and Mermaid diagram targets writing into `dist/`; not cluster-facing, but the entry point that builds the workshop's teaching artifacts.
- `#L258-L264` — README.md — course companion stub naming the POC, Stable, Production progression that `docs/workshop` and the `manifests/day-*` trees implement.
- `#L265-L315` — .github/workflows/build-image.yml — QEMU + Buildx + Docker Hub login then `build-push-action` on `app/` for `linux/amd64,linux/arm64`, tagging `:v1` and `:${{ github.sha }}`; every `uses:` is digest-pinned, a supply-chain habit worth contrasting with image tags.
- `#L316-L341` — manifests/day-one/deployment.yaml — the POC Deployment: one replica, `app: sample-app` selector, image `:v1`, `containerPort: 8080`, database wiring via plaintext `DB_HOST=postgres` and `DB_PASSWORD`; deliberately no probes, no resources, `default` namespace — the anti-pattern baseline students later fix.
- `#L342-L351` — manifests/day-one/kind-cluster.yaml — kind `Cluster` with one control-plane (host 30080 → node 30080) and two workers; the topology that makes NodePort reachability and scheduling demos concrete.
- `#L352-L451` — manifests/day-one/README.md — stage-by-stage apply instructions, the explicit POC-vs-Stable Deployment rationale, and the NGINX Gateway Fabric `nginxproxy` patch that pins the data-plane NodePort to 30080 and the data-plane Pod onto the control-plane node with a matching toleration; the clearest explanation in the repo of `externalTrafficPolicy: Local` and why host curl fails without it.
- `#L452-L460` — manifests/day-one/k8s/base/configmap.yaml — `db-config` holding only non-secret `DB_HOST`/`DB_PORT`/`DB_NAME`; the split that motivates `envFrom` plus a separate Secret for credentials.
- `#L461-L521` — manifests/day-one/k8s/base/deployment.yaml — the matured Deployment in namespace `app`: `envFrom` the ConfigMap, override `DB_HOST=postgres-rw` (the CNPG read-write Service), pull `DB_USER`/`DB_PASSWORD` from Secret `postgres-app` via `secretKeyRef`, startup/readiness/liveness probes on `/healthz`, and requests/limits (100m/128Mi → 500m/256Mi); the reference file for probe timing and Secret-to-env wiring.
- `#L522-L532` — manifests/day-one/k8s/base/gateway.yaml — a Gateway API `Gateway` named `sample-app` using `gatewayClassName: nginx` with one HTTP listener on port 80; shows the class-vs-instance split that overlays later exploit.
- `#L533-L550` — manifests/day-one/k8s/base/httproute.yaml — `HTTPRoute` parented to the `sample-app` Gateway, hostname `sample-app.local`, `PathPrefix /` routing to Service `sample-app:8080`; the L7 routing object that replaces an Ingress.
- `#L551-L560` — manifests/day-one/k8s/base/kustomization.yaml — pins `namespace: app` and lists all six base resources; the single `apply -k` unit and the anchor every overlay references.
- `#L561-L573` — manifests/day-one/k8s/base/postgres-cluster.yaml — CloudNativePG `Cluster` named `postgres`, `instances: 1`, 1Gi storage with no `storageClass`, `initdb` database `appdb` owner `appuser`; teaches an operator-owned database, the `postgres-rw` Service name, and the generated `postgres-app` Secret.
- `#L574-L584` — manifests/day-one/k8s/base/service.yaml — ClusterIP Service selecting `app: sample-app` on port 8080 → targetPort 8080; the stable in-cluster name the HTTPRoute backendRef relies on, contrasted with the POC NodePort.
- `#L585-L597` — manifests/day-two/eks-cluster.yaml — eksctl `ClusterConfig` `fem-workshop` in `us-west-2`, `withOIDC: true`, one managed node group of two `t3.medium` with min/max pinned to 2; the managed-cloud counterpart to kind and the prerequisite for IRSA-based add-ons.
- `#L598-L612` — manifests/day-two/k8s/argocd/application-eks.yaml — Argo CD `Application` sourcing `manifests/day-two/k8s/overlays/eks` at `main` into the in-cluster API, namespace `app`, with automated `prune` and `selfHeal`; GitOps as the deployment mechanism instead of manual apply.
- `#L613-L627` — manifests/day-two/k8s/argocd/application-kind.yaml — the same `Application` pointed at `manifests/day-one/k8s/base`; a direct side-by-side showing Argo CD cares about a repo path, not a cluster type.
- `#L628-L657` — manifests/day-two/k8s/cluster-setup/alb-gatewayclass.yaml — three objects: AWS `LoadBalancerConfiguration` (internet-facing), `TargetGroupConfiguration` with `targetType: ip` for Service `sample-app`, and a `GatewayClass` `alb` wired through `parametersRef`; shows a second Gateway API implementation plugging into the same Gateway/HTTPRoute contract.
- `#L658-L667` — manifests/day-two/k8s/cluster-setup/gp3-storageclass.yaml — `gp3` StorageClass, `ebs.csi.aws.com`, `WaitForFirstConsumer`, marked default via annotation; explains why the CNPG Cluster can omit `storageClass` and how provisioning is deferred until a pod schedules.
- `#L668-L674` — overlays/eks/gateway-class-alb.yaml — patch flipping the base Gateway to `gatewayClassName: alb`; class selection as the environment seam.
- `#L675-L681` — overlays/eks/httproute-path-only.yaml — patch setting `hostnames: []`, so the ALB route answers on any host instead of `sample-app.local`; the trade-off between host-scoped and host-agnostic routing.
- `#L682-L694` — overlays/eks/kustomization.yaml — overlay pulling `../../../../day-one/k8s/base` and applying four targeted patches (Gateway class, CNPG storageClass, Deployment replicas, HTTPRoute hostnames); the canonical Kustomize overlay pattern with `target: { kind, name }` selectors.
- `#L695-L701` — overlays/eks/replicas-4.yaml — patch raising the Deployment to 4 replicas; capacity as a pure overlay delta.
- `#L702-L714` — overlays/eks/sealed-db-extra.yaml — Bitnami `SealedSecret` `db-extra` with an encrypted `password` plus a bare template; demonstrates committing encrypted secrets to Git, and notably is not referenced by the eks kustomization, so it is a demonstration rather than an active patch.
- `#L715-L722` — overlays/eks/storageclass-gp3.yaml — patch adding `spec.storage.storageClass: gp3` to the CNPG `Cluster`; the operator-specific knobs a base deliberately leaves open.
- `#L723-L729` — overlays/kind/gateway-class-nginx.yaml — patch keeping the Gateway on `gatewayClassName: nginx` locally; the counterpart that makes the eks/kind diff meaningful.
- `#L730-L738` — overlays/kind/kustomization.yaml — same base, two patches only (Gateway class, replicas 2); the minimal overlay proves the base is environment-neutral.
- `#L739-L745` — overlays/kind/replicas-2.yaml — patch setting 2 replicas for the local cluster; pairs with the eks 4-replica patch to show one number, two environments.
