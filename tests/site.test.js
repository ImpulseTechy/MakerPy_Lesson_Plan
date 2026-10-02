import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { DIST, htmlFiles, read } from "./helpers.js";

const files = await htmlFiles();
const pages = new Map();
for (const f of files) pages.set(f, await read(f));
const idsOf = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

test("build produced the expected pages", () => {
  const rel = files.map((f) => path.relative(DIST, f).split(path.sep).join("/"));
  for (const p of ["index.html", "makerpy/index.html", "makerpy/session-01/index.html", "makerpy/session-14/index.html",
    "makerpy/session-32/index.html", "makerpy/pin-map/index.html", "makerpy/components/index.html", "makerpy/code/index.html",
    "makerpy/troubleshooting/index.html", "teaching-online/index.html", "updates/index.html", "404.html"]) {
    assert.ok(rel.includes(p), `missing ${p}`);
  }
  assert.equal(rel.filter((p) => /^makerpy\/session-\d\d\/index\.html$/.test(p)).length, 32);
});

test("every internal link and anchor resolves", () => {
  const problems = [];
  for (const [file, html] of pages) {
    if (file.endsWith("404.html")) continue; // 404 uses root-absolute links on purpose (it is served from any URL)
    for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const url = m[1];
      if (/^(https?:|mailto:|data:|javascript:)/.test(url)) continue;
      const [target, hash] = url.split("#");
      const resolved = target ? path.resolve(path.dirname(file), target) : file;
      if (!existsSync(resolved)) { problems.push(`${path.relative(DIST, file)} → ${url} (missing file)`); continue; }
      if (hash && resolved.endsWith(".html")) {
        const targetHtml = pages.get(resolved);
        if (!idsOf(targetHtml).includes(hash)) problems.push(`${path.relative(DIST, file)} → ${url} (missing #${hash})`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

test("session switcher and search index point at real pages", async () => {
  const lesson = pages.get(path.join(DIST, "makerpy/session-14/index.html"));
  const options = [...lesson.matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(options.length, 32);
  for (const o of options) assert.ok(existsSync(path.resolve(DIST, "makerpy/session-14", o)), o);
  const src = await read(path.join(DIST, "assets/search-index.js"));
  const items = JSON.parse(src.slice(src.indexOf("["), src.lastIndexOf("]") + 1));
  assert.ok(items.length > 60);
  for (const it of items) {
    const [p, hash] = it.u.split("#");
    assert.ok(existsSync(path.join(DIST, p)), it.u);
    if (hash) assert.ok(idsOf(pages.get(path.join(DIST, p))).includes(hash), it.u);
  }
});

test("no duplicate ids on any page", () => {
  for (const [file, html] of pages) {
    const ids = idsOf(html);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    assert.deepEqual(dupes, [], path.relative(DIST, file));
  }
});

test("every page has a title, language, viewport and noindex", () => {
  for (const [file, html] of pages) {
    const name = path.relative(DIST, file);
    assert.match(html, /<html lang="en"/, name);
    assert.match(html, /<title>[^<]+<\/title>/, name);
    assert.match(html, /name="viewport"/, name);
    assert.match(html, /noindex/, name);
  }
});

test("no template leaks or wrong brand spelling in the output", () => {
  for (const [file, html] of pages) {
    const name = path.relative(DIST, file);
    assert.doesNotMatch(html, /\bundefined\b|\[object Object\]|>NaN<|\$\{/, name);
    assert.doesNotMatch(html, /BigBot\b/, name);
  }
});

test("teacher-only content is marked so Screen-share view hides it", () => {
  const html = pages.get(path.join(DIST, "makerpy/session-14/index.html"));
  // every teacher note and every solution must sit inside a .t-only element
  assert.equal((html.match(/class="tnote t-only"/g) || []).length, (html.match(/class="tnote/g) || []).length);
  for (const m of html.matchAll(/<span class="badge">Solution<\/span>/g)) {
    const before = html.slice(Math.max(0, m.index - 200), m.index);
    assert.match(before, /<div class="t-only"><div class="code">/);
  }
});
