---
source: seed.ndjson
source_lines: 141
created: 2026-08-22
updated: 2026-08-22
status: absorbed
absorbed_at: 2026-09-08
---

# Digest — seed.ndjson

The seed content imported into Sanity for the Vertex learning platform: 141 NDJSON documents — 6 categories, 5 instructors, 10 courses, and 120 lessons. Authored by hand (in `studio/scripts/seed/content.mjs`) and expanded into importable NDJSON by `build-ndjson.mjs`, then imported idempotently with stable `_id`s and `_key`s so re-imports don't duplicate. Every lesson points at one real, verified YouTube video (per `videos.json`). The seed exists so the site has realistic content to render and the search feature has real data to rank against.

## Overview (L1)

- **Categories (6)** — web-development, ai-engineering, backend-infrastructure, data, languages, security. Each has title/slug/description.
- **Instructors (5)** — fictional instructors with name, slug, expertise, and bio.
- **Courses (10)** — one per topic, each with 4 modules (each module has an ordered list of lessons). Courses: Next.js App Router in Depth, React Performance Engineering, TypeScript for Application Developers, Building AI Apps with LLMs, Retrieval-Augmented Generation from Scratch, Python for Data Work, System Design Foundations, PostgreSQL for Developers, DevOps with Docker and Kubernetes, Practical Web Security.
- **Lessons (120)** — 12 per course (4 modules × 3 lessons, roughly), each a real lesson document with title/slug, a real YouTube video URL, duration, key points, Portable Text notes, and resources.
- **Video data (120)** — each lesson maps to a real YouTube video (id, title, channel, duration, and the search query used to find it), stored in `videos.json` and resolved into URLs at seed build time.

## Sections (L2)

### Content types and counts
- Locator: `[[sources/vertex-learning-platform/seed.ndjson#content-types]]`
- Summary: The NDJSON documents cover exactly four Sanity document types: category (6), instructor (5), course (10), lesson (120). No video or agent-context documents appear here — those are produced by the ingestion pipeline and context import respectively.
- Key claims: 141 total documents; ids are stable slugs like `category.web-development`, `course.nextjs-app-router-in-depth`, `instructor.mira-kovac`, lesson ids under each course.
- Learner-relevant: This is the content layer the read-only pages render and search ranks against.

### Course/module/lesson shape
- Locator: `[[sources/vertex-learning-platform/seed.ndjson#course-shape]]`
- Summary: Each course carries marketing fields (summary, cover, level, price), an instructor reference, a category reference, learning outcomes, and 4 embedded modules. Each module holds a title, summary, and an ordered list of lesson references; module and lesson numbers are derived from order, never stored.
- Key claims: Lessons do not store their parent course — the course references them; lesson numbering (5.1) is derived. Each lesson has a real video URL, duration, key points, and rich text notes.
- Learner-relevant: The seed is the living proof of the AGENTS.md data-model decisions (modules embedded, lessons standalone, numbers derived, courses own the ordering).

### Video mapping
- Locator: `[[sources/vertex-learning-platform/seed.ndjson#video-mapping]]`
- Summary: Every seeded lesson maps to one verified real YouTube video across ten topics (Next.js, React, TypeScript, LLMs, RAG, Python, system design, PostgreSQL, DevOps, security), each found via a specific search query.
- Key claims: The content is coherent top-to-bottom — a course's lessons genuinely cover that course's topic, which is what makes search return non-junk results.
- Learner-relevant: Content quality is a precondition for search quality; the seed deliberately models that.
