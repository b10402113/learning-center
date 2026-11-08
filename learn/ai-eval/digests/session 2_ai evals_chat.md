---
source: sources/ai-eval/20261108/supplement/code/session 2_ai evals_chat.txt
source_type: text
source_lines: 232
status: skipped
skip_reason: "Week 2 直播聊天紀錄：問題零散、講者回答極簡，教學內容已被 session 2 transcript 與 Week 2 assignment 完整覆蓋。"
created: 2026-11-08
updated: 2026-11-08
---

# L1 overview

- Session 2 live chat log — raw Zoom-style chat transcript for Week 2 (2026-10-14, LLM-as-judge), mostly learner introductions and housekeeping with a steady stream of questions: what observability means for agents, whether Splunk/Datadog-style tools still matter, code-based check examples, prompt/persona adherence, council-style judges, judging local models, harsh judges, Cohen's kappa support, human-annotation sample size, and mixed-level agents. Instructor/TA answers are few and terse (the Hugging Face agent incident framed as a governance/monitoring failure; links to TypeSafe AI's Jev, a Substack post, and a Google doc; repeated requests to move questions live).

# L2 detail

- `#L1-L9` — Chat opens at 16:57 with greetings; Harsha Srivatsa announces Class 2 / Week 2 will cover LLM-as-a-Judge.
- `#L10-L38` — Learner introductions and mood ("excited", "excited and nervous", "swamped by PRs"), a remark that AI is a new experience, Harsha's "Summer always following Winter", and the housekeeping rule to use Chat for discussion and Q&A for questions.
- `#L39-L47` — A learner notes this is the third AI wave (first attempt in the early 1950s); Kunal Cheda asks whether the OpenAI agents incident at Hugging Face skipped these eval steps.
- `#L48-L60` — Requests to cover voice-agent evals; Raj Colluru asks whether one session equals a single turn; the Hugging Face question is repeated and Harsha repeats the Chat/Q&A instruction.
- `#L61-L82` — Light banter about asking before the welcome; Kunal asks whether guardrails on top of all agents will be covered; Harsha answers the Hugging Face incident was also a lack of AI governance and monitoring, with no way to stop agents that went rogue; housekeeping repeats.
- `#L83-L100` — Manjeet's LinkedIn handle shared; Harsha asks for an explanation of observability for AI agents; Ben Chen asks whether cloud-era tools like Splunk and Datadog are still relevant for LLM observability; Priyanka asks what "agent with tracing data" means; João Vinagre notes a tools slide is missing from the PDF.
- `#L101-L127` — Follow-up identifying the missing slide as the last tools-related ones (with a screenshot), Harsha promising to check with Manjeet on the PDF; Naveen asks how to add consistent evals for prompt/persona adherence, Priyanka asks for code-based check examples, and Harsha asks whether LLM-as-judge means one model or a council of models.
- `#L128-L141` — Resource drops: TypeSafe AI as creator of Jev, Manjeet's Substack post on AI agent tests bankrupting you, a LinkedIn article on the Jev model, and a Google Doc link.
- `#L142-L148` — Harsha asks what metrics and metric-based artifacts belong in stakeholder eval presentations; Kunal asks whether multiple eval methods (LLM judge plus human review) can be combined.
- `#L149-L176` — Shiyi Wang asks whether a hybrid model setup should split traces (permission traces for small models, reasoning traces for big models) instead of sending the whole trace to one judge and is asked to raise it live; Ben Chen asks which model to use to judge a local qwen3:8b / Ollama / temperature-0 workflow (Harsha clarifies local vs cloud); Priyanka asks what to do when a judge is too harsh and notes adjusting prompt and temperature.
- `#L177-L196` — Learners name Langfuse (Garrett, João); Harsha jokes "Eval our Fitness!"; Harsha asks whether Braintrust provides Cohen's kappa; Shiyi asks how many of 100K–1M rows need human annotation, and Priyanka asks how to improve the judge from the analysis.
- `#L197-L220` — Repeated calls to raise hands and ask live (Ben Chen specifically); Harsha thanks Shiyi for a great question; Lucas suggests asking AI to find 50 more examples with different patterns; Raj asks which LLM Manjeet prefers as a judge (e.g. Claude Code for coding); Naveen asks whether a mixed router/tool-calling agent is rated at the highest level or per component.
- `#L221-L232` — Closing remarks that outputs can differ next run and that an apparent success may be accidental with compounding error; goodbyes and thanks to Manjeet.
