# Split long sources into part files with part-local line addressing

A long source currently lives as one `.txt` — the principle-pi book is 25,393 lines. Digests are already split into `<stem>.<n>.part.md`, but every citation still points into that single file with a global `#Lx-Ly`. Reading one part means opening the whole file, and the line address only makes sense against the unsplit original.

We split long text sources into part files and make the part file the unit of citation.

## Decision

- Add `scripts/split-sources.mjs` with `--dry-run` and `--apply`. The dry run prints a table (chunk, original line range, target filename, line count, first heading) and writes nothing. `learn-init` and `ingest` must run the dry run, show the table, get explicit confirmation, and only then run `--apply`.
- Split `.txt` sources over 3000 lines or 250 KB.
- Cut at chapter/section headings. Merge a section under ~200 lines into the next one; split a section over ~2000 lines at a subheading or paragraph boundary.
- Name chunks `<stem>.<n>.part.txt` in the source's own directory. This mirrors the existing digest name `<stem>.<n>.part.md`; citation rewriting is just a `.md` → `.txt` swap.
- Keep one chunk per digest part. A part digest's `source` points at its chunk and its `source_lines` equals that chunk's real line count. `verify` enforces the pairing for sources that have a manifest.
- Write `<stem>.parts.json` next to the chunks. It records the original filename, total line count, and each part's original range and chunk filename. `verify` requires the ranges to tile the original with no gap and no overlap and to sum to the recorded total.
- Delete the original `.txt` after a successful apply. Keep the PDF in place; `pdf-backfill` skips extraction when `<stem>.*.part.txt` already exists, so a later run cannot recreate the long file.
- Citations use part-local line numbers. A range that would cross a boundary becomes two citations; a digest L2 entry that crosses is split.
- Migrate principle-pi in the same change: split the book, rewrite its 19 digests and 46 citations mechanically from `.parts.json`.

## Rejected

- **Keep global line numbers and add an offset map.** Preserves old citations, but every reader has to convert before opening a file, and `source_lines` stops meaning anything.
- **Cite digest L2 ranges instead of source lines.** Loses the ability to trace a claim back to a line of the original.
- **Split inside `pdf-backfill` without confirmation.** Fastest, but removes the review step and makes the deletion of the original unreviewable.

## Consequences

- Generated files now exist under `sources/`. This is an explicit, narrow exception to "sources are immutable": they are derived, recorded in `.parts.json`, and never edited by hand.
- Global line numbers from earlier runs are gone. Anything outside the repo that cites them cannot be resolved without `.parts.json`.
- `verify` gains only the coverage check and the chunk/digest pointer check. It already validates `source_lines` and range bounds, so citation checks need no change.
- The 19 existing principle-pi digests keep their filenames; only their `source`, `source_lines`, and L2 ranges change.
