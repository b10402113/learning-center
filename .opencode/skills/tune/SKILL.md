---
name: tune
description: Extract a YouTuber's voice from their transcripts into a TUNE.md voice profile.
disable-model-invocation: true
argument-hint: "Which author's voice should be profiled? (e.g. /tune justin-sung)"
---

Capture one author's speaking style as `tune/<author-slug>/TUNE.md`. Invoke as `/tune <author-slug>`. The profile is a styling layer: writer skills apply it when a subject's `MEMORY.md` names the tune, while pedagogy stays governed by `MEMORY.md`. The shared contract — directory, format, merge lifecycle, consumption rules — lives in `docs/reference/tune.md`.

Prereqs: `tune/<author-slug>/` exists with transcript files (`.srt`, `.txt`, `.vtt`). Run this *before* `/learn-init`; learn-init lists the resulting TUNE.md for the learner to choose.

1. **Resolve.** Map the argument to `tune/<author-slug>/`. If it does not match a folder name, kebab-case the folder names (spaces → dashes, lowercase) and match on that.
2. **Inventory.** List transcripts in the folder. Parse SRT (drop index and timestamp lines, join caption blocks into flowing text); accept plain text files as-is. Warn and skip empty or near-empty files.
3. **Compare.** Read the existing `TUNE.md` `files` hashes if present. Only new or changed transcripts need analysis; unchanged ones are skipped.
4. **Analyze.** Dispatch one sub-agent per new/changed transcript, in parallel. Each reads only `tune/<author>/` and returns style observations per the `docs/reference/tune.md` rubric — explanation moves, style habits, rhetorical devices, a negative list, and attributed exemplars. Observations are behaviors, not verbatim words; only exemplars are quoted. Keep the returned message small.
5. **Merge.** Combine the observations into the TUNE.md structure, preserving existing observations and hand edits. Add new observations; remove one only when a new one contradicts it with evidence.
6. **Confirm.** Write `tune/<author-slug>/TUNE.md` with the `files` fingerprints and the current date. Present the profile with one short voice sample (2–3 sentences written in the style) and ask the learner to confirm. On disagreement, merge their corrections and repeat.
7. **Verify.** Every exemplar is a verbatim quote attributable to a listed transcript, every section has content, and the `files` hashes match the folder.

Completion: `TUNE.md` exists, the learner confirmed the voice, and writer skills can apply it via a subject's `MEMORY.md`.
