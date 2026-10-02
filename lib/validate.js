// Content validation. The build stops if any rule fails, so a broken lesson can never be published.
import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT } from "./load.js";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const WIRING = ["simulation", "onboard", "external"];
const STATUS = ["outline", "full"];
const COMPONENT_TYPES = ["board", "onboard", "external", "tool", "virtual"];
const BLOCK_TYPES = ["p", "h3", "teacher", "callout", "code", "quiz", "list", "steps", "apps", "problem",
  "components", "figure", "image", "widget", "details", "table", "copytext"];
const WIDGETS = ["ldr-lab", "light-test", "blink", "led-circuit", "traffic-light"];

/** Collect every string inside a value (deep), for text-wide checks. */
function strings(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => strings(v, out));
  return out;
}

/** All "GPIO n" numbers mentioned in a text, including lists like "GPIO 18/19/20" or "GPIO 11–17". */
export function gpioMentions(text) {
  const found = [];
  const re = /GPIO\s*(\d+(?:\s*(?:\/|,|–|-|and)\s*\d+)*)/g;
  let m;
  while ((m = re.exec(text))) {
    for (const piece of m[1].split(/\s*(?:\/|,|and)\s*/)) {
      const range = piece.match(/^(\d+)\s*[–-]\s*(\d+)$/);
      if (range) for (let n = +range[1]; n <= +range[2]; n++) found.push(n);
      else found.push(Number(piece));
    }
  }
  return found;
}

/** Walk blocks recursively (steps contain nested blocks). */
export function walkBlocks(blocks, fn) {
  for (const b of blocks || []) {
    fn(b);
    if (b.type === "steps") b.items.forEach((it) => walkBlocks(it.blocks, fn));
  }
}

export function validate(content) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  const { course, pins, components, sessions, teaching } = content;
  const validGpio = new Set(pins.pins.map((p) => p.gpio));

  // Pin map
  const seenGpio = new Set();
  for (const p of pins.pins) {
    if (seenGpio.has(p.gpio)) err("pins.json", `GPIO ${p.gpio} listed twice`);
    seenGpio.add(p.gpio);
    for (const s of p.sessions) if (s < 1 || s > course.sessionCount) err("pins.json", `GPIO ${p.gpio} refers to session ${s}`);
  }

  // Components library
  const seenComp = new Set();
  for (const c of components.items) {
    if (seenComp.has(c.id)) err("components.json", `duplicate id ${c.id}`);
    seenComp.add(c.id);
    if (!components.groups.some((g) => g.id === c.group)) err("components.json", `${c.id} has unknown group ${c.group}`);
    for (const s of c.sessions) if (s < 1 || s > course.sessionCount) err("components.json", `${c.id} refers to session ${s}`);
    for (const n of gpioMentions(c.pins)) if (!validGpio.has(n)) err("components.json", `${c.id} mentions GPIO ${n}, not in the pin map`);
  }

  // Sessions
  if (sessions.length !== course.sessionCount) err("sessions", `expected ${course.sessionCount} sessions, found ${sessions.length}`);
  sessions.forEach((s, i) => {
    const w = s._file;
    if (s.number !== i + 1) err(w, `expected session ${i + 1}, file says ${s.number}`);
    if (!w.endsWith(`${String(s.number).padStart(2, "0")}.js`)) err(w, `file name does not match session number ${s.number}`);
    for (const k of ["title", "phase", "module", "level", "electronics", "coding", "activities", "componentsText", "output", "wiring", "status"]) {
      if (s[k] === undefined || s[k] === "") err(w, `missing "${k}"`);
    }
    const phase = course.phases.find((p) => s.number >= p.sessions[0] && s.number <= p.sessions[1]);
    if (!phase || phase.number !== s.phase) err(w, `phase ${s.phase} does not match course phases`);
    if (!LEVELS.includes(s.level)) err(w, `unknown level "${s.level}"`);
    if (!WIRING.includes(s.wiring)) err(w, `unknown wiring "${s.wiring}"`);
    if (!STATUS.includes(s.status)) err(w, `unknown status "${s.status}"`);
    const total = (s.activities || []).reduce((t, a) => t + a.min, 0);
    if (total !== course.sessionMinutes) err(w, `activities add up to ${total} min, not ${course.sessionMinutes}`);

    const all = strings(s).join("\n");
    if (/BigBot\b/.test(all)) err(w, `brand must be written "BigBoT"`);
    for (const n of gpioMentions(all)) if (!validGpio.has(n)) err(w, `mentions GPIO ${n}, which is not in the pin map`);

    if (s.status === "full") validateFull(s, course, err);
  });

  // Teaching online guide uses the same block format
  (teaching.sections || []).forEach((sec) => checkBlocks(sec.blocks, "teaching-online.js", err));

  if (errors.length) {
    const e = new Error(`Content validation failed (${errors.length}):\n  - ${errors.join("\n  - ")}`);
    e.errors = errors;
    throw e;
  }
}

