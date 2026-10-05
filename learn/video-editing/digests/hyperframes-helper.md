---
source: hyperframes-helper
source_type: codebase
source_lines: 127
language: python
file_count: 2
status: absorbed
absorbed_at: 2026-10-03
created: 2026-10-03
updated: 2026-10-03
---

# Digest — hyperframes-helper

## Overview (L1)

- `hyperframes-helper` — A Claude Code skill kit layered on top of [Hyperframes](https://github.com/heygen-com/hyperframes), HeyGen's open-source HTML-to-MP4 composition framework. It organises video production into three effort levels (Level 1 website-to-video, Level 2 storyboards, Level 3 guided talking-head videos) and ships a step-DAG of tooling: HTML composition/storyboard scaffolds, copy-paste motion-graphics recipes, and a Python/ffmpeg cut pipeline (silence cut → faster-whisper transcription → last-take retake cut). Created by Jay / RoboNuggets, CC BY 4.0.

## Structure (L2)

### `README.md`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/README.md]]`
- Purpose: Kit landing page — explains the three levels, install/quick-start, feature list, usage examples, attribution.
- Key exports: three-level model; install snippet (`npx hyperframes@latest`, `npx skills add heygen-com/hyperframes`); credits (Hyperframes Apache 2.0, video-use, 21st.dev, GSAP, D3, faster-whisper).
- Dependencies: Hyperframes CLI; `.claude/skills/hyperframes-helper/` templates.
- Learner-relevant: Frames the whole course — Level 1 website-to-video, Level 2 storyboards, Level 3 guided videos; the mental map for when each production path applies.

### `CLAUDE.md`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/CLAUDE.md]]`
- Purpose: Agent-facing instructions and behavior rules for the kit.
- Key exports: "invoke the skill before doing anything else" on any Hyperframes/HTML-to-MP4 request; behavior rules — never modify Hyperframes core; always run `npx hyperframes@latest lint` with 0 errors before claiming done; quote cost + wait for explicit go before paid generation (e.g. Kling-rendered Claude flip videos); default to multi-clip `data-media-start` pattern when Studio-draggable cuts are wanted, single-clip otherwise.
- Dependencies: `SKILL.md`, `templates/`.
- Learner-relevant: Shows the operational guardrails (lint gate, paid-API consent, single vs multi-clip choice) that keep agent-driven video production safe and honest.

### `.claude/skills/hyperframes-helper/SKILL.md`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/.claude/skills/hyperframes-helper/SKILL.md]]`
- Purpose: The main skill file — full three-level workflow, 16 Hyperframes lint gotchas, multi-clip cut-editing pattern, Studio editing limits, highest-quality render recipe.
- Key exports: Install commands (`node --version`, `npx hyperframes@latest --help/init/preview/lint/render`); Level 3 pipeline Step 01 cut (`ffmpeg -i input.mkv -af "silencedetect=noise=-30dB:d=0.4" -f null -`), Step 02 storyboard, Step 03 motion graphics; 16 lint rules — every timed element needs `class="clip"` + `data-start` + `data-duration` + `data-track-index`; GSAP must not animate `.clip` (wrap in clip-shell + inner div); same-track clips cannot overlap (float precision); visually-overlapping elements need separate tracks; timeline paused + registered as `window.__timelines["main"]`; deterministic only (no `Math.random`/`Date.now`/`fetch`); video uses `muted` + separate `<audio>`; source video needs 1s GOP (`-g 30 -keyint_min 30 -force_key_frames "expr:gte(t,n_forced*1)"`); canvas redraw via `tl.eventCallback('onUpdate', ...)` not `requestAnimationFrame`; `repeat: -1` forbidden (`gsap_infinite_repeat`) — derive finite `repeats = Math.max(0, Math.floor(HOLD / CYCLE) - 1)`; one `<audio>` element to avoid echo; pseudo-elements cannot be GSAP'd; strip inverted Studio inline `z-index`; stacking-context and `z-index: -1` gotchas; multi-clip pattern (`data-media-start`, alternate tracks 2/3, one `<audio>`); Studio limits (can drag start/track/duration/left-handle-media, cannot split mid-source, no undo/multi-select); high-quality render (`--quality high --crf 16 --gpu`).
- Dependencies: references all `templates/` files and external links (Hyperframes docs, video-use, 21st.dev, GSAP).
- Learner-relevant: The core curriculum — the three-level decision model plus the concrete render/lint constraints that make HTML-to-MP4 deterministic.

### `.claude/skills/hyperframes-helper/templates/composition-template.html`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/.claude/skills/hyperframes-helper/templates/composition-template.html]]`
- Purpose: Scaffold for a new Hyperframes composition (RoboNuggets "master-slides" design system).
- Key exports: RoboNuggets design tokens (`--accent: #ff6b1a`, `--teal`, `--violet`…); `#root` with `data-composition-id="main"`, `data-width="1920"`, `data-height="1080"`; always-on `#hexBg` canvas (track 0) and vignette (track 1); title and outro scene clips (track 2); `.watermark` clip (track 9); `pixelAgentSvg()` / `SIDEBAR_ICON_DATA` pixel-art agent renderer; deterministic `drawHex(time)` canvas; paused GSAP timeline registered as `window.__timelines['main']` with `onUpdate` hex repaint and slide-up-fade tweens.
- Dependencies: GSAP 3.14.2 via jsDelivr CDN; Google Fonts (Instrument Serif, Outfit, JetBrains Mono).
- Learner-relevant: Shows the canonical composition skeleton — clip shells with timing attributes, deterministic canvas, and paused/registered timeline — as a working example of every framework rule.

### `.claude/skills/hyperframes-helper/templates/storyboard-template.html`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/.claude/skills/hyperframes-helper/templates/storyboard-template.html]]`
- Purpose: Level 2 storyboard starter — 5 scene cards with scaled 1920×1080 layout previews and motion-note panels.
- Key exports: Header (title, meta pills, proportional `.timeline-bar` with flex per scene duration), sticky `.toc` nav, `.scene` cards (two-pane: `.preview` at 880×495 = 50% scale + `.notes`), placeholder classes (`pv-video` "YOU", `.pv-card.c-polaroid/c-editorial/c-comics/c-product`, `.pv-panel.violet/cyan/teal/amber/pink`, `.pv-stage`, `.pv-watermark`, `.pv-tag`, `.pv-outro`, `.pv-label`, `.pv-arrow`), per-scene color coding; decorative `#hexBg` canvas using `requestAnimationFrame` (preview-only, not render).
- Dependencies: Google Fonts; standalone (no Hyperframes runtime).
- Learner-relevant: Teaches layout-before-commit — iterating a visual plan in ~1 min HTML cycles instead of ~15 min Studio cycles, and using scaled previews to plan 1920×1080 shots.

### `.claude/skills/hyperframes-helper/templates/recipes.md`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/.claude/skills/hyperframes-helper/templates/recipes.md]]`
- Purpose: Copy-paste pattern library (10 recipes) for production motion graphics.
- Key exports: 1) liquid-glass card (`backdrop-filter: blur(24px) saturate(160%)`); 2) pulse border via `@property --bg-angle` conic-gradient mask (with warning CSS infinite animations do not seek); 3) white-glow text over video (`text-shadow` layers); 4) animated SVG curved underline (`stroke-dasharray`/`stroke-dashoffset` GSAP draw); 5) chroma key via SVG `feColorMatrix` soft alpha + 12% despill (avoid `feComponentTransfer type="discrete"`); 6) multi-clip cut-editing pattern; 7) pulsing-glow rings with finite GSAP `repeat`; 8) corner notes / deco pills (ROBOLABS pill); 9) D3 `geoOrthographic` wireframe globe with halftone land dots (Natural Earth `ne_110m_land.json` wrapped as `window.NE_LAND`, `clearRect` for transparency); 10) pixel-art agent icon row (`SIDEBAR_ICON_DATA`, 8-col mirrored render); 11) Python module-generator pattern (emit N near-identical slides from a template + data dicts).
- Dependencies: GSAP, D3 v7, Natural Earth GeoJSON; references SKILL.md critical rules.
- Learner-relevant: The reusable motion-graphics vocabulary — concrete implementations of glass, glow, chroma key, globe, and the cut-editing pattern that appear across real productions.

