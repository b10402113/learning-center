---
source: ui2.8
source_type: pdf
source_lines: 4358
part: 8
status: absorbed
absorbed_at: 2026-10-07
created: 2026-10-07
updated: 2026-10-07
---

# Digest — UX/UI Design Course by Designership (part 8: Technical concepts)

## Overview (L1)

- 8.0 Welcome to technical concepts — Module opener (0:54): when a developer says something is too hard or will take long, either they are lazy or the proposed UI is unconventional and its development impact was not considered; the module builds technical knowledge around designing UI for digital devices, to be applied increasingly with experience.
- 8.1 What is the box model — (2:02) Every element on a screen is a rectangular box made of four parts — content, padding, border, margin; understanding how these nest (boxes within boxes) makes designing for the web easier.
- 8.2 Box model challenge — (7:48) Hands-on Webflow exercise: recreate a "Master technical concepts" section by adding a div (section), setting background color, then configuring margin, padding, and border to see how the box model controls space inside, outside, and on the edge of an element.
- 8.3 What is flexbox — (3:07) Browsers default to left-aligning and vertically stacking elements; Flexbox is the CSS layout mode that positions elements in rows and columns and is the web equivalent of Figma Auto Layout.
- 8.4 Flexbox challenge — (8:32) Follow-along Webflow build applying Flexbox to the section (vertical direction, 40px row gap) and nesting a `title` flexbox (8px gap) to reproduce Figma Auto Layout one-to-one.
- 8.5 What is CSS grid — (3:24) Flexbox handles high-level structure, but for layouts that are literally a grid of content boxes, CSS Grid is the purpose-built CSS layout mode: built-in column/row settings, easy multi-column changes, and breakpoint-based responsiveness.
- 8.6 CSS grid challenge — (12:24) Build the four-box content grid in Webflow with CSS Grid: set columns and gap, style each box (background, border, radius, padding), then adjust columns per breakpoint so mobile stacks from four to two to one column automatically.
- 8.7 What is position absolute — (3:20) Position absolute is now less common thanks to Flexbox/CSS Grid, but still needed for precise placement; two examples show pulling an element (notification icon, rotating stamp) out of an Auto Layout stack to pin it to a corner.
- 8.8 Position absolute challenge — (4:42) Hands-on lesson: setting an icon to position absolute takes it out of the flow/z-index stack, and in the web world the parent container must be set to position relative so the absolute element positions itself against the closest relative ancestor.

## Sections (L2)

### 8.0 Welcome to technical concepts

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.0 Welcome to technical concepts Lesson Summary (Li).en.srt#welcome]]`, `[[sources/ui-ux-design/20261007/ui2/8.0 Welcome to technical concepts Lesson Summary I Designership (Li).pdf#welcome]]`
- Summary: Opens the Technical Concepts module, which teaches the technical concepts that help designers build UI for digital devices. When a developer calls a task hard or time-consuming there are only two reasons: they are lazy, or the proposed UI is unconventional and its impact on development time was not considered.
- Key claims: Developers resist work either from laziness or because a UI is "out of the box" without accounting for development time; the module deepens technical knowledge for UI design; some knowledge may not apply immediately but becomes valuable with more UI design experience.
- Learner-relevant: Sets the module's purpose — think about how design decisions translate into development effort.

### 8.1 What is the box model

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.1 What is the box model Lesson Summary (Li).en.srt#box-model]]`, `[[sources/ui-ux-design/20261007/ui2/8.1 What is the box model Lesson Summary I Designership (Li).pdf#box-model]]`
- Summary: Explains that every component on a page is a rectangular box composed of four parts — content, padding, border, margin — using a button and a Facebook newsfeed input as examples. Zooming out shows the model nests: a profile photo, input field, and buttons are themselves a box whose padding and margin control spacing.
- Key claims: Box model parts are content, padding (space between content and edge), border (line surrounding content and padding), and margin (space outside the border); padding pushes content away from the border while margin pushes surrounding elements away; elements on a screen are boxes within boxes; understanding this simplifies digital design; example values — ~16px padding inside the container and 16px margin around it.
- Learner-relevant: Foundational mental model — every spacing/border decision is box-model configuration.

