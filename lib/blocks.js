// Renders lesson content blocks to HTML. Block types are documented in CLAUDE.md.
import { esc, rel, highlightPython, TYPE_LABEL } from "./html.js";

export function renderBlocks(blocks, ctx) {
  return (blocks || []).map((b) => wrap(b, render(b, ctx))).join("\n");
}

function wrap(b, html) {
  return b.teacherOnly ? `<div class="t-only">${html}</div>` : html;
}

function render(b, ctx) {
  switch (b.type) {
    case "p": return `<p>${b.html}</p>`;
    case "h3": return `<h3${b.id ? ` id="${esc(b.id)}"` : ""}>${esc(b.text)}</h3>`;
    case "callout": return `<div class="callout">${b.html}</div>`;
    case "teacher": return teacher(b);
    case "code": return code(b);
    case "quiz": return b.items.map((q, i) => `
      <div class="q"><p>${i + 1}. ${q.q}</p>
        <button class="btn small ghost reveal" type="button" aria-expanded="false">Show answer</button>
        <div class="ans">${q.a}</div></div>`).join("");
    case "list": {
      const tag = b.ordered ? "ol" : "ul";
      return `<${tag}>${b.items.map((i) => `<li>${i}</li>`).join("")}</${tag}>`;
    }
    case "steps": return b.items.map((st, i) => `
      <div class="step"><div class="num" aria-hidden="true">${i + 1}</div>
        <h3>${esc(st.title)}${st.min ? ` <span class="min">${st.min} min</span>` : ""}</h3>
        <div class="body">${renderBlocks(st.blocks, ctx)}</div></div>`).join("");
    case "apps": return `<div class="apps">${b.items.map((a) =>
      `<div class="app"><b>${a.icon ? `<span aria-hidden="true">${a.icon}</span> ` : ""}${esc(a.title)}</b><span>${esc(a.text)}</span></div>`).join("")}</div>`;
    case "problem": return `<div class="problem">
      <div class="pcol"><b>${esc(b.withoutTitle || "Without it")}</b><ul>${b.without.map((t) => `<li>${t}</li>`).join("")}</ul></div>
      <div class="pcol sol"><b>${esc(b.withTitle || "With our project")}</b><ul>${b.with.map((t) => `<li>${t}</li>`).join("")}</ul></div></div>`;
    case "components": return components(ctx.session);
    case "figure": return `<figure class="figure">${b.html}${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>`;
    case "image": return `<figure class="figure"><img src="${esc(rel(ctx.path, "assets/img/" + b.src))}" alt="${esc(b.alt)}" loading="lazy">${b.caption ? `<figcaption>${esc(b.caption)}</figcaption>` : ""}</figure>`;
    case "widget": return widget(b.name, ctx, b);
    case "details": return `<details><summary>${esc(b.summary)}</summary>${b.html}</details>`;
    case "table": return `<div class="tscroll"><table><thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
      <tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    case "copytext": return `<div class="code"><div class="label"><span>${esc(b.label)}</span><button class="copy" type="button">Copy</button></div><pre class="plain">${esc(b.text)}</pre></div>`;
    default: throw new Error(`Unknown block type ${b.type}`);
  }
}

function teacher(b) {
  const head = `<strong>${esc(b.title || "Teacher")}</strong>`;
  const body = b.items ? `<ul>${b.items.map((i) => `<li>${i}</li>`).join("")}</ul>` : (b.html || "");
  return `<div class="tnote t-only">${head}${body}</div>`;
}

export function code(b) {
  const badge = b.solution ? `<span class="badge">Solution</span> ` : "";
  const html = `<div class="code"><div class="label"><span>${badge}${esc(b.label || "")}</span><button class="copy" type="button">Copy</button></div><pre><code>${highlightPython(b.code)}</code></pre></div>`;
  return b.solution ? `<div class="t-only">${html}</div>` : html;
}

export function components(s) {
  const rows = s.components.map((c) => `<tr>
      <td><strong>${esc(c.name)}</strong>${c.detail ? ` ${esc(c.detail)}` : ""}</td>
      <td class="center">${esc(c.qty)}</td>
      <td><span class="tag ${esc(c.type)}">${TYPE_LABEL[c.type]}</span></td>
      <td>${esc(c.connects)}</td>
      <td>${esc(c.usedFor)}</td></tr>`).join("");
  const ext = s.components.filter((c) => c.type === "external");
  const note = ext.length
    ? `<div class="callout"><strong>External components today:</strong> ${ext.map((c) => esc(c.name)).join(", ")}. Check every student has them before class.</div>`
    : `<div class="callout"><strong>External components:</strong> ${esc(s.externalNote)}</div>`;
  return `<div class="tscroll"><table class="comp">
    <thead><tr><th>Component</th><th class="center">Qty</th><th>Type</th><th>Connects to</th><th>Used for</th></tr></thead>
    <tbody>${rows}</tbody></table></div>${note}`;
}

function widget(name, ctx, b = {}) {
  if (name === "ldr-lab") return LDR_LAB;
  if (name === "blink") return blinkSim(b.led === "external");
  if (name === "led-circuit") return LED_CIRCUIT.replace(/circ-glow/g, `circ-glow-${++simId}`);
  if (name === "traffic-light") return trafficLight();
  if (name === "button") return buttonSim();
  if (name === "crossing") return crossingSim();
  if (name === "pot") return potSim();
  if (name === "light-test") return `<div class="tscroll" data-widget="light-test" data-key="s${ctx.session.number}">
    <table><thead><tr><th>Student</th><th>Covered</th><th>Shadow</th><th>Room</th><th>Torch</th><th>DARK below</th><th>BRIGHT above</th></tr></thead><tbody></tbody></table></div>`;
  throw new Error(`Unknown widget ${name}`);
}

const LDR_LAB = `<div class="lab" data-widget="ldr-lab">
  <div>
    <h3>Light lab</h3>
    <p class="muted small">Drag the slider and watch the number the board would read.</p>
    <div class="scene" data-out="scene">Room light</div>
    <input type="range" min="0" max="100" value="70" aria-label="Light level" data-in="light">
    <div class="ends"><span>🌑 Covered</span><span>🔦 Phone torch</span></div>
    <dl class="readout">
      <dt>LDR resistance</dt><dd data-out="r">–</dd>
      <dt>Voltage at GPIO 27</dt><dd data-out="v">–</dd>
    </dl>
    <div class="muted small" style="margin-top:.7rem">ldr.read_u16() returns</div>
    <div class="big-adc" data-out="adc">–</div>
    <div class="state" data-out="state">–</div>
  </div>
  <div class="ledbox" aria-hidden="true">
    <svg viewBox="0 0 200 220">
      <defs><radialGradient id="lab-glow"><stop offset="0" stop-color="#FFE48A" stop-opacity=".95"/><stop offset=".55" stop-color="#F7C548" stop-opacity=".35"/><stop offset="1" stop-color="#F7C548" stop-opacity="0"/></radialGradient></defs>
      <circle data-out="halo" cx="100" cy="80" r="80" fill="url(#lab-glow)" opacity="0"/>
      <path d="M70 120 V75 a30 30 0 0 1 60 0 V120 Z" fill="var(--surface-2)" stroke="var(--ink)" stroke-width="3"/>
      <path data-out="bulb" d="M70 120 V75 a30 30 0 0 1 60 0 V120 Z" fill="#FFD54A" opacity="0"/>
      <rect x="62" y="120" width="76" height="10" rx="3" fill="var(--ink)"/>
      <line x1="85" y1="130" x2="85" y2="200" stroke="var(--copper)" stroke-width="4"/>
      <line x1="115" y1="130" x2="115" y2="185" stroke="var(--copper)" stroke-width="4"/>
      <text x="100" y="216" text-anchor="middle" class="svg-t s" data-out="ledtxt">Night light: off</text>
    </svg>
  </div>
</div>`;

/** Lines of a small code listing; each line can be highlighted by the widget script (data-line="n"). */
function simCode(lines) {
  return `<pre class="sim-code" aria-hidden="true"><code>${lines.map((l, i) => `<span class="ln" data-line="${i}">${esc(l) || " "}</span>`).join("")}</code></pre>`;
}

// Pico W board drawing shared by the blink simulator. The onboard LED sits next to the USB port.
const PICO_BOARD = `
      <rect x="40" y="20" width="120" height="240" rx="8" fill="#1F7A4A"/>
      <rect x="82" y="10" width="36" height="22" rx="3" fill="#B9BCC2" stroke="#8A8D93"/>
      <rect x="72" y="120" width="56" height="56" rx="3" fill="#2B2B2B"/>
      <text x="100" y="152" text-anchor="middle" font-size="10" fill="#CFCFCF" font-family="monospace">RP2040</text>
      <rect x="78" y="196" width="44" height="40" rx="3" fill="#C9CCD1" stroke="#9A9DA3"/>
      <text x="100" y="220" text-anchor="middle" font-size="8" fill="#555" font-family="monospace">Wi-Fi</text>
      <g fill="#E8C35A">${Array.from({ length: 20 }, (_, i) => `<circle cx="48" cy="${32 + i * 11.4}" r="3.2"/><circle cx="152" cy="${32 + i * 11.4}" r="3.2"/>`).join("")}</g>`;

let simId = 0;
function blinkSim(external) {
  const gid = `blink-glow-${++simId}`;
  const lines = external
    ? ["led = Pin(2, Pin.OUT)", "while True:", "    led.value(1)", "    time.sleep(1)", "    led.value(0)", "    time.sleep(1)"]
    : ["led = Pin(\"LED\", Pin.OUT)", "while True:", "    led.on()", "    time.sleep(1)", "    led.off()", "    time.sleep(1)"];
  const led = external
    ? `<path d="M152 66 H190 V100" fill="none" stroke="#E0B33A" stroke-width="3"/>
      <rect x="183" y="100" width="14" height="34" rx="4" fill="#D8C7A0" stroke="#8A6D3B"/>
      <rect x="183" y="108" width="14" height="4" fill="#E07B39"/><rect x="183" y="116" width="14" height="4" fill="#E07B39"/><rect x="183" y="124" width="14" height="4" fill="#8B5A2B"/>
      <line x1="190" y1="134" x2="190" y2="150" stroke="#E0B33A" stroke-width="3"/>
      <circle data-out="halo" cx="190" cy="166" r="34" fill="url(#${gid})" opacity="0"/>
      <path d="M178 176 V162 a12 12 0 0 1 24 0 V176 Z" fill="#7A1F1F" stroke="var(--ink)" stroke-width="1.5"/>
      <path data-out="bulb" d="M178 176 V162 a12 12 0 0 1 24 0 V176 Z" fill="#FF4D4D" opacity="0"/>
      <path d="M186 176 V230 H152" fill="none" stroke="#333" stroke-width="3"/>
      <text x="160" y="62" class="svg-t s">GP2</text><text x="158" y="244" class="svg-t s">GND</text>`
    : `<circle data-out="halo" cx="64" cy="40" r="30" fill="url(#${gid})" opacity="0"/>
      <rect x="57" y="35" width="14" height="9" rx="2" fill="#E8F0E8" stroke="#9AA59A"/>
      <rect data-out="bulb" x="57" y="35" width="14" height="9" rx="2" fill="#7CFF8A" opacity="0"/>
      <text x="64" y="58" text-anchor="middle" font-size="9" fill="#FFFFFF" font-family="sans-serif">LED</text>`;
  const glow = external ? "#FF6B6B" : "#7CFF8A";
  return `<div class="lab sim" data-widget="blink">
  <div>
    <h3>Blink simulator</h3>
    <p class="muted small">Change the sleep times and watch the ${external ? "LED on GP2" : "onboard LED"} follow the code, line by line.</p>
    <div class="chips" role="group" aria-label="Presets">
      <button type="button" data-preset="1,1" aria-pressed="true">Normal (1 s)</button>
      <button type="button" data-preset="0.2,0.2" aria-pressed="false">Fast (0.2 s)</button>
      <button type="button" data-preset="0.1,0.1" aria-pressed="false">Strobe (0.1 s)</button>
      <button type="button" data-preset="0.1,1.5" aria-pressed="false">Short flash</button>
    </div>
    <label class="slider">ON time <output data-out="on">1 s</output><input type="range" min="0.1" max="2" step="0.1" value="1" data-in="on" aria-label="ON time in seconds"></label>
    <label class="slider">OFF time <output data-out="off">1 s</output><input type="range" min="0.1" max="2" step="0.1" value="1" data-in="off" aria-label="OFF time in seconds"></label>
    ${simCode(lines)}
    <div class="sim-bar"><button type="button" class="btn small" data-play>Pause</button><span class="muted small" data-out="count">Blinks: 0</span><span class="state" data-out="state">OFF</span></div>
  </div>
  <div class="ledbox" aria-hidden="true">
    <svg viewBox="0 0 ${external ? 240 : 200} 270">
      <defs><radialGradient id="${gid}"><stop offset="0" stop-color="${glow}" stop-opacity=".9"/><stop offset=".6" stop-color="${glow}" stop-opacity=".25"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient></defs>
      ${PICO_BOARD}
      ${led}
    </svg>
  </div>
</div>`;
}

const LED_CIRCUIT = `<div class="lab sim" data-widget="led-circuit">
  <div>
    <h3>LED circuit lab</h3>
    <p class="muted small">Switch the pin, take out the resistor or flip the LED, and see what happens to the current.</p>
    <div class="toggles">
      <label><input type="checkbox" data-in="pin" checked> GP2 is HIGH (<code>value(1)</code>)</label>
      <label><input type="checkbox" data-in="res" checked> 330 Ω resistor in the circuit</label>
      <label><input type="checkbox" data-in="flip"> LED put in backwards</label>
    </div>
    <dl class="readout">
      <dt>Voltage from GP2</dt><dd data-out="v">3.3 V</dd>
      <dt>Current</dt><dd data-out="i">–</dd>
    </dl>
    <div class="state" data-out="state">–</div>
    <p class="small" data-out="why"></p>
    <button type="button" class="btn small ghost" data-out="fix" hidden>Put in a new LED</button>
  </div>
  <div class="ledbox" aria-hidden="true">
    <svg viewBox="0 0 260 220">
      <defs><radialGradient id="circ-glow"><stop offset="0" stop-color="#FF6B6B" stop-opacity=".9"/><stop offset=".6" stop-color="#FF6B6B" stop-opacity=".25"/><stop offset="1" stop-color="#FF6B6B" stop-opacity="0"/></radialGradient></defs>
      <path d="M40 88 V40 H220 V180 H150" fill="none" stroke="var(--line)" stroke-width="6" stroke-linejoin="round"/>
      <path class="flow" data-out="flow" d="M40 88 V40 H220 V180 H150" fill="none" stroke="var(--brand)" stroke-width="4" stroke-dasharray="2 14" stroke-linecap="round"/>
      <rect x="10" y="88" width="60" height="44" rx="8" fill="var(--teal)"/>
      <text x="40" y="108" text-anchor="middle" class="svg-t chip" style="font-size:14px">GP2</text>
      <text x="40" y="124" text-anchor="middle" class="svg-t chip" style="font-size:12px" data-out="pinlbl">HIGH</text>
      <g data-out="res">
        <rect x="100" y="28" width="60" height="24" rx="6" fill="#D8C7A0" stroke="#8A6D3B" stroke-width="1.5"/>
        <rect x="112" y="28" width="5" height="24" fill="#E07B39"/><rect x="122" y="28" width="5" height="24" fill="#E07B39"/><rect x="132" y="28" width="5" height="24" fill="#8B5A2B"/>
        <text x="130" y="20" text-anchor="middle" class="svg-t s">330 Ω</text>
      </g>
      <circle data-out="halo" cx="220" cy="110" r="44" fill="url(#circ-glow)" opacity="0"/>
      <g data-out="ledg">
        <path d="M206 124 V104 a14 14 0 0 1 28 0 V124 Z" fill="#7A1F1F" stroke="var(--ink)" stroke-width="1.5"/>
        <path data-out="bulb" d="M206 124 V104 a14 14 0 0 1 28 0 V124 Z" fill="#FF4D4D" opacity="0"/>
        <text x="244" y="100" class="svg-t s" data-out="plus">+</text>
      </g>
      <g data-out="smoke" opacity="0"><circle cx="222" cy="80" r="8" fill="#9A978E"/><circle cx="232" cy="66" r="10" fill="#9A978E" opacity=".7"/><circle cx="222" cy="50" r="12" fill="#9A978E" opacity=".45"/></g>
      <rect x="110" y="166" width="40" height="28" rx="6" fill="var(--ink)"/>
      <text x="130" y="185" text-anchor="middle" font-size="12" font-weight="700" fill="var(--bg)">GND</text>
    </svg>
  </div>
</div>`;

function trafficLight() {
  const tid = `tl${++simId}`;
  return `<div class="lab sim" data-widget="traffic-light">
  <div>
    <h3>Traffic light simulator</h3>
    <p class="muted small">The highlighted lines are running right now. Speed it up to see the whole cycle quickly.</p>
    <div class="scene" data-out="scene">Green: go</div>
    <div class="muted small" data-out="left">5 s left</div>
    ${simCode([
      "while True:",
      "    green_led.value(1)    # GREEN",
      "    yellow_led.value(0)",
      "    red_led.value(0)",
      "    time.sleep(5)",
      "    green_led.value(0)    # YELLOW",
      "    yellow_led.value(1)",
      "    red_led.value(0)",
      "    time.sleep(2)",
      "    green_led.value(0)    # RED",
      "    yellow_led.value(0)",
      "    red_led.value(1)",
      "    time.sleep(5)"
    ])}
    <div class="sim-bar">
      <button type="button" class="btn small" data-play>Pause</button>
      <div class="chips" role="group" aria-label="Speed">
        <button type="button" data-speed="1" aria-pressed="true">Real time</button>
        <button type="button" data-speed="3" aria-pressed="false">3× faster</button>
      </div>
    </div>
  </div>
  <div class="ledbox" aria-hidden="true">
    <svg viewBox="0 0 200 300">
      <defs>${[["r", "#FF5A4F"], ["y", "#FFC83D"], ["g", "#3DDC6A"]].map(([k, c]) => `<radialGradient id="${tid}-${k}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset=".6" stop-color="${c}" stop-opacity=".2"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join("")}</defs>
      <rect x="94" y="230" width="12" height="66" fill="#555"/>
      <rect x="55" y="12" width="90" height="222" rx="18" fill="#2A2A2A" stroke="#111" stroke-width="2"/>
      ${[["r", 56, "#4A1512", "#FF5A4F", "GP2"], ["y", 122, "#4A3A10", "#FFC83D", "GP3"], ["g", 188, "#123A1E", "#3DDC6A", "GP4"]].map(([k, y, off, on, pin]) => `
      <circle data-out="halo-${k}" cx="100" cy="${y}" r="52" fill="url(#${tid}-${k})" opacity="0"/>
      <circle cx="100" cy="${y}" r="26" fill="${off}"/>
      <circle data-out="lamp-${k}" cx="100" cy="${y}" r="26" fill="${on}" opacity="0"/>
      <text x="156" y="${y + 5}" class="svg-t s">${pin}</text>`).join("")}
    </svg>
  </div>
</div>`;
}

// Shared LED drawing for the simulators: dark body, bright overlay and a halo the script fades in.
function simLed(x, y, color, dark, gid, key) {
  return `<circle data-out="halo-${key}" cx="${x}" cy="${y - 6}" r="30" fill="url(#${gid}-${key})" opacity="0"/>
      <path d="M${x - 11} ${y + 6} V${y - 8} a11 11 0 0 1 22 0 V${y + 6} Z" fill="${dark}" stroke="var(--ink)" stroke-width="1.2"/>
      <path data-out="lamp-${key}" d="M${x - 11} ${y + 6} V${y - 8} a11 11 0 0 1 22 0 V${y + 6} Z" fill="${color}" opacity="0"/>`;
}
function glowDefs(gid, list) {
  return `<defs>${list.map(([k, c]) => `<radialGradient id="${gid}-${k}"><stop offset="0" stop-color="${c}" stop-opacity=".85"/><stop offset=".6" stop-color="${c}" stop-opacity=".2"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join("")}</defs>`;
}

function buttonSim() {
  const gid = `btn${++simId}`;
  return `<div class="lab sim" data-widget="button">
  <div>
    <h3>Button lab</h3>
    <p class="muted small">Pick a wiring, then press and hold the button. Watch what <code>button.value()</code> reads.</p>
    <div class="chips" role="group" aria-label="Wiring">
      <button type="button" data-mode="down" aria-pressed="true">Active HIGH (pull-down)</button>
      <button type="button" data-mode="up" aria-pressed="false">Active LOW (pull-up)</button>
      <button type="button" data-mode="toggle" aria-pressed="false">Toggle (Challenge 2)</button>
    </div>
    <div class="sim-bar">
      <button type="button" class="push" data-push aria-label="Push button: press and hold">PRESS</button>
      <div><div class="muted small">button.value() reads</div><div class="big-adc" data-out="val">0</div></div>
    </div>
    <div class="state" data-out="state">Released</div>
    <div data-code="down">${simCode(["button = Pin(0, Pin.IN, Pin.PULL_DOWN)", "while True:", "    if button.value() == 1:", "        led.on()", "    else:", "        led.off()"])}</div>
    <div data-code="up" hidden>${simCode(["button = Pin(0, Pin.IN, Pin.PULL_UP)", "while True:", "    if button.value() == 0:", "        led.on()", "    else:", "        led.off()"])}</div>
    <div data-code="toggle" hidden>${simCode(["button = Pin(0, Pin.IN, Pin.PULL_UP)", "while True:", "    if button.value() == 0:", "        led_state = not led_state", "        led.value(led_state)", "        while button.value() == 0:", "            time.sleep(0.01)"])}</div>
  </div>
  <div class="ledbox" aria-hidden="true">
    <svg viewBox="0 0 260 250">
      ${glowDefs(gid, [["l", "#FF6B6B"]])}
      <text x="30" y="24" class="svg-t s" data-out="top">3.3 V</text>
      <line x1="50" y1="32" x2="50" y2="62" stroke="var(--ink)" stroke-width="2.5"/>
      <g data-out="contact"><line x1="50" y1="62" x2="78" y2="48" stroke="var(--ink)" stroke-width="2.5"/></g>
      <rect x="34" y="34" width="32" height="8" rx="2" fill="var(--brand)" data-out="cap"/>
      <circle cx="50" cy="62" r="3" fill="var(--ink)"/><circle cx="80" cy="62" r="3" fill="var(--ink)"/>
      <line x1="80" y1="62" x2="80" y2="120" stroke="var(--ink)" stroke-width="2.5"/>
      <text x="92" y="58" class="svg-t s">button</text>
      <line x1="80" y1="120" x2="150" y2="120" stroke="var(--ink)" stroke-width="2.5"/>
      <rect x="150" y="104" width="62" height="32" rx="8" fill="var(--teal)"/>
      <text x="181" y="125" text-anchor="middle" class="svg-t chip" style="font-size:14px">GP0</text>
      <line x1="80" y1="120" x2="80" y2="150" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="4 3"/>
      <rect x="70" y="150" width="20" height="44" rx="3" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="4 3"/>
      <line x1="80" y1="194" x2="80" y2="222" stroke="var(--ink)" stroke-width="2.5" stroke-dasharray="4 3"/>
      <text x="96" y="168" class="svg-t s">internal</text>
      <text x="96" y="184" class="svg-t s" data-out="pull">pull-down</text>
      <text x="60" y="242" class="svg-t s" data-out="bottom">GND</text>
      ${simLed(220, 196, "#FF4D4D", "#7A1F1F", gid, "l")}
      <text x="204" y="236" class="svg-t s">GP16</text>
    </svg>
  </div>
</div>`;
}

function crossingSim() {
  const gid = `cross${++simId}`;
  return `<div class="lab sim" data-widget="crossing">
  <div>
    <h3>Pedestrian crossing</h3>
    <p class="muted small">Press the button. The red light goes off and the green light gives people time to cross, then it goes back to red.</p>
    <div class="scene" data-out="scene">Red: wait</div>
    <div class="muted small" data-out="left">Press the button to cross</div>
    ${simCode(["while True:", "    if button.value() == 1:", "        red_led.off()", "        green_led.on()", "        time.sleep(10)", "        green_led.off()", "        red_led.on()", "    time.sleep(0.1)"])}
    <div class="sim-bar"><button type="button" class="push" data-push aria-label="Pedestrian button">PRESS</button><label class="small"><input type="checkbox" data-fast> 3× faster</label></div>
  </div>
  <div class="ledbox" aria-hidden="true">
    <svg viewBox="0 0 200 270">
      ${glowDefs(gid, [["r", "#FF5A4F"], ["g", "#3DDC6A"]])}
      <rect x="94" y="200" width="12" height="66" fill="#555"/>
      <rect x="55" y="20" width="90" height="184" rx="16" fill="#2A2A2A" stroke="#111" stroke-width="2"/>
      <circle data-out="halo-r" cx="100" cy="70" r="50" fill="url(#${gid}-r)" opacity="0"/>
      <circle cx="100" cy="70" r="28" fill="#4A1512"/><circle data-out="lamp-r" cx="100" cy="70" r="28" fill="#FF5A4F" opacity="0"/>
      <text x="100" y="78" text-anchor="middle" font-size="24">🧍</text>
      <circle data-out="halo-g" cx="100" cy="150" r="50" fill="url(#${gid}-g)" opacity="0"/>
      <circle cx="100" cy="150" r="28" fill="#123A1E"/><circle data-out="lamp-g" cx="100" cy="150" r="28" fill="#3DDC6A" opacity="0"/>
      <text x="100" y="158" text-anchor="middle" font-size="24">🚶</text>
      <text x="152" y="74" class="svg-t s">GP16</text><text x="152" y="154" class="svg-t s">GP17</text>
    </svg>
  </div>
</div>`;
}

function potSim() {
  const gid = `pot${++simId}`;
  return `<div class="lab sim" data-widget="pot">
  <div>
    <h3>Knob lab</h3>
    <p class="muted small">Turn the knob. The ADC turns the voltage on GP26 into a number from 0 to 65535.</p>
    <div class="chips" role="group" aria-label="Program">
      <button type="button" data-mode="zones" aria-pressed="true">Temperature indicator</button>
      <button type="button" data-mode="bar" aria-pressed="false">Bar graph (bonus)</button>
    </div>
    <input type="range" min="0" max="65535" step="1" value="12000" aria-label="Knob position" data-in="pot">
    <div class="ends"><span>↺ fully left</span><span>fully right ↻</span></div>
    <dl class="readout">
      <dt>Voltage at GP26</dt><dd data-out="v">–</dd>
      <dt>As a percentage</dt><dd data-out="pct">–</dd>
    </dl>
    <div class="muted small" style="margin-top:.6rem">pot.read_u16() returns</div>
    <div class="big-adc" data-out="adc">–</div>
    <div class="zonebar" aria-hidden="true"><span></span><span></span><span></span><i data-out="mark"></i></div>
    <div class="zonelbl small muted"><span>0</span><span>21845</span><span>43690</span><span>65535</span></div>
    <div data-code="zones">${simCode(["    if pot_value <= 21845:", "        green_led.on()      # low", "    elif pot_value <= 43690:", "        yellow_led.on()     # medium", "    else:", "        red_led.on()        # high"])}</div>
    <div data-code="bar" hidden>${simCode(["    green_led.value(pot_value > 0)", "    yellow_led.value(pot_value > 21845)", "    red_led.value(pot_value > 43690)"])}</div>
  </div>
  <div class="ledbox" aria-hidden="true">
    <svg viewBox="0 0 240 260">
      ${glowDefs(gid, [["g", "#3DDC6A"], ["y", "#FFC83D"], ["r", "#FF5A4F"]])}
      <circle cx="120" cy="80" r="62" fill="#1E5FA8"/>
      <circle cx="120" cy="80" r="46" fill="#D9DCE1" stroke="#9AA0A8" stroke-width="2"/>
      <g data-out="knob"><rect x="116" y="38" width="8" height="30" rx="4" fill="#4A4F57"/></g>
      <path d="M78 124 A60 60 0 1 1 162 124" fill="none" stroke="var(--line)" stroke-width="3" stroke-dasharray="2 6"/>
      <text x="120" y="164" text-anchor="middle" class="svg-t s">GND · SIG → GP26 · 3.3 V</text>
      ${simLed(70, 220, "#3DDC6A", "#123A1E", gid, "g")}
      ${simLed(120, 220, "#FFC83D", "#4A3A10", gid, "y")}
      ${simLed(170, 220, "#FF5A4F", "#4A1512", gid, "r")}
      <text x="70" y="252" text-anchor="middle" class="svg-t s">GP4</text>
      <text x="120" y="252" text-anchor="middle" class="svg-t s">GP3</text>
      <text x="170" y="252" text-anchor="middle" class="svg-t s">GP2</text>
    </svg>
  </div>
</div>`;
}
