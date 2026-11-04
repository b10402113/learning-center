---
source: sources/background-agent/20261105/1-background-agents.vtt
source_type: text
source_lines: 948
status: absorbed
absorbed_at: 2026-11-05
created: 2026-11-05
updated: 2026-11-05
supplements:
  - server.md#L1-L216
  - server.md#L1052-L1066
  - server.md#L878-L928
---

# L1 overview

- Class definition round — students offer definitions (a Kubernetes-style reconcile loop running on an interval, "a process that does a job", the subagent Codex spins up in the background, "activates when an event from the outside world happens"); Scott validates all of them, notes the concept has many names, and confirms the event-activated variant is what the workshop builds.
- Why it's the productivity unlock — chat agents are synchronous: you only go as fast as you can prompt, you still have to read outputs, it is not fire-and-forget; background agents let the work happen with neither you doing it nor you scheduling it, closer to a team of people who know when to do their job.
- Goal instead of prompt — the shift from a single task to a standing goal: you describe the state the world should be in and the agent enforces that vision, hunting equilibrium; the real differentiator from a chat agent is durability — surviving failed calls and timeouts, pausing and resuming, not being a replacement for chat.
- Real-world examples — the incident/operations agent from the demo, plus Scott's personal email-inbox agent (event = new email, goal phrased as "what I'd like to know", local model + tunneled access for privacy, built on this exact architecture); the architecture stays the same even if the tools change.
- The authority question — once something runs unattended you must decide who holds authority; the anti-pattern is delegating "should I ask permission?" to the LLM (it hallucinates that too), which forces a deliberate split between ambiguous intelligence work (LLM) and deterministic harness work that spoon-feeds the agent only what it needs.
- Observe → decide → act loop — situates the harness among agent thinking frameworks (chain-of-thought, tree-of-thought, ReAct — not React.js): observe world state, decide the next action, act, repeat; nearly identical to any SDK tool loop, except this harness uses no model-level tool calling at all yet still selects actions.
- Waiting as a first-class ability — coding agents cannot suspend for days (process dies, connection drops, state goes stale), whereas a background agent parks like a person blocked on a Slack question and consumes no compute while it waits.

# L2 detail

- `#L1-L148` — Opens with a live Q&A asking the room for a definition: "an endless loop like a Kubernetes operator that reconciles every so often", "an agent is a process that does some job", a subagent kicked off from another interface (Codex subagents), and "activates when some event from the outside world happens" — that last one is the design the course uses; Scott acknowledges the many names for the concept.
- `#L149-L286` — Argues background agents are the real productivity unlock: with a chat/coding agent you are bound to prompting and to waiting for and verifying output, so it is not fire-and-forget; interval/schedule triggers in tools like Codex edge toward background agents but are not quite it; the ideal is work that gets done without you doing it or scheduling it, like a well-run team — "the bones are there, it's up to you to make it that".
- `#L287-L457` — Prompt/task versus goal: a background agent is given a target state or vision and enforces it ("find harmony within a state you gave it", keep it at equilibrium), e.g. "go buy me some stuff online"; the real difference is durability — a chat agent that hits a broken API call or timeout eventually answers "I can't do it", whereas a person (and a background agent) keeps going, can pause and resume, and is therefore not a drop-in replacement for chat agents.
- `#L458-L580` — Concrete examples: the operations/incident agent watching a service, then Scott's own email agent that only cares about `new email` events and was told what he wants to see rather than what to do; asked what he runs it on, he explains a local model tunneled from anywhere because he refuses to expose personal email to a frontier model ("I don't need Opus-5.5-class intelligence to check an email") — and that agent runs on the same architecture taught here.
- `#L581-L735` — The authority problem: with a fire-and-forget agent running while you're "on the beach in Hawaii", someone must define who is authorized to do what and guarantee that contract always holds; demonstrates the failure mode of putting the approval decision inside the LLM — "why would it not hallucinate if it needed an approval at some point?" — so you must separate ambiguous intelligence work from the deterministic harness that withholds and spoon-feeds.
- `#L736-L862` — Names the architecture "observe, decide, act" and places it beside other thinking frameworks (chain-of-thought, tree-of-thought, ReAct — explicitly not React.js), noting it is basically what every agent SDK tool loop already does except for two differences that matter: there is no tool calling at all in this harness, and the agent is still able to choose an action.
- `#L863-L948` — Explains why background agents must be able to wait: coding agents today cannot suspend and resume — close your laptop and the run is gone, a three-day wait would lose the connection and the state would have changed — whereas this agent parks like a person blocked on a question, sitting idle with no compute spent until the answer arrives, which sets up the next section.
