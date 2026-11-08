/** Media query that carries the reader's reduced-motion preference. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Skeleton floor so a cached subject never flashes a placeholder. */
export const MIN_LOADING_MS = 150;

/**
 * Read a MediaQueryList (or any `{ matches }` object) as a boolean.
 * Pure, so the preference gate can be tested without a browser.
 */
export function resolveMotionPreference(mediaQueryList) {
  return Boolean(mediaQueryList && mediaQueryList.matches);
}

/**
 * Subscribe to a MediaQueryList and call `onChange` with the resolved
 * boolean whenever the preference changes. Returns a cleanup function.
 */
export function subscribeMotionPreference(mediaQueryList, onChange) {
  if (!mediaQueryList) return () => {};

  const emit = (event) => {
    const matches =
      event && typeof event.matches === "boolean"
        ? event.matches
        : mediaQueryList.matches;
    onChange(Boolean(matches));
  };

  if (typeof mediaQueryList.addEventListener !== "function") return () => {};
  mediaQueryList.addEventListener("change", emit);
  return () => mediaQueryList.removeEventListener("change", emit);
}

/**
 * Milliseconds still owed to a minimum display window. Returns 0 once the
 * window has passed or when there is no start time.
 */
export function remainingDisplayMs(startedAt, now, minMs = MIN_LOADING_MS) {
  if (!startedAt || !Number.isFinite(startedAt)) return 0;
  const remaining = minMs - (now - startedAt);
  return remaining > 0 ? remaining : 0;
}

/**
 * Scroll behaviour for a table-of-contents jump. Reduced motion jumps
 * instantly; otherwise the reader gets the usual smooth glide.
 */
export function scrollBehaviorFor(reduced) {
  return reduced ? "auto" : "smooth";
}

/**
 * The frame the TOC bookmark should occupy, read from the active link's
 * offsets. Returns null when there is no visible link to measure.
 */
export function tocIndicatorFrame(link) {
  if (!link) return null;
  const top = Number(link.offsetTop);
  const height = Number(link.offsetHeight);
  if (!Number.isFinite(top) || !Number.isFinite(height) || height <= 0) {
    return null;
  }
  return { top, height };
}

/**
 * True when the browser already holds the image, so a cached figure appears
 * on the first paint instead of fading in from invisible.
 */
export function imageAlreadyLoaded(image) {
  return Boolean(image && image.complete);
}

/**
 * Which way the quiz deck travelled. The entering card slides in from that
 * side, so stepping back feels like going back.
 */
export function quizDirection(fromIndex, toIndex) {
  return Number(toIndex) < Number(fromIndex) ? "prev" : "next";
}

/** Horizontal entrance offset in pixels for a quiz card's direction. */
export function quizEnterOffset(direction) {
  return direction === "prev" ? -8 : 8;
}

/** Gap between each item in the completion card's entrance. */
export const COMPLETION_STAGGER_MS = 20;

/** Entrance delay for the nth completion item, clamped at zero. */
export function completionDelayMs(order) {
  const index = Number(order);
  if (!Number.isFinite(index) || index <= 0) return 0;
  return index * COMPLETION_STAGGER_MS;
}
