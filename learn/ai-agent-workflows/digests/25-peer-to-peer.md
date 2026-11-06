---
source: sources/ai-agent-workflows/20261105/course/25-peer-to-peer.txt
source_type: text
source_lines: 208
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
---

# L1 overview

- Peer-to-peer (also called any-to-any, mesh, or decentralized) has no central coordinator; agents communicate directly and every agent must be aware of every other agent.
- All agents sit on equal footing, the complete opposite of the supervisor design, and each needs to understand the others' specialties.
- Best fit is a problem with no natural hierarchy and a decomposition that is not known upfront; the pattern has no direct workflow equivalent.
- Analogy: a room of engineers discussing a system design problem, where anyone can participate or call on anyone at any time; the speaker calls it "conversation triage."
- It is the hardest pattern to debug because nobody knows who will talk to whom or when; Cognition's 2025 follow-up still called arbitrary agent networks mostly a distraction.
- Example network: career, education, funding, and trends agents collaborate on a career-change request and return three career paths, programs, and funding options.
- Context scales with the number of relationships, not agents: adding one agent adds N new relationships, so the relationship count grows exponentially.
- Cost is usually very high (many agents, compounding rounds), reliability is usually worse without a central checker, coordination failures are common, and the speaker treats it as a last resort rather than a default.

# L2 detail

- `#L1-L25` — Naming and core definition: peer-to-peer, any-to-any network, mesh, decentralized; all agents on equal footing, no central coordinator, direct communication, and each agent aware of every other agent's specialty; information passes back and forth until a stop condition.
- `#L26-L38` — Fit and non-fit: problems with no natural hierarchy and an unknown decomposition; the pattern has no direct workflow equivalent, unlike the other patterns discussed.
- `#L39-L70` — Why it is chaos: agents choose when to speak, to whom, and who speaks next, so no deterministic code can drive it; closest hack is a random choice of next speaker; the engineers-in-a-room analogy and the warning that it is the hardest system to debug.
- `#L71-L89` — Ecosystem warning: Cognition's 2025 "Don't Build Multi-Agents" post and its follow-up ten months later, which admitted some multi-agent setups work but still called arbitrary networks a distraction; know the pattern but think hard before shipping it.
- `#L90-L108` — Diagram setup: specialized agents that discuss, share information, and pass control; any agent can speak with any other; the added career, education, funding, and trends agents.
- `#L109-L136` — Worked example: a user interested in a tech career asks about options, programs, and funding and invites collaboration; any agent may call any other at any time, and the network eventually returns a combined answer with three career paths and next steps; flexible, open-ended collaboration where specialists take over tasks.
- `#L137-L156` — Trade-offs and context: no aggregator step means no single point of failure, and triage can happen as issues emerge, but every agent needs context on every other agent, so context scales with relationships rather than agent count.
- `#L157-L172` — Relationship math: adding one agent requires creating relationships to the funding, career, education, and trends agents, i.e. N new relationships for N existing agents, so relationships increase exponentially.
- `#L173-L188` — Reliability and coordination failures: without a central agent doing checks, reliability is usually worse than other patterns, and coordination failure (two agents unable to talk to each other) is more likely when many agents all try to communicate.
- `#L189-L195` — Cost and positioning: very expensive because many agents run at once with compounding rounds, hardest to debug, and a last resort rather than a default choice.
- `#L196-L208` — Why debugging is impossible: the system gives up every predefined arrow, agents write their own arrows to each other, and there is no way to predict the trajectory before starting because anyone can talk to anyone at any time.
