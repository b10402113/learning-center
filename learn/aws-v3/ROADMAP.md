---
subject: aws-v3
status: draft
created: 2026-08-25
---

# ROADMAP — aws-v3

## Goal
Deploy a static site to S3 + CloudFront with HTTPS and a custom domain, and build enough AWS fluency to talk about it confidently in interviews.

## How to use
Read the nodes in order. Each node is a step-DAG. Run `/probe <subject>/<node-id>` to measure a node, then `/nodes <subject>/<node-id>` to confirm and start work on it.

## Nodes

### Tier 1 — Mental model
1. **[[learn/aws-v3/nodes/why-aws-for-web-deployment|Why AWS for web deployment]]**
   - Goal: Explain why front-end devs need AWS — static files, latency problem, CDN concept
   - Sources:
     - [[sources/aws-v3/01#introduction]]
     - [[sources/aws-v3/01#the-physics-problem]]
     - [[sources/aws-v3/01#workshop-format]]
     - [[sources/aws-v3/06#aws-ecosystem]]
     - [[sources/aws-v3/06#service-overview]]

2. **[[learn/aws-v3/nodes/aws-account-and-iam|AWS account and IAM]]**
   - Goal: Set up a secure AWS account with an admin user and understand IAM's role
   - Sources:
     - [[sources/aws-v3/02#account-creation]]
     - [[sources/aws-v3/02#security-stakes]]
     - [[sources/aws-v3/03#user-groups]]
     - [[sources/aws-v3/03#administratoraccess-policy]]
     - [[sources/aws-v3/03#the-daily-driver]]
     - [[sources/aws-v3/04#account-alias]]
     - [[sources/aws-v3/05#iam-concept]]
     - [[sources/aws-v3/05#least-privilege]]
     - [[sources/aws-v3/05#policies]]

### Tier 2 — S3 fundamentals
3. **[[learn/aws-v3/nodes/s3-basics|S3 basics]]**
   - Goal: Create an S3 bucket, understand object storage vs file systems, bucket naming and regions
   - Sources:
     - [[sources/aws-v3/07#s3-concept]]
     - [[sources/aws-v3/07#bucket-creation]]
     - [[sources/aws-v3/07#object-storage-vs-file-system]]

4. **[[learn/aws-v3/nodes/s3-static-hosting|S3 static hosting]]**
   - Goal: Deploy a React app to S3 with public access and static website hosting
   - Sources:
     - [[sources/aws-v3/08#sample-app]]
     - [[sources/aws-v3/08#build-process]]
     - [[sources/aws-v3/09#public-access]]
     - [[sources/aws-v3/09#static-website-hosting]]
     - [[sources/aws-v3/09#initial-deployment]]

5. **[[learn/aws-v3/nodes/s3-policies-and-security|S3 policies and security]]**
   - Goal: Write bucket policies with least privilege, understand ARNs, enable encryption and versioning
   - Sources:
     - [[sources/aws-v3/10#bucket-policies]]
     - [[sources/aws-v3/10#policy-structure]]
     - [[sources/aws-v3/10#arns]]
     - [[sources/aws-v3/11#additional-s3-features]]
     - [[sources/aws-v3/11#production-considerations]]

### Tier 3 — CloudFront
6. **[[learn/aws-v3/nodes/cloudfront-cdn-setup|CloudFront CDN setup]]**
   - Goal: Explain why S3 alone isn't enough, create a CloudFront distribution with custom domain and HTTPS
   - Sources:
     - [[sources/aws-v3/12#s3-hosting-limitations]]
     - [[sources/aws-v3/12#transition-to-cloudfront]]
     - [[sources/aws-v3/13#cdn-concept]]
     - [[sources/aws-v3/13#caching-tiers]]
     - [[sources/aws-v3/14#distribution-creation]]
     - [[sources/aws-v3/14#custom-domains]]
     - [[sources/aws-v3/14#ssl-tls]]

7. **[[learn/aws-v3/nodes/cloudfront-caching|CloudFront caching]]**
   - Goal: Configure TTL, run invalidations, and tune behavior settings for different content types
   - Sources:
     - [[sources/aws-v3/15#cache-invalidation]]
     - [[sources/aws-v3/15#ttl]]
     - [[sources/aws-v3/15#invalidation-costs]]
     - [[sources/aws-v3/15#behavior-settings]]

### Tier 4 — Production deployment
8. **[[learn/aws-v3/nodes/deployment-workflow-and-spa-routing|Deployment workflow and SPA routing]]**
   - Goal: Execute the build → S3 → invalidate pipeline; fix client-side routing with custom error pages and Lambda@Edge
   - Sources:
     - [[sources/aws-v3/16#new-deployment]]
     - [[sources/aws-v3/16#cache-persistence]]
     - [[sources/aws-v3/16#deployment-workflow]]
     - [[sources/aws-v3/17#client-side-routing-problem]]
     - [[sources/aws-v3/17#custom-error-pages]]
     - [[sources/aws-v3/17#lambda-at-edge]]
     - [[sources/aws-v3/18#goal-achieved]]
     - [[sources/aws-v3/18#future-topics]]

## Status
- [x] Roadmap and nodes confirmed
- [ ] Step articles written
- [ ] Edges written
