---
source: ui2.7
source_type: pdf
source_lines: 4569
part: 7
status: absorbed
absorbed_at: 2026-10-07
created: 2026-10-07
updated: 2026-10-07
---

# Digest — UX/UI Design Course by Designership (part 7: Foundational styles)

## Overview (L1)

- 7.0 Welcome to foundational styles — module opener; frames the reusable-style work in Figma for the Com.ai project: grid layouts, typography, colour palettes, corner radiuses, and iconography.
- 7.1 Grid layouts — the practical method for deciding how many grid layouts a project needs (fluid, fixed, hybrid) across desktop, tablet and mobile, and for keeping content centred on very wide screens.
- 7.2 Color palette — why colour drives recognition, meaning and accessibility, then a walkthrough defining a primary brand colour and generating the tint/shade system as Figma styles.
- 7.3 Typography — how to pick web-safe fonts, readability/legibility rules, and a tour of the pre-built responsive type styles (Inter).
- 7.4 Iconography — icon styles, criteria for choosing an icon set, standard sizes, and a worked activity to identify needed icons and build an icon library in Figma.
- 7.5 Shadows — finalises the foundations by verifying the pre-built global shadow styles before buttons and inputs.
- 7.6 Buttons — confirms the button primary colour and wires the icon placeholder plus instance-swap properties into the button component set.
- 7.7 Input fields — finalises input components (styling, left/right icon placeholders, show/hide toggles) then publishes the whole module-7 file as a Figma library.

## Sections (L2)

### 7.0 Welcome to foundational styles

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.0 Welcome to foundational styles Lesson Summary (Li).en.srt#welcome-to-foundational-styles]]`
- Summary: Short module introduction. States the module covers setting up reusable styles for the Com.ai project inside Figma, spanning grid layouts, typography, colour palettes, corner radiuses and iconography, and invites the learner to dive into the styles.
- Key claims: The module's job is reusable foundational styles for the project in Figma; the scope is grid layouts, typography, colour palettes, corner radiuses and iconography.
- Learner-relevant: Sets the sequence and vocabulary for the seven lessons that follow.

### 7.1 Grid layouts

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.1 Grid layouts Lesson Summary (Li).en.srt#grid-layouts]]`
- Summary: Grid layouts organize content and give pages structure in responsive web/mobile design. The lesson explains three types — fluid (content expands/contracts with viewport), fixed (content has a fixed width), and hybrid (a mix) — then walks through deciding exactly which grids this project needs by reviewing the wireframes screen by screen, and finally builds them as Figma components.
- Key claims: Fluid layouts are the most common today and suit content-heavy, device-responsive pages; fixed layouts suit designs whose layout must be held constant; hybrid layouts use a fixed sidebar (e.g. ~200px) with a fluid content area, common in dashboards and three-column/sidebar layouts; for this project the desktop reduces to just two grids — a standard 12-column grid and a fixed-sidebar grid — plus a tablet grid and a mobile grid, four total; on viewports wider than the 1440 design width, keep content centred rather than stretching it across 1920px+, because full-width text is hard to read; grids serve the designer, so don't over-complicate or over-create them.
- Learner-relevant: Gives an experience-based decision procedure for consolidating a project's grid layouts, plus the Figma mechanics (unhide the grid component, Shift+I, detach instance, name layers) to reuse them.

### 7.2 Color palette

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.2 Color palette Lesson Summary (Li).en.srt#color-palette]]`
- Summary: Colour strongly shapes UX — it evokes emotions, conveys meaning and builds visual hierarchy. A consistent palette using the same colour for similar elements (buttons, links) creates cohesion, brand identity and memorability, while poor colour choices harm recognition. Accessibility, especially text/background contrast, is crucial. The activity defines the project's primary colour and generates a shade/tint palette as global Figma styles.
- Key claims: Consistent colour on similar elements aids recognition, cohesion and memorability; poor colour choices hinder memorability and stop users recognising key actions; contrast between text and background is essential for readability and colour-vision accessibility (increasingly a mandate in some regions); harmonious colours feel balanced while contrasting colours feel energetic, so the palette should match desired brand perception; in this lesson only the primary colour needs customising — the project reuses the ShipFastar UI kit's Primary, Success, Warning, Destructive, Shades, Grey and Neutral styles; generate tints/shades with the Figma community "Colour Tint Shade Generator" plugin from the primary hex, then overwrite the colour styles (Cmd/Ctrl-click the swatch → Edit Style); mixing a little blue into greys yields a more harmonious palette.
- Learner-relevant: Teaches how colour connects to brand, recognition and accessibility, and produces the project's colour system as reusable styles.