### 8.2 Box model challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.2 Box model challenge (Li).en.srt#box-model-challenge]]`, `[[sources/ui-ux-design/20261007/ui2/8.2 Box model challenge I Designership (Li).pdf#box-model-challenge]]`
- Summary: A Webflow exercise where learners become "web developers" without code, recreating a "Master technical concepts" section (title, practical exercise sub-heading, four-column grid, text and images) that gets built across the module using box model, Flexbox, CSS Grid, and position absolute. Steps: create a blank Webflow site, set body background, add a div named `section`, and configure margin/padding/border.
- Key claims: Webflow is a no-code tool that still uses code on the backend; a `div` (division) is a box that contains information; add 40px margin on all sides to see margin spacing, 40px padding to push text from the border, and a border width (e.g. 4px) to see the border sit on the edge; margin sits outside the border and padding inside; Figma Auto Layout knowledge translates directly to web development; Experiment by duplicating the section and adjusting bottom margins to see space increase.
- Learner-relevant: First hands-on build; cements padding vs margin vs border through direct manipulation in a real layout tool.

### 8.3 What is flexbox

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.3 What is flexbox Lesson Summary (Li).en.srt#flexbox]]`, `[[sources/ui-ux-design/20261007/ui2/8.3 What is flexbox Lesson Summary I Designership (Li).pdf#flexbox]]`
- Summary: Positioning elements and building responsive layouts requires explicit instructions because browsers default to left-aligned, vertically stacked flow. Using a partnerships-page example, it shows that a parent container set to Flexbox with direction horizontal lays out its children (icon + label) side by side, and switching direction to vertical stacks them.
- Key claims: By default browsers position elements to the left and stack vertically; developers must instruct the browser how to display content; Flexbox is a CSS layout mode for positioning elements swiftly and is very similar to Figma Auto Layout; container direction (horizontal/vertical) controls child orientation; alignment like `space-between` automatically distributes child elements as desired.
- Learner-relevant: Introduces Flexbox as the primary layout tool and the direct analog of Figma Auto Layout.

### 8.4 Flexbox challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.4 Flexbox challenge (Li).en.srt#flexbox-challenge]]`, `[[sources/ui-ux-design/20261007/ui2/8.4 Flexbox challenge I Designership (Li).pdf#flexbox-challenge]]`
- Summary: A follow-along Webflow build that applies Flexbox to the `section` from the previous lesson (reset margins/border/background, keep 40px top/bottom padding) and nests a `title` flexbox to mirror Figma's structure. Key insight: Figma Auto Layout maps one-to-one to Flexbox.
- Key claims: Figma Auto Layout = Flexbox in the web world, and vice versa; Flex controls direction (horizontal/vertical), align, justify, gap, wrap, and padding; set the section to vertical with a 40px row gap; because the title and sub-heading sat inside a Figma Auto Layout `title` container with an 8px gap, the same nested `title` flexbox (vertical, 8px gap) must be created in Webflow; Webflow adds default heading margins that must be reset to zero; no-styled elements naturally flush left and stack; next lesson will use CSS Grid for the four boxes.
- Learner-relevant: Hands-on translation of Auto Layout to Flexbox; teaches nesting containers to control spacing precisely.

