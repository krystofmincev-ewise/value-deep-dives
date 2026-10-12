"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { runInThisContext } = require("node:vm");
// The repository uses ES modules; load this classic browser script with a CJS export target.
const filename = resolve(__dirname, "../site/teaching.js");
const logicModule = { exports: {} };
runInThisContext(`(function(module) {\n${readFileSync(filename, "utf8")}\n})`, { filename })(logicModule);
const {
  STEP_DURATION_MS, transition, parsePoint, buildRoute, routeKeyframes,
  overlapsViewport, createCoordinator,
} = logicModule.exports;

test("default/reset show all; manual steps focus and pause", () => {
  const all = Object.freeze({ step: null, playing: false });
  assert.deepEqual(transition(all, "previous", 3), all);
  assert.deepEqual(transition(all, "next", 3), { step: 0, playing: false });
  assert.deepEqual(transition({ step: 1, playing: true }, "next", 3), { step: 2, playing: false });
  assert.deepEqual(transition({ step: 2, playing: true }, "previous", 3), { step: 1, playing: false });
  assert.deepEqual(transition({ step: 2, playing: true }, "reset", 3), all);
});

test("play advances every six seconds, holds last stage, then stops", () => {
  assert.equal(STEP_DURATION_MS, 6000);
  let state = transition({ step: null, playing: false }, "play", 3);
  assert.deepEqual(state, { step: 0, playing: true });
  state = transition(state, "tick", 3);
  assert.deepEqual(state, { step: 1, playing: true });
  state = transition(state, "tick", 3);
  assert.deepEqual(state, { step: 2, playing: true });
  state = transition(state, "tick", 3);
  assert.deepEqual(state, { step: 2, playing: false });
  assert.deepEqual(transition(state, "play", 3), { step: 0, playing: true });
});

test("pause is stable and a one-stage player stops", () => {
  const paused = transition({ step: 1, playing: true }, "pause", 3);
  assert.deepEqual(transition(paused, "tick", 3), paused);
  assert.deepEqual(transition(paused, "play", 3), { step: 1, playing: true });
  const single = transition({ step: null, playing: false }, "play", 1);
  assert.deepEqual(transition(single, "tick", 1), { step: 0, playing: false });
  assert.throws(() => transition({ step: 5, playing: false }, "next", 3), RangeError);
  assert.throws(() => transition({ step: null, playing: true }, "tick", 3), RangeError);
});

test("equipment route follows all declared corners at proportional offsets", () => {
  const route = buildRoute("413,133", "547,133;547,340;413,340", "413,353");
  assert.equal(route.length, 488);
  assert.deepEqual(route.distances, [0, 134, 341, 475, 488]);
  const frames = routeKeyframes(route);
  assert.deepEqual(frames.map((frame) => frame.offset), [0, 134 / 488, 341 / 488, 475 / 488, 1]);
  assert.equal(frames[0].transform, "translate(413px, 133px)");
  assert.equal(frames.at(-1).transform, "translate(413px, 353px)");
});

test("invalid routes remain still; repeated adjacent points do not distort speed", () => {
  assert.equal(parsePoint(" ,10"), null);
  assert.equal(parsePoint("Infinity,2"), null);
  assert.equal(buildRoute("0,0", "bad;1,1", "3,4"), null);
  assert.equal(buildRoute("0,0", null, "0,0"), null);
  const route = buildRoute("0,0", "0,0;3,4;3,4", "6,8");
  assert.deepEqual(route.distances, [0, 5, 10]);
  assert.deepEqual(routeKeyframes(route).map((frame) => frame.offset), [0, 0.5, 1]);
});

test("coordinator pauses previous player and ignores stale release", () => {
  const coordinator = createCoordinator();
  let firstPauses = 0;
  let secondPauses = 0;
  const first = { pause() { firstPauses += 1; coordinator.release(first); } };
  const second = { pause() { secondPauses += 1; coordinator.release(second); } };
  coordinator.activate(first);
  coordinator.activate(second);
  assert.equal(firstPauses, 1);
  coordinator.release(first);
  assert.equal(coordinator.getActive(), second);
  coordinator.pauseActive();
  assert.equal(secondPauses, 1);
  assert.equal(coordinator.getActive(), null);
});

test("offscreen means no overlap with the viewport", () => {
  assert.equal(overlapsViewport({ top: -200, bottom: 1, left: 0, right: 300 }, 400, 700), true);
  assert.equal(overlapsViewport({ top: -200, bottom: 0, left: 0, right: 300 }, 400, 700), false);
  assert.equal(overlapsViewport({ top: 700, bottom: 800, left: 0, right: 300 }, 400, 700), false);
  assert.equal(overlapsViewport({ top: 0, bottom: 100, left: 400, right: 500 }, 400, 700), false);
});
