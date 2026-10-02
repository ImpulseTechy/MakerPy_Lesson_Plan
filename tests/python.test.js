// Every lesson code block must be valid Python. Needs python3 (or python) on PATH; skipped otherwise.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { loadContent } from "../lib/load.js";
import { walkBlocks } from "../lib/validate.js";

const py = ["python3", "python"].find((cmd) => spawnSync(cmd, ["--version"]).status === 0);
const content = await loadContent();
const blocks = [];
for (const s of content.sessions.filter((x) => x.status === "full")) {
  for (const sec of s.sections) walkBlocks(sec.blocks, (b) => { if (b.type === "code") blocks.push({ s: s.number, b }); });
}

test("lesson code blocks are valid Python", { skip: !py && "python not installed" }, () => {
  assert.ok(blocks.length > 0);
  for (const { s, b } of blocks) {
    // Partial snippets (a single indented line) are wrapped so they parse on their own.
    const code = b.partial ? `while True:\n${b.code}\n` : b.code;
    const r = spawnSync(py, ["-c", "import ast,sys; ast.parse(sys.stdin.read())"], { input: code, encoding: "utf8" });
    assert.equal(r.status, 0, `Session ${s}, "${b.label}":\n${r.stderr}`);
  }
});

test("lesson code only imports modules that exist in MicroPython for the Pico W", () => {
  const allowed = new Set(["machine", "time", "utime", "neopixel", "math", "random", "sys", "pico_i2c_lcd", "lcd_api", "network", "rp2"]);
  for (const { s, b } of blocks) {
    for (const m of b.code.matchAll(/^\s*(?:from\s+(\w+)\s+import|import\s+([\w, ]+))/gm)) {
      const mods = (m[1] || m[2]).split(",").map((x) => x.trim().split(" ")[0]);
      for (const mod of mods) assert.ok(allowed.has(mod), `Session ${s}, "${b.label}" imports "${mod}"`);
    }
  }
});
