---
source: three-js-bootcamp-zero-to-mastery
source_hash: 46f58bf9321ff5a95fd0ec5e93c39f0d108db98f3384501fe7777f77dbd25c38
source_lines: 44849
part: 1
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 1)

## Overview (L1)

- 0001. Three.js Bootcamp — Jesse Zhou introduces the course: build a personalized 3D portfolio in third-person game style. Goal is to combine creativity with dev skills, starting from basics with community support.
- 0002. Three.js Examples — Motivation through real-world examples. Jesse shares how his Three.js portfolio got him hired, then browses threejs.org showcases (interactive worlds, metaverse, animations) to prove beginners can achieve stunning results.
- 0003. Wait...What is Three.js_ — Conceptual foundation. Defines Three.js as a high-level JavaScript API for browser-based 3D graphics; explains GPU, WebGL, and the low-level vs high-level API tradeoff that makes Three.js accessible without sacrificing flexibility.
- 0004. Prerequisite Knowledge — What you need before starting. JavaScript basics (variables, objects, loops, functions) are enough; basic math is fine; tools are Chrome, VS Code, and optionally Blender. Jesse shares his own path from Python/data science to Three.js.
- 0005. Three.js Documentation — Learning to read the docs as best practice. The threejs.org docs include native, source-code-viewable examples; the recommended learning loop is to find an example, open its code, tweak it, and break it to understand how things work.
- 0006. Hacking the Example — First hands-on run. Download the Three.js repo, serve the examples locally with Live Server to bypass browser file-loading restrictions, and modify a simple text example — changing the string and colors to confirm you can run and alter Three.js code.
- 0007. Three.js Fundamentals — The core app structure. Every Three.js app is built on Scene (holds all objects in a parent-child hierarchy), Camera (determines the user's viewpoint), and Renderer (generates the image); the render loop calls the renderer ~60 times per second for animation and interactivity.

## Sections (L2)

### 0001

- Locator: `[[sources/three-js/20260907/0001. Three.js Bootcamp.srt#0001]]`
- Summary: Course introduction by Jesse Zhou. He frames the course around a capstone project — a personalized 3D portfolio with a third-person game style and a 3D avatar — and emphasizes that the real goal is reigniting creative passion alongside technical skill. The promise is a step-by-step ramp from basics, backed by community support.
- Key claims: Three.js lets web developers, designers, and game devs build innovative interactive 3D experiences directly in the browser; the course starts from basics and eases the learner in; community is available for questions.
- Learner-relevant: Sets the emotional and project anchor for the whole subject — the learner is building toward a creative portfolio piece, not just abstract exercises.

### 0002

- Locator: `[[sources/three-js/20260907/0002. Three.js Examples.srt#0002]]`
- Summary: Jesse uses social proof and live demos to build excitement. He tells the story of being hired because of his Three.js portfolio, then walks through several threejs.org examples — an interactive 3D world, the Webverse metaverse, and a personal portfolio — showing that these are real-time 3D, not video. He emphasizes that he built his portfolio in 6 months while working full-time.
- Key claims: The best way to understand Three.js capability is through examples; Three.js enables real-time interactive 3D in the browser (WASD controls, click-and-drag camera); beginners can reach impressive results quickly.
- Learner-relevant: Gives the learner concrete visual targets and confidence that the skill is achievable; introduces threejs.org as a source of inspiration and example code.

### 0003

- Locator: `[[sources/three-js/20260907/0003. Wait...What is Three.js_.srt#0003]]`
- Summary: Conceptual stack explanation. Three.js is defined as a high-level JavaScript API for rendering 3D graphics in the browser without writing low-level WebGL. The section explains real-time rendering, the GPU's role in parallel computation, WebGL as the browser GPU API, and the low-level vs high-level API spectrum. Three.js sits on top of WebGL to abstract complexity while remaining flexible enough for professional work.
- Key claims: Three.js abstracts WebGL into a more accessible JavaScript API; WebGL is a low-level API offering fine control but high complexity; the GPU is specialized hardware for parallel simple computations; high-level APIs trade some granular control for usability; Three.js still unlocks most creative needs without deep WebGL knowledge.
- Learner-relevant: Gives the learner the mental model for where Three.js sits in the web graphics stack — essential context before writing any code.

### 0004

- Locator: `[[sources/three-js/20260907/0004. Prerequisite Knowledge.srt#0004]]`
- Summary: Prerequisite check. The only hard requirement is basic JavaScript familiarity (variables, objects, loops, functions); most of the course uses the Three.js API rather than advanced JS. Basic math is used but kept minimal. Recommended tools are Chrome, VS Code, and optionally Blender for one lesson. Jesse normalizes non-traditional backgrounds by sharing his own Python/data-science-to-Three.js path.
- Key claims: JavaScript basics are sufficient; you do not need to love math to be a good Three.js developer; Chrome and VS Code are the recommended tools; Blender is free and optional — a pre-made model is provided.
- Learner-relevant: Lowers anxiety about readiness and gives a concrete tool setup checklist before the first line of code.

### 0005

- Locator: `[[sources/three-js/20260907/0005. Three.js Documentation.srt#0005]]`
- Summary: Introduces the official Three.js documentation at threejs.org as a habit to build early. The docs are not the most polished but contain rich information and, crucially, ship with native examples whose raw source code is viewable. The prescribed learning method is to find an interesting example, open its code, tweak it, and break it to understand how it works.
- Key claims: Reading documentation is a best practice the course will reinforce; threejs.org examples are viewable as raw source code; learning by tweaking and breaking examples is a valid, encouraged strategy.
- Learner-relevant: Establishes a self-sufficiency skill — the learner will be directed to the docs throughout the course as the source of truth.

### 0006

- Locator: `[[sources/three-js/20260907/0006. Hacking the Example.srt#0006]]`
- Summary: First hands-on run. Jesse walks through downloading the Three.js GitHub repo, opening the examples folder, and serving the files locally with the VS Code Live Server extension to bypass the browser's local-file security restriction. He then modifies a simple text example — changing the displayed string and colors — to confirm the learner can run and alter Three.js code.
- Key claims: Browsers block local file loading for security, so examples must be served over a local web server; Live Server (or later Vite) solves this; modifying example code is the fastest way to start learning.
- Learner-relevant: Gives the learner a working local dev environment and a first successful edit — the "hello world" moment for the subject.

### 0007

- Locator: `[[sources/three-js/20260907/0007. Three.js Fundamentals.srt#0007]]`
- Summary: The structural mental model for every Three.js application. The Scene holds all visible objects (lights, meshes, backgrounds) in a parent-child hierarchy that lets transformations propagate from parent to child. The Camera determines what the user sees at any moment (position, field of view). The Renderer takes scene and camera data and generates the image; calling it ~60 times per second in a render loop produces animation and interactivity.
- Key claims: Scene, Camera, and Renderer are the three pillars of any Three.js app; the scene is organized as a hierarchy where children inherit parent transforms; the renderer generates one image per call, so a render loop is needed for motion; the Hollywood set/camera/film analogy maps cleanly onto the three objects.
- Learner-relevant: This is the foundational architecture the learner will reuse in every subsequent project — understanding it early prevents confusion when real code appears.
