---
source: sources/kubernetes/20261031/44-deleting-cloud-resources.txt
source_type: text
source_lines: 137
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Teardown discipline — frames cleanup as operational discipline rather than tidying: control plane nodes, EBS volumes, and ALBs each bill hourly, so the rule is delete in order, then verify, because deleting out of order lets Argo CD's self-healing field controller recreate an ALB by accident.
- Demo teardown — deletes the Argo CD `Application` first so nothing keeps self-healing, deletes the Gateway so the AWS load balancer controller removes the ALB (verified in EC2 load balancers with a helper command), then runs `eksctl delete cluster` against the day-two EKS cluster manifest, which drives CloudFormation and takes about 20 minutes.
- Orphan sweep — after deletion, checks for leftover load balancers, orphaned EBS volumes, and security groups that would block or strand the cluster, checks by tags, and warns that a forgotten cluster is an unbudgeted bill ("down, verified, clean, nothing billing").

# L2 detail

- `#L1-L39` — Introduces the teardown phase, lists the hourly-billed resources (control plane nodes, EBS volumes, ALB), explains that EKS control deletes the cluster and everything it created but can leave orphans documented in the repo, stresses ordering (stop GitOps, let the load balancer deprovision) and warns that skipping order lets the Argo CD field controller recreate the ALB and incur cost; states the two-step rule: delete in order, then verify.
- `#L40-L51` — Begins the guided teardown by deleting the application in Argo CD first, because otherwise it continually self-heals, recreates load balancers, and keeps spending; anything that auto-syncs must be deleted before the cluster.
- `#L52-L85` — Deletes the Gateway (a gateway equals a load balancer) so the Kubernetes resource removal propagates through the AWS load balancer controller to the Amazon ALB, confirms the ALB is gone under EC2 → load balancers, and mentions a helper command whose error response means deletion succeeded.
- `#L86-L102` — Runs `eksctl delete cluster` with the same `manifest day two EKS cluster` path used at creation, notes it uses CloudFormation to delete everything and runs about 20 minutes in the background.
- `#L103-L137` — Reviews post-delete verification: check again for load balancers, orphan volumes, security groups, and anything that could stall deletion; check orphans by tags; warns that a forgotten cluster is an unbudgeted bill and the common workshop regret is a cluster running a week after everyone left; closes with "down, verified, clean, nothing billing" and no live cluster left after day two.
