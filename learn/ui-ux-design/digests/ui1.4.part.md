---
source: ui1.4
source_type: pdf
source_lines: 2585
part: 4
status: absorbed
absorbed_at: 2026-10-07
created: 2026-10-07
updated: 2026-10-07
---

# Digest — UX/UI Design Mastery Course (part 4: Web Design Figma Project)

## Overview (L1)

- 1. Intro — Project Brief, Image and Typography Library — Sets up the fictional "Pride" music-streaming landing-page brief, defines assumptions about the target audience (16–26, dance/hip-hop/rock/R&B, desktop users), and builds the design foundations: a dark-theme color palette, color styles, a typography scale, and an image library.
- 2. Designing Top Navigation & Hero Section — Builds the 1920×1080 frame, a 4-column layout grid, the top navigation (logo, links, signup button) using auto layout, and the hero section with heading, paragraph, CTA, gradient background blur, and a background-removed hero photo.
- 3. 2nd section — Creates the "top 3 trending songs" cards: H2/H3/P2/UI-label styles, image cropping, play icons with absolute positioning, glassy card auto layouts, and a featured middle card.
- 4. 3rd section — Designs a music-genres carousel with navigation arrows, four image cards with text-over-image background blur, clip-content frames, play buttons, rounded corners, and shadow reflections.
- 5. 4th section — Designs the "Trending Artists" section: five circular artist photos (200×200), names, song counts, a feature link, reusable cards with shadow effects, a staggered layout, and an "explore all" button.
- 6. 5th section — Features a current popular/exclusive artist with a background-removed photo, an info card listing her popular songs, equal-spacing auto layout, glassy transparent fill and gradient background blur.
- 7. 6th section — Adds the newsletter sign-up (catchy title, description, email field, send-icon subscribe button built from the play-button background) and the footer (three link columns, social links, description, divider, copyright/cookies), then final home-page spacing polish and a background-blurred sticky navigation.

## Sections (L2)

### 1. Intro - Project Brief, Image and Typography Library

- Locator: `[[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/1. Intro - Project Brief, Image and Typography Library.en.srt#intro]]`
- Summary: Introduces the module's promise — take a simple brief to a finished, visually appealing website for the fictional music-streaming company "Pride". It establishes the brief (ad-free, web-based, mobile pre-download, target age 16–26) and the user/business assumptions, then sets up the color library, typography system, and image sourcing before building the site in later lessons.
- Key claims: research target audience needs/motivations/frustrations to inform decisions, and analyze competitors but always start with users; choose a bold dark theme (dark-blue background, red primary CTA, pink/blue secondaries) because it suits the age group and evening usage; use Figma color styles so a global change propagates everywhere; build typography with H1/H2/H3, P1/P2/P3, and three UI-label weights, using percentage line height (110–130% headings, 140–170% paragraphs) and larger-text-smaller-line-height; only use copyright-free/licensed images (Envato trial, Unsplash, Pexels).
- Learner-relevant: Outcome — a reusable color-style + text-style + image library foundation that speeds up the whole project and future work; anchor — the brief-to-design and design-thinking framing.

### 2. Designing Top Navigation & Hero Section

- Locator: `[[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/2. Designing Top Navigation & Hero Section.en.srt#nav-hero]]`
- Summary: Builds the site skeleton in Figma. It creates a 1920×1080 frame, adds a 4-column 200px-margin/30px-gutter grid for alignment, then assembles the top navigation and hero section using nested auto layouts, colour/text styles, gradient background blur, and a background-removed hero image. Ends by previewing the prototype and teasing the trending-songs section.
- Key claims: a Figma frame is the container equivalent to an artboard; duplicate objects with Option+Shift drag or Cmd+C/Cmd+V; signup button uses 24px horizontal / 16px vertical padding and 16px corner radius, with 24px spacing to the login link and 48px among other labels; apply "fill container" horizontal resizing so contents resize with the frame, and align everything to the grid; build the hero glow with an angular-gradient rectangle plus secondary pink/blue colours, and use a rectangular/background blur to fade the image and focus the "Music Without Limits" title.
- Learner-relevant: Outcome — a working navigation + hero, plus the auto-layout/grid/blur patterns reused in every later section; anchor — using text and colour styles instead of raw values.

### 3. 2nd section

