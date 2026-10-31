---
source: sources/kubernetes/20261031/38-cluster-storage-ebs-csi.txt
source_type: text
source_lines: 244
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- PVC semantics — a PersistentVolumeClaim is the contract over a volume, not the volume itself; a pod must claim it before it becomes active, and the provisioner behind the contract is environmental: Kind's local path versus EKS's EBS CSI.
- Driver tradeoffs — GP3 beats GP2 with better baseline and decoupled IOPS plus tunable performance, and `WaitForFirstConsumer` binds the zonal volume where the first pod lands.
- Install path — treats the EBS CSI driver as a managed add-on instead of hand-applied manifests, the same reasoning used for metrics-server, kube-proxy, and CoreDNS, then runs `eksctl create addon --name aws-ebs-csi-driver --cluster ... --region ... --force`.
- Verification — the add-on appears in the console, and `kubectl get pods -n kube-system` filtered by the driver label shows the CSI controller pods (6/6 and 3/3 ready).
- Storage class — creates a StorageClass for gp3 that uses the EBS CSI provisioner and is marked default through an annotation, so `kubectl get storageclass` lists gp2 and the new default gp3; a side discussion covers KMS-backed secrets and SOPS as the newer alternative to Sealed Secrets.

# L2 detail

- `#L1-L42` — Defines PVC as a claim rather than a volume, treats the provisioner as environmental and the PVC as the contract, contrasts Kind's local path with EKS's EBS CSI, and explains GP3 IOPS and `WaitForFirstConsumer` zonal binding.
- `#L43-L89` — Argues for managed add-ons over manifests: metrics-server, kube-proxy, and CoreDNS already existed, and configuring add-ons in the cluster definition means fewer manifests and vendor-managed lifecycle and updates.
- `#L90-L116` — Runs `eksctl create addon --name aws-ebs-csi-driver` against the FEM workshop cluster in us-east-2 with `--force`; notes CloudFormation runs underneath and the console may briefly show the add-on as degraded.
- `#L117-L165` — Answers how Amazon obtains the sealing key: Sealed Secrets can use KMS so the controller fetches a cloud-owned key, and adds that the team now uses SOPS, which works with KMS, GCP, and Azure Key Vault and needs no in-cluster controller.
- `#L166-L202` — The add-on shows up as the fifth add-on; it created EBS CSI controller pods and a service account, and `kubectl get pods -n kube-system` with the driver label reports 6/6 and 3/3 ready.
- `#L203-L244` — Explains that Kind supplied a storage class for free but EKS needs the CSI driver first; creates a gp3 StorageClass whose provisioner is the EBS CSI driver, marks it default with the `storageclass.kubernetes.io/is-default-class` annotation, and `kubectl get storageclass` shows both gp2 and gp3.