function validateFull(s, course, err) {
  const w = s._file;
  for (const k of ["mission", "goals", "runsheet", "components", "sections", "prep", "troubleshooting"]) {
    if (!s[k] || (Array.isArray(s[k]) && !s[k].length)) err(w, `full lesson is missing "${k}"`);
  }
  if (!s.runsheet) return;
  let t = 0;
  for (const r of s.runsheet) {
    if (r.start !== t) err(w, `run sheet gap or overlap at minute ${t} ("${r.title}")`);
    if (r.end <= r.start) err(w, `run sheet item "${r.title}" ends before it starts`);
    t = r.end;
  }
  if (t !== course.sessionMinutes) err(w, `run sheet ends at ${t}, not ${course.sessionMinutes}`);

  const ids = new Set();
  for (const sec of s.sections || []) {
    if (ids.has(sec.id)) err(w, `duplicate section id "${sec.id}"`);
    ids.add(sec.id);
    checkBlocks(sec.blocks, w, err);
  }
  for (const r of s.runsheet) if (!ids.has(r.id)) err(w, `run sheet links to missing section "${r.id}"`);
  for (const c of s.components || []) {
    if (!COMPONENT_TYPES.includes(c.type)) err(w, `component "${c.name}" has unknown type "${c.type}"`);
    if (!c.name || !c.usedFor || !c.connects || !c.qty) err(w, `component "${c.name}" is missing name, qty, connects or usedFor`);
  }
  const hasExternal = (s.components || []).some((c) => c.type === "external");
  if (s.wiring === "external" && !hasExternal) err(w, `wiring is "external" but no external components are listed`);
  if (s.wiring !== "external" && hasExternal) err(w, `external components listed but wiring is "${s.wiring}"`);
  if (!hasExternal && !s.externalNote) err(w, `no external components: add "externalNote" saying so`);
  const hasVirtual = (s.components || []).some((c) => c.type === "virtual");
  if (hasVirtual && s.wiring !== "simulation") err(w, `virtual (Wokwi) components listed but wiring is "${s.wiring}"`);
}

function checkBlocks(blocks, w, err) {
  walkBlocks(blocks, (b) => {
    if (!BLOCK_TYPES.includes(b.type)) return err(w, `unknown block type "${b.type}"`);
    if (b.type === "code") {
      if (!b.code || !b.code.trim()) err(w, `empty code block "${b.label}"`);
      if (/\$\{/.test(b.code || "")) err(w, `code block "${b.label}" contains "\${" (template literal leak)`);
      if (/\t/.test(b.code || "")) err(w, `code block "${b.label}" uses tabs; use 4 spaces`);
    }
    if (b.type === "quiz") b.items.forEach((q, i) => { if (!q.q || !q.a) err(w, `quiz item ${i + 1} needs q and a`); });
    if (b.type === "widget" && !WIDGETS.includes(b.name)) err(w, `unknown widget "${b.name}"`);
    if (b.type === "image") {
      if (!b.alt || !b.alt.trim()) err(w, `image "${b.src}" needs alt text describing what it shows`);
      if (!b.src || !existsSync(path.join(ROOT, "src/assets/img", b.src))) err(w, `image file src/assets/img/${b.src} not found`);
    }
    if (b.type === "steps") b.items.forEach((it) => { if (!it.title) err(w, `step without a title`); });
  });
}
