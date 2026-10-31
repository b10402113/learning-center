---
source: sources/kubernetes/20261031/37-exploring-the-eks-cluster.txt
source_type: text
source_lines: 352
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- EKS economics — the $75/month control plane (API server, etcd, scheduler) is managed and always up, but you pay separately for worker nodes; without instances there is no pod capacity, and billing is hourly, which is why the cluster is torn down at the end.
- Ownership boundary — you own the worker nodes and workloads and can never SSH into the control plane; the only surface is the API.
- Console tour — the cluster is active after roughly 14 minutes; the UI exposes versions/upgrades, OIDC, IAM roles, the cluster ARN, add-ons such as metrics-server, resources/pods/events, ReplicaSets, ConfigMaps, two T3 medium EC2 nodes from the configured node group, and VPC subnets with kube-proxy, CoreDNS, and VPC CNI.
- Switching in — `kubectl config use-context` (tab completion lists contexts) needs valid AWS credentials, then `kubectl get nodes` and `kubectl get pods -A` show real EC2 instances instead of Kind containers.
- Platform differences — the API endpoint is public by default (can be made VPC-private), and the storage class now backs volumes with GP2 EBS instead of Kind's local directories; expansion and the database motivation are discussed, and the commands and resource kinds stay identical.

# L2 detail

- `#L1-L16` — Closes out the Kind phase, notes the CloudFormation stack is still running, and frames the move to the managed EKS cluster as the next segment.
- `#L17-L47` — Explains EKS pricing: Amazon runs the control plane (API server, etcd, scheduler) so it is always available, the platform is a $75 flat monthly fee, and worker nodes are billed as ordinary instances you must provision yourself.
- `#L48-L61` — Stresses that worker nodes and workloads are yours, that SSH access to the EKS control plane is impossible, and that only the API is reachable.
- `#L62-L80` — Notes one cluster at a time with no federation and hourly billing (a fraction of $75 per hour of use), motivating teardown; then attempts the first context switch to confirm nodes are real.
- `#L81-L129` — Console walkthrough: cluster active, Kubernetes version/upgrade support, OIDC awareness the Kind cluster lacked, IAM roles, cluster ARN, and installable add-ons such as metrics-server; provisioning took about 14 minutes.
- `#L130-L175` — Resources tab mirrors K9s: pods, events, ReplicaSets with ready/failed counts, and ConfigMaps readable in the UI, accessible to anyone without a CLI; notes it holds no more information than kubectl.
- `#L176-L203` — Compute view shows two small T3 medium EC2 nodes and the node group defined in `eks-cluster.yaml`, plus networking out of the box: subnets and add-ons kube-proxy, metrics-server, CoreDNS, and VPC CNI.
- `#L204-L255` — Switches clusters with `kubectl config use-context`, using tab completion to list contexts and requiring AWS credentials in the shell; `kubectl get pods --all-namespaces` and `kubectl get nodes` confirm the FEM workshop context.
- `#L256-L294` — Contrasts Kind's container "nodes" with real EC2 instances that have reachable IPs and cost money; `kubectl cluster-info` shows a public API endpoint, which is authorized by policy and can be moved into the VPC if privacy is required.
- `#L295-L331` — Compares storage classes: Kind wrote directories on the laptop, EKS provisions GP2 EBS volumes; a question about volume expansion leads to default-size-plus-expansion for databases.
- `#L332-L352` — Concludes that no commands or resource kinds changed: still nodes and still storage classes, but the cluster knows it is on Amazon, so a node request becomes an EC2 instance and a volume request becomes an EBS volume.
