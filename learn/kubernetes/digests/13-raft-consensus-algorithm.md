---
source: sources/kubernetes/20261031/13-raft-consensus-algorithm.txt
source_type: text
source_lines: 421
status: absorbed
absorbed_at: 2026-10-31
created: 2026-10-31
updated: 2026-10-31
---

# L1 overview

- Raft consensus algorithm — a whiteboard/visual lesson that defines imperative versus declarative design and the eventual consistency that comes with the reconciliation loop, then opens the Raft visualiser at raft.github.io to show leader election across five nodes (S2 wins the timer race), heartbeat, failover to S4, and deadlock when only two of three nodes remain without quorum. It ends by contrasting quorum-based Raft with the gossip protocol's epidemic peer-to-peer spread.

# L2 detail

- `#L1-L29` — Imperative (steps to get there) versus declarative (what it should be); reconciliation loop as an architectural choice; shifting from running commands to defining desired state.
- `#L30-L102` — Eventual consistency as the caveat: replicas temporarily in different states, limbo rather than broken, cascading sync failures, hard to debug; etcd called out as highly consistent via a consensus algorithm.
- `#L103-L134` — Kubernetes uses Raft, a fault-tolerant distributed-consensus algorithm that reliably converges; pointer to raft.github.io instead of reading slides.
- `#L135-L199` — Five-node cluster in the Raft visualiser; leader model, S2 elected, all requests routed through the leader; countdown timers fire, first node declares itself alive, others acknowledge.
- `#L200-L253` — Stopping S2 deadlocks the cluster, S4 responds fastest and becomes leader; quorum and majority principle; dropping to two nodes leaves neither able to win, flapping between candidates.
- `#L254-L300` — All nodes are equal, so the first event plus enough quorum decides the leader; when a majority exists (two of three, then three of five) the cluster becomes consistent again; timeout offset versus reaping causes the visible flapping.
- `#L301-L345` — Deadlock persists because no timer reaches zero to emit intent; restarting nodes forces a clean re-election and one becomes leader; "kicking the pod" to unstick constant checking is a real operational workaround.
- `#L346-L421` — Why Raft does not just let the first node to notice take over — it wants a majority contract; the gossip protocol as the alternative: epidemic-style peer-to-peer, bootstrap from any local node, eventual consistency without majority guarantee.
