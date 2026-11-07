---
source: sources/js-mastery-engineer/20261107/course/059 - Setup Design System and UI Foundation.en.txt
source_type: text
source_lines: 313
status: absorbed
absorbed_at: 2026-11-07
created: 2026-11-07
updated: 2026-11-07
---

# L1 overview

- Feature five architects and develops the design system and UI foundation: the visual language, primitives, base components, and the product's two signature shapes, the swipe card and the feed pick card, with keyboard-operable focus handling.
- The design source is a real decision: a Figma file, screenshots, or a proposed direction; the lesson researches Dribbble/Awwwards/UI8, saves UI8 movie-UI references, then deliberately asks for a proposed direction because the product is about taste, not retrieval.
- The chosen register is "quiet cinema": near-black surfaces, restrained neutral text, almost no chrome, one accent; plus a geometric sans, dark-only theme, Lucide icons, skeleton/illustrated-empty states, and shadcn components.
- It is explicitly mobile-first and native-feeling: top bar collapsing to a bottom bar, safe-area insets and dynamic viewport units, sheets on mobile, haptics on swipe commit, suppressed web tells, PWA installable now and offline later.
- Deck gestures map three outcomes to right-like, left-dislike, up-skip, driven by Motion (with use-gesture mentioned as a physics alternative); cards render real starter-deck films with hard-coded reasons until sign-in and storage exist.
- Develop splits into roughly ten steps (tokens, fonts, design.md, shadcn init, buttons, gated design route, accessibility baseline, focus ring, reduced motion, layout primitives, swipe deck, pick card, installability) and Playwright catches a fixed-tab-bar overlap defect that gets fixed.
- After seeing the live app, the human prefers a more modern reference look and re-invokes architect then develop, keeping the components but retuning the design.

# L2 detail

- `#L1-L10` — Introduces feature five, its done criteria (design.md covers type/color/spacing/components, base components handle focus and keyboard), and starts architect.
- `#L11-L33` — Reads design-conversation.md, does pre-flight, infers Tailwind v4 + shadcn, and presents the design-source options.
- `#L34-L60` — Researches movie-app designs on Dribbble/Awwwards, reviews a UI8 kit, and decides mobile-first matters.
- `#L61-L90` — Chooses to propose a direction, scopes feature five to foundation plus two cards and the shell, and picks dark-only theming.
- `#L91-L130` — Settles the quiet-cinema register, geometric sans, single accent, spacing, swipe-card contents, native mobile feel, and responsive app shell.
- `#L131-L160` — Defines three deck outcomes and gesture mapping, picks Motion, adds safe areas/haptics/suppressed web tells, PWA installability, and state components.
- `#L161-L200` — Decides card placement, accessibility baseline, design.md plus live design route, poster fallback, toasts, signed-out shell, and the amber accent.
- `#L201-L232` — Skips motion skills, fills cards with real starter-deck films and hard-coded reasons, keeps all nav destinations, skips cross-verify, and accepts the spec.
- `#L233-L262` — Notes scope auto-update after architect and the ten-step develop plan spanning tokens, shadcn, a11y, primitives, swipe deck, and installability.
- `#L263-L291` — Playwright testing finds and fixes the fixed-tab-bar defect; manual desktop and mobile checks confirm the bottom bar and native feel.
- `#L292-L313` — Feeds new references to re-architect and redevelop the look while keeping components, then previews the result.
