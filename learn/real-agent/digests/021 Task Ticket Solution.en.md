---
source: sources/real-agent/20261030/Planning/021 Task Ticket Solution.en.srt
source_type: text
source_lines: 483
status: absorbed
created: '2026-10-30'
updated: '2026-10-30'
absorbed_at: '2026-10-30'
---

# L1 overview

- The task ticket invokes the wizard skill, whose reliability depends on how well its description matches the situation.
- The wizard reads the research, the map, and dependent tickets, and checks vendor docs so it does not invent dashboard steps.
- The wizard runs outside the agent in a fresh terminal, so pasted secrets never pass through a model.
- It walks the human through account signup, channel creation, API keys, and signing keys, validating each stage as it goes.
- A verification pass catches a truncated signing key, which is fixed manually and re-checked with a real signed API call.
- Four values land in a gitignored .env, the ticket closes, and the local setup is proven ready for prototyping.

# L2 detail

- `#L1-L42` — Start the ticket; the risk with model-invoked skills is whether the description and leading words trigger the agent, and here it does.
- `#L43-L116` — Wizard generation: reads all research, the map, and dependent tickets, checks Knock's docs for the exact dashboard path, and produces a bash script at roughly 44k tokens.
- `#L117-L160` — Run it in a new terminal beside a browser because it is interactive and opens pages itself.
- `#L161-L206` — Guided signup: open the dashboard, create an organization, stay on the free developer plan, pick the development environment, paste the dashboard URL for the record.
- `#L207-L240` — Secrets stay local because the wizard is not connected to an agent; create the app-feed channel named cadence feed.
- `#L241-L300` — Copy public and secret API keys, generate a base64 application signing key, enable enhanced security; the wizard admits the docs do not say where the toggle is.
- `#L301-L374` — Setup writes four values to .env (feed channel id, public key, secret key, signing key), which is gitignored; ask the agent to verify without revealing the keys.
- `#L375-L424` — Verification catches a truncated signing key; ask for the manual step, paste it again, re-verify.
- `#L425-L460` — A real signed token call confirms the keys, and the resolution is recorded on the map.
- `#L461-L483` — Wizard skill is optional but high leverage when provisioning several vendors at once.
