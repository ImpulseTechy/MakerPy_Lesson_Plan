// Session 14 — LDR Light Sensor. FULL lesson (reference template for all other sessions).
// Block types are documented in CLAUDE.md. HTML strings are trusted author content.
// Code blocks: every block is syntax-checked by `npm test`; status "full" also means the
// code has been run on a real MakerPy board.

export default {
  number: 14,
  status: "full",
  wiring: "onboard",
  phase: 2,
  module: 6,
  moduleTopic: "Light Sensor",
  title: "LDR Light Sensor",
  level: "Intermediate",
  electronics: "LDR (photoresistor), resistance vs light, voltage divider on PCB: LDR to 3.3V, 4.7kΩ to GND, ADC1 GPIO 27 — more light = HIGHER reading",
  coding: "ADC, read_u16(), threshold logic (if/elif/else), mapping values, comparative operators",
  activities: [
    { min: 10, text: "Theory — LDR, voltage divider, how PCB routes it" },
    { min: 20, text: "Read LDR values, print light level classification" },
    { min: 20, text: "Smart light — RGB LED brightness (PWM) adapts to room light (darker room = brighter LED)" },
    { min: 5, text: "Recap" }
  ],
  componentsText: "MakerPy board (LDR GPIO 27, RGB GPIO 18/19/20)",
  output: "Auto brightness LED based on room light",

  // ---------- Full lesson ----------
  mission: "Today every student teaches their MakerPy board to sense light, then turns it into a night light that glows brighter as the room gets darker.",
  facts: [
    "LDR on <b>GPIO 27</b>",
    "RGB LED on <b>GPIO 18 / 19 / 20</b>"
  ],
  goals: [
    "explain why an LDR's resistance changes with light, and how the board turns that into a number;",
    "read light values with <code>ADC</code> and <code>read_u16()</code>, and pick their own thresholds;",
    "use <code>if / elif / else</code> to sort light into Dark, Dim and Bright, and control LED brightness with PWM."
  ],
  runsheet: [
    { start: 0, end: 3, id: "hello", title: "Hello + board check" },
    { start: 3, end: 5, id: "recap", title: "Recap Session 13" },
    { start: 5, end: 7, id: "project", title: "Today's project + components" },
    { start: 7, end: 10, id: "theory", title: "How an LDR works" },
    { start: 10, end: 30, id: "build", title: "Guided build" },
    { start: 30, end: 50, id: "challenge", title: "Challenge: smart night light" },
    { start: 50, end: 55, id: "wrap", title: "Quiz + wrap-up" }
  ],

  components: [
    { name: "MakerPy board", detail: "Raspberry Pi Pico W", qty: 1, type: "board", connects: "USB to laptop", usedFor: "Runs our code" },
    { name: "LDR", detail: "+ 4.7 kΩ resistor (voltage divider)", qty: 1, type: "onboard", connects: "GPIO 27, already wired", usedFor: "Senses light" },
    { name: "RGB LED", detail: "with 100 Ω resistors", qty: 1, type: "onboard", connects: "GPIO 18 (R), 19 (G), 20 (B), already wired", usedFor: "The night light" },
    { name: "Buzzer", detail: "", qty: 1, type: "onboard", connects: "GPIO 7, already wired", usedFor: "Bonus B: darkness alarm" },
    { name: "Micro-USB data cable", detail: "", qty: 1, type: "tool", connects: "Pico W ↔ laptop", usedFor: "Power + uploading code" },
    { name: "Laptop with Chrome", detail: "+ MicroLab", qty: 1, type: "tool", connects: "—", usedFor: "Writing and running code" },
    { name: "Phone torch", detail: "", qty: 1, type: "tool", connects: "—", usedFor: "Bright-light test" }
  ],
  externalNote: "None today. Everything is already wired on the MakerPy board, so no jumper wires or breadboard are needed.",

  parentMessage: `Hi! Tomorrow's BigBoT MakerPy class is about light sensors 💡
Please keep ready before class:
• MakerPy board + USB cable
• Laptop with Google Chrome
• A phone with a torch (flashlight)
• Webcam/phone camera that can show the board
Please join 5 minutes early so we can check the board connection. Thank you!`,

  prep: [
    "Run all the code on this page on your own MakerPy board. Note your own Dark / Room readings so you have a reference.",
    "Open MicroLab (<a href=\"https://getmicrolab.com\" target=\"_blank\" rel=\"noopener\">getmicrolab.com</a>) in Chrome and connect your board, so you can screen-share it live.",
    "Keep your phone torch ready for the demo, and point a document camera or second webcam at your board.",
    "Go through the <a href=\"#components\">components list</a>. Today everything is onboard, so each student only needs the board, a data USB cable and a phone torch.",
    "Send the reminder message below to parents the day before."
  ],

  sections: [
    {
      id: "hello", title: "Hello + board check",
      lead: "Get all 5 students connected and showing their boards before any teaching starts.",
      blocks: [
        { type: "teacher", items: [
          "Greet each student by name. With only 5, everyone should speak in the first two minutes.",
          "Ask everyone to hold their MakerPy board up to the camera. Move on only when their MicroLab shows the board as connected.",
          "If someone can't connect, don't hold up the class. Start the recap and fix it while others answer (see <a href=\"#help\">troubleshooting</a>)."
        ] }
      ]
    },
    {
      id: "recap", title: "Do you remember?",
      lead: "Last session we built a temperature alarm with the LM35. Ask one student per question.",
      blocks: [
        { type: "quiz", items: [
          { q: "Which GPIO pin is the LM35 temperature sensor connected to?", a: "GPIO 26 (ADC0)" },
          { q: "What range of numbers does <code>read_u16()</code> give us?", a: "0 to 65535" },
          { q: "How did we turn the raw number into a temperature?", a: "Voltage = raw × 3.3 / 65535, then temperature = voltage × 100" }
        ] },
        { type: "teacher", html: `Praise every attempt, even partly right ones. Then bridge to today:
          <p><strong>Say:</strong> <span class="say">The LM35 turned temperature into a number. Today we'll use a sensor that turns light into a number.</span></p>` }
      ]
    },
    {
      id: "project", title: "Today's project: automatic night light",
      lead: "A light that switches itself on when the room gets dark, and glows brighter the darker it gets. No switch needed.",
      blocks: [
        { type: "h3", text: "The real-life problem" },
        { type: "problem", withTitle: "With our night light",
          without: [
            "At night, people walk to the bathroom or kitchen in the dark and can trip or fall, especially grandparents and small children.",
            "Leaving a light on all night wastes electricity and makes it harder to sleep.",
            "People forget to switch lights off in the morning, so they stay on all day."
          ],
          with: [
            "It turns on by itself only when it's dark, so nobody has to find a switch.",
            "It glows just enough for the darkness, so it's not too bright to sleep.",
            "It turns off by itself when daylight comes, so it saves electricity."
          ] },
        { type: "h3", text: "Where the same idea is used" },
        { type: "apps", items: [
          { icon: "🌃", title: "Street lights", text: "Switch on at sunset and off at sunrise, so a city doesn't waste power in daytime." },
          { icon: "🪜", title: "Staircase lights", text: "Light up corridors and stairs only when it's dark, for safety." },
          { icon: "📱", title: "Phone screen", text: "Auto-brightness dims the screen in the dark, saving battery and your eyes." },
          { icon: "🔆", title: "Solar garden lamps", text: "Charge all day and glow only at night." }
        ] },
        { type: "teacher", items: [
          "Ask each student, <span class=\"say\">Where in your home would an automatic night light help, and who would it help?</span> With 5 students, everyone answers.",
          "Connect it to them: today's code is the same idea a real street light uses, just smaller.",
          "Keep this to two minutes; the components list comes next."
        ] },
        { type: "h3", text: "Components we'll use", id: "components" },
        { type: "components" },
        { type: "teacher", html: "Ask students to find each onboard part on their own board and point to it on camera: the LDR, the RGB LED and the buzzer. Show yours on your board camera first." }
      ]
    },
    {
      id: "theory", title: "How an LDR works",
      blocks: [
        { type: "p", html: "An <strong>LDR (Light Dependent Resistor)</strong> is a resistor that changes with light. In the dark its resistance is very high, so very little current flows. In bright light its resistance drops a lot, and more current flows." },
        { type: "h3", text: "How the board reads light" },
        { type: "p", html: "The board can't measure resistance directly. It measures <em>voltage</em>. So the MakerPy board pairs the LDR with a fixed 4.7 kΩ resistor. This pair is called a <strong>voltage divider</strong>, and the voltage in the middle goes to GPIO 27." },
        { type: "figure", caption: "On the MakerPy board, the LDR sits on the 3.3 V side and the 4.7 kΩ resistor goes to ground.", html: `<svg viewBox="0 0 520 250" role="img" aria-label="Voltage divider: 3.3 volts, then LDR, then middle point to GPIO 27, then 4.7 kilo-ohm resistor, then ground">
  <g fill="none" stroke="var(--ink)" stroke-width="2.5">
    <line x1="140" y1="30" x2="140" y2="60"/>
    <rect x="122" y="60" width="36" height="60" rx="6"/>
    <line x1="140" y1="120" x2="140" y2="150"/>
    <rect x="122" y="150" width="36" height="60" rx="2"/>
    <line x1="140" y1="210" x2="140" y2="232"/>
    <line x1="118" y1="232" x2="162" y2="232"/><line x1="126" y1="239" x2="154" y2="239"/><line x1="134" y1="246" x2="146" y2="246"/>
    <line x1="140" y1="135" x2="330" y2="135"/>
  </g>
  <circle cx="140" cy="135" r="5" fill="var(--ink)"/>
  <g stroke="var(--amber)" stroke-width="2.5" fill="none">
    <line x1="70" y1="62" x2="110" y2="80"/><polyline points="100,73 110,80 98,82"/>
    <line x1="68" y1="90" x2="108" y2="104"/><polyline points="97,97 108,104 96,106"/>
  </g>
  <text x="140" y="22" text-anchor="middle" class="svg-t b">3.3 V</text>
  <text x="172" y="95" class="svg-t">LDR</text>
  <text x="172" y="185" class="svg-t">4.7 kΩ</text>
  <text x="50" y="120" class="svg-t s">light</text>
  <rect x="330" y="112" width="160" height="46" rx="10" fill="var(--teal)"/>
  <text x="410" y="141" text-anchor="middle" class="svg-t chip">GPIO 27 (ADC1)</text>
  <text x="172" y="246" class="svg-t s">GND</text>
</svg>` },
        { type: "callout", html: "<strong>The one rule to remember:</strong> on the MakerPy board, <strong>more light gives a higher number</strong>. Darkness gives a low number." },
        { type: "teacher", html: "Many online tutorials wire the LDR the other way round, where more light gives a <em>lower</em> number. If a student copies code from the internet, their Dark and Bright will come out swapped. Point back to this rule." },
        { type: "widget", name: "ldr-lab" },
        { type: "teacher", html: "Share your screen on this slider. Move it slowly from Covered to Phone torch and ask: <span class=\"say\">When the light goes up, does the number go up or down?</span> The LED shows what students will build in the challenge: dark room, bright LED. The numbers are typical values; real boards will differ a little." }
      ]
    },
    {
      id: "build", title: "Guided build",
      lead: "Students code along with you, one step at a time. Wait until all 5 are done before moving to the next step.",
      blocks: [
        { type: "steps", items: [
          { title: "Connect in MicroLab", min: 2, blocks: [
            { type: "p", html: "Open <a href=\"https://getmicrolab.com\" target=\"_blank\" rel=\"noopener\">MicroLab</a> in Chrome, plug in the MakerPy board, click <strong>Connect</strong> and create a new file called <code>light.py</code>." }
          ] },
          { title: "Read raw light values", min: 5, blocks: [
            { type: "code", label: "light.py", code: `from machine import ADC, Pin
import time

ldr = ADC(Pin(27))        # LDR is on GPIO 27 (ADC1)

while True:
    light = ldr.read_u16()    # 0 = dark ... 65535 = very bright
    print("Light:", light)
    time.sleep(0.5)` },
            { type: "p", html: "Run it and open the serial monitor. A new number appears every half second." },
            { type: "teacher", items: [
              "Type this live while screen-sharing rather than pasting. Students learn more from watching you type and fix typos.",
              "Explain <code>ADC(Pin(27))</code>: <span class=\"say\">ADC is the part of the Pico that turns voltage into a number. We tell it to look at pin 27, where our LDR is.</span>",
              "Ask everyone to paste one number in the chat. If someone sees the same number no matter what, check they wrote 27 and not 26."
            ] }
          ] },
          { title: "Light test: find your numbers", min: 8, blocks: [
            { type: "p", html: "Each student measures 4 conditions and types the numbers in the chat:" },
            { type: "list", ordered: true, items: [
              "<strong>Covered</strong>: put a finger firmly over the LDR.",
              "<strong>Shadow</strong>: hold a hand about 10 cm above the board.",
              "<strong>Room light</strong>: nothing covering it.",
              "<strong>Phone torch</strong>: shine the torch right at it."
            ] },
            { type: "p", html: "Every home has different lighting, so <strong>every student gets their own thresholds</strong>. The table works them out automatically." },
            { type: "widget", name: "light-test", teacherOnly: true },
            { type: "teacher", items: [
              "Fill the table as students post numbers in the chat. Read each student's thresholds back to them; they'll use them in step 4.",
              "DARK is halfway between Covered and Shadow. BRIGHT is halfway between Shadow and Room.",
              "Ask students to cover the sensor with a finger rather than switching off room lights, so parents aren't disturbed and cameras still work."
            ] }
          ] },
          { title: "Dark, Dim or Bright?", min: 5, blocks: [
            { type: "p", html: "Now the board decides what the light level means. Replace <code>15000</code> and <code>40000</code> with your own numbers." },
            { type: "code", label: "light.py", code: `from machine import ADC, Pin
import time

ldr = ADC(Pin(27))

DARK = 15000      # use YOUR number from the light test
BRIGHT = 40000    # use YOUR number from the light test

while True:
    light = ldr.read_u16()
    if light > BRIGHT:
        state = "Bright"
    elif light > DARK:
        state = "Dim"
    else:
        state = "Dark"
    print(light, state)
    time.sleep(0.5)` },
            { type: "teacher", items: [
              "Point out the order: we check <code>BRIGHT</code> first. Ask: <span class=\"say\">What would happen if we checked DARK first?</span> (Everything above DARK would print Dim, so Bright would never show. The order of <code>elif</code> matters.)",
              "Test together: everyone covers the LDR and says \"Dark!\" when the monitor shows it. It's a quick way to check all 5 boards at once."
            ] }
          ] }
        ] }
      ]
    },
    {
      id: "challenge", title: "Challenge: smart night light",
      lead: "Make the RGB LED glow brighter as the room gets darker, like a real night lamp.",
      blocks: [
        { type: "p", html: "Start from this code. Only one line is missing." },
        { type: "code", label: "nightlight.py — starter", code: `from machine import ADC, Pin, PWM
import time

ldr = ADC(Pin(27))
red = PWM(Pin(18))
green = PWM(Pin(19))
blue = PWM(Pin(20))
for led in (red, green, blue):
    led.freq(1000)

while True:
    light = ldr.read_u16()
    brightness = ...          # TODO: darker room = bigger number
    red.duty_u16(brightness)
    green.duty_u16(brightness)
    blue.duty_u16(brightness)     # all three together = white light
    print("Light:", light, "LED:", brightness)
    time.sleep(0.1)` },
        { type: "details", summary: "Hint", html: "<p>The light number goes from 0 (dark) up to 65535 (bright). You want the LED to do the opposite. What could you subtract the light number from?</p>" },
        { type: "teacher", title: "Solution 1: simple flip", html: "Most students should reach this one." },
        { type: "code", label: "Missing line", solution: true, partial: true, code: `    brightness = 65535 - light` },
        { type: "teacher", html: "Ask: <span class=\"say\">In normal room light, is your LED fully off?</span> It isn't; it still glows a little, because the room reading is well below 65535. That's the problem solution 2 fixes, using their own thresholds." },
        { type: "code", label: "Solution 2: real night lamp using thresholds", solution: true, code: `from machine import ADC, Pin, PWM
import time

ldr = ADC(Pin(27))
red = PWM(Pin(18))
green = PWM(Pin(19))
blue = PWM(Pin(20))
for led in (red, green, blue):
    led.freq(1000)

DARK = 15000      # student's own numbers
BRIGHT = 40000

def light_to_brightness(light):
    if light >= BRIGHT:
        return 0                  # bright room: LED off
    if light <= DARK:
        return 65535              # dark room: full brightness
    return int((BRIGHT - light) * 65535 / (BRIGHT - DARK))

while True:
    light = ldr.read_u16()
    brightness = light_to_brightness(light)
    red.duty_u16(brightness)
    green.duty_u16(brightness)
    blue.duty_u16(brightness)
    print("Light:", light, "LED:", brightness)
    time.sleep(0.1)` },
        { type: "teacher", title: "Running the challenge online", items: [
          "Give 10 minutes of quiet work. Ask students to keep cameras pointed at their boards so you can watch the LEDs.",
          "Whoever finishes first demos for the group: cover the sensor, the LED brightens.",
          "If a student is stuck for more than 3 minutes, ask them to share their screen and read their code aloud. They often spot the bug themselves.",
          "Students who finish early move to the bonus tasks below."
        ] },
        { type: "h3", text: "Bonus A: light-level colors" },
        { type: "p", html: "Green when bright, yellow when dim, red when dark. Use your Dark / Dim / Bright code and a <code>set_color()</code> function." },
        { type: "code", label: "Bonus A solution", solution: true, code: `from machine import ADC, Pin
import time

ldr = ADC(Pin(27))
red = Pin(18, Pin.OUT)
green = Pin(19, Pin.OUT)
blue = Pin(20, Pin.OUT)

DARK = 15000
BRIGHT = 40000

def set_color(r, g, b):
    red.value(r)
    green.value(g)
    blue.value(b)

while True:
    light = ldr.read_u16()
    if light > BRIGHT:
        set_color(0, 1, 0)    # green = bright
    elif light > DARK:
        set_color(1, 1, 0)    # yellow = dim
    else:
        set_color(1, 0, 0)    # red = dark
    time.sleep(0.2)` },
        { type: "h3", text: "Bonus B: darkness alarm" },
        { type: "p", html: "Make the buzzer beep when it gets dark. The buzzer is on GPIO 7." },
        { type: "code", label: "Bonus B solution", solution: true, code: `from machine import ADC, Pin, PWM
import time

ldr = ADC(Pin(27))
DARK = 15000      # student's own number

def beep(freq, ms):
    buzzer = PWM(Pin(7))
    buzzer.freq(freq)
    buzzer.duty_u16(32768)
    time.sleep_ms(ms)
    buzzer.deinit()
    Pin(7, Pin.OUT, value=1)    # active-LOW buzzer: HIGH = silent

while True:
    light = ldr.read_u16()
    if light < DARK:
        print("Too dark!", light)
        beep(880, 150)
        time.sleep(0.3)
    else:
        time.sleep(0.2)` },
        { type: "teacher", html: "The MakerPy buzzer is active-LOW: it's wired to 3.3 V on one side, so setting GPIO 7 HIGH makes it silent. That's why the code sets the pin HIGH after each beep." }
      ]
    },
    {
      id: "wrap", title: "Quiz + wrap-up",
      lead: "Everyone answers in the chat at the same time, then reveal the answer.",
      blocks: [
        { type: "quiz", items: [
          { q: "What does LDR stand for?", a: "Light Dependent Resistor" },
          { q: "When more light falls on an LDR, does its resistance go up or down?", a: "Down" },
          { q: "Which GPIO is the LDR connected to on the MakerPy board?", a: "GPIO 27" },
          { q: "You cover the LDR with your finger. Does the <code>read_u16()</code> number go up or down?", a: "Down (on the MakerPy board, darker means a lower number)" },
          { q: "Why did we write <code>65535 - light</code> in the night light?", a: "To flip it: the darker the room, the bigger the brightness number" }
        ] },
        { type: "h3", text: "What we learned today" },
        { type: "list", items: [
          "An LDR changes resistance with light, and the voltage divider turns that into a voltage.",
          "<code>ADC(Pin(27)).read_u16()</code> turns that voltage into a number from 0 to 65535.",
          "We picked thresholds from real measurements and used them to build a night light."
        ] },
        { type: "callout", html: "<strong>Try at home (optional):</strong> measure the light number in 3 rooms of your house and at your window. Which room is the darkest? Bring your numbers next class." },
        { type: "p", html: "<strong>Next session:</strong> Servo motors. We'll make a motor turn to an exact angle, and build a button-controlled robot arm." },
        { type: "teacher", html: "Before ending, ask each student to save <code>light.py</code> and <code>nightlight.py</code> on the board." }
      ]
    }
  ],

  troubleshooting: [
    { symptom: "Number never changes", cause: "Wrong pin (often 26, the LM35)", fix: "Read the <code>ADC(Pin(…))</code> line aloud. It must be 27." },
    { symptom: "Dark and Bright are swapped", cause: "Code copied from the internet, or thresholds in the wrong place", fix: "Remind them: on MakerPy, more light = higher number. Check DARK is the smaller number." },
    { symptom: "Numbers jump around a lot", cause: "Flickering room light or a moving hand", fix: "Keep the hand still. Optional: average 10 readings." },
    { symptom: "LED never lights in the night light", cause: "Missing <code>duty_u16()</code> line, or room too bright for solution 2", fix: "Cover the LDR fully. Check all three color lines are there." },
    { symptom: "Buzzer keeps humming after Bonus B", cause: "Pin left LOW after <code>deinit()</code>", fix: "Make sure the line <code>Pin(7, Pin.OUT, value=1)</code> is there." }
  ]
};
