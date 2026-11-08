import assert from "node:assert/strict";
import test from "node:test";
import {
  MIN_LOADING_MS,
  imageAlreadyLoaded,
  remainingDisplayMs,
  resolveMotionPreference,
  scrollBehaviorFor,
  subscribeMotionPreference,
  tocIndicatorFrame,
} from "./motion.mjs";

function fakeMediaQueryList(matches = false) {
  const listeners = new Set();
  return {
    matches,
    listeners,
    addEventListener(type, listener) {
      assert.equal(type, "change");
      listeners.add(listener);
    },
    removeEventListener(type, listener) {
      assert.equal(type, "change");
      listeners.delete(listener);
    },
    emit(matches) {
      this.matches = matches;
      for (const listener of listeners) listener({ matches });
    },
  };
}

test("resolves a media query list to its matches flag", () => {
  assert.equal(resolveMotionPreference({ matches: true }), true);
  assert.equal(resolveMotionPreference({ matches: false }), false);
  assert.equal(resolveMotionPreference(null), false);
  assert.equal(resolveMotionPreference(undefined), false);
});

test("subscribes and reports preference changes, then cleans up", () => {
  const mql = fakeMediaQueryList(false);
  const seen = [];
  const unsubscribe = subscribeMotionPreference(mql, (value) => seen.push(value));

  mql.emit(true);
  mql.emit(false);
  assert.deepEqual(seen, [true, false]);

  unsubscribe();
  mql.emit(true);
  assert.deepEqual(seen, [true, false]);
  assert.equal(mql.listeners.size, 0);
});

test("ignores a media query list without addEventListener", () => {
  let called = false;
  const unsubscribe = subscribeMotionPreference({ matches: true }, () => {
    called = true;
  });
  assert.equal(typeof unsubscribe, "function");
  assert.doesNotThrow(unsubscribe);
  assert.equal(called, false);
});

test("is a no-op when there is no media query list", () => {
  assert.doesNotThrow(() => subscribeMotionPreference(null, () => {})());
});

test("remainingDisplayMs keeps the minimum window and then returns zero", () => {
  assert.equal(MIN_LOADING_MS, 150);
  assert.equal(remainingDisplayMs(0, 1000), 0);
  assert.equal(remainingDisplayMs(1000, 1050, 150), 100);
  assert.equal(remainingDisplayMs(1000, 1150, 150), 0);
  assert.equal(remainingDisplayMs(1000, 2000, 150), 0);
});

test("scrollBehaviorFor keeps TOC jumps instant under reduced motion", () => {
  assert.equal(scrollBehaviorFor(true), "auto");
  assert.equal(scrollBehaviorFor(false), "smooth");
});

test("tocIndicatorFrame reads the active link's offset and height", () => {
  assert.deepEqual(tocIndicatorFrame({ offsetTop: 42, offsetHeight: 18 }), {
    top: 42,
    height: 18,
  });
  assert.deepEqual(tocIndicatorFrame({ offsetTop: 0, offsetHeight: 20 }), {
    top: 0,
    height: 20,
  });
});

test("tocIndicatorFrame ignores a missing or empty link", () => {
  assert.equal(tocIndicatorFrame(null), null);
  assert.equal(tocIndicatorFrame({ offsetTop: 10, offsetHeight: 0 }), null);
  assert.equal(tocIndicatorFrame({ offsetTop: NaN, offsetHeight: 18 }), null);
});

test("imageAlreadyLoaded reveals a cached image on the first paint", () => {
  assert.equal(imageAlreadyLoaded({ complete: true }), true);
  assert.equal(imageAlreadyLoaded({ complete: false }), false);
  assert.equal(imageAlreadyLoaded(null), false);
});
