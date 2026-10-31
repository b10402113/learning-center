---
source: sources/real-agent/20261030/Planning/015 Chart The Map Solution.en.srt
source_type: text
source_lines: 655
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- A short, underspecified prompt is enough: Wayfinder first pins the destination, then scope, then the shape of the decision graph.
- The first question is "what does done look like", answered as a spec rather than a working build.
- Scope discipline matters early: keep the in-app feed fixed, treat push and email as research questions, and avoid over-specifying well-known concepts.
- Domain modeling pays off: the glossary supplies roles and names that later questions reuse, and the session writes new terms back to glossary.md.
- The generated map holds destination, notes, decisions so far, not-yet-specified fog, out-of-scope items, and tickets with open/blocked/assigned states.
- Research tickets fire immediately as background sub-agents and resolve to concrete findings stored as files on a throwaway branch.

# L2 detail

- `#L1-L50` — Initial prompt for in-app notifications, a real third-party service, notification kinds, and app appearance; the skill loads grilling plus domain modeling, and the first question fixes "done" as a spec.
- `#L51-L78` — Scope question: define what counts as in-app; the feed is fixed, push and email are open, and with no mobile app push may be weak so email could be the default.
- `#L79-L150` — Vendor as part of the map: choosing it is driven by research tickets, hosted over self-hosted, production-grade intent confirmed; the questions and answers stay sensible.
- `#L151-L218` — Round two: decide the second channel via a research ticket; the model admits it lacks information instead of barrelling ahead; all four glossary roles are in scope.
- `#L219-L298` — Vendor requirements (free dev tier, own in-app components), sign up for one vendor and prototype rather than signing up for several, user controls per category/channel, glossary terms "notification" and "notification feed".
- `#L299-L410` — Payoff and map creation: glossary.md updated, shared understanding reached, roughly seven tickets covering all four types, then approval to create the map.
- `#L411-L502` — Map after creation: two research sub-agents launched; destination line, vague notes, empty decisions-so-far, not-yet-specified fog, out-of-scope list, and ticket states (open, blocked, assigned).
- `#L503-L562` — Reading the map: first available ticket is a grilling ticket labeled Wayfinder grilling; each learner will get a different map, so the author saves the map and every update as reference.
- `#L563-L610` — Research results: vendor research resolves to Knock after comparing Novu and MagicBell; summary in the ticket comment, full research in a real file on a throwaway branch with linked sources.
- `#L611-L655` — Web push research: email should be the default out-of-app channel, web push only as opt-in extra, and everything must also land in the feed; map and research are ready for grilling.