- Locator: `[[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/3. 2nd section.en.srt#trending-songs]]`
- Summary: Builds the "top 3 trending songs" section from three 300×420 image cards. It covers cropping images (Cmd-drag or double-click handles), placing play icons with absolute positioning, and composing card content (H3 titles, P2 singer names, UI-label listen counts, a listen icon pill) into glassy auto-layout cards, then connecting the three cards with space-between.
- Key claims: use dark-gray paragraphs for contrast against headings; absolute positioning lets an object sit on top of another and be freely aligned inside an auto layout; group an icon with Cmd+G and give it 8px padding, transparent background, 25px radius; the featured middle card gets extra bottom padding, center alignment, and a special background fill, plus a coloured background blur for emphasis; copy cards and use "paste to replace" to swap images.
- Learner-relevant: Outcome — reusable content-card pattern and the absolute-positioning technique; anchor — dynamic spacing via space-between instead of fixed gaps.

### 4. 3rd section

- Locator: `[[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/4. 3rd section.en.srt#genres-carousel]]`
- Summary: Designs a browsable music-genres carousel. It builds arrow controls inside 55px stroked ellipses (with absolute positioning for the icon), then four 358×490 image cards with library headings, song counts, music icons, and play buttons over a coloured background blur. Cards are connected with space-between and finished with 24px corners and blur-based shadow reflections.
- Key claims: only one arrow should look clickable — adjust arrow colour to signal state; if a size comes out odd (e.g. 490.48), nudge the frame by one pixel or change the nudge amount in settings; set the frame to "clip content" so blurred overlays stay inside; derive the blur colour from the image for a natural match; create a reflection by copying/cropping the image, applying a layer blur of 49, positioning it just below, and tuning opacity for matching luminosity.
- Learner-relevant: Outcome — a carousel component and the text-over-image readability pattern; anchor — signalling interactive vs. disabled states through styling.

### 5. 4th section

- Locator: `[[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/5. 4th section.en.srt#trending-artists]]`
- Summary: Builds the "Trending Artists" section that makes Pride feel dynamic. Five artist images are made circular and 200×200, each card adds the artist name, song count, and a feature/sign-up link, with 32px horizontal and 40px vertical padding and a colour-picked photo shadow. Cards are copied and content swapped, staggered via top padding, and closed with an "explore all artists" button copied from the hero.
- Key claims: reuse cards and only change photos/copy to keep consistency; use the colour picker to pull a shadow colour straight from the photo and tune it so the shadow is not too strong; lock a layer via the lock icon to prevent accidental edits, and right-click the blurred area to reveal it in the layers panel when it must be moved; give the 2nd and 4th cards 80px top padding for a staggered, unique layout; keep the frame aligned to the grid.
- Learner-relevant: Outcome — a repeated artist-card system and layout-staggering technique; anchor — layer locking as a workflow safeguard.

### 6. 5th section

- Locator: `[[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/6. 5th section.en.srt#featured-artist]]`
- Summary: Creates a feature spot for a current popular, platform-exclusive artist. It removes the artist photo's background, duplicates the previous title/paragraph and rewrites copy to highlight exclusivity, and builds a glassy card listing the artist's most popular songs. The card uses equal-spacing auto layout, transparent fill/stroke, 24px radius, and a gradient background blur tuned by previewing repeatedly.
- Key claims: many free background-removal tools exist (erase.bg, remove.bg); use auto layout to create equal spacing between all song cards; the card takes 40px spacing with 40px horizontal and 60px vertical padding, transparent fill/stroke, 24px radius, and a blur value of 48 for a glass effect; add a gradient background blur and iterate via preview until it looks right.
- Learner-relevant: Outcome — a featured-content card and the gradient-glass recipe; anchor — background removal plus exclusivity copy as a conversion lever.

### 7. 6th section

- Locator: `[[sources/ui-ux-design/20261007/ui1/4. Web Design Figma Project/7. 6th section.en.srt#newsletter-footer]]`
- Summary: Completes the homepage with a newsletter sign-up and the footer. The newsletter uses a "Don't miss a beat" title, a description, a 618px-wide text frame, a transparent headphones image, an email field, and a subscribe button that recycles the play-button background with a send icon. The footer copies the logo and signup button, splits into three columns, and adds description, social links, divider, copyright, and cookie/data links before a final spacing pass and a blurred navigation preview.
- Key claims: reuse the play-button background and swap in the send icon for the subscribe control; use "Constrain proportions" when resizing images to preserve aspect ratio, and change headphones image width to 576px; make the newsletter's main auto layout "Space Between" so the frame fits the grid, switch its background to linear for a fade, and set a 32px corner radius to stay consistent; footer column titles use a darker gray and list items a lighter gray to look prominent/clickable, and the links should follow the page structure; use Component tool and absolute positioning so the image can exceed container bounds, then apply a background blur to the navigation and preview the final design.
- Learner-relevant: Outcome — a finished homepage footer + newsletter and the discipline of a final whole-page spacing/alignment polish; anchor — component reuse and converting a solid fill to a linear/gradient for depth.
