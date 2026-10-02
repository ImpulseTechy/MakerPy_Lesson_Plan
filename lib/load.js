// Loads every content file into one object. Pure data: no HTML here.
import { readFile, readdir } from "node:fs/promises";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

// fileURLToPath keeps this correct on Windows too (no leading "/C:/" paths).
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const json = async (p) => JSON.parse(await readFile(path.join(ROOT, p), "utf8"));

export async function loadContent() {
  const site = await json("src/data/site.json");
  const updates = await json("src/data/updates.json");
  const troubleshooting = await json("src/data/troubleshooting.json");
  const course = await json("src/content/makerpy/course.json");
  const pins = await json("src/content/makerpy/pins.json");
  const components = await json("src/content/makerpy/components.json");

  const dir = path.join(ROOT, "src/content/makerpy/sessions");
  const files = (await readdir(dir)).filter((f) => /^\d{2}\.js$/.test(f)).sort();
  const sessions = [];
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(dir, file)).href);
    sessions.push({ ...mod.default, _file: `src/content/makerpy/sessions/${file}` });
  }
  sessions.sort((a, b) => a.number - b.number);

  const teaching = (await import(pathToFileURL(path.join(ROOT, "src/content/pages/teaching-online.js")).href)).default;

  return { site, updates, troubleshooting, course, pins, components, sessions, teaching };
}

export { ROOT };