### 7.3 Typography

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.3 Typography Lesson Summary (Li).en.srt#typography]]`
- Summary: Typography can make or break a UI project, so font selection must be web-safe and readable. The lesson covers font sourcing options and then tours the pre-built responsive type styles (display, headings, headings for mobile, paragraphs, labels, button label) that ship with the project, leaving the learner only to install Inter and confirm the styles.
- Key claims: Not all fonts are web-safe — the same 14px can render differently across browsers/devices if the font isn't optimised for the web; use system fonts (Helvetica, Arial, Apple's San Francisco), free Google Fonts (Inter, Railway [sic], PT Sans, Work Sans, Nunito Sans, Noto Sans), free high-quality Fontshare (founded by the Indian Type Foundry in 2009; used by Apple, Google, Samsung, Sony, Amazon, Hyundai) or paid Adobe Typekit; consider readability/legibility (some faces are hard to read on small screens); Apple's smallest recommended size is 11pt, preferably in caps; choose a face matching brand personality without hurting readability; this project uses Inter, which the learner must download and install; a distinct button-label style exists (different line height from paragraph) so button heights stay divisible by four.
- Learner-relevant: Equips the learner to choose web-safe fonts by source and criteria, and to use the project's responsive type scale.

### 7.4 Iconography

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.4 Iconography (Li).en.srt#iconography]]`
- Summary: Icons are visual representations of an action, object or idea that convey information quickly and help users navigate complex interfaces. The lesson surveys icon styles (flat, line, 3D, hand-drawn, skeuomorphic), gives criteria for picking a set, standardizes sizes, then runs a two-part activity: choose an icon set and collect needed icons from the wireframes, then build an icon library in Figma using one of two componentization methods.
- Key claims: Icon styles — flat (minimal, no depth, easy to extend), line (lines only, no fill/shading, scalable), 3D (depth/dimension, futuristic feel), hand-drawn (playful/personal but hard to make), skeuomorphic (realistic, good for app icons but avoided in UI because hard to recreate/scale); choose a set by whether its style suits the brand (curved line icons for fun/friendly, solid sharp icons for sports/fitness energy), whether it has enough icons, and whether icons/strokes are editable; standardize sizes 16, 32, 48, 64px even though SVG scales infinitely, to keep a clean design language; the project uses Streamline premium icons (18,329 vector icons; coupon Designership20 for 20% off) or free Google Material Design icons; identify every icon needed from the wireframes up front to avoid hunting mid-design; two library methods — create one component set with an "icon type" property (filterable but no preview), or create many individual components (allows instance swap with visual preview); create a 20×20 `icon/placeholder` (neutral 300 square) for use in buttons and inputs.
- Learner-relevant: Builds the judgement for selecting an icon set and the Figma skill of turning loose icons into a reusable, swap-ready library.

### 7.5 Shadows

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.5 Shadows (Li).en.srt#shadows]]`
- Summary: The final pure-foundations step. The shadows are pre-sourced from the project's ShipFaster UI kit (extra small, small, medium, large, extra large, extra-extra large) and already turned into global styles. The learner's only task is to verify they exist and to customize any shadow they dislike.
- Key claims: The project's shadows are pre-built as global styles in six sizes (xs, s, m, l, xl, xxl); the learner should verify the styles exist and is happy with them; shadows can be edited via Cmd/Ctrl-click the square → click the shadow → Edit Style on the right; after buttons and inputs are finalized, the whole foundational-styles file is published as a UI kit and pulled through into the design workflow.
- Learner-relevant: Confirms the last foundation before components, and introduces editing global effect styles.

### 7.6 Buttons

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.6 Buttons (Li).en.srt#buttons]]`
- Summary: With all foundational styles complete, two button details remain. First confirm the button primary colour (all buttons use the colour style Primary 600) matches your palette; second, add the `icon/placeholder` inside icon-only square buttons and configure an instance-swap so the icon can be changed, then verify the button component set's full variant matrix.
- Key claims: Buttons use the colour style Primary 600, so the button colour follows the customised palette; insert the `icon/placeholder` (a 20×20 square with neutral 300) inside icon-only buttons as the default icon; enable "apply instance swap property" and create a "change icon" property whose default/preferred value is the placeholder, so icons can be swapped later; the button component exposes variants for kind (primary/secondary), style (filled/outlined), state (hover/pressed/disabled), size (small/regular/large), icon-only, and change-icon; only the icons actually used (search, minus, more, help, close) need their swaps wired.
- Learner-relevant: Completes the button component set and shows the instance-swap pattern later reused by inputs.

### 7.7 Input fields

- Locator: `[[sources/ui-ux-design/20261007/ui2/7.7 Input fields (Li).en.srt#input-fields]]`
- Summary: The final lesson of module 7. Input components are pre-built; the learner confirms stylistic choices (corner radius, stroke/border), adds `icon/placeholder` icons on the left and right of each input, and wires separate "change icon left / change icon right" instance-swap properties plus boolean show/hide toggles. The module then publishes the whole file as a Figma library.
- Key claims: Inputs are pre-built; confirm styling (e.g. corner radius, which may be linked across size variants, and border thickness); add up to two `icon/placeholder` icons per input (left and right) with `change icon left`/`change icon right` instance-swap properties so either can be swapped; icons can be removed entirely and toggled with a boolean property (Layer → apply boolean property, e.g. "show icon on the left"/right); the input system shown is just one basic approach and can be modified; after completing grid, colour, typography, iconography, shadows, buttons and inputs, publish the module-7 foundational styles file (Assets → library icon → Publish) so the library can be connected to the design file and pull the styles through.
- Learner-relevant: Completes the last foundational component and demonstrates publishing a styles library to reuse across the project.
