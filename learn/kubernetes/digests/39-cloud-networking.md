---
source: sources/kubernetes/20261031/39-cloud-networking.txt
source_type: text
source_lines: 334
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Why this step exists — pods, volumes, and add-ons are ready but the service still cannot be curled from outside; Kind used NGINX Gateway Fabric, while EKS needs the AWS Load Balancer Controller to turn the same Gateway/HTTPRoute YAML into a real ALB.
- Contract pattern — the route is the Kubernetes manifest and the controller is environmental, exactly like the PVC and the EBS provisioner; the GatewayClass is the controller's class, mirroring a StorageClass.
- IAM prerequisites — downloads Amazon's IAM policy and creates it with `aws iam create-policy`, runs `eksctl utils associate-iam-oidc-provider`, then `eksctl create IAM service account` with the policy ARN so the in-cluster controller may create load balancers.
- Install chain — applies cert-manager (1.20.2), the Gateway API CRDs, and AWS Load Balancer Controller CRDs and controller (3.4.0, versions matched), waiting on rollout conditions each time.
- Wiring objects — then creates a LoadBalancerConfiguration, a TargetGroupConfiguration, and a GatewayClass to glue the AWS controller to the Gateway API, fixing a missing `app` namespace with `kubectl create namespace app` and rerunning the idempotent apply.

# L2 detail

- `#L1-L37` — States the gap: curl works against the Kind cluster but not the EKS service; introduces Amazon load balancer support and restates the contract idea, where the route is the manifest and the controller is environmental.
- `#L38-L58` — Maps Kind's NGINX Gateway Fabric onto EKS's AWS Load Balancer Controller, which turns the same YAML into an ALB; introduces the GatewayClass name that the controller picks up, analogous to a StorageClass.
- `#L59-L89` — Downloads Amazon's default IAM policy JSON and creates the AWS Load Balancer Controller policy with `aws iam create-policy`, giving the in-cluster process permission to change Amazon resources.
- `#L90-L127` — Associates an OIDC provider using `eksctl utils associate-iam-oidc-provider`, a command built only for linking IAM policies to clusters, then creates the controller's IAM service account with `eksctl create IAM service account` and the policy ARN.
- `#L128-L175` — Explains why this is required: Kubernetes on EKS only has the base permissions to run, not permission to touch load balancers or EC2; notes Terraform makes this marginally easier and that this friction is why people dislike EKS.
- `#L176-L205` — Installs cert-manager from its releases (1.20.2) so certificates can be generated, swapping the version placeholder in the guide command and waiting for deployment conditions to be met.
- `#L206-L243` — Installs Gateway API CRDs because an EKS cluster does not ship them, then the AWS Load Balancer Controller CRDs at 3.4.0, keeping CRD and controller versions aligned.
- `#L244-L286` — Creates the LoadBalancerConfiguration (which provisions an ALB), TargetGroupConfiguration, and GatewayClass that glue controller and Gateway API; a missing namespace error is fixed with `kubectl create namespace app` and an idempotent rerun.
- `#L287-L334` — Checks EC2 load balancers and K9s, finds the GatewayClass waiting for a controller, realizes the controller deployment itself was skipped, installs it at 3.4.0 to match the CRDs, and confirms `kubectl rollout status` succeeded.
