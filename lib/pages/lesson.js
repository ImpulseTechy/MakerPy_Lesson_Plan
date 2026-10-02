// Lesson page: full lessons render every section; outline lessons render the curriculum plan.
import { esc, rel, stamp, sessionPath, LEVEL_ICON, WIRING_LABEL } from "../html.js";
import { page, breadcrumb, footer } from "../layout.js";
import { renderBlocks } from "../blocks.js";

export function lessonPage(s, content) {
  const { course, sessions, site } = content;
  const path = sessionPath(s.number);
  const phase = course.phases.find((p) => p.number === s.phase);
  const prev = sessions.find((x) => x.number === s.number - 1);
  const next = sessions.find((x) => x.number === s.number + 1);
  const ctx = { session: s, path };
  const full = s.status === "full";

  const runsheet = full
    ? s.runsheet.map((r) => ({ ...r, href: `#${r.id}` }))
    : s.activities.reduce((acc, a) => {
        const start = acc.length ? acc[acc.length - 1].end : 0;
        acc.push({ start, end: start + a.min, title: a.text, href: "#plan" });
        return acc;
      }, []);

  const rail = `
  <aside class="rail" aria-label="Class clock and run sheet">
    <div class="clock" data-clock data-total="${course.sessionMinutes}" data-key="${course.id}-s${s.number}">
      <div class="time" data-clock-time>00:00</div>
      <div class="of">of ${course.sessionMinutes}:00</div>
      <div class="bar"><span data-clock-bar></span></div>
      <div class="now" data-clock-now>Class not started</div>
      <div class="left" data-clock-left></div>
      <div class="btns">
        <button class="btn" type="button" data-clock-go>Start class</button>
        <button class="btn ghost" type="button" data-clock-reset>Reset</button>
      </div>
    </div>
    <ol class="runsheet">
      ${runsheet.map((r) => `<li data-s="${r.start}" data-e="${r.end}"><span class="m">${stamp(r.start)}–${stamp(r.end)}</span><a href="${r.href}">${esc(r.title)}</a></li>`).join("\n      ")}
    </ol>
    <div class="extra">
      ${full ? `<a href="#before" class="t-only">Before class checklist</a><a href="#help" class="t-only">Troubleshooting</a>` : ""}
      <a href="${rel(path, "makerpy/pin-map/index.html")}">Pin Map</a>
    </div>
  </aside>`;

  const facts = [
    `<b>${course.sessionMinutes} min</b> live online`,
    `<b>5 students</b> per batch`,
    `<b>${LEVEL_ICON[s.level]} ${esc(s.level)}</b>`,
    `<b>${esc(WIRING_LABEL[s.wiring])}</b>`,
    ...(s.facts || [])
  ].map((f) => `<span class="fact">${f}</span>`).join("");

  const hero = `
    <div class="hero">
      <div class="kicker">Session ${s.number} of ${course.sessionCount} · Phase ${s.phase}: ${esc(phase.title)} · Module ${s.module}</div>
      <h1>${esc(s.title)}</h1>
      <p class="mission">${full ? esc(s.mission) : `Project: ${esc(s.output)}`}</p>
      <div class="facts">${facts}</div>
      ${full ? `<div class="goals"><h2 class="h-small">By the end of class, every student can</h2><ul>${s.goals.map((g) => `<li>${g}</li>`).join("")}</ul></div>` : ""}
    </div>`;

  const main = full ? fullBody(s, ctx) : outlineBody(s);

  const pager = `
    <nav class="pager" aria-label="Previous and next session">
      ${prev ? `<a class="pg prev" href="${rel(path, sessionPath(prev.number))}"><span class="muted small">← Previous</span><b>Session ${prev.number}: ${esc(prev.title)}</b></a>` : `<span></span>`}
      ${next ? `<a class="pg next" href="${rel(path, sessionPath(next.number))}"><span class="muted small">Next →</span><b>Session ${next.number}: ${esc(next.title)}</b><span class="small">Needs: ${esc(next.componentsText)}</span></a>` : `<span></span>`}
    </nav>`;

  const body = `
<div class="wrap lesson" id="top">
  ${rail}
  <main id="main">
    ${breadcrumb(path, [
      { label: "Home", href: "index.html" },
      { label: "MakerPy", href: "makerpy/index.html" },
      { label: `Phase ${s.phase}`, href: `makerpy/index.html#phase-${s.phase}` },
      { label: `Session ${s.number}` }
    ])}
    ${hero}
    ${main}
    ${pager}
    ${footer(`${esc(site.brand)} · MakerPy curriculum · Session ${s.number} of ${course.sessionCount}. Pins checked against the MakerPy board schematic (RP_Pi_DevBoard Rev 1.0, Raspberry Pi Pico W).${full ? " Test all code on a board before class." : ""}`)}
  </main>
