# BigBoT Teacher Hub — guide for Claude Code

Teacher-only website for **BigBoT** online robotics classes. Teachers use it to prepare
and to run live classes (55 minutes, batches of 5 students, everyone on their own board at home).
The first course is **MakerPy** (32 sessions, Raspberry Pi Pico W on the MakerPy board, MicroPython in MicroLab).

The site is private: it is hosted on Cloudflare Pages behind Cloudflare Access (teacher email + one-time code).

## Commands

```bash
npm run build   # validate content + render every page to dist/
npm run dev     # build, then preview at http://localhost:4321
npm test        # build + all tests (content, links, anchors, HTML, Python syntax)
```

Node 22+ only. **No npm dependencies** — keep it that way unless there is a strong reason.
Python 3 is used by one test to syntax-check lesson code (the test is skipped if Python is missing).

Optional browser check (needs `pip install playwright && playwright install chromium`):
run `npm run dev` in one terminal, then `python scripts/browser-check.py` in another.

## Architecture

```
build.js                     entry: load → validate → render → write dist/
lib/load.js                  reads all content files
lib/validate.js              content rules; the build FAILS on any error
lib/html.js                  esc(), rel() relative links, Python highlighter, labels
lib/layout.js                page shell: head, top bar, search, session switcher, view toggle
lib/blocks.js                renders content blocks (see "Block types")
lib/pages/lesson.js          lesson page (full lesson or outline)
lib/pages/site.js            home, course roadmap, pin map, components, code, troubleshooting, guide, updates, 404
src/content/makerpy/
  course.json                course facts and phases
  pins.json                  THE pin map (source of truth for every GPIO number)
  components.json            components library
  sessions/01.js … 32.js     one file per session
src/content/pages/teaching-online.js   Teaching Online Guide (same block format)
src/data/                    site.json, updates.json, troubleshooting.json
src/assets/                  site.css, app.js (all pages), widgets.js (lesson widgets), img/
public/                      copied as-is to dist/ (_headers, robots.txt)
tests/                       node:test suites
```

All links are **relative** (`rel()`), so the site works on any host path and when opened from disk.
Never hand-write `href="/..."` except in `404.html`. Never edit `dist/`; it is regenerated.

## Session files

Every session exports one object. Outline sessions have only the curriculum fields:

| Field | Meaning |
|---|---|
| `number`, `phase`, `module`, `moduleTopic`, `title`, `level` | From the curriculum sheet. Level: Beginner, Intermediate, Advanced, Expert |
| `electronics`, `coding`, `activities`, `componentsText`, `output` | From the sheet. `activities` minutes must add up to 55 |
| `wiring` | `simulation` (Wokwi), `onboard` (no jumper wires), `external` (jumper wires / plug-in parts) |
| `status` | `outline` or `full` |

A **full** lesson also needs (see `sessions/14.js`, the reference lesson):
`mission`, `goals`, `facts` (optional), `runsheet`, `components`, `externalNote` (when no external parts),
`prep`, `parentMessage` (optional), `sections`, `troubleshooting`.

- `runsheet`: contiguous from minute 0 to 55; every `id` must match a section `id`.
- `components`: `{ name, detail, qty, type: board|onboard|external|tool|virtual, connects, usedFor }`.
  If `wiring` is `external`, at least one component must be `external`, and vice versa.
  `virtual` = a part added in Wokwi; only allowed when `wiring` is `simulation`.
- Every lesson includes a real-life problem the project solves (`problem` block) and where the idea is used (`apps` block).

## Block types

Used in `sections[].blocks` and in the Teaching Online Guide. Any block can take `teacherOnly: true`.
HTML strings are trusted author content.

