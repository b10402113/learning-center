---
source: "sources/agent-as-service/20261101/9-Wk8 - Expanding Beyond/3-2️⃣ Learning How to Learn/resources/youtube-gemini-summarizer"
source_type: codebase
source_lines: 232
language: javascript
file_count: 4
status: absorbed
absorbed_at: 2026-11-01
created: 2026-11-01
updated: 2026-11-01
---

# L1 overview

A tiny Chrome extension (MV3) shipped as the Wk8 "Learning How to Learn" resource: it injects a "Gemini" button into YouTube's watch-page action bar; clicking it copies a `Summarize this video: <url>` prompt to the clipboard and opens Gemini in a new tab. 4 source files, 232 lines total — a real, minimal example of a content-script extension a solo practitioner could have their agent build.

# L2 detail

- `#L1-L31` — manifest.json — MV3 manifest: name/version/description, icons, one content script (`content.js` + `content.css`) matching `https://www.youtube.com/*`, `run_at: document_idle`, permissions `activeTab` plus YouTube host permission. The extension's whole attack surface.
- `#L32-L69` — README.md — install steps (chrome://extensions → Developer mode → Load unpacked), usage (click Gemini button near the video), privacy notes: no data collection, YouTube pages only, needs a Gemini-capable Google account.
- `#L70-L191` — content.js (lines 1-122 of the file) — button creation with inline SVG sparkle icon, `handleGeminiClick` (clipboard write of the summarize prompt, success feedback, `window.open` to the Gemini app, 2s reset), and `injectButton` targeting `ytd-watch-metadata #top-level-buttons-computed`, inserting after the Share button with stale-button cleanup.
- `#L192-L232` — content.js (lines 95-122) — SPA resilience: a `MutationObserver` on `document.body` that injects only on `/watch` paths, removes the button when navigating away, plus the initial 1s-delayed injection. The pattern that makes a content script survive YouTube's SPA navigation.
