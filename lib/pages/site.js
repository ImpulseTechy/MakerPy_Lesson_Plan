// Home, course roadmap, resource pages, updates and 404.
import { esc, rel, sessionPath, LEVEL_ICON, WIRING_LABEL } from "../html.js";
import { page, breadcrumb, footer, RESOURCE_LINKS } from "../layout.js";
import { renderBlocks, code as codeBlock } from "../blocks.js";
import { walkBlocks } from "../validate.js";

const shell = (path, crumbs, inner, site) => `
<div class="wrap single">
  <main id="main">
    ${crumbs ? breadcrumb(path, crumbs) : ""}
    ${inner}
    ${footer(`${esc(site.brand)} Teacher Hub · For BigBoT teachers only. Please don't share links or screenshots outside the team.`)}
  </main>
</div>`;

const fullCount = (sessions) => sessions.filter((s) => s.status === "full").length;

/* ---------------- Home ---------------- */
export function homePage(c) {
  const path = "index.html";
  const { site, course, sessions, updates } = c;
  const done = fullCount(sessions);
  const phaseBar = course.phases.map((p) => {
    const n = p.sessions[1] - p.sessions[0] + 1;
    return `<span class="pb p${p.number}" style="flex:${n}" title="Phase ${p.number}: ${esc(p.title)}">P${p.number}</span>`;
  }).join("");
  const inner = `
    <div class="hero home-hero">
      <h1>Teacher Hub</h1>
      <p class="mission">Everything you need to prepare and teach BigBoT online classes: lesson guides, pins, parts and fixes.</p>
    </div>
    <div class="continue" data-continue>
      <div>
        <div class="muted small" data-continue-label>Start here</div>
        <b data-continue-title>Session 1: ${esc(sessions[0].title)}</b>
      </div>
      <a class="btn" data-continue-link href="${rel(path, sessionPath(1))}">Open lesson</a>
    </div>
    <h2 class="sec-title">Your courses</h2>
    <a class="course-card" href="${rel(path, "makerpy/index.html")}">
      <div class="cc-top"><b>${esc(course.title)}</b><span class="muted">${course.sessionCount} sessions · ${course.sessionMinutes} min · ${esc(course.batch)}</span></div>
      <p>${esc(course.subtitle)}</p>
      <div class="phasebar" aria-hidden="true">${phaseBar}</div>
      <div class="small muted">${done} of ${course.sessionCount} lessons fully written · the rest show the curriculum outline</div>
    </a>
    <p class="muted small">New courses will appear here as they're added.</p>
    <h2 class="sec-title">Quick links</h2>
    <div class="quick">
      ${RESOURCE_LINKS.filter((l) => l.label !== "Updates").map((l) => `<a href="${rel(path, l.href)}">${esc(l.label)}</a>`).join("")}
    </div>
    <h2 class="sec-title">Latest updates</h2>
    <ul class="updates">${updates.slice(0, 3).map(updateItem).join("")}</ul>
    <p><a href="${rel(path, "updates/index.html")}">All updates</a></p>`;
  return { path, html: page({ path, site, title: "Home", body: shell(path, null, inner, site) }) };
}

const updateItem = (u) => `<li><time datetime="${esc(u.date)}">${esc(fmtDate(u.date))}</time><b>${esc(u.title)}</b><span>${u.body ? esc(u.body) : ""}</span></li>`;

function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]} ${y}`;
}