### 8.5 What is CSS grid

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.5 What is CSS grid Lesson Summary (Li).en.srt#css-grid]]`, `[[sources/ui-ux-design/20261007/ui2/8.5 What is CSS grid Lesson Summary I Designership (Li).pdf#css-grid]]`
- Summary: Contrasts Flexbox with CSS Grid using the same partnerships page, whose two-column layout (form left, social-proof component right) could be built with either. For layouts that are literally a grid of content boxes across multiple columns and rows, CSS Grid is the better-fit CSS layout mode because grid settings are built in.
- Key claims: Flexbox emulates Auto Layout one-to-one and is great for high-level structure, but CSS Grid is purpose-built for complex multi-column/multi-row grids; multiplying columns is as simple as increasing the number; responsiveness is largely handled inside the grid attribute, with breakpoints and custom per-view settings; Flexbox would require more manual tinkering with alignment and spacing to behave like a grid; Grid also supports direction and alignment like Flexbox; built to manage and structure layout grids.
- Learner-relevant: Explains when to reach for Grid vs Flexbox — the core layout-selection decision for responsive UI.

### 8.6 CSS grid challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.6 CSS grid challenge (Li).en.srt#css-grid-challenge]]`, `[[sources/ui-ux-design/20261007/ui2/8.6 CSS grid challenge I Designership (Li).pdf#css-grid-challenge]]`
- Summary: Follow-along Webflow build that recreates the four-box `content` section with CSS Grid. It reviews the structure (section → title → content with four boxes; each box → heading with icon + subheading, plus paragraph), sets Grid display with four columns and a 20px gap, styles the box (background `1E1E1E`, 1px `2E2E2E` border, 8px radius, 20px padding), then adjusts columns per breakpoint.
- Key claims: Each box has a min-width of 200px so content wraps as the container narrows; Flexbox is used inside each box (heading vertical, 8px gap) while CSS Grid arranges the boxes; CSS Grid automatically adapts layouts when resized because of its built-in browser default behaviors; breakpoints stack columns — desktop 4, tablet 4, mobile 2, portrait 1; Webflow sometimes assigns default margins/padding that should be reset to zero; CSS Grid saves developers time versus manual Flexbox tinkering.
- Learner-relevant: Practical Grid build plus responsive breakpoint strategy — directly reusable for card-grid UIs.

### 8.7 What is position absolute

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.7 What is position absolute Lesson Summary (Li).en.srt#position-absolute]]`, `[[sources/ui-ux-design/20261007/ui2/8.7 What is position absolute Lesson Summary I Designership (Li).pdf#position-absolute]]`
- Summary: Explains that although Flexbox and CSS Grid now handle most positioning, position absolute is still needed for precise placement in specific cases. Two examples: a notification icon that must pin to the top-right corner, and a stamp that must sit rotated in the bottom-right corner of a portfolio.
- Key claims: Position absolute has become less common with Flexbox/CSS Grid but remains necessary for precision cases; an element inside an Auto Layout cannot be positioned freely, so use position absolute to take it out of the stack; the layout then acts as if the element does not exist in the flow; still kept in the layers panel under its parent; both examples position an element outside the default vertical/left stacking.
- Learner-relevant: Defines the niche where absolute positioning is the right tool and when it should be avoided.

### 8.8 Position absolute challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/8.8 Position absolute challenge (Li).en.srt#position-absolute-challenge]]`, `[[sources/ui-ux-design/20261007/ui2/8.8 Position absolute challenge I Designership (Li).pdf#position-absolute-challenge]]`
- Summary: Hands-on lesson on absolute positioning. In Figma, setting an icon to Absolute Position takes it out of the container's Auto Layout so it can be moved freely; in Webflow, the same element is set to position absolute, which removes it from the z-index/flow, then offset with top/right values. Crucially, the web requires the parent container to be `position: relative`.
- Key claims: Position absolute removes an element from the z-index (flow/stack) of elements; in the web world an absolute element positions itself relative to the closest ancestor set to position relative (zero from top/right of that nearest relative container), not necessarily its immediate parent; changing a container from relative back to static re-anchors the absolute element to a higher relative ancestor; this is technical and less relevant unless building websites, but it helps designers reason about whether precise positioning is truly needed and about design impact on developers; the more you understand development, the better a UI/UX designer you become.
- Learner-relevant: Completes the technical-concepts toolkit and connects design choices to developer effort and feasibility.