### `.claude/skills/hyperframes-helper/templates/silence-cut.sh`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/.claude/skills/hyperframes-helper/templates/silence-cut.sh]]`
- Purpose: Step 01 / Pass A — ffmpeg silence trim, re-encoding with tight 1s GOP keyframes for Hyperframes seek.
- Key exports: `silencedetect=noise=-32dB:d=0.25` detection; hand-built keep ranges with 0.1s keep-pad; `filter_complex` of `[0:v]trim=s:e,setpts=PTS-STARTPTS[vN]` + `[0:a]atrim=s:e,asetpts=PTS-STARTPTS[aN]` then `concat=n=N:v=1:a=1`; encode flags `-c:v libx264 -preset fast -crf 18 -r 24 -g 24 -keyint_min 24 -force_key_frames "expr:gte(t,n_forced*1)" -c:a aac -b:a 192k -movflags +faststart`; tunable knobs (threshold, duration filter, keep-pad, fps, CRF); `ffprobe` duration check.
- Dependencies: bash, ffmpeg, ffprobe.
- Learner-relevant: Teaches the first cut pass — detecting dead air, building keep ranges, and the GOP/keyframe requirement that makes source video compatible with frame-seek rendering.

### `.claude/skills/hyperframes-helper/templates/transcribe-whisper.py`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/.claude/skills/hyperframes-helper/templates/transcribe-whisper.py]]`
- Purpose: Step 01 / Pass B — faster-whisper word-level transcription (Windows-safe, no torchaudio).
- Key exports: `WhisperModel("base", device="cpu", compute_type="int8")`; `model.transcribe(path, language="en", word_timestamps=True, vad_filter=False)`; writes `<video>.transcript.json` (`info.duration`, `info.language`, per-segment `id/start/end/text/words[]` with per-word `start/end/word`) and `<video>.transcript.txt` timestamped lines.
- Dependencies: `faster-whisper` (CTranslate2, pip install).
- Learner-relevant: Produces the word-level timestamps needed to find retake clusters, and explains why faster-whisper replaces WhisperX (torchaudio libtorchaudio load errors on Windows).

