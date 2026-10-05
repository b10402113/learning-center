---
source: generate-skill-guide
source_type: pdf
source_lines: 612
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — generate-skill-guide

## Overview (L1)

- README / intro — Frames a `/generate` skill as one command that creates images and videos, routes each request to the cheapest capable model, and files every output in one flat folder. States the guide is for Claude Code and any agent that reads skill files; pages 2–6 are the setup path, page 8 is a bonus gallery prompt.
- The Idea (01) — Defines what a skill is (a folder of markdown files the agent reads before it acts) and lays out the four-step pipeline: Route → Prep refs → Generate → Log. Shows the target folder layout.
- Setup (02) — Names the three aggregator providers (Kie AI, fal.ai, WaveSpeed AI), the API key names, `.env` handling, and rough per-job costs that motivate cost gates.
- The Brain (03) — The copy-paste `SKILL.md` starter: frontmatter, model routing table, provider routing rules, output rules, and guardrails.
- The Recipes (04) — The per-model markdown recipe template (endpoint, auth, request, response, notes) and the async polling pattern most video models use.
- The Models (05) — Five recommended models with exact model ids, providers, and costs, plus the three different provider auth shapes and sync-vs-async per model.
- The Guardrails (06) — Explains the five money-saving rules and specifies the sidecar JSON log format written next to every output.
- Bonus (07) — A verbatim prompt that builds a single-file bento/masonry gallery over the `generations` folder, plus wiring the folder rule into `CLAUDE.md`.
- Where This Goes Next (09) — Closing pitch: the value is the system around generation (routing, gates, library), with a recap of the six deliverables and a pointer to the pre-built community version.

## Sections (L2)

### readme-intro

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#readme]]`
- Summary: Introduces the whole guide — a `/generate` skill that makes images and videos on demand, picks the cheapest capable model, never surprises you with a bill, and files every output in one folder. Explains the two acquisition paths (build it free from pages 2–6, or install the pre-built version that ships with the RoboNuggets community) and that all prompts are selectable/copy-paste.
- Key claims: The skill works with Claude Code and any agent that reads skill files; the pre-built version at `skool.com/robonuggets` includes the exact `/generate` skill plus the "Rubric Generations" tab it feeds; bordered boxes are copy-paste ready.
- Learner-relevant: Orients the learner on the deliverable and the order of the build (keys → skill file → model ids/auth).

