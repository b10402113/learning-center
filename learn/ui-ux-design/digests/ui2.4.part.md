---
source: ui2.4
source_type: pdf
source_lines: 5033
part: 4
status: absorbed
absorbed_at: 2026-10-07
created: 2026-10-07
updated: 2026-10-07
---

# Digest — UX/UI Design Course by Designership (part 4: Userflows)

## Overview (L1)

- 4.0 Welcome to Userflows — 27-second module opener; frames the three userflow lessons: what userflows are, how to create them, and a hands-on activity to build one for the course's practical project (Accom.ai).
- 4.1 What is a userflow — defines userflows, contrasts them with sitemaps, and argues why mapping them (validation, decisions, overlooked states, business optimization) matters before wireframing.
- 4.2 How to create a userflow — a worked FigJam walkthrough of the Twitter/X and Instagram post experiences, introducing the 5-element legend and conventions for mandatory vs optional steps and validation.
- 4.3 Create your userflows — a full activity that turns Accom.ai client job stories into a search-and-booking userflow, including screen-level thinking and a funnel-consolidation design decision.

## Sections (L2)

### 4.0 Welcome to Userflows

- Locator: `[[sources/ui-ux-design/20261007/ui2/4.0 Welcome to Userflows Lesson Summary (Li).en.srt#welcome-to-userflows]]`
- Summary: Short module introduction. States the module covers what userflows are and how to create them, ending with an activity to build your own userflow for the Accom.ai project.
- Key claims: The module teaches userflow definition, userflow creation, and a hands-on userflow activity on the practical project; the activity targets the Accom.ai platform.
- Learner-relevant: Sets the scope and sequence for the three following userflow lessons and links them to the course project.

### 4.1 What is a userflow

- Locator: `[[sources/ui-ux-design/20261007/ui2/4.1 What is a userflow Lesson Summary (Li).en.srt#what-is-a-userflow]]`
- Summary: Notes that a sitemap may be enough for a simple site, but a complex, logic-heavy product benefits from mapping specific userflows. A userflow is a visual representation of the path a user takes — the steps, decisions, and actions — to accomplish a goal within a product. It contrasts userflows with sitemaps (interactions/decisions/states for one flow vs high-level page structure) and lists why they matter.
- Key claims: A userflow is a visual path of steps, decisions, and actions toward a goal; a sitemap focuses on high-level page structure while userflows dive into interactions, decisions, and states for a specific flow; creating userflows helps identify technical and non-technical issues upfront, lets stakeholders visualize the journey and pain points, surfaces technical limitations early, uncovers overlooked states/screens (e.g., failures, empty states), and unlocks business-objective optimization; create userflows early, especially for complex logic/decision-heavy experiences (payments, complex search), and refine them as new information appears.
- Learner-relevant: Establishes what a userflow is, when it beats a sitemap, and the concrete benefits that justify the extra planning step.

### 4.2 How to create a userflow

- Locator: `[[sources/ui-ux-design/20261007/ui2/4.2 How to create a userflow Lesson Summary (Li).en.srt#how-to-create-a-userflow]]`
- Summary: A worked FigJam walkthrough using Twitter/X's create-a-post flow, followed by a learner challenge to map Instagram's post flow and an instructor demo of the Instagram flow. Introduces the five-element legend and conventions for reading mandatory vs optional actions and where validation and decisions belong.
- Key claims: The legend has five elements — screen (filled rectangle), overlay/modal (unfilled rectangle), action/feature (dotted line), decision (diamond), validation (cylinder); lay the flow left-to-right from start to end, with optional actions branching vertically off the mandatory path so viewers can tell what's required; primary CTAs (post, share, save) trigger validation that sends data to a server and can succeed or fail; map key decisions (e.g., "undo?" after posting, or "image vs video?", which leads to two entirely different flows); scope to the first level of hierarchy and to MVP/version 1 — real features ship with limited functionality and grow over time; the challenge is to map Instagram's post flow at one level of hierarchy.
- Learner-relevant: Gives the concrete FigJam vocabulary and reading conventions for building a userflow, plus practice applying them to the Instagram post experience.

### 4.3 Create your userflows

- Locator: `[[sources/ui-ux-design/20261007/ui2/4.3 Create your userflows Lesson Summary (Li).en.srt#create-your-userflows]]`
- Summary: The module's main activity: build the search-and-booking userflow for the Accom.ai platform from the client's job stories. Before mapping, the instructor sketches the screens he envisions (homepage, search, validation, results, details, checkout, my bookings) and reasons through interactions and design decisions, then builds the FigJam userflow.
- Key claims: Only the search-and-booking experience warrants a userflow — other parts of the platform are straightforward; the envisioned flow is homepage → search (destination, start/end date, guests) → validation → search results (with optional filter-by-occasion/price/style/things-to-do/amenities and sort-by-price/value/convenience) → accommodation details → login/create-account → checkout/confirmation → payment → validation → my bookings; clicking a primary button (search, make a booking, make payment) always triggers validation that can succeed (advance) or fail (return); ask users to log in/create an account at the point of booking interest so the platform can capture intent and reach out if they drop off; consider showing accommodation details in a slide-in overlay rather than new tabs so users can compare without being overwhelmed; a design decision is to consolidate login, confirmation, and payment into a single checkout page for version 1 because there is little content, keeping it simpler to build and easy to break out later if drop-off is high — the tradeoff being that broken-up steps can raise conversion while more funnel screens raise drop-off; there is no single correct flow — different stakeholders may require different detail.
- Learner-relevant: Applies the userflow method end-to-end on the real course project, producing the artifact that later wireframing and UI work build on.
