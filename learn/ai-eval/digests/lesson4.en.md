---
source: sources/ai-eval/20261108/supplement/lesson4.en.txt
source_type: text
source_lines: 707
status: absorbed
absorbed_at: 2026-11-08
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Office hours format — a dedicated hour for week 1 and week 2 questions, with screen sharing encouraged; the session opens on a student's local Ollama + Braintrust setup failing when generating judge results.
- Local vs cloud tooling — Ollama cloud API keys (free, no credit card) added as an API provider inside Braintrust; Braintrust's free credits cover its AI features and playground but not arbitrary local code calls, which need your own provider key; local-to-cloud tunnels can hit firewall issues.
- Cohen's κ explained — 0.6 is a chance-corrected alignment bar, not 60% accuracy; the Seattle-rains analogy shows why raw agreement can be meaningless; a κ of zero usually means labels or judge output are missing or broken, and a one-shot LLM judge in a chat window can substitute while tooling is down.
- Building test cases from knowledge — AgentForce testing center demo; generate possible user questions by feeding an enterprise corpus (a 30-page Honda warranty/service PDF) to an LLM; synthetic data for adversarial, security, governance and prompt-injection scenarios is previewed for week 3.
- Eval skills and extra metrics — the repo's skills folder (error discovery, RAG metrics, validate evaluator) and PR contributions; true positive rate and true negative rate as companions to κ so raising κ does not silently damage TPR/TNR; "back pocket evals" and train/dev/test splits for unseen business scenarios.
- Operational workflow — NeatLog guest speaker on automated issue detection from traces, online detectors on sampled traffic, alerts, and staggered agent rollouts; Garrett's LangFuse migration path: consolidate named human-vetted datasets first, then align scorers and judges, then A/B, dashboards, and finally alerts.
- Remaining themes — multi-turn trace reading, a failure-first approach that solves the cold-start problem before designing evals, staging-environment traces as useful but not a substitute for production loops, drift from prompt/model/instruction/data changes making evals continuous, and learning-style tooling (NotebookLM, whiteboard explainer skills).

# L2 detail

- `#L1-L60` — Welcome and office-hours purpose; student's local Ollama + Braintrust judge-generation failure; Ollama cloud free credits and key creation; why local-to-cloud tunnels hit firewall and security issues while cloud-to-cloud generally does not.
- `#L61-L160` — Adding Ollama as a Braintrust API provider alongside OpenAI; provider key vs Braintrust key confusion; free-credit scope (playground/AI features vs local code); book distribution to submitters; domain-specific agent examples (Harvey legal zero-hallucination claim, SDR agents) and why they need extra eval thinking.
- `#L161-L280` — Week 2 assignment completion check; κ zero debugging and what κ 0.6 actually means (chance-corrected, Seattle rain analogy); one-shot LLM judging as a fallback; AgentForce testing center; adversarial/synthetic data preview; generating test scenarios from enterprise knowledge with the Honda PDF example.
- `#L281-L420` — Chat follow-ups: API key still required for the smoke-test job, blank escalation column in an A/B screenshot, GPT-4o-mini as a solid judge; skills folder tour (error discovery, RAG metrics, validate evaluator), TPR/TNR balance, back-pocket evals, train/dev/test splitting, and whether the repo will publish full solutions.
- `#L421-L580` — NeatLog founder as guest speaker and the two automations he will demo (issue discovery from traces, online detectors); detectors on sampled traffic with alerts; agent experimentation and staggered rollout instead of full GA; book subfolder; week 3 adversarial/safety preview (five attack types, agents reading an entire drive at machine speed); Garrett's Notion→LangFuse adoption plan and the bite-at-a-time roadmap.
- `#L581-L660` — New blog posts on multi-turn traces with turn-by-turn focus; failure-first reverse approach and the cold-start problem; whiteboard explainer-video skill and model-agnostic harness; NotebookLM as a learning tool with sources, web access, mind maps and follow-up questions.
- `#L661-L707` — Staging traces: useful for finding new failure modes but the real loop uses production logs; evals remain ongoing because the stack keeps changing; drift at model and harness level revisited for week 3; future "build an agent end to end" course idea; closing.
