// Shared page shell: <head>, top bar with navigation and search, footer.
import { esc, rel, rootOf, sessionPath } from "./html.js";

export const RESOURCE_LINKS = [
  { href: "makerpy/pin-map/index.html", label: "Pin Map" },
  { href: "makerpy/components/index.html", label: "Components" },
  { href: "makerpy/code/index.html", label: "Code library" },
  { href: "makerpy/troubleshooting/index.html", label: "Troubleshooting" },
  { href: "teaching-online/index.html", label: "Teaching Online Guide" },
  { href: "updates/index.html", label: "Updates" }
];

/**
 * @param {object} o
 * @param {string} o.path    output path relative to dist/, e.g. "makerpy/index.html"
 * @param {string} o.title   page title (without site name)
 * @param {string} o.body    inner HTML of <body> below the top bar
 * @param {object} [o.lesson] { number, sessions } — adds the session switcher and view toggle
 * @param {string} [o.bodyAttrs]
 */
export function page({ path, title, body, lesson, bodyAttrs = "", site }) {
  const r = (p) => rel(path, p);
  const switcher = lesson ? sessionSwitcher(path, lesson) : "";
  const toggle = lesson ? `
    <div class="mode" role="group" aria-label="View mode">
      <button type="button" data-mode="teacher" aria-pressed="true">Teacher view</button>
      <button type="button" data-mode="share" aria-pressed="false">Screen-share view</button>
    </div>` : "";
  return `<!DOCTYPE html>
<html lang="en" data-root="${rootOf(path)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${esc(title)} | ${esc(site.name)}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r("assets/site.css")}">
<script>/* Apply the saved (or system) theme before first paint so pages never flash. */
(function(){var t;try{t=JSON.parse(localStorage.getItem("bigbot.theme"))}catch(e){}
if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.documentElement.setAttribute("data-theme",t)})();</script>
</head>
<body ${bodyAttrs}>
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <a class="brand" href="${r("index.html")}">${esc(site.brand)} <span>Teacher Hub</span></a>
  <nav class="mainnav" aria-label="Main">
    <a href="${r("makerpy/index.html")}">MakerPy course</a>
    <details class="menu">
      <summary>Resources</summary>
      <div class="menu-panel">
        ${RESOURCE_LINKS.map((l) => `<a href="${r(l.href)}">${esc(l.label)}</a>`).join("\n        ")}
      </div>
    </details>
  </nav>
  <div class="search" role="search">
    <label class="sr" for="q">Search the Teacher Hub</label>
    <input id="q" type="search" placeholder="Search lessons, parts, pins…" autocomplete="off" aria-controls="q-results">
    <div class="search-results" id="q-results" role="listbox" hidden></div>
  </div>
  ${switcher}
  ${toggle}
  <button type="button" class="theme-toggle" data-theme-toggle aria-label="Switch to dark mode" title="Switch light / dark mode">
    <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
    <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>
  </button>
</header>
${lesson ? `<div class="share-banner" role="status">Screen-share view: teacher notes, answers and solutions are hidden. Switch back to Teacher view after sharing.</div>` : ""}
${body}
<script src="${r("assets/search-index.js")}"></script>
<script src="${r("assets/app.js")}"></script>
${lesson ? `<script src="${r("assets/widgets.js")}"></script>` : ""}
</body>
</html>
`;
}

function sessionSwitcher(path, { number, sessions, course }) {
  const groups = course.phases.map((ph) => {
    const opts = sessions
      .filter((s) => s.phase === ph.number)
      .map((s) => `<option value="${rel(path, sessionPath(s.number))}"${s.number === number ? " selected" : ""}>${s.number}. ${esc(s.title)}</option>`)
      .join("");
    return `<optgroup label="Phase ${ph.number}: ${esc(ph.title)}">${opts}</optgroup>`;
  }).join("");
  return `<label class="switcher"><span class="sr">Jump to session</span><select data-switcher>${groups}</select></label>`;
}

export function breadcrumb(path, items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((it, i) =>
    i === items.length - 1
      ? `<li aria-current="page">${esc(it.label)}</li>`
      : `<li><a href="${rel(path, it.href)}">${esc(it.label)}</a></li>`).join("")}</ol></nav>`;
}

export function footer(text) {
  return `<footer class="foot">${text}</footer>`;
}
