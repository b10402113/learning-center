---
source: How to build mobile apps for local businesses with Claude Code - FULL COURSE
source_type: text
source_lines: 17078
part: 4
status: absorbed
absorbed_at: 2026-10-02
created: 2026-10-01
updated: 2026-10-01
---

# Digest — How to build mobile apps for local businesses with Claude Code - FULL COURSE (part 4)

## Overview (L1)

- Onboarding interaction fixes — The Continue button fails without valid input; date-of-birth, a missing back button, and a non-draggable anxiety slider are diagnosed and fixed, with native liquid-glass requested for the slider.
- Button design-system rebuild — A screenshot is analyzed with GPT (classified as "neumorphism + glossy 3D") and Claude is looped until buttons match the attached design, ideally as a reusable component / design system.
- Onboarding background consistency & Expo dev menu — The screen-3 background is applied to screens 2 and 4, a stray medical-history image is removed, and the Expo debug overlay toggle (Ctrl D) is explained.
- Design upscaling & home screen with native tabs — Design references are upscaled in GPT, the home screen is built via screenshot-compare loop, and Expo "native tabs" is adopted to get liquid glass without custom code.
- Home screen polish & onboarding gating — The "who is this for" section is cut, horizontal padding fixed, onboarding suppressed on reload, quick actions go 2×2, and native tabs confirmed working.
- UI variation generation with GPT — A workflow for generating six alternative UI variations from a screenshot, upscaling the favorite, and rebuilding it in Claude.
- Book appointment screen build — Three upscaled appointment screens are pasted as references and implemented via the screenshot-compare loop; Hickfield MCP is introduced as a faster upscale path.
- Book appointment functionality fixes — Design system enforced globally (saved to AGENTS.md), the select-reason button and calendar dates fixed, past dates blocked, and buttons restyled.
- Book appointment polish & session pause — Logo/checkmark sizing, horizontal padding, change-button removal, bolder confirm text; recording paused at 1 a.m. to resume next morning.
- AI assistant screen & auto-compact — AI assistant UI built from two references using Hickfield MCP asset generation, auto-compact explained for long histories, and image-quality config saved to agents.md.
- Profile screen design & implementation — Profile screen and its sub-screens are generated to match the app's green palette; Claude implements UI-only with hard-coded values.

## Sections (L2)

### Onboarding interaction fixes

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The onboarding flow is debugged: "continue" only works when input is valid, the date-of-birth field accepts arbitrary values, there is no back button from screen 2 onward, the anxiety-level handlebar does not move, and text overlaps the image on screen 2. A native component is requested so the slider gets the liquid-glass effect.
- Key claims: Continue only advances with valid input; DOB needs month ≤ 12 and day ≤ 31 restrictions; a back button should appear top-left from the second screen; the anxiety slider should use a native Expo component for liquid glass.
- Learner-relevant: Supports a step on fixing onboarding form validation and navigation, and on when to reach for native Expo components for platform effects.

### Button design-system rebuild

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The author screenshots the intended design, asks GPT to name the style ("a mix of neumorphism and glossy 3D"), then pastes that plus the reference image into Claude asking it to implement the exact button style and extract a reusable component / design system.
- Key claims: Naming a design style helps Claude reproduce it; asking for a reusable component or design system pays off across the project; several tiny tasks in one prompt are acceptable, but multiple large tasks in one prompt usually go poorly.
- Learner-relevant: Supports a step on deriving a reusable UI design system from a single reference and on prompt scoping.

### Onboarding background consistency & Expo dev menu

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The screen-3 background is extended to screens 2 and 4, the medical-history image is removed for a cleaner look, and the on-screen Expo debug button is explained (toggle it off, bring it back with Ctrl D).
- Key claims: Reusing one background across screens improves consistency; the Expo floating button is development-only and can be toggled; removing the side image made the layout cleaner.
- Learner-relevant: Supports a step on killing Expo dev affordances and on cross-screen visual consistency.

