---
source: three-js-bootcamp-zero-to-mastery
source_lines: 44849
part: 16
created: 2026-09-07
updated: 2026-09-07
---

# Digest — three-js-bootcamp-zero-to-mastery (part 16)

## Overview (L1)

- **0091. Asset Array** — Introduces the asset-array pattern: instead of manually loading each resource, define an array of asset descriptors (path, id, type) that drives a reusable loader. Mirrors the solar-system course's planet-array approach but generalized for textures and models.
- **0092. Creating the AssetStore** — Builds the `AssetLoader` class with Draco, GLTF, and Texture loaders, then creates a Zustand `AssetStore` via `createStore`. The store holds both the `assetsToLoad` queue and the `loadedAssets` object, and exposes an `addLoadedAsset` method on the store itself.
- **0093. Loading Our Assets** — Iterates the queue, dispatches each asset to the correct loader by `type`, and writes it into the store via `set`. Demonstrates the Zustand "merge previous state + new key" pattern (`...state.loadedAssets, [id]: asset`) and the implicit-return parenthesis shorthand for set callbacks.
- **0094. Preloader Progress** — Creates a `Preloader` that subscribes to the store and derives live progress as `Object.keys(loadedAssets).length / assetsToLoad.length`. Also covers Chrome DevTools network throttling to simulate first-visitor load times.
- **0095. Preloader UI** — Adds DOM UI: an overlay to hide the scene until ready, a progress text/percentage element, and a start button. Explains the start button's dual role: gamified entry and Chrome-autoplay-policy workaround that requires user gesture before audio playback.

## Sections (L2)

### 0091

- Locator: `[[sources/three-js/20260907/0091. Asset Array.srt#0091]]`
- Summary: Explains the high-level architecture for loading many assets at once: an array of descriptor objects feeds into an asset loader, which hands results to an asset store. Walks through defining the first asset (Earth texture) with `path`, `id`, and `type`, then stubs out Mars, Mercury, and Sun entries.
- Key claims: Loading assets one-by-one is repetitive; an array of descriptors plus helper methods scales better. The `type` field determines which loader (TextureLoader vs. GLTFLoader) the loader invokes. The static folder holds the actual binary/image files the loader will fetch.
- Learner-relevant: Establishes the "data-driven loading" mental pattern — the asset list is a declarative manifest, and the loader reads it procedurally. Anchors to the earlier solar-system course's planet-array approach.

### 0092

- Locator: `[[sources/three-js/20260907/0092. Creating the AssetStore.srt#0092]]`
- Summary: Implements `AssetLoader` with `DracoLoader`, `GLTFLoader`, and `TextureLoader` instantiated inside `instantiateLoaders()`. Then creates the Zustand `AssetStore` via `createStore`, storing `assetsToLoad` and an empty `loadedAssets` object, plus an `addLoadedAsset` method defined directly on the store. Verifies the store is reachable by importing it into the loader and logging it.
- Key claims: GLTFLoader and DracoLoader live in the `three/addons` folder, not core THREE. Zustand's `createStore` accepts a callback whose return value is the initial state; methods can live alongside state in that same object. Store methods are accessible anywhere the store is imported.
- Learner-relevant: Shows how to colocate behavior and state in a Zustand vanilla store (not React-bound). Prepares the learner to understand why `addLoadedAsset` can be called from the loader without prop-drilling.

### 0093

- Locator: `[[sources/three-js/20260907/0093. Loading Our Assets.srt#0093]]`
- Summary: Writes the load loop: `this.assetsToLoad.forEach(asset => { if (asset.type === 'texture') this.textureLoader.load(asset.path, this.assetStore.addLoadedAsset) })`, and the symmetric GLTF branch. Then replaces the console.log stub in `addLoadedAsset` with a `set(state => ({ loadedAssets: { ...state.loadedAssets, [assetId]: loadedAsset } }))` pattern. Demonstrates step-by-step how each call merges the previous snapshot with a new key. Also shows the parenthesis-wrapped implicit-return shorthand `set(state => ({ ... }))`.
- Key claims: Zustand's `set` receives a function whose first argument is the previous state; returning a new object merges into the store. The spread operator `...state.loadedAssets` preserves prior entries; the new `[assetId]: loadedAsset` appends the just-loaded one. Implicit return via `({})` braces avoids an explicit `return` keyword.
- Learner-relevant: This is the core reactive-loading mechanic — every completed fetch immutably appends to `loadedAssets`, and any subscriber (like the Preloader) sees the update immediately.

### 0094

- Locator: `[[sources/three-js/20260907/0094. Preloader Progress.srt#0094]]`
- Summary: Creates a `Preloader` class that imports the store and calls `this.assetStore.subscribe(state => { ... })`. Inside the callback it computes `loadedAssetsCount = Object.keys(state.loadedAssets).length` and `assetsToLoadCount = state.assetsToLoad.length`, then `progress = loadedAssetsCount / assetsToLoadCount`, logging values that climb 0.25 → 0.5 → 0.75 → 1. Also demonstrates enabling "Disable cache" and adding a custom throttling profile (8 Mbps "average internet") in Chrome DevTools Network tab to simulate real first-visit conditions.
- Key claims: `Object.keys(obj).length` converts an object's key count into a progress numerator. Zustand's `subscribe` fires on every state mutation, making it a natural progress listener. Network throttling is essential for actually observing the preloader because cached/local loads complete instantly.
- Learner-relevant: Teaches the read-side companion to the write-side pattern from 0093, and gives a practical DevTools workflow for testing loading UX.

### 0095

- Locator: `[[sources/three-js/20260907/0095. Preloader UI.srt#0095]]`
- Summary: Uncomments four HTML/CSS UI pieces one by one: an overlay `<div>` that blacks out the canvas until ready, a loading `<h1>`/percentage text, and a start button. Explains the start button's rationale — it gamifies entry and, more concretely, satisfies Chrome's autoplay policy which blocks audio until the user has interacted with the page. Mentions accompanying CSS handles fade-in/out and hover states that will be wired to the Preloader logic next.
- Key claims: The overlay prevents partially-loaded scene geometry from "popping" into view before the experience is ready. Chrome requires a user gesture (click/tap) before allowing audio autoplay; the start button guarantees that gesture. CSS classes for fades and hovers will be toggled from JavaScript based on Preloader state.
- Learner-relevant: Connects the loading pipeline to actual DOM, and introduces the browser-constraint reason (autoplay policy) that drives many real-world "click to start" screens.
