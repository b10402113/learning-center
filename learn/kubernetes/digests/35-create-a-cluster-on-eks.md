---
source: sources/kubernetes/20261031/35-create-a-cluster-on-eks.txt
source_type: text
source_lines: 215
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- GitOps secrets framing — opens by naming Sealed Secrets as the next checkbox after pods, persistence, and external access, and stresses that base64 is not encryption; the operator pattern appears again as a controller that does one thing.
- Parallel track — rather than watching eksctl wait, the lesson authenticates an AWS CLI (SSO profile plus region, verified with `aws s3 ls`), installs eksctl, and runs `eksctl create cluster -f manifests/day2/eks-cluster.yaml` in the background.
- What the manifest carries — `instanceType`, `desiredCapacity`, `minSize`, `maxSize` (auto-scaling group settings) plus eksctl APIs that make the cluster opinionated as an Amazon cluster, unlike the Kind config.
- Under the hood — the command drives CloudFormation, whose stack events show the NAT gateway and control plane being built, and the cluster then appears in the EKS console.
- Kind versus managed EKS — closes on the tradeoff: Kind gives a local CLI-compatible cluster, EKS gives a shared managed service with a UI, upgrades, and support, at more cost and setup work.

# L2 detail

- `#L1-L27` — Introduces GitOps secrets with Sealed Secrets as the next step after pods, persisted data, and external access; complains that current secrets sit in the repo as plain text.
- `#L28-L45` — Pauses the secrets thread to start an EKS cluster early because it provisions unattended; restates that base64 is not encryption and that Sealed Secrets is the operator pattern doing one thing.
- `#L46-L99` — AWS console login, then CLI authentication: exports the AWS region and profile, uses SSO, and explains the IAM-user-with-admin-and-access-key alternative; `aws s3 ls` confirms the CLI works.
- `#L100-L131` — Installs eksctl from its GitHub releases and describes it as Amazon's own kubectl for managing clusters; notes Terraform would replace it but is out of scope for this course.
- `#L132-L162` — Runs `eksctl create cluster -f manifests/day2/eks-cluster.yaml`; reads the manifest's `instanceType`, `desiredCapacity`, `minSize`, and `maxSize` as basic auto-scaling group settings and notes eksctl APIs opinionate it as an Amazon cluster.
- `#L163-L190` — Explains the wait: eksctl is running CloudFormation underneath, visible in stack events as the NAT gateway and control plane are built, and the cluster shows up in the EKS console.
- `#L191-L215` — Compares Kind (small local cluster, same CLI flexibility) with EKS (managed, collaborative, UI, upgrades, support) and frames the extra money and setup effort as the price of that value.
