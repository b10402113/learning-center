---
source: sources/kubernetes/20261031/41-environment-overlays-with-kustomize.txt
source_type: text
source_lines: 109
status: absorbed
absorbed_at: 2026-10-31
supplements:
  - fem-kubernetes-main.1.part.md#L682-L694
  - fem-kubernetes-main.1.part.md#L730-L738
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Kustomize overlays — explains that a base `k8s` directory of manifests stays untouched while `overlays/eks` and `overlays/kind` merge in only the per-environment deltas: gateway class (`alb` vs `nginx`), replica counts, and hostnames, with Kind using local-path storage and low replicas while EKS uses GP3 and higher replicas.
- Overlay structure — opens the project's `manifests/k8s/overlays` directory, shows each `<env>/kustomization.yaml` importing the base via a relative path and listing small patch files, then runs a diff between base and overlay to prove only replicas, gateway class name, and host names change byte-wise. Concludes that overlays exist purely so EKS-specific values can be set without duplicating the base.

# L2 detail

- `#L1-L11` — Frames Kustomize as merging manifests so dev and prod differ only by overlay variables applied over an untouched base.
- `#L12-L34` — Recalls the created `K8s` base directory, defines an overlay as the small change merged with that base, and names the EKS-vs-Kind deltas (storage class, gateway class, replica count) that had to exist before the Postgres cluster and other EKS-specific resources could deploy.
- `#L35-L46` — Points at the `manifest day 2 K8s` project directory and its `k8s/overlays` folder containing `eks` and `kind`, each holding only its single-change difference files.
- `#L47-L66` — Contrasts the outcome: a gateway on Kind merges to gateway class `nginx`, on EKS to `alb`; then inspects the EKS `kustomization` file and shows it importing the base by walking up directories.
- `#L67-L85` — Explains that the remaining entries in the EKS kustomization are patches (each file one patch), compares with the Kind kustomization which needs only two patches (gateway class and replica count), and summarizes that a kustomization YAML merges a base kustomization with further kustomization YAML.
- `#L86-L109` — Runs the diff command comparing base against overlay, showing everything is identical byte-wise except replicas, gateway class name, and host names; states these values must differ between EKS and Kind, and closes that the whole section is just merging manifests.
