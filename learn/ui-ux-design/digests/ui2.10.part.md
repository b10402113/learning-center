---
source: ui2.10
source_type: pdf
source_lines: 7203
part: 10
status: absorbed
absorbed_at: 2026-10-07
created: 2026-10-07
updated: 2026-10-07
---

# Digest — UX/UI Design Course by Designership (part 10: Usability testing)

## Overview (L1)

- 10.0 Welcome to usability testing — module opener; promises an end-to-end process: set up the first usability test plan, find participants, and execute the whole thing with shared templates.
- 10.1 What is usability testing — defines usability tests, contrasts lean vs formal processes, and argues testing early reduces risk and builds business efficiency and customer empathy.
- 10.2 How to create a test plan — the test plan's required sections and a real template walkthrough, including cohort/segment criteria and measurable success criteria.
- 10.3 Create a test plan challenge — hands-on task to write three test plans (homepage messaging, search-results intuitiveness, filter priorities) for the Accom.ai booking project using templates and unbiased question starters.
- 10.4 Setup your UI prototypes — quick walkthrough to isolate module 9 UI designs into a design-feedback/separation area so they can be prepared for testing.
- 10.5 Prototype challenge — activity to ready the homepage for viewing, link the search CTA to a loading screen then results, and finalize realistic content (ChatGPT for placeholders).
- 10.6 How to conduct a usability test — where to find participants, scheduling/booking automation, five facilitation best practices, a findings-tracking template, and how to document and report.
- 10.7 Conduct the test challenge — activity to run the test with five participants, plus a Typeform + Calendly walkthrough for automating onboarding and booking.
- 10.8 How to iterate on designs — explain the process of turning test findings into design iterations, then moving finalized designs out of the feedback area.
- 10.9 Improve designs challenge — activity to pick one insight, make a small design tweak, and move final designs into the last section, completing brief-to-development.
- 10.10 What is Maze — introduces Maze.co for unmoderated remote testing and argues learning the manual process first makes tool use far more effective.

## Sections (L2)

### 10.0 Welcome to usability testing

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.0 Welcome to usability testing Lesson Summary I Designership (Li).pdf#welcome-to-usability-testing]]`
- Summary: Two-minute module introduction. States the module's arc — set up a usability test plan, find participants, and execute the entire process end-to-end — and promises downloadable templates to get started.
- Key claims: the module covers plan setup, participant finding, and full execution; templates are provided; no prior specialist tools are needed to begin.
- Learner-relevant: Sets expectations and the end-to-end scope of the usability-testing module.

### 10.1 What is usability testing

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.1 What is usability testing Lesson Summary I Designership (Li).pdf#what-is-usability-testing]]`
- Summary: Defines usability testing and shows that its formality scales with project needs. Recounts a lean in-house version (Zoom call, screen share, one task, notepad findings, straight back into the design file) versus a formal agency/enterprise version (brief, stakeholder approval, documented and presentable findings). Closes with the benefits of testing.
- Key claims: the UX process does not end at a design file; testing early reduces the risk of users rejecting an experience after months of building; lean vs formal processes are equally valid depending on constraints; testing improves UX, brings business efficiency, reduces post-launch changes, uncovers opportunities early, and keeps designers empathizing with users.
- Learner-relevant: Anchors why testing matters and lets the learner choose how much process their project warrants.

### 10.2 How to create a test plan

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.2 How to create a test plan Lesson Summary I Designership (Li).pdf#create-a-test-plan]]`
- Summary: Explains that a test plan is a brief documenting project details and process, then walks a real template: project overview, project scope, participant criteria, tasks, and success criteria — using an X1Z Online Bookstore example. Details cohort (time-based) vs segment (common-interest) participant thinking and gives per-task success thresholds.
- Key claims: a test plan typically includes an overview of the initiative, scope of work, clear measurable objectives, participant criteria, tasks, and success/failure criteria; formalizing it gathers thoughts, aligns stakeholders, and builds scalable processes; cohorts are time-based (e.g., purchased in the past six months) and segments are common-interest subsets of a cohort; tasks must be specific, simple, and step-based so users can complete them; success criteria are numeric targets (e.g., 90% navigate without confusion, 85% find a specific book via search, 90% filter products) used as a launch benchmark.
- Learner-relevant: Core process anchor — this is the document the learner reproduces in the challenge and all later lessons reference.

