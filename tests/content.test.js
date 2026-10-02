import { test } from "node:test";
import assert from "node:assert/strict";
import { loadContent } from "../lib/load.js";
import { validate, gpioMentions } from "../lib/validate.js";

const content = await loadContent();

test("all content passes validation", () => {
  assert.doesNotThrow(() => validate(content));
});

test("course has 32 sessions numbered 1–32", () => {
  assert.deepEqual(content.sessions.map((s) => s.number), Array.from({ length: 32 }, (_, i) => i + 1));
});

test("phase ranges cover every session exactly once", () => {
  const covered = content.course.phases.flatMap((p) => Array.from({ length: p.sessions[1] - p.sessions[0] + 1 }, (_, i) => p.sessions[0] + i));
  assert.deepEqual(covered, Array.from({ length: 32 }, (_, i) => i + 1));
});

test("GPIO mention parser handles lists and ranges", () => {
  assert.deepEqual(gpioMentions("RGB GPIO 18/19/20"), [18, 19, 20]);
  assert.deepEqual(gpioMentions("GPIO 11–17"), [11, 12, 13, 14, 15, 16, 17]);
  assert.deepEqual(gpioMentions("Free pins: GPIO 0–3, 21, 22"), [0, 1, 2, 3, 21, 22]);
  assert.deepEqual(gpioMentions("buzzer GPIO 7, buttons GPIO 4/5/6"), [7, 4, 5, 6]);
});

test("validation rejects a pin that is not on the board", () => {
  const broken = structuredClone(content);
  broken.sessions[0] = { ...broken.sessions[0], output: "LED on GPIO 23" };
  assert.throws(() => validate(broken), /GPIO 23/);
});

test("validation rejects a run sheet that doesn't add up to 55 minutes", () => {
  const broken = structuredClone(content);
  const s = broken.sessions.find((x) => x.status === "full");
  s.runsheet = s.runsheet.slice(0, -1);
  assert.throws(() => validate(broken), /run sheet ends at/);
});

test("validation rejects the wrong brand spelling", () => {
  const broken = structuredClone(content);
  broken.sessions[1] = { ...broken.sessions[1], output: "Welcome to BigBot" };
  assert.throws(() => validate(broken), /BigBoT/);
});

test("pin map matches the schematic-checked assignments", () => {
  const use = Object.fromEntries(content.pins.pins.map((p) => [p.gpio, p.use]));
  assert.match(use[27], /LDR/);
  assert.match(use[26], /LM35/);
  assert.match(use[3], /NeoPixel/);
  assert.match(use[21], /Trig/);
  assert.match(use[22], /Echo/);
  assert.match(use[13], /AIN1/);
  assert.match(use[12], /AIN2/);
  assert.match(use[14], /STBY/);
});

test("validation rejects a missing image or missing alt text", () => {
  const broken = structuredClone(content);
  const s = broken.sessions.find((x) => x.status === "full");
  s.sections[0].blocks.push({ type: "image", src: "does-not-exist.jpg", alt: "" });
  assert.throws(() => validate(broken), /needs alt text[\s\S]*not found|not found[\s\S]*needs alt text/);
});
