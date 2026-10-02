// Small HTML helpers shared by every page template.

/** Escape text for safe use inside HTML text and attribute values. */
export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build a relative link from one output file to another, so the site works on any
 * host path and when opened straight from disk. Both paths are relative to dist/.
 *   rel("makerpy/session-14/index.html", "assets/site.css") -> "../../assets/site.css"
 */
export function rel(fromPath, toPath) {
  const depth = fromPath.split("/").length - 1;
  return (depth === 0 ? "./" : "../".repeat(depth)) + toPath;
}

/** Root prefix for a page, e.g. "../../" — used by client-side scripts. */
export function rootOf(fromPath) {
  const depth = fromPath.split("/").length - 1;
  return depth === 0 ? "./" : "../".repeat(depth);
}

export const sessionPath = (n) => `makerpy/session-${String(n).padStart(2, "0")}/index.html`;

/** Minute number -> class clock stamp, e.g. 5 -> "0:05". */
export const stamp = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;

const KEYWORDS = /\b(from|import|while|True|False|None|if|elif|else|def|return|for|in|and|or|not|with|as|try|except|break|continue|pass)\b/g;

/** Minimal Python highlighter: comments, strings and keywords. Output is escaped HTML. */
export function highlightPython(code) {
  return code.split("\n").map(highlightLine).join("\n");
}

function highlightLine(line) {
  let out = "";
  let buf = "";
  let quote = null;
  const flush = () => {
    out += esc(buf).replace(KEYWORDS, '<span class="k">$1</span>');
    buf = "";
  };
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      buf += ch;
      if (ch === quote && line[i - 1] !== "\\") {
        out += `<span class="s">${esc(buf)}</span>`;
        buf = "";
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") { flush(); quote = ch; buf = ch; continue; }
    if (ch === "#") { flush(); return out + `<span class="c">${esc(line.slice(i))}</span>`; }
    buf += ch;
  }
  if (quote) out += esc(buf); else flush();
  return out;
}

export const LEVEL_ICON = { Beginner: "🟢", Intermediate: "🟡", Advanced: "🟠", Expert: "🔴" };
export const WIRING_LABEL = { simulation: "Wokwi simulation", onboard: "Onboard only", external: "External wiring" };
export const TYPE_LABEL = { board: "Board", onboard: "Onboard", external: "External", tool: "Tool", virtual: "Wokwi part" };