### 10.3 Create a test plan challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.3 Create a test plan challenge I Designership (Li).pdf#create-a-test-plan-challenge]]`
- Summary: A challenge to build three test plans for the Accom.ai accommodation-booking project: clarity of homepage messaging/UVP, intuitiveness of the search-listings results page, and priorities of the filters provided. The instructor demonstrates his own filled-in answers, including cohort/segment choices (traveled and booked accommodation in Australia within six months, and were the key decision-maker/planner) and specific task wording.
- Key claims: every design decision assumes the design is best, so testing verifies it actually achieves the outcome; test early concepts/wireframes with different measurable outcomes than content/copy or concept-idea validation; unbiased open-ended questions must not lead (ask "how do you start a search for booking accommodation?", not "do you use Google?"); a five-second recall test can gauge homepage comprehension; remote + moderated is the instructor's preferred method (convenient and allows in-the-moment follow-ups); the same five participants run all three tests in one session.
- Learner-relevant: Turned into practice — produces the concrete test-plan artifacts (overview, scope, tasks, success criteria) the learner will execute.

### 10.4 Setup your UI prototypes

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.4 Setup your UI prototypes I Designership (Li).pdf#setup-your-ui-prototypes]]`
- Summary: A short walkthrough that copies the module 9 UI designs (homepage and listings) into the file's design-feedback area, moves annotation items aside, and adds a loading screen plus a date so the prototype feels realistic. The goal is to isolate a working copy because it will be changed during testing.
- Key claims: only the homepage and listings page are being tested; a loading screen makes the prototype more realistic; designs are isolated so iterations do not disturb the original; this is UX-focused, not a Figma masterclass.
- Learner-relevant: Prep step that makes the prototype testable; sets up the file structure used again in 10.5 and 10.8.

### 10.5 Prototype challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.5 Prototype challenge I Designership (Li).pdf#prototype-challenge]]`
- Summary: An activity with three steps — prepare the homepage for viewing, connect the homepage search CTA to the results page, and finalize realistic content. The instructor builds the flow: CTA to a search/loading page, an 800ms delay, a 300ms dissolve-ease-out into the loaded results, marked as a flow starting point, then tested with the play control.
- Key claims: the CTA should navigate to the search-results/loading page rather than the results directly; timing is 800ms delay before a 300ms dissolve ease-out; content must be realistic before a real user test; ChatGPT can generate placeholder styles, activities, amenities, and listing names; content only needs to be plausible, not final.
- Learner-relevant: Produces the clickable prototype the usability test runs against.

### 10.6 How to conduct a usability test

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.6 How to conduct a usability test Lesson Summary I Designership (Li).pdf#conduct-a-usability-test]]`
- Summary: Comprehensive lesson on running a test. Covers where to find participants (current user base, email/in-app invites, social-media groups such as the Sydney Startup Group on Facebook, niche communities, third-party recruiters like usertesting.com, and Maze.co for unmoderated tests), automating scheduling (Calendly event type, one-on-one, Zoom location, bookable window, available hours, buffer time; Typeform registration form with contact info and Calendly integration), five facilitation best practices, what to record in a findings sheet, and post-test reporting. Ends with a Google Sheets template walkthrough.
- Key claims: participants must match the cohort/segment and represent the real user base; invite existing users and offer incentives while assuring feedback is essential; set clear measurable goals before starting; write realistic scenarios that reflect real tasks; facilitate effectively — guide without over-leading, observe, and ask unbiased open-ended questions; make participants comfortable giving negative feedback since finding what is broken is the purpose; record audio/video with consent; track per-task success/fail, time taken, error count, observed notes, qualitative insights, and recommendations; use Google Sheets for a free, shareable, quick-to-manage log; summarize successes, failures, and recommendations to stakeholders to inform next steps.
- Learner-relevant: The operational core of the module — the concrete process the learner follows to run their own test and log findings.

