---
source: ui1.2
source_type: pdf
source_lines: 2737
part: 2
status: absorbed
absorbed_at: 2026-10-07
created: 2026-10-07
updated: 2026-10-07
---

# Digest — UX/UI Design Mastery Course (part 2: Learn Figma)

## Overview (L1)

- 1. Choosing the right design software — Compares the four mainstream UI design tools — Figma, Adobe XD, Sketch, and Framer — on collaboration, prototyping, design systems, integration, and cost, then gives selection criteria for picking one.
- 2. Figma Walkthrough — A full tour of the Figma interface: home screen, file creation, the main menu sections (File/Edit/View/Objects/Text/Arrange/Vector/Plugins/Preferences), the top toolbar tools, right-side collaboration/prototype/zoom controls, and the three right-panel tabs (Design/Prototype/Inspect).
- 3. Frames, Shapes, Colours and Basic Design Techniques — Hands-on basics: creating and duplicating frames, canvas navigation, drawing rectangles/ellipses/polygons/stars, resizing vs scaling, fills/gradients/strokes, effects (drop shadow, inner shadow, layer blur, background blur), and exporting assets.
- 4. Color Styles, Alignment, Position — Creating, applying, and globally updating reusable color styles; alignment and distribution controls; grouping/ungrouping; and managing layer hierarchy and z-order.
- 5. Text Styles — Adding and formatting text (font, weight, size, line height, letter/paragraph/list spacing, case, alignment/resizing modes), then creating reusable text styles and detaching them when needed.
- 6. Constraints - Theory — Explains what constraints are, that they require an object inside a frame, and demonstrates every horizontal/vertical option (Left, Right, Center, Scale, Top, Bottom) with seven circles in identical frames.
- 7. Creating Responsive Design with Constraints — Two applied exercises: making a UI screen horizontally responsive (status bar, image, play button, heading, paragraph+button auto layout) and a mobile screen vertically responsive with fixed scrolled position.
- Binary asset: `7. Constraints Exercise.fig` — a Figma source file for the two exercises; binary/asset, not text-readable.

## Sections (L2)

### 1. Choosing the right design software

- Locator: `[[sources/ui-ux-design/20261007/ui1/2. Learn Figma/1. Choosing the right design software.en.srt#choosing-design-software]]`
- Summary: Compares Figma, Adobe XD, Sketch, and Framer as UI design tools. Figma is a cloud-based tool known for real-time collaboration, vector networks, prototyping, and design systems; Adobe XD integrates with the Creative Cloud; Sketch is a Mac-only vector editor with a strong community; Framer excels at high-fidelity prototyping and prebuilt components. It closes with selection factors: collaboration, integration, prototyping, and cost.
- Key claims: Figma's standout feature is real-time multi-designer collaboration on one file; Adobe XD is best if you are already in the Adobe ecosystem; Framer is the choice for advanced prototyping; choose by team needs, integrations, prototyping depth, and budget.
- Learner-relevant: Grounds the "why Figma" decision and gives a tool-selection framework the learner can reuse when a project's constraints change.

### 2. Figma Walkthrough

- Locator: `[[sources/ui-ux-design/20261007/ui1/2. Learn Figma/2. Figma Walkthrough.en.srt#figma-walkthrough]]`
- Summary: A guided tour of Figma's layout. It covers the home screen (create/import files, search, recents), the main menu's sections (File, Edit, View, Objects, Text, Arrange, Vector, Plugins/community tools, Preferences), the top navigation bar's tools (Move, Frame, Section, Slice, Shape, Pen, Pencil, Text, Resources, Hand, Comment), and the right-side controls (Huddle, avatars, Share, Prototype, Zoom). It ends on the three right-panel tabs — Design, Prototype, and Inspect.
- Key claims: The main menu is the hub for file/edit/view/object/text/arrange/vector operations; the toolbar holds creation and manipulation tools; the right panel splits into Design (styling), Prototype (interactions), and Inspect (developer specs/code).
- Learner-relevant: Gives the interface map needed before any later lesson; anchors all subsequent Figma operations to a named location.

### 3. Frames, Shapes, Colours and Basic Design Techniques

- Locator: `[[sources/ui-ux-design/20261007/ui1/2. Learn Figma/3. Frames, Shapes, Colours and Basic Design Techniques.en.srt#frames-shapes-colours]]`
- Summary: Walks through core drawing and styling. Frames are containers/artboards created with `F` or the frame tool, with device and paper presets; duplication uses Option/Alt-drag (add Shift to lock axis); canvas navigation favors the Space-bar Hand tool. It covers rectangle/ellipse/polygon/star shape tools, resizing via handles or numeric fields with Constrain proportions, rotation, corner radius, and the arc/ring/sweep handles on ellipses. Then fills, the Eyedropper, gradients (linear/radial/angular), strokes, the four effects (Drop Shadow, Inner Shadow, Layer Blur, Background Blur), and export settings (`+` in the export section, scale like 2x, format, Export).
- Key claims: Frames are Figma's artboards and hold design elements; Shift during drawing constrains to a square/circle while Shift during rotation snaps to 15°; the Scale tool resizes without distorting shape (unlike dragging width/height); Figma has four effect types, and Background Blur (with reduced opacity) creates popular glass effects.
- Learner-relevant: The practical toolkit for producing any static screen; every later lesson assumes these frame/shape/color/effect primitives.