/* ---------------- Course roadmap ---------------- */
export function coursePage(c) {
  const path = "makerpy/index.html";
  const { site, course, sessions } = c;
  const done = fullCount(sessions);
  const card = (s) => `
      <a class="scard" href="${rel(path, sessionPath(s.number))}" data-phase="${s.phase}" data-wiring="${s.wiring}" data-status="${s.status}"
         data-text="${esc([s.title, s.electronics, s.coding, s.componentsText, s.output].join(" ").toLowerCase())}">
        <span class="snum">${s.number}</span>
        <span class="stitle">${esc(s.title)}</span>
        <span class="sout">${esc(s.output)}</span>
        <span class="stags"><span class="tag lvl">${LEVEL_ICON[s.level]} ${esc(s.level)}</span><span class="tag w-${s.wiring}">${esc(WIRING_LABEL[s.wiring])}</span>${s.status === "full" ? `<span class="tag full">Full lesson</span>` : `<span class="tag outline">Outline</span>`}</span>
      </a>`;
  const phases = course.phases.map((p) => {
    const inPhase = sessions.filter((s) => s.phase === p.number);
    const modules = [...new Set(inPhase.map((s) => s.module))];
    return `
    <section class="phase" id="phase-${p.number}" data-phase-block="${p.number}">
      <div class="phase-head"><span class="pchip p${p.number}">Phase ${p.number}</span><h2>${esc(p.title)}</h2><span class="muted">Sessions ${p.sessions[0]}–${p.sessions[1]} · ${esc(p.where)}</span></div>
      <p class="lead">${esc(p.summary)}</p>
      ${modules.map((m) => `
      <div class="module" data-module-block>
        <h3>Module ${m}</h3>
        <div class="cards">${inPhase.filter((s) => s.module === m).map(card).join("")}</div>
      </div>`).join("")}
    </section>`;
  }).join("");

  const inner = `
    <div class="hero">
      <div class="kicker">Course</div>
      <h1>${esc(course.title)}</h1>
      <p class="mission">${esc(course.subtitle)}.</p>
      <div class="facts">
        <span class="fact"><b>${course.sessionCount}</b> sessions</span>
        <span class="fact"><b>${course.sessionMinutes} min</b> each</span>
        <span class="fact"><b>${esc(course.batch)}</b></span>
        <span class="fact">${esc(course.language)} in <b>${esc(course.platform)}</b></span>
      </div>
      <p class="small muted">Board: ${esc(course.board)}. ${done} of ${course.sessionCount} lessons fully written.</p>
    </div>
    <div class="filters" role="group" aria-label="Filter sessions">
      <label class="sr" for="f-text">Filter sessions</label>
      <input id="f-text" type="search" placeholder="Filter by topic or part, e.g. servo, LCD" data-filter-text>
      <div class="chips" data-filter="phase">
        <button type="button" aria-pressed="true" data-v="">All phases</button>
        ${course.phases.map((p) => `<button type="button" aria-pressed="false" data-v="${p.number}">Phase ${p.number}</button>`).join("")}
      </div>
      <div class="chips" data-filter="wiring">
        <button type="button" aria-pressed="true" data-v="">Any setup</button>
        <button type="button" aria-pressed="false" data-v="simulation">Wokwi simulation</button>
        <button type="button" aria-pressed="false" data-v="onboard">Onboard only</button>
        <button type="button" aria-pressed="false" data-v="external">External wiring</button>
      </div>
      <div class="chips" data-filter="status">
        <button type="button" aria-pressed="true" data-v="">All lessons</button>
        <button type="button" aria-pressed="false" data-v="full">Full lessons</button>
        <button type="button" aria-pressed="false" data-v="outline">Outlines</button>
      </div>
      <div class="small muted" data-filter-count aria-live="polite"></div>
    </div>
    <div class="empty" data-filter-empty hidden>No sessions match these filters. <button type="button" class="btn small ghost" data-filter-clear>Clear filters</button></div>
    ${phases}`;
  return { path, html: page({ path, site, title: "MakerPy course", body: shell(path, [{ label: "Home", href: "index.html" }, { label: "MakerPy" }], inner, site) }) };
}

