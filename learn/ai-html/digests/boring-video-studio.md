---
source: boring-video-studio
source_type: codebase
source_lines: 11132
language: Markdown/JS/HTML
file_count: 58
status: absorbed
absorbed_at: 2026-09-11
created: 2026-09-10
updated: 2026-09-10
---

# Digest — boring-video-studio

## Overview (L1)

- **skills/boring-video/** — Orchestrator skill that chains four planning stages (beats → narration → scenes → storyboard) then hands off to HyperFrames for production; manages intake (presentation type, collaboration mode, voice, design direction) and artifact lifecycle
- **skills/to-spec-beats/** — Turns source material into `BEATS.md`: audience definition, thesis, reverse-iceberg arc (hook → value → evidence → implications → close), per-beat cognitive job/claim/evidence/setup/handoff/duration
- **skills/to-narration/** — Converts `BEATS.md` into `NARRATION.md`: spoken-draft writing (one thought per sentence, concrete subjects, spoken transitions), beat-boundary anchoring (`<beat-id>-pNN`), timing budget validation
- **skills/to-scenes/** — Transforms beats + narration into `SCENES.md`: physical/spatial expression of abstract concepts, continuity objects, shot-scale variation, visual peaks, feasibility classification against the HyperFrames capability envelope
- **skills/to-storyboard/** — Converts scenes + narration into HyperFrames `STORYBOARD.md`: frame boundaries (hard edits, new worlds, independent units), shot-moment decomposition (state→action→final-state, camera/attention path, narration anchors), duration estimates
- **skills/to-video/** — Handoff skill: confirms artifact ID consistency, loads HyperFrames workflow, delivers planning artifacts + voice branch, optionally invokes ListenHub TTS
- **skills/verysmallwoods-video/** — Complete personal video pipeline for the "VerySmallWoods" brand: design selection, video via HyperFrames/faceless-explainer, five-ratio covers, YouTube/Bilibili copy, blog, tweet, with references for each step
- **demo/** — Four showcase HyperFrames projects (`claude-showcase`, `raycast-showcase`, `swiss-showcase`, `storyboard-demo`) + poster images, demonstrating real output from the pipeline
- **CHANGELOG.md** — Detailed version history from v0.1.0 (ListenHub TTS + producing-video) through v0.5.0 (cover-design skill, producing-video motion-patterns/scene-transitions/runtime-adapters references)

## Structure (L2)

### skills/boring-video/SKILL.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/skills/boring-video/SKILL.md]]`
- Purpose: Top-level orchestrator — resolves presentation choice (faceless/footage/screen/talking-head/mixed), collaboration mode (storyboard review vs agent-executed), voice (HyperFrames/ListenHub/user-recording/none), and design direction from user input; then chains `to-spec-beats → to-narration → to-scenes → to-storyboard → to-video` in order, requiring each artifact's completion criterion before advancing; downstream findings return to the owning artifact
- Key exports: Intake protocol (4 questions), chain execution order, handoff contract
- Dependencies: All `to-*` skills, HyperFrames `/hyperframes` entry point
- Learner-relevant: Teaches artifact-chain orchestration — each skill produces a durable, independently reviewable document; the chain enforces sequential completeness without coupling

### skills/to-spec-beats/SKILL.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/skills/to-spec-beats/SKILL.md]]`
- Purpose: Source material → `BEATS.md` content architecture — reads all sources, resolves factual uncertainty, defines audience/thesis/viewer-shift/duration/scope, builds reverse-iceberg arc (hook in viewer language, value by beat two, then evidence/mechanism/implications/close), gives each beat one cognitive job, writes structured beats with job/claim/evidence/setup/handoff/duration, audits for claim support and dependency chain
- Key exports: `BEATS.md` schema (frontmatter + per-beat sections), beat ID stability contract
- Dependencies: Source materials, project fact-checks
- Learner-relevant: Teaches content architecture as the first durable artifact — the beat is a stable interface that survives wording and visual revisions; demonstrates "reverse-iceberg" narrative structure for educational video

### skills/to-narration/SKILL.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/skills/to-narration/SKILL.md]]`
- Purpose: `BEATS.md` → `NARRATION.md` spoken draft — writes for the ear (one thought/sentence, concrete subjects/verbs, spoken transitions, first-use terminology explanation), lets visuals carry structure/comparison/transformation, marks paragraph-to-beat boundaries without visual instructions, assigns stable `<beat-id>-pNN` anchors, validates timing at user's speaking rate
- Key exports: `NARRATION.md` schema (frontmatter + anchored paragraphs), paragraph anchor stability contract
- Dependencies: `BEATS.md`, cited sources, user voice conventions
- Learner-relevant: Teaches narration-as-evidence — the draft remains revisable by visual direction; demonstrates how to write for the ear (concrete, one-thought-per-sentence) while preserving beat-level traceability

### skills/to-scenes/SKILL.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/skills/to-scenes/SKILL.md]]`
- Purpose: Beats + narration → `SCENES.md` visual direction — finds physical/spatial expression for abstract beats (give concept a body, put it in a world, cause visible state change), groups/splits beats by visual continuity, designs film-level variation (worlds, shot scales, visual peaks, rhythm), classifies feasibility against HyperFrames capability envelope, flags narration sentences that fight visual events
- Key exports: `SCENES.md` schema, scene format reference, feasibility classification
- Dependencies: `BEATS.md`, `NARRATION.md`, design truth, `references/hyperframes-capability-envelope.md`, `references/scene-format.md`
- Learner-relevant: Teaches scene design as "small events in worlds, not containers for information" — demonstrates how to translate abstract argument structure into physical visual events while respecting production feasibility

### skills/to-storyboard/SKILL.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/skills/to-storyboard/SKILL.md]]`
- Purpose: Scenes + narration → HyperFrames `STORYBOARD.md` — chooses frame boundaries (hard edit / new world / independent unit), decomposes each frame into ordered shot moments (moment ID, initial→action→final state, camera/attention path, narration anchors or `silent`, handoff), uses canonical HyperFrames fields with `boring_*` extras for supplementary data, audits narration coverage and action legibility
- Key exports: `STORYBOARD.md` schema, frame boundary rules, shot-moment decomposition contract
- Dependencies: `SCENES.md`, `NARRATION.md`, `/hyperframes-core`, `references/storyboard-format.md`
- Learner-relevant: Teaches storyboard as the bridge between creative direction and production buildability — each frame is an independently buildable block; shot moments describe what the viewer sees, not what the code does

### skills/to-video/SKILL.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/skills/to-video/SKILL.md]]`
- Purpose: Production handoff — confirms all four artifacts agree on stable IDs, loads HyperFrames and its workflow route contract, delivers planning artifacts + source material + design constraints + presentation/collaboration/voice choices, optionally invokes ListenHub TTS at the workflow's voice gate, stays inside HyperFrames through its completion criterion
- Key exports: Handoff protocol, voice-gate integration, artifact-consistency check
- Dependencies: `BEATS.md`, `NARRATION.md`, `SCENES.md`, `STORYBOARD.md`, `/hyperframes`, `/listenhub-tts`, `/media-use`
- Learner-relevant: Teaches production handoff as a contract — the planning skills produce durable truth; HyperFrames owns the production loop and can revise artifacts through its own review

### skills/verysmallwoods-video/SKILL.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/skills/verysmallwoods-video/SKILL.md]]`
- Purpose: Complete personal video pipeline — orchestrates topic selection, design choice (from `references/designs.md`), video production via HyperFrames/faceless-explainer, narration (TTS or user-recorded with alignment/correction), five-ratio covers (16:9/16:10/4:3/3:4/9:16), YouTube/Bilibili platform copy, blog post, tweet; delivers 4K master + 1080p, covers, platform copy, blog, tweet
- Key exports: 6-step workflow (topic → video → audio → covers → platform copy → blog/tweet), delivery checklist
- Dependencies: `/hyperframes`, `/faceless-explainer`, `/hyperframes-animation`, `/hyperframes-creative`, references for designs/audio/covers/platform-copy/blog-and-tweet
- Learner-relevant: Teaches "one topic = one project directory" structure and the complete publishing pipeline from idea to platform-ready artifacts; demonstrates how an orchestration skill adds three capabilities on top of a base production skill (design choice, user-recorded audio, publishing materials)

### demo/storyboard-demo/

- Locator: `[[sources/ai-html/20260910/boring-video-studio/demo/storyboard-demo/]]`
- Purpose: Working HyperFrames storyboard demo — contains `STORYBOARD.md` (the planning artifact), `hyperframes.json` (project config), `index.html` (composition entry), `compositions/` directory (scene files), `package.json` (dependencies), `meta.json` (metadata). Demonstrates the output format that `to-storyboard` produces
- Key exports: `STORYBOARD.md` example, HyperFrames project structure
- Dependencies: HyperFrames runtime
- Learner-relevant: Shows the concrete artifact that `to-storyboard` produces and how it integrates into a HyperFrames project — the bridge between planning text and buildable video

### demo/claude-showcase/, demo/raycast-showcase/, demo/swiss-showcase/

- Locator: `[[sources/ai-html/20260910/boring-video-studio/demo/claude-showcase/]]`, `[[sources/ai-html/20260910/boring-video-studio/demo/raycast-showcase/]]`, `[[sources/ai-html/20260910/boring-video-studio/demo/swiss-showcase/]]`
- Purpose: Showcase HyperFrames projects demonstrating real pipeline output — each contains `hyperframes.json`, `index.html`, `meta.json`, `package.json`. The Claude and Raycast showcases demonstrate product-focused video; the Swiss showcase demonstrates design-system-aware video composition
- Key exports: Complete runnable HyperFrames projects
- Dependencies: HyperFrames runtime
- Learner-relevant: Concrete examples of what the boring-video pipeline produces — useful for understanding the target output format before starting the planning chain

### CHANGELOG.md

- Locator: `[[sources/ai-html/20260910/boring-video-studio/CHANGELOG.md]]`
- Purpose: Version history documenting skill evolution — v0.1.0 (ListenHub TTS + producing-video foundation), v0.2.0 (blockframe-video orchestration + full-ratio covers), v0.3.x (cover-design skill, brand-icons, finance-stock-video domain layer, listenhub-tts heteronym scanning), v0.4.x (producing-video preview step, project directory structure), v0.5.0 (cover-design consolidation, motion-patterns/scene-transitions/runtime-adapters references). Records specific踩坑 (pitfalls) and their fixes
- Key exports: Version history with Added/Changed/Verified/Notes sections, external dependency notes
- Dependencies: None (meta-documentation)
- Learner-relevant: Teaches how a skill collection evolves through real-world use — each version records specific failure modes and their fixes; demonstrates structured changelog as institutional memory for agent skills

### demo/posters/

- Locator: `[[sources/ai-html/20260910/boring-video-studio/demo/posters/]]`
- Purpose: Three JPEG poster images (`claude.jpg`, `raycast.jpg`, `swiss.jpg`) — visual thumbnails for the showcase demos, used in README or documentation
- Key exports: JPEG image assets
- Dependencies: None
- Learner-relevant: Shows the visual output style of each showcase demo
