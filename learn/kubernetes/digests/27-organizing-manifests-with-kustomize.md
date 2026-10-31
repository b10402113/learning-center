---
source: sources/kubernetes/20261031/27-organizing-manifests-with-kustomize.txt
source_type: text
source_lines: 216
status: absorbed
absorbed_at: 2026-10-31
supplements:
  - fem-kubernetes-main.1.part.md#L551-L560
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Why Kustomize — replaces the long chain of `kubectl apply -f` calls with a tool that merges plain YAML; `kustomization.yaml` acts as the index entry point wiring individual Deployments, ConfigMaps, Services, gateway, route, and cluster into one combined manifest, enabling per-environment overlays.
- Base layout and namespace rules — creates `k8s/base`, moves the hand-written manifests into it, and writes `kustomization.yaml` with the usual apiVersion/kind/namespace schema; warns that a root `namespace` applies to everything, so multi-namespace setups must drop it, and that the common gotcha is silently landing resources in `default`.
- Preview and apply — `kubectl kustomize k8s/base` prints the merged result, with merge order not guaranteed (Deployment appeared before ConfigMap) but all resources applied together, allowing eventual consistency; `kubectl apply -k k8s/base` reports `unchanged`/`configured` with no Pod rotation because the resources already matched.
- Takeaway — `-k` is built into kubectl and changes nothing functionally; Kustomize is only a templating layer on top of ordinary manifests.

# L2 detail

- `#L1-L44` — Frames the problem: repeated manual `kubectl apply -f` is inefficient; introduces Kustomize as an outside project that just merges YAML, with `kustomization.yaml` at the root like an `index.html` wiring manifests together, and contrasts dev versus production overlays.
- `#L45-L82` — Explains the base concept and the repo's `manifest/day-1/k8s/base/kustomization.yaml`, its apiVersion/kind/namespace fields, namespace inheritance behavior, and the risk of accidentally deploying to the default or wrong namespace.
- `#L83-L144` — Creates `k8s/base`, moves Deployment, Service, ConfigMap, Gateway, HTTPRoute, and CNPG Cluster into it, writes `kustomization.yaml` (after an initial missing-file error), previews with `kubectl kustomize k8s/base`, and notes merge order is not guaranteed while application is simultaneous.
- `#L145-L216` — Optional commit of the files, then `kubectl apply -k` showing unchanged/configured output, no Pod restart, and idempotent re-application; closes by saying `-k` only makes manifests templatable and works as an extra layer over plain YAML.
