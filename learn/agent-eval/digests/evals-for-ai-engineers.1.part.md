---
source: sources/agent-eval/20261029/Evals for AI Engineers Systematically Measuring and Improving AI Applications .txt
source_type: text
source_lines: 2972
status: absorbed
absorbed_at: 2026-10-29
created: 2026-10-29
updated: 2026-10-29
part: 1
---

# L1 overview

- Title page and copyright: *Evals for AI Engineers: Systematically Measuring and Improving AI Applications* by Shreya Shankar and Hamel Husain, O'Reilly, First Edition October 2026 (First Release 2026-10-12), ISBN 979-8-341-66072-4.
- Preface opens with the production gap: LLMs are embedded in customer service, content generation, decision support, and information extraction, yet adoption has outpaced the ability to evaluate whether these systems work.
- Core argument for why LLM evaluation differs from traditional software testing: outputs are subjective, context-dependent, and multifaceted — a response can be factually accurate but contextually inappropriate, persuasive but wrong, or partially complete.
- The book's framework is the **Analyze-Measure-Improve lifecycle**: analyze pipeline behavior on representative data to find failure modes, measure failures quantitatively with automated evaluators, improve based on evidence rather than guesswork.
- The book's scope spans initial error analysis to production monitoring, naming the "Three Gulfs" model, qualitative coding for error analysis, collaborative evaluation, automated evaluators including LLM-as-judge, architecture-specific evaluation (multi-turn, RAG, tool calling, agentic systems), CI/CD, human review interfaces, and improvement strategies (accuracy optimization, cost reduction, model cascades).
- Audience is engineers and technical product managers building generative AI products; no expert-level ML or statistics required, since concepts are explained even where code and math notation appear.
- "A Note on the Pace of Change" separates durable principles (define good output, break quality into observable dimensions, build datasets matching real use, analyze errors before changing the system, measure changes against a baseline, combine automated checks with human judgment, close the loop) from fast-moving techniques (AI-assisted error discovery, trace sampling for labeling, writing and validating task-specific LLM judges, agent-proposed evaluation cases, deciding human review/override points).
- Explicit non-scope: general-purpose foundation model benchmarking (MMLU, HellaSwag), training or fine-tuning foundation models, and comparative model selection based on benchmark scores alone; the focus is application-centric evaluation. Structure: Part I Foundations (Ch 1–2), Part II The Analyze Phase (Ch 3–4), Part III The Measure Phase (Ch 5–8), Part IV Production and Improvement (Ch 9–12), with Ch 1–2 recommended first.

# L2 detail

- `#L1-L6` — Title page: book title, subtitle, and authors Shreya Shankar and Hamel Husain.
- `#L7-L32` — Copyright page: O'Reilly publication details, October 2026 First Edition, 2026-10-12 First Release, ISBN, trademark and disclaimer notices.
- `#L33-L39` — Preface opening: LLMs moved from research curiosity to production reality; evaluation has not kept pace; defines the gap and the three guiding questions (is the pipeline adequate, where does it fail, how to improve it).
- `#L40-L44` — "What This Book Covers" begins: introduces the Analyze-Measure-Improve lifecycle and its three iterative activities.
- `#L45-L55` — Coverage list of the full evaluation journey from initial error analysis to production monitoring: Three Gulfs, qualitative coding, collaborative evaluation, automated evaluators and LLM-as-judge, architecture-specific evaluation, CI/CD, human review interfaces, and improvement strategies; material derived from a live course.
- `#L56-L62` — "Who Should Read This Book": audience, assumed background, no ML/statistics expertise required, and what product managers versus engineers will get out of it.
- `#L63-L73` — "A Note on the Pace of Change," part one: the durable principles that hold across models and tools (define good, split into observable dimensions, realistic datasets, analyze before changing, measure against baseline, automated plus human, close the loop).
- `#L74-L81` — Same section, part two: the fast-moving techniques (AI-assisted error finding, trace sampling, task-specific LLM judges, agent-proposed eval cases, human review/override points), plus the stated six-to-twelve-month lag of a printed book and the live course.
- `#L82-L87` — "What This Book Doesn't Cover": application-centric evaluation only; excludes general-purpose foundation model benchmarking, training/fine-tuning, and benchmark-only model selection; advises prototyping with real application data instead.
- `#L88-L98` — "How This Book Is Organized": Parts I–IV mapped to chapters (Foundations 1–2, Analyze 3–4, Measure 5–8, Production and Improvement 9–12) with the recommendation to read Chapters 1–2 first.
- `#L99-L112` — "Conventions Used in This Book": Italic, Constant width, Tip, Note, Warning, and Example P-1 conventions.
- `#L113-L116` — "O'Reilly Online Learning": description of the O'Reilly learning platform and its 200+ publisher catalog.
- `#L117-L130` — "How to Contact Us": publisher address, phone numbers, fax, email, website, book page URL, and social channels.
- `#L131-L134` — Acknowledgments: course participants, consulting partner companies, named technical reviewers, and editor Angela Rufino.
- `#L135-L139` — Front matter transition into `part01.html`: start of Part I. Foundations.