### the-idea

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#the-idea]]`
- Summary: Defines a skill as a folder of markdown files the agent reads before acting, "like a playbook," and specifies the four-step `/generate` pipeline: STEP 1 Route (pick model + cheapest provider, read that model's recipe), STEP 2 Prep refs (load real reference images from a refs folder; never describe a logo in words), STEP 3 Generate (call the API per the recipe, poll if async, save flat into the generations folder), STEP 4 Log (write a small JSON note beside the file with prompt/model/settings).
- Key claims: Target layout is `.claude/skills/generate/SKILL.md`, `models/` (one recipe file per model), `generations/` (flat outputs, no subfolders), `refs/`, and `.env`; one flat folder lets any gallery/dashboard/script read the library with zero setup; per-model recipe files make models swappable by adding one markdown file when a better model ships; rules live in the skill because the agent reads them every time, so cost gates and folder rules are enforced forever.
- Learner-relevant: The canonical mental model and directory contract for the whole build; anchors the later skill-file and recipe sections.

### setup

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#setup]]`
- Summary: "Get your keys" — you don't need accounts with every AI lab because aggregators host many models behind one key and one bill. Sign up for three providers and copy the API key names into a `.env` file.
- Key claims: Kie AI (`kie.ai`) → `KIE_API_KEY`, often the cheapest route for popular models and has file upload to turn local images into public URLs; fal.ai (`fal.ai`) → `FAL_KEY`, fast with a huge catalog and the best docs of the three, first fallback; WaveSpeed AI (`wavespeed.ai`) → `WAVESPEED_API_KEY`, broad catalog, second fallback. Costs: draft image on a cheap model ~$0.01–$0.03 (the default, iterate freely), quality image on a top model ~$0.05–$0.15 (finals only), video ~$0.20–$0.35 per second so a 10-second clip is $2–$3.50 — the reason cost gates exist.
- Learner-relevant: Concrete provider/key/cost facts a lesson can cite; the cost figures justify the guardrails section.

### the-brain

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#the-brain]]`
- Summary: "Write the SKILL file" — create `.claude/skills/generate/SKILL.md`; the frontmatter tells the agent when to use the skill and the body tells it how. Provides a copy-paste starter to swap models and folder paths into.
- Key claims: Frontmatter uses `name: generate` and a `description` listing triggers (`/generate`, generate image, generate video, create image, thumbnail, animate); Models table maps tasks to default model + recipe path (Image default, Image quality, Video default) and instructs reading the recipe before every generation. Provider routing: default to the lowest-cost provider that runs the model well (check Kie AI, fal.ai, WaveSpeed AI), fall back to the next provider if cheapest lacks the model or errors, and never hide a provider swap (say which route ran and why). Output: save every file FLAT into a named generations folder, no subfolders, references live in `generations/refs/`, naming convention `{project}_{description}_{timestamp}.{ext}`. Rules: quote cost and wait for explicit go before any paid video run (one approval = one run); draft on the cheap image model first and rerun on a quality model only for a favourite; never describe a logo or face in text — pass the real image file or stop and ask; run multiple generations one at a time to avoid rate limits; after every save write the sidecar log.
- Learner-relevant: The single most teachable artifact — the exact skill contract and rule set the rest of the guide enforces.

### the-recipes

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#the-recipes]]`
- Summary: "One file per model" — each model gets a markdown file in `models/` holding everything the agent needs to call it: endpoint, auth, request shape, response handling. Fill the template from the provider's API docs, about ten minutes per model, once.
- Key claims: Template fields are Model ID (the exact id), Provider (Kie AI / fal.ai / WaveSpeed AI), Method (Sync = instant reply or Async = submit then poll), Type (Image or Video), API key (`.env -> KEY_NAME`), Docs link, Cost (rough per image/per second), plus sections Endpoint (`POST https://...`), Request format (exact JSON body with prompt, aspect ratio, resolution, reference image fields), Response handling (base64 field or download URL; for async the status endpoint and the "done" field), and Notes (rate limits, max sizes, content rules, upload quirks). The async pattern: POST the job → reply contains a task id; poll the status URL every 5–10 seconds; status says complete and the reply contains a file URL; download immediately because result URLs often expire in hours; save into the generations folder then write the log. Start with two recipes (one cheap image, one video) and add more as markdown files.
- Learner-relevant: The reusable recipe schema and the canonical async video workflow; directly supports writing the first model files.

### the-models

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#the-models]]`
- Summary: "Five worth wiring up" — two image and three video models covering almost every job, each row giving the exact model id, hosting provider, and rough cost, plus how each provider authenticates and which models are sync vs async.
- Key claims: **Nano Banana 2** — everyday images, cheap/fast/strong with reference images; Google AI Studio (also on fal.ai); id `gemini-3.1-flash-image-preview`, Lite variant `gemini-3.1-flash-lite-image` at about $0.034 per 1K image. **GPT Image 2** — text inside images (signs, posters, menus, packaging, UI mockups); fal.ai; id `openai/gpt-image-2`, edit endpoint adds `/edit`, about $0.05 per image at medium. **Kling 3.0** — general video sensible default, good motion, fair price; Kie AI; id `kling-3.0/video`, `std` is 720p and `pro` is 1080p, 3–15 seconds. **Veo 3.1** — higher quality video from a start frame, slower; Google AI Studio; id `veo-3.1-generate-preview`, 8-second clips, 720p, 1–4 samples per call. **Seedance 2.0 Fast** — reference-to-video, feed up to 9 images and it animates them; fal.ai; id `bytedance/seedance-2.0/fast/reference-to-video`, $0.24 per second at 720p so a 5-second clip is about $1.21. Auth shapes: **Google AI Studio** puts the key in the URL (`POST .../models/{model-id}:generateContent?key={GOOGLE_KEY}`); **fal.ai** uses a header with the word `Key` (`POST https://fal.run/{model-id}` with `Authorization: Key {FAL_KEY}`); **Kie AI** uses a header with `Bearer` (`POST api.kie.ai/api/v1/jobs/createTask` with `Authorization: Bearer {KIE_KEY}`). Sync vs async: GPT Image 2, Nano Banana, and Seedance reply in one call; Kling and Veo return a job id and require polling a status endpoint every 10–15 seconds until done. Start with Nano Banana 2 Lite + Kling 3.0 (cheapest in their lane, and teach both sync and async patterns); add GPT Image 2 when readable text is needed, Veo 3.1 when Kling's motion isn't good enough for a hero shot, Seedance 2.0 Fast to animate reference images. If a call returns "model not found," copy the fresh id from the provider's model page and update the recipe file — the only maintenance this system needs.
- Learner-relevant: The concrete model/id/provider/cost table and the three auth patterns — the densest set of citable technical facts in the source.

### the-guardrails

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#the-guardrails]]`
- Summary: "Rails that save money" — explains why each of the five rules already in the SKILL starter earns its place, and fully specifies the optional sidecar log feature.
- Key claims: Quote before video — the agent states model, duration, resolution, and expected dollars, then waits for explicit go; quoting alone is not approval and one approval covers one run (video is the expensive lane). Draft cheap, finish pretty — iterate on the $0.01 model and only rerun a favourite on a quality model, so you stop paying premium prices for throwaway drafts. Real refs, never described — a logo described in words comes back wrong every time (wrong shape, colors, made-up details); keep real files in `generations/refs/` and pass them into the API call. One flat folder — every output lands in the same folder, no subfolders; sorting into folders breaks every tool that reads the library and you'll never remember the scheme. Sidecar log — after every save the agent writes a small JSON file next to the media with the same basename plus `.json` extension; fields are `model`, `prompt` (full text sent to the API), `refs` (e.g. `["refs/logo.png", "refs/headshot.jpg"]`), `params` (e.g. `{"aspect": "16:9", "size": "2K"}`), and `created` (ISO timestamp). Same basename + `.json` is the contract, so any future tool or folder search can recover exactly how any file was made.
- Learner-relevant: The cost-governance contract and the sidecar-log JSON schema a lesson can implement verbatim.

### bonus-gallery

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#bonus]]`
- Summary: "The gallery wall" — a verbatim prompt that turns the generations folder into a single-file local gallery page (no server), and wires the folder rule into your `CLAUDE.md` so future generations appear automatically.
- Key claims: The gallery prompt must build a single web page showing every image and video in one bento/masonry wall, reading one folder called `generations` with newest at the top; masonry layout where tiles keep their own shape (nothing cropped or squashed), rounded cards, even gaps, 4 columns degrading with window width; videos play quietly on hover and stop on mouse-away, images static; click a tile to open it large in the center, click outside to close; no search, filters, tabs, or side panels; one file that runs by opening it; when done, add a line to `CLAUDE.md` so anything `/generate` makes saves into that same folder and shows on the page automatically, without auto-opening the page each time. Why it works: the skill saves flat into one folder, so the wall never needs updating — new generations just appear; the final paragraph wires the rule into the agent's memory file so skill and gallery stay pointed at the same folder.
- Learner-relevant: A ready-to-paste prompt and a concrete `CLAUDE.md`-as-memory pattern; ties the flat-folder rule to a visible payoff.

### where-this-goes-next

- Locator: `[[sources/video-editing/20261003/generate-skill-guide.pdf#where-this-goes-next]]`
- Summary: Closing section arguing the value is the system around generation — routing that keeps costs sane, gates that stop surprise bills, and a library that never loses a prompt — and recapping the six deliverables; promotes the pre-built RoboNuggets community version at `skool.com/robonuggets`.
- Key claims: "The easy part is generating a pretty picture" — what people and businesses pay for is the surrounding system, which is a sellable skill. Recap of what you now have: (1) three provider keys in `.env` covering nearly every image and video model; (2) a SKILL file routing every request to the cheapest capable model with fallbacks; (3) a recipe file per model so adding a model is ten minutes of markdown; (4) guardrails — cost quotes before video, cheap drafts first, real reference images, one flat folder; (5) a sidecar log beside every file so no prompt is lost; (6) a gallery wall showing everything automatically. Workflow reduces to typing `/generate` and asking for something.
- Learner-relevant: A summary checklist usable as a completion rubric for the whole subject.

## Sources

- `[[sources/video-editing/20261003/generate-skill-guide.pdf]]`