</div>`;

  return {
    path,
    html: page({
      path, site, title: `Session ${s.number}: ${s.title}`, body,
      lesson: { number: s.number, sessions, course },
      bodyAttrs: `data-lesson="${esc(path)}" data-lesson-title="Session ${s.number}: ${esc(s.title)}"`
    })
  };
}

function fullBody(s, ctx) {
  const stampOf = Object.fromEntries(s.runsheet.map((r) => [r.id, r.start]));
  const before = `
    <section class="seg t-only" id="before">
      <div class="seg-head"><h2>Before class</h2></div>
      <p class="lead">Do these 15 minutes before the session. In an online class, most lost time comes from setup problems you could have caught early.</p>
      <div class="tscroll"><table>
        <thead><tr><th class="center">✓</th><th>Check</th></tr></thead>
        <tbody>${s.prep.map((p, i) => `<tr><td class="center"><input type="checkbox" data-prep="${i}" aria-label="Done"></td><td>${p}</td></tr>`).join("")}</tbody>
      </table></div>
      ${s.parentMessage ? renderBlocks([{ type: "copytext", label: "Reminder message for parents (WhatsApp / email)", text: s.parentMessage }], ctx) : ""}
    </section>`;

  const sections = s.sections.map((sec) => `
    <section class="seg${sec.teacherOnly ? " t-only" : ""}" id="${esc(sec.id)}">
      <div class="seg-head">${stampOf[sec.id] !== undefined ? `<span class="stamp">${stamp(stampOf[sec.id])}</span>` : ""}<h2>${esc(sec.title)}</h2></div>
      ${sec.lead ? `<p class="lead">${sec.lead}</p>` : ""}
      ${renderBlocks(sec.blocks, ctx)}
    </section>`).join("");

  const help = `
    <section class="seg t-only" id="help">
      <div class="seg-head"><h2>Troubleshooting for this lesson</h2></div>
      <p class="lead">You can't touch the student's board, so ask them to share their screen or show the board on camera. Connection problems are in the <a href="${rel(ctx.path, "makerpy/troubleshooting/index.html")}">main troubleshooting page</a>.</p>
      <div class="tscroll"><table>
        <thead><tr><th>What the student sees</th><th>Likely cause</th><th>What to ask them to do</th></tr></thead>
        <tbody>${s.troubleshooting.map((t) => `<tr><td>${t.symptom}</td><td>${t.cause}</td><td>${t.fix}</td></tr>`).join("")}</tbody>
      </table></div>
    </section>`;

  return before + sections + help;
}

function outlineBody(s) {
  let t = 0;
  const rows = s.activities.map((a) => {
    const row = `<tr><td class="out">${stamp(t)}–${stamp(t + a.min)}</td><td>${a.min} min</td><td>${esc(a.text)}</td></tr>`;
    t += a.min;
    return row;
  }).join("");
  const comps = splitTopLevel(s.componentsText);
  return `
    <div class="notice"><strong>Outline only.</strong> The full teaching content for this session (teacher notes, step-by-step code, quiz and troubleshooting) hasn't been written yet. Below is the plan from the curriculum sheet.</div>
    <section class="seg" id="plan">
      <div class="seg-head"><h2>Lesson plan</h2></div>
      <div class="tscroll"><table>
        <thead><tr><th>Time</th><th>Length</th><th>Activity</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <h3>Electronics concept</h3><p>${esc(s.electronics)}</p>
      <h3>Coding concept (Python)</h3><p>${esc(s.coding)}</p>
      <h3>Components</h3><ul>${comps.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      <h3>Project output</h3><p>${esc(s.output)}</p>
    </section>`;
}

/** Split "A (x, y), B, C" on commas that are not inside brackets. */
export function splitTopLevel(text) {
  const out = [];
  let depth = 0, cur = "";
  for (const ch of text) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