/* ---------------- Pin Map ---------------- */
export function pinMapPage(c) {
  const path = "makerpy/pin-map/index.html";
  const { site, pins } = c;
  const links = (arr) => arr.map((n) => `<a href="${rel(path, sessionPath(n))}">${n}</a>`).join(", ");
  const inner = `
    <div class="hero"><div class="kicker">MakerPy resources</div><h1>Pin Map</h1>
      <p class="mission">Every GPIO on the MakerPy board and what it's used for. Lessons, code and wiring must match this page.</p>
      <p class="small muted">Source: ${esc(pins.source)}.</p></div>
    <div class="tscroll"><table class="pins">
      <thead><tr><th>GPIO</th><th>Pico pin</th><th>Used for</th><th>Type</th><th>Where</th><th>Sessions</th><th>Note</th></tr></thead>
      <tbody>${pins.pins.map((p) => `<tr id="gpio-${p.gpio}"><td class="out"><b>GPIO ${p.gpio}</b></td><td class="center">${p.pin}</td><td>${esc(p.use)}</td>
        <td><span class="tag ${p.kind}">${p.kind === "onboard" ? "Onboard" : "External"}</span></td><td>${esc(p.where)}</td><td>${links(p.sessions)}</td><td>${esc(p.note)}</td></tr>`).join("")}
      </tbody></table></div>
    <h2 class="sec-title">Other pins</h2>
    <div class="tscroll"><table><thead><tr><th>Pin</th><th>Used for</th><th>Note</th></tr></thead>
      <tbody>${pins.special.map((p) => `<tr><td><b>${esc(p.label)}</b></td><td>${esc(p.use)}</td><td>${esc(p.note)}</td></tr>`).join("")}</tbody></table></div>
    <h2 class="sec-title">Power</h2>
    <ul>${pins.power.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`;
  return { path, html: page({ path, site, title: "Pin Map", body: shell(path, crumbs("Pin Map"), inner, site) }) };
}

const crumbs = (label) => [{ label: "Home", href: "index.html" }, { label: "MakerPy", href: "makerpy/index.html" }, { label }];

/* ---------------- Components ---------------- */
export function componentsPage(c) {
  const path = "makerpy/components/index.html";
  const { site, components } = c;
  const links = (arr) => arr.length > 12
    ? `${arr[0]}–${arr[arr.length - 1]}`
    : arr.map((n) => `<a href="${rel(path, sessionPath(n))}">${n}</a>`).join(", ");
  const inner = `
    <div class="hero"><div class="kicker">MakerPy resources</div><h1>Components</h1>
      <p class="mission">Every part used in the course, whether it's already on the board or connected with jumper wires, and which sessions use it.</p></div>
    ${components.groups.map((g) => `
      <h2 class="sec-title" id="${g.id}">${esc(g.title)}</h2>
      <div class="tscroll"><table>
        <thead><tr><th>Component</th><th>Details</th><th>Pins / connection</th><th>Sessions</th></tr></thead>
        <tbody>${components.items.filter((i) => i.group === g.id).map((i) => `<tr id="${i.id}"><td><b>${esc(i.name)}</b></td><td>${esc(i.detail)}</td><td>${esc(i.pins)}</td><td>${links(i.sessions)}</td></tr>`).join("")}</tbody>
      </table></div>`).join("")}`;
  return { path, html: page({ path, site, title: "Components", body: shell(path, crumbs("Components"), inner, site) }) };
}

/* ---------------- Code library ---------------- */
export function codePage(c) {
  const path = "makerpy/code/index.html";
  const { site, sessions } = c;
  const withCode = sessions.filter((s) => s.status === "full");
  const parts = withCode.map((s) => {
    const blocks = [];
    for (const sec of s.sections) walkBlocks(sec.blocks, (b) => { if (b.type === "code") blocks.push(b); });
    return `
      <section class="seg" id="s${s.number}">
        <div class="seg-head"><h2><a href="${rel(path, sessionPath(s.number))}">Session ${s.number}: ${esc(s.title)}</a></h2></div>
        ${blocks.map((b) => codeBlock({ ...b, solution: false, label: (b.solution ? "Solution — " : "") + (b.label || "") })).join("")}
      </section>`;
  }).join("");
  const inner = `
    <div class="hero"><div class="kicker">MakerPy resources</div><h1>Code library</h1>
      <p class="mission">All lesson code in one place, including solutions. Code appears here once a lesson is fully written.</p></div>
    ${parts || `<p>No full lessons yet.</p>`}`;
  return { path, html: page({ path, site, title: "Code library", body: shell(path, crumbs("Code library"), inner, site) }) };
}