### 10.7 Conduct the test challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.7 Conduct the test challenge Lesson Summary I Designership (Li).pdf#conduct-the-test-challenge]]`
- Summary: The activity: execute the test plan by recruiting five relevant participants with a defined cohort and segment, testing the prototype beforehand, and documenting findings in Google Sheets. A Typeform + Calendly walkthrough shows creating a registration form (name, email, booking block), authenticating Calendly, selecting the usability-test event, configuring duration/time slots and buffer time, publishing, and sharing the link.
- Key claims: recruit exactly five participants matching cohort and segment; test the prototype yourself before running participants; Typeform's Calendly integration automates booking; configure custom hours and buffer time to avoid back-to-back sessions; on test day, click the calendar link, ask the participant to share their screen, get recording consent, and run the session.
- Learner-relevant: Puts the whole module into practice — the learner actually executes the end-to-end usability test.

### 10.8 How to iterate on designs

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.8 How to iterate on designs Lesson Summary I Designership (Li).pdf#iterate-on-designs]]`
- Summary: Explains how to turn findings into design changes. Start in the Google Sheet, understand the actual root cause of a failure (was the CTA hard to find, or was the layout unintuitive?), then return to Figma, fix the problem in the design-feedback copy, and move the finalized designs into the final designs section alongside untested-but-prioritized screens.
- Key claims: the key is understanding where and why a design fell through, not just that it failed; follow-up participant questions surface the real reason; a second round of testing may be skipped if it costs too much resource, so do the best on round one and move to development; keep the original in the workspace and iterate on the isolated design-feedback copy; move final designs next to the previously iterated ones to recombine the flow.
- Learner-relevant: Closes the loop from test insight to a finished, development-ready design file.

### 10.9 Improve designs challenge

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.9 Improve designs challenge Lesson Summary I Designership (Li).pdf#improve-designs-challenge]]`
- Summary: Final activity: pick one solution, iterate the designs based on usability-test findings, and move the final designs into the last section of the Figma file. Reinforces that the learner has now gone brief → designs → test → insights → iteration → final, development-ready designs.
- Key claims: choose one insight and make a simple tweak in the design-feedback section; copy the revised designs to final designs and recombine with the rest of the flow; this completes the start-to-finish product-design process.
- Learner-relevant: Capstone artifact — a refined, validated design ready to hand to development.

### 10.10 What is Maze

- Locator: `[[sources/ui-ux-design/20261007/ui2/10.10 What is Maze Lesson Summary I Designership (Li).pdf#what-is-maze]]`
- Summary: Introduces Maze.co, a tool for unmoderated and remote usability testing, and argues that learning the manual process first makes tool use more effective. Walks through creating a maze, adding blocks (prototype test, multiple-choice, yes/no, and a five-second test for recall), importing a Figma prototype via a "anyone with the link" link, clicking hotspots, going live, and sharing the link — optionally during a moderated call instead of screen sharing.
- Key claims: Maze offers prototype testing, live-website testing, feedback surveys, interview studies, card sorting, and tree testing; five-second tests display an image briefly to test recall; unmoderated tests are faster but lack in-the-moment follow-ups, so moderated and unmoderated have different pros and cons; Maze can be sent during a moderated test so the facilitator watches progress through the link; understanding the manual process teaches you to leverage tools better than tool-dependent designers.
- Learner-relevant: Tooling capstone — shows how to scale the manual process the learner just practiced.
