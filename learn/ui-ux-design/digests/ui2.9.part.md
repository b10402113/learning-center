---
source: ui2.9
source_type: pdf
source_lines: 3827
part: 9
status: absorbed
absorbed_at: 2026-10-07
created: 2026-10-07
updated: 2026-10-07
---

# Digest — UX/UI Design Course by Designership (part 9: UI Design breakdowns)

## Overview (L1)

- 9.0 Welcome to UI Design — (0:31) Opens the UI design module: turn wireframes plus the Module 7 UI kit into finished UI, screen by screen, starting with a project-file tour.
- 9.1 Project file overview — (2:55) Walkthrough of the Figma project file (taken from Mizko's Figma masterclass) and how to utilise it; focus is the "O5 workspace" across desktop/tablet/mobile; later sections (design feedback, final designs, components) are out of scope.
- 9.2 Header and footer breakdown — (9:02) Design the header and footer for Accommodate AI starting at the 1024–1439 desktop breakpoint; header kept light, footer four-column and scalable; search bar collapsed to avoid duplicate CTAs.
- 9.3 Homepage breakdown — (5:59) Bring the homepage wireframe to life: prominent hero heading, F-pattern support image, features/search UI surfaced to sell the USP, and a strict 4-point spacing system.
- 9.4 Search and booking experience breakdown — (13:52) Largest lesson: design the full search→results→listing→checkout→processing→bookings flow, including an unwired loading/validation state; SEO rationale for rich logged-out footers vs simplified logged-in footers.
- 9.5 My bookings breakdown — (4:24) Design My Bookings, Booking Details, Messages, and Cancellation pages; header gains a profile photo once logged in; neutral-100 background + neutral-200 borders create hierarchy; outline buttons avoid CTA competition.
- 9.6 Profile settings breakdown — (2:05) Design Edit Profile, Change Password, and Manage Notifications; reuse the sub-header, span the 12-column grid, and tweak notification labels for scanability.
- 9.7 Authentication breakdown — (1:56) This lesson's transcript actually covers the help desk / FAQ section: two-column layout with accordion questions on the left and email/call CTAs on the right (title says "Authentication").
- 9.8 Desktop experience breakdown — (2:40) Final desktop screen, the "Become a Host" landing page: CTA + social proof + simple form on the left, reusing homepage sections and the FAQ component; credible logos removed until available.
- 9.9 Responsive views breakdown — (1:34) Self-guided challenge to complete responsive views by stacking designs for tablet, mobile, and 1440+; all answer designs are provided in the starter file pack.

## Sections (L2)

### 9.0 Welcome to UI Design

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.0 Welcome to UI Design Lesson Summary (Li).en.srt#welcome]]`, `[[sources/ui-ux-design/20261007/ui2/9.0 Welcome to UI Design Lesson Summary I Designership (Li).pdf#welcome]]`
- Summary: Module opener. Mizko frames Module 9 as the point where wireframes and the previously built UI kit become finished UI, guiding learners through the project file and then building each section of the web app one step at a time.
- Key claims: Design the UI using wireframes plus the UI kit from a previous lesson; first a project-file guide, then section-by-section construction; the module is a challenge to tackle.
- Learner-relevant: Sets the module roadmap and mindset before hands-on UI work begins.

### 9.1 Project file overview

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.1 Project file overview (Li).en.srt#project-file]]`, `[[sources/ui-ux-design/20261007/ui2/9.1 Project file overview I Designership (Li).pdf#project-file]]`
- Summary: Tour of the Figma project file, borrowed from Mizko's Figma masterclass. Pages contain Welcome (title screen), O2 (project info: overview, problem statement, competitors, inspiration), wireframes, mood board, and the O5 workspace — the area used for all of Module 9.
- Key claims: Only the O5 workspace is covered; it holds desktop, tablet, and mobile designs plus design feedback, final designs, components, and implementation notes (those extra sections are out of scope and taught in the Figma masterclass); the file is responsive and reusable for real client/in-house projects.
- Learner-relevant: Explains where to work and how to reuse the file structure on other projects.

### 9.2 Header and footer breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.2 Header and footer breakdown (Li).en.srt#header-footer]]`, `[[sources/ui-ux-design/20261007/ui2/9.2 Header and footer breakdown I Designership (Li).pdf#header-footer]]`
- Summary: First UI task — design the header and the footer for Accommodate AI, starting at the smaller desktop breakpoint (1024–1439) rather than 1440+, because it is easier to extend upwards later. Mizko connects the Module 7 foundational-styles library, drops responsive grid components (desktop/tablet/mobile, with or without sidebar), and detaches instances to design.
- Key claims: Start at 1024–1439 then expand to 1440+, handling all responsive views in one later lesson; keep the header visually light since it already owns prime real estate at the top and needs negative space for content; the search bar is collapsed because the homepage hero provides its own CTA (avoid duplicate CTAs); the footer's four columns are designed to be scalable so content survives width changes.
- Learner-relevant: Establishes the design workflow and reusable responsive-grid technique; enforces the "one-to-one wireframe translation" theme.

### 9.3 Homepage breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.3 Homepage breakdown (Li).en.srt#homepage]]`, `[[sources/ui-ux-design/20261007/ui2/9.3 Homepage breakdown I Designership (Li).pdf#homepage]]`
- Summary: Extend the header/footer frame into a homepage and translate the homepage wireframe into UI. Mizko emphasises a clear, prominent hero heading, an F-pattern scan to a supporting image, and surfacing product UI to communicate the platform's USP.
- Key claims: The hero image must support the left-hand message and give contextual understanding of the platform; intentionally pull in the features/search-results UI to show users they can customise search by comfort, convenience, and price (the USP); content is neutral/clean so photography carries the colour; all spacing follows a 4-point grid (everything divisible by four) and should be systematic and reusable; no right or wrong way — efficiency matters.
- Learner-relevant: Teaches image-selection reasoning, USP-driven hero composition, and spacing-system discipline.

### 9.4 Search and booking experience breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.4 Search and booking experience breakdown (Li).en.srt#search-booking]]`, `[[sources/ui-ux-design/20261007/ui2/9.4 Search and booking experience breakdown I Designership (Li).pdf#search-booking]]`
- Summary: The core flow lesson — design everything from search results to the first My Bookings page, and add a loading/validation state the wireframes omitted. Consult userflows and sitemaps to ensure nothing is missed. Screens: search results, results overlay on map, single listing, checkout (login-gated), payment-processing modal, then My Bookings.
- Key claims: Every primary CTA sends info to a server, so design a preloading state (grey skeleton bars over an ad-less results-like screen) that indicates something is happening before results appear — distinct from the payment-processing modal; don't reveal the exact address until payment is made (privacy/stalking concern); logged-out pages keep rich, indexable footers for SEO while authenticated pages can simplify headers/footers since search engines cannot log in; keep UI dull/neutral so listing photos carry colour and only CTAs/key items get contrast; reuse one card component (sometimes flipping image/text) instead of recreating layouts; version 1 should stay simple and flexible.
- Learner-relevant: Most substantial build task; teaches loading states, legal/privacy-aware UI, SEO-vs-auth design decisions, and component reuse.

### 9.5 My bookings breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.5 My bookings breakdown (Li).en.srt#my-bookings]]`, `[[sources/ui-ux-design/20261007/ui2/9.5 My bookings breakdown I Designership (Li).pdf#my-bookings]]`
- Summary: Design the logged-in My Bookings section: main list, Booking Details, Messages, and Cancellation pages. The header now shows a profile photo because the user is authenticated after booking.
- Key claims: Add a light neutral-100 background and subtle neutral-200 borders to separate sub-header, header, and content and create hierarchy (all-white flattens the hierarchy); use Auto Layout "hug" to quickly derive card designs and reuse components; keep cancellation-page content centered with side margins (skip columns 1 and 12) so it stays readable on wide screens; when multiple CTAs sit together, use outline buttons so they don't compete; messaging uses the full screen real estate.
- Learner-relevant: Reinforces hierarchy through colour/borders, Figma Auto Layout efficiency, and CTA de-confliction.

### 9.6 Profile settings breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.6 Profile settings breakdown (Li).en.srt#profile-settings]]`, `[[sources/ui-ux-design/20261007/ui2/9.6 Profile settings breakdown I Designership (Li).pdf#profile-settings]]`
- Summary: Wrap up with the basic profile-settings pages: Edit Profile, Change Password, and Manage Notifications. Reuse the sub-header design and span the 12-column grid for the larger content.
- Key claims: Keep consistency by reusing the sub-header; Edit Profile and Change Password are simple forms; for Manage Notifications, extract/promote labels because condensing all description text made it hard to read and scan, improving the check/uncheck experience.
- Learner-relevant: Shows consistency reuse and a small, concrete scanability fix from wireframe to UI.

### 9.7 Authentication breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.7 Authentication breakdown (Li).en.srt#authentication]]`, `[[sources/ui-ux-design/20261007/ui2/9.7 Authentication breakdown I Designership (Li).pdf#authentication]]`
- Summary: The lesson is titled "Authentication breakdown" but the transcript walks through designing the help desk / FAQ screen: a two-column layout with a help-desk title, question categories/accordions on the left, and contact CTAs on the right. (The authentication/checkout-login UI is actually designed in lesson 9.4.)
- Key claims: Help center uses general inquiries grouped by category, expandable accordion answers, and right-side "email us"/"call us" CTAs; wireframes stay mid-fi/low-fi while accordions are needed so answers can be hidden/shown; design is roughly one-to-one with the wireframe.
- Learner-relevant: Teaches FAQ/accordion layout and contact-CTA placement; flag the title/transcript mismatch when citing.

### 9.8 Desktop experience breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.8 Desktop experience breakdown (Li).en.srt#desktop-experience]]`, `[[sources/ui-ux-design/20261007/ui2/9.8 Desktop experience breakdown I Designership (Li).pdf#desktop-experience]]`
- Summary: The final desktop screen to design — the "Become a Host" landing page. Frame it around helping the host earn extra cash on the side, with a left-hand CTA, social proof, and a simple form.
- Key claims: Reuse the same styles across the whole application and keep the UI light, focusing colour on CTAs, headings, and key items (photos bring the colour instead); all content sits on a 12-column grid, or 10 columns when it should feel centered; re-use the homepage section designs and the FAQ component, plus the site footer; credible logos were removed because they likely aren't available day one (re-add as social proof/trust signal when available).
- Learner-relevant: Caps the desktop pass and reinforces the app-wide style system and component reuse.

### 9.9 Responsive views breakdown

- Locator: `[[sources/ui-ux-design/20261007/ui2/9.9 Responsive views breakdown (Li).en.srt#responsive-views]]`, `[[sources/ui-ux-design/20261007/ui2/9.9 Responsive views breakdown I Designership (Li).pdf#responsive-views]]`
- Summary: A self-guided challenge to complete the responsive views for tablet, mobile, and 1440+ by adding grids for each breakpoint and reconstructing the desktop designs to fit each medium.
- Key claims: Responsive work is fundamentally about stacking/reconstructing information per medium; drag finished designs into tablet/mobile views and rebuild them; all reference designs (1440+, 1025–1439, tablet, mobile) are supplied in the starter file pack, so the answers live in the design file; this closes Module 9.
- Learner-relevant: Applies the whole module to responsive design and hands the learner the finished reference set.