### 4. Color Styles, Alignment, Position

- Locator: `[[sources/ui-ux-design/20261007/ui1/2. Learn Figma/4. Color Styles, Alignment, Position.en.srt#color-styles-alignment-position]]`
- Summary: Shows how to define reusable color styles (select object, four-dots icon, plus, name it, Create Style) and how editing a style updates every object using it. It then covers alignment: a single selection aligns to its parent (group/frame/component), multiple selections align to each other or the parent, with left/h-center/right and top/v-center/bottom controls plus Tidy Up and distribute-spacing. Finally it covers grouping (`Command G`), ungrouping, renaming layers, and reordering/repositioning layers (drag in the panel, Bring to Front/Send to Back, `Command [` / `Command ]`).
- Key claims: Color styles are global — updating one refreshes all users of it; alignment behavior depends on whether one or many layers are selected; z-order is controlled both by dragging layers in the left panel and by bracket shortcuts.
- Learner-relevant: Establishes the consistency and organization habits (styles, alignment, naming, layering) that scale to design systems.

### 5. Text Styles

- Locator: `[[sources/ui-ux-design/20261007/ui1/2. Learn Figma/5. Text Styles.en.srt#text-styles]]`
- Summary: Covers text creation and formatting in Figma. The Text tool adds editable text; scaling uses the Scale control or `K`; you set font family, weight, and size, and choose Auto Width/Auto Height/Fixed Size resizing. It explains Line Height (auto, px, or %), letter spacing (generally not recommended), Paragraph Spacing, list spacing, text alignment, decorations, indentation, bullet/numbered lists, and case. It then shows creating reusable text styles via the four-dots icon and detaching a style to edit independently.
- Key claims: Line height can be auto, fixed pixels, or a percentage of font size; fixed-size text areas enable alignment within the text box; a style locks its properties (line height/size hidden) until you detach it.
- Learner-relevant: The typography half of a design system; pairs directly with color styles for consistent, reusable type.

### 6. Constraints - Theory

- Locator: `[[sources/ui-ux-design/20261007/ui1/2. Learn Figma/6. Constraints - Theory.en.srt#constraints-theory]]`
- Summary: Defines constraints as guidelines for how a layer reacts when its containing frame is resized, and stresses that constraints only apply to objects inside a frame. It shows both the clickable constraint rectangle and the two dropdowns (horizontal, vertical), noting Scale is only available via dropdowns. Using seven identical circles in identical frames it demonstrates Left/Top, Center/Center, Right/Top, Left+Right/Top, Scale/Scale, Bottom/Center, and Left+Right/Top+Bottom, and explains each resulting behavior.
- Key claims: Constraints require the object to be inside a frame; Scale sizes/positions the object as a percentage of the frame; pinning both left+right stretches (and can distort) an object when width changes; Center keeps an object centered as the frame changes.
- Learner-relevant: The conceptual model behind responsive design; prerequisite for the applied constraints exercise.

### 7. Creating Responsive Design with Constraints

- Locator: `[[sources/ui-ux-design/20261007/ui1/2. Learn Figma/7. Creating Responsive Design with Constraints.en.srt#responsive-constraints-exercise]]`
- Summary: Two exercises applying constraints. Exercise 1 makes a UI screen horizontally responsive: status bar (left/top circle, Scale/Scale middle bar, right+top circles grouped), image (Scale/Scale), play button (center/center), heading (Auto Width + center), and paragraph+button wrapped in Auto Layout (`Shift A`) then set to Scale/Top after switching Hug → Fixed Width, with the paragraph set to Fill Container. Exercise 2 makes a mobile screen vertically responsive: status bar (Top/Center, title Left/Top), images Top, bottom nav Center/Bottom, then fixing the nav and status bar in the prototype with "fix position when scrolling."
- Key claims: One correct set of constraints per element makes the layout responsive; Auto Layout keeps spacing as content length changes and is explained in depth later; Scale is grayed out for Auto Layout until horizontal resizing is set to Fixed Width; "fix position when scrolling" anchors bars in prototype preview.
- Learner-relevant: Turns constraints theory into a repeatable process for building responsive screens; references the companion `7. Constraints Exercise.fig` file.
