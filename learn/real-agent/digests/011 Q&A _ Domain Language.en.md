---
source: sources/real-agent/20261030/Language/011 Q&A _ Domain Language.en.srt
source_type: text
source_lines: 651
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- One glossary is enough until names collide; prefix entities (quiz question vs discussion question) before splitting.
- Too much prefixing signals bounded contexts: product and finance can both be right with different models.
- In one repo, use `glossary-map.md` and per-context ADRs; split when two contexts fight over one glossary.
- Ship glossary updates as soon as a term is agreed, before spec and tickets; rename code before the spec.
- Mine domain words from users; start with no glossary and grow it slowly.
- An agent must not own the glossary; the language has to stay shared with humans or it diverges.

# L2 detail

- `#L1-L30` — recap of domain language, ADRs, and Grill with Docs; transition into common questions.
- `#L31-L82` — one glossary as the app grows; quiz vs discussion questions; prefix entities; never say bare "admin".
- `#L83-L144` — too much prefixing reveals two conversations; DDD multiple models; refund vs chargeback in product vs finance.
- `#L145-L232` — bounded contexts inside one repo; `glossary-map.md`; global vs per-context ADRs; split when contexts collide.
- `#L233-L330` — when to ship glossary updates: right after agreement, before spec; rename code before tickets exist.
- `#L331-L397` — choosing good words: mine user language; match product language to how users think.
- `#L398-L442` — no glossary needed up front; grow it while grilling; it is never finished.
- `#L443-L500` — adding and pruning require hard thinking; go slow and create only the entries needed.
- `#L501-L600` — an agent must not own the glossary; ubiquitous means code, team, and product; invented terms split the team.
- `#L601-L651` — glossary work is high-value human work; further reading; final ubiquitous-language takeaway.