| Type | Fields | Notes |
|---|---|---|
| `p` | `html` | Paragraph |
| `h3` | `text`, `id?` | Sub-heading |
| `teacher` | `title?`, `html` or `items[]` | Purple teacher note, **always hidden in Screen-share view** |
| `callout` | `html` | Amber highlight |
| `code` | `label`, `code`, `solution?`, `partial?` | MicroPython. `solution: true` hides it in Screen-share view. `partial: true` for an indented snippet from inside a loop |
| `quiz` | `items[{q, a}]` | Answers hidden until "Show answer" |
| `list` | `items[]`, `ordered?` | |
| `steps` | `items[{title, min, blocks[]}]` | Numbered guided-build steps (nested blocks) |
| `problem` | `without[]`, `with[]`, `withoutTitle?`, `withTitle?` | Real-life problem vs our project |
| `apps` | `items[{icon, title, text}]` | Where the idea is used in real life |
| `components` | — | Renders the lesson's `components` table + external parts note |
| `figure` | `html`, `caption?` | Inline SVG diagram (use CSS variables for colors) |
| `image` | `src`, `alt`, `caption?` | File in `src/assets/img/`; `alt` is required |
| `widget` | `name`, `led?` | `ldr-lab`, `light-test`, `blink` (add `led: "external"` for an LED on GP2), `led-circuit`, `traffic-light`, `button`, `crossing`, `pot` (in `src/assets/widgets.js`) |
| `details` | `summary`, `html` | Collapsible hint |
| `table` | `head[]`, `rows[][]` | |
| `copytext` | `label`, `text` | Copyable plain text (parent messages) |

To add a block type: render it in `lib/blocks.js`, add it to `BLOCK_TYPES` in `lib/validate.js`, document it here.

## Hardware facts — never contradict these

From the board schematic (RP_Pi_DevBoard Rev 1.0). `pins.json` is the source of truth; the build fails
if any lesson mentions a GPIO number that is not in it.

- The board is a **Pico W**. Onboard LED: `Pin("LED", Pin.OUT)` — not pin 25. Flash the **Pico W** firmware.
- Buttons GPIO 4/5/6: 10 kΩ pull-ups, **active-LOW** (`value() == 0` when pressed).
- Buzzer GPIO 7: wired to 3.3 V, **active-LOW**; set the pin HIGH for silence after PWM.
- RGB LED: R = GPIO 18, G = 19, B = 20 (100 Ω resistors), HIGH = on.
- LM35 on GPIO 26, powered from 3.3 V (rated 4 V minimum): tell teachers to check readings.
- LDR on GPIO 27, LDR on the 3.3 V side, 4.7 kΩ to GND: **more light = HIGHER reading**.
- GPIO 28 is only the J7 header (3.3 V / signal / GND); nothing is onboard.
- Servos: GPIO 8/9/10 on J3/J2/J1, 5 V.
- Motor driver TB6612FNG: PWMA 11, **AIN2 12, AIN1 13**, STBY 14 (must be HIGH), PWMB 15, **BIN2 16, BIN1 17**.
  Motors on J5 (M_1) and J6 (M_2); VM is 9 V, so motors need the 9 V adapter.
- External parts: LCD SDA 0 / SCL 1, IR sensor 2, NeoPixel DIN 3, HC-SR04 Trig 21 / Echo 22
  (Echo is 5 V → 1 kΩ / 2 kΩ divider, or use HC-SR04P). These use every free pin.
- Pico GPIO is 3.3 V only. Never tell students to connect 5 V or 9 V to a GPIO.

## Writing rules

- Brand is always **BigBoT** (the build fails on "BigBot"). English only.
- Write for teachers in plain, direct sentences. Scripted lines for the teacher go in
  `<span class="say">…</span>` (rendered in quotes).
- Anything a student must not see while the teacher screen-shares (notes, answers, solutions, prep) must be
  `teacher` blocks, `solution: true` code, or `teacherOnly: true`.
- Code: 4-space indentation, no tabs, comments that a student can understand, only modules available in
  MicroPython for the Pico W (`machine`, `time`, `neopixel`, `math`, `random`, `sys`, plus uploaded libraries).
- Online-class reality: 5 students at home, cameras on boards, numbers shared in chat, the teacher can't touch boards.

## Writing a full lesson (definition of done)

1. Read the session's outline file and `sessions/14.js`.
2. Write the full lesson in the same file, keeping the curriculum fields.
3. `npm test` must pass (it checks pins, run sheet, links, anchors, Python syntax, teacher-only marking).
4. **Run every code block on a real MakerPy board.** Only then set `status: "full"`.
5. Add an entry at the top of `src/data/updates.json`.
6. If the lesson introduces a new part, add it to `components.json` (and `pins.json` if it uses a pin).

## Deploying

Cloudflare Pages: build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.
Access is controlled in Cloudflare Zero Trust (Access application on the site's domain, policy = allowed teacher emails,
login method = one-time PIN). `public/_headers` adds noindex and security headers.