/* ---------------- Troubleshooting ---------------- */
export function troubleshootingPage(c) {
  const path = "makerpy/troubleshooting/index.html";
  const { site, troubleshooting, sessions } = c;
  const areas = [...new Set(troubleshooting.map((t) => t.area))];
  const table = (rows) => `<div class="tscroll"><table>
      <thead><tr><th>What the student sees</th><th>Likely cause</th><th>What to do</th></tr></thead>
      <tbody>${rows.map((t) => `<tr><td>${esc(t.symptom)}</td><td>${esc(t.cause)}</td><td>${esc(t.fix)}</td></tr>`).join("")}</tbody></table></div>`;
  const perLesson = sessions.filter((s) => s.status === "full").map((s) => `
      <h3><a href="${rel(path, sessionPath(s.number))}#help">Session ${s.number}: ${esc(s.title)}</a></h3>
      <div class="tscroll"><table><thead><tr><th>What the student sees</th><th>Likely cause</th><th>What to do</th></tr></thead>
      <tbody>${s.troubleshooting.map((t) => `<tr><td>${t.symptom}</td><td>${t.cause}</td><td>${t.fix}</td></tr>`).join("")}</tbody></table></div>`).join("");
  const inner = `
    <div class="hero"><div class="kicker">MakerPy resources</div><h1>Troubleshooting</h1>
      <p class="mission">Common problems in online classes and how to fix them without touching the student's board.</p></div>
    <div class="callout"><strong>First move, every time:</strong> ask the student to share their screen and point their camera at the board. Most problems are visible in ten seconds.</div>
    ${areas.map((a) => `<h2 class="sec-title">${esc(a)}</h2>${table(troubleshooting.filter((t) => t.area === a))}`).join("")}
    <h2 class="sec-title">Lesson-specific problems</h2>
    ${perLesson}`;
  return { path, html: page({ path, site, title: "Troubleshooting", body: shell(path, crumbs("Troubleshooting"), inner, site) }) };
}

/* ---------------- Teaching Online Guide ---------------- */
export function teachingPage(c) {
  const path = "teaching-online/index.html";
  const { site, teaching } = c;
  const ctx = { path, session: null };
  const inner = `
    <div class="hero"><div class="kicker">For all courses</div><h1>${esc(teaching.title)}</h1>
      <p class="mission">${esc(teaching.intro)}</p></div>
    <nav class="toc" aria-label="On this page"><ol>${teaching.sections.map((s) => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join("")}</ol></nav>
    ${teaching.sections.map((s) => `
      <section class="seg" id="${esc(s.id)}">
        <div class="seg-head"><h2>${esc(s.title)}</h2></div>
        ${s.lead ? `<p class="lead">${s.lead}</p>` : ""}
        ${renderBlocks(s.blocks, ctx)}
      </section>`).join("")}`;
  return { path, html: page({ path, site, title: teaching.title, body: shell(path, [{ label: "Home", href: "index.html" }, { label: teaching.title }], inner, site) }) };
}

/* ---------------- Updates ---------------- */
export function updatesPage(c) {
  const path = "updates/index.html";
  const { site, updates } = c;
  const inner = `
    <div class="hero"><h1>Updates</h1><p class="mission">What changed in the lessons and resources, newest first. Check here before teaching a session you've taught before.</p></div>
    <ul class="updates">${updates.map(updateItem).join("")}</ul>`;
  return { path, html: page({ path, site, title: "Updates", body: shell(path, [{ label: "Home", href: "index.html" }, { label: "Updates" }], inner, site) }) };
}

/* ---------------- 404 ---------------- */
export function notFoundPage(c) {
  // Served from any URL by the host, so links use root-absolute paths.
  const { site } = c;
  return { path: "404.html", html: `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | ${esc(site.name)}</title><link rel="stylesheet" href="/assets/site.css"></head>
<body><div class="wrap single"><main id="main"><div class="hero"><h1>Page not found</h1><p class="mission">This page doesn't exist or has moved.</p></div><p><a class="btn" href="/">Go to the Teacher Hub home</a> <a class="btn ghost" href="/makerpy/">Open the MakerPy course</a></p></main></div></body></html>` };
}