### `.claude/skills/hyperframes-helper/templates/cut-retakes.py`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/.claude/skills/hyperframes-helper/templates/cut-retakes.py]]`
- Purpose: Step 01 / Pass C — last-take-rule retake removal.
- Key exports: `KEEPS` list of `(start, end)` ranges in the silence-cut timeline; builds per-clip `trim`/`atrim` + `concat=n=N:v=1:a=1` filter_complex; runs ffmpeg with the same 1s GOP flags (`-r 30 -g 30 -keyint_min 30 -force_key_frames "expr:gte(t,n_forced*1)" -crf 18`); `ffprobe` duration verification vs sum of `(end-start)`. Rules: keep only the LAST take of a repeated phrase; 0.04s pad baked into timestamps; watch tail bleed; ffmpeg silently truncates if source is shorter than requested end.
- Dependencies: Python `subprocess`, `pathlib`; ffmpeg, ffprobe.
- Learner-relevant: Teaches retake removal by the "last take wins" heuristic and how to build a pure-ffmpeg trim/concat edit from transcript-derived cutoff points.

### `LICENSE`

- Locator: `[[sources/video-editing/20261003/hyperframes-helper-main/LICENSE]]`
- Purpose: Creative Commons Attribution 4.0 International (CC BY 4.0), Copyright (c) 2026 RoboNuggets — free to share/adapt, including commercially, with attribution.
- Key exports: CC BY 4.0 terms and canonical links.
- Dependencies: none.
- Learner-relevant: Licensing constraint governing reuse of the kit (attribution required).
