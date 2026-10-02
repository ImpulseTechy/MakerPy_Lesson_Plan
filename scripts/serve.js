// Local preview server for dist/. Usage: npm run dev  (then open http://localhost:4321)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = Number(process.env.PORT) || 4321;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".txt": "text/plain; charset=utf-8" };

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.normalize(path.join(DIST, p));
    if (!file.startsWith(DIST)) throw new Error("outside dist");
    if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(await readFile(path.join(DIST, "404.html")).catch(() => "Not found"));
  }
}).listen(PORT, () => console.log(`Teacher Hub preview: http://localhost:${PORT}`));