### Design upscaling & home screen with native tabs

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Design references are upscaled via GPT, the home screen is built by looping Claude until the simulator screenshot matches the reference, and Expo documentation on "native tabs" is copied as markdown so Claude can implement liquid-glass tabs with correct colors, icons, and text even though the design lacks them.
- Key claims: Native tabs give liquid glass without writing a single line of code; native tabs are the default choice over JavaScript tabs unless heavy customization is needed; pasting the docs as markdown grounds the implementation.
- Learner-relevant: Supports a step on adopting Expo native tabs and on injecting external documentation into a Claude prompt.

### Home screen polish & onboarding gating

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The "who is this for" section is removed (that question moves to booking), horizontal padding is added, onboarding is made non-blocking after login/reload, quick actions switch from 1×4 to a 2×2 grid, and the shared onboarding background is applied to the home screen.
- Key claims: Repeating onboarding on every reload is undesirable and comes from a hardcoded flag; quick actions need a 2×2 grid for readable text; native tabs render correctly after the changes.
- Learner-relevant: Supports a step on onboarding gating / persisted auth state and responsive grid layout.

### UI variation generation with GPT

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: A repeatable trick: screenshot the current screen, ask GPT to "generate a grid of six with different variations," pick one, upscale it, paste into Claude, and rebuild the screen from it.
- Key claims: GPT can produce six design variations from a screenshot; upscaling the chosen variation gives a usable reference; this is a routine fallback when the current UI is unsatisfying.
- Learner-relevant: Supports a step on rapidly exploring UI alternatives before committing to implementation.

### Book appointment screen build

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Three upscaled book-appointment screens (selection, form, confirmation) are attached and implemented via the screenshot-compare loop. The author notes the upscale-then-paste workflow is tedious and introduces using Hickfield MCP to upscale every remaining screen automatically, saving and copying them.
- Key claims: The three-step booking flow is built from three reference screens; Hickfield MCP can batch-upscale references, but most learners won't have it; the core loop is upscale → paste → iterate.
- Learner-relevant: Supports a step on building multi-screen flows from references and on tooling shortcuts for asset prep.

### Book appointment functionality fixes

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Claude is told the booking buttons don't match the onboarding design system, and this rule is saved to AGENTS.md. It fixes the non-working "select reason" button, shows the correct calendar date, and prevents booking past dates while keeping the back button.
- Key claims: Design-system consistency should be codified in AGENTS.md so it persists; the calendar must show the real date and allow future navigation only; the select-reason button must actually work.
- Learner-relevant: Supports a step on persisting project conventions via AGENTS.md and on calendar/past-date validation logic.

### Book appointment polish & session pause

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: Final feedback shrinks the logo and checkmark for horizontal padding, removes the "change" buttons under the date and in the confirm screen, and bolds the confirm-appointment text. The author calls it done at roughly 1 a.m. and pauses the recording until morning.
- Key claims: Spacing fixes can be driven by shrinking the checkmark rather than adding padding; date/user changes shouldn't live inside the confirm flow; the UI now closely resembles the reference Pinterest image without hand-written code.
- Learner-relevant: Supports a step on applying iterative UI feedback and reasonable stopping points in a build session.

### AI assistant screen & auto-compact

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: The AI assistant screen is built from two upscaled references. The author annotates the generated fake image (deleting middle-of-UI images, removing an icon, making the placeholder one line) using in-image comments. Auto-compact is explained as a way to shrink over-long session context, and image generation is pinned to 1K quality, aspect 9:16, GPT image 2, with that rule saved to agents.md.
- Key claims: Commenting directly on an image is an effective way to give layout feedback; auto-compact condenses long context to keep the model effective; constraining image quality/aspect in agents.md controls credit spend.
- Learner-relevant: Supports a step on image-annotation feedback and on context management / cost controls.

### Profile screen design & implementation

- Locator: `[[sources/mobile-app-course/20261001/How to build mobile apps for local businesses with Claude Code - FULL COURSE.srt]]`
- Summary: No profile screen existed in the design, so GPT is asked to generate one matching the app, plus sub-screens behind personal information and appointments. Colors first come back blue and are regenerated to the app's green, then Claude implements the profile UI with hard-coded values, reusing existing local assets.
- Key claims: Missing screens can be generated to match an established design language; palette mismatches require explicitly asking for the app's color; the profile screen is built UI-only with hard-coded values for now.
- Learner-relevant: Supports a step on extending a design system to new screens and on the UI-first, data-later build order.
