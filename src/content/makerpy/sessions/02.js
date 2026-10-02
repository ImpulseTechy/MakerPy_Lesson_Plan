// Session 2 — Digital Output: LED Control. FULL lesson, written from the
// "External LED with Pico" class deck and following the structure of 14.js.
// Everything runs on the Wokwi simulator. GP2/GP3/GP4 are fine in Wokwi, but on the real
// MakerPy board those pins are taken (IR sensor, NeoPixel, Button 1): see the teacher note in "build".

export default {
  number: 2,
  status: "full",
  wiring: "simulation",
  phase: 1,
  module: 1,
  moduleTopic: "Digital Output",
  title: "Digital Output — LED Control",
  level: "Beginner",
  electronics: "What is digital output? HIGH vs LOW, GPIO as output, current limiting with resistors",
  coding: "Variables, while True loop, time.sleep(), Pin class, Pin.OUT",
  activities: [
    { min: 10, text: "Theory — digital output + resistors" },
    { min: 20, text: "Wokwi — connect LED + resistor to GPIO, blink code" },
    { min: 20, text: "Traffic light project (3 LEDs, sequence logic)" },
    { min: 5, text: "Share screens + discuss" }
  ],
  componentsText: "Wokwi, LEDs x3, resistors, GPIO pins",
  output: "Traffic light sequence running on Wokwi",

  // ---------- Full lesson ----------
  mission: "Today every student wires their own LEDs and resistors to the Pico in Wokwi, makes an external LED blink, and builds a working traffic light.",
  facts: [
    "Red / yellow / green on <b>GP2 / GP3 / GP4</b>",
    "<b>330 Ω</b> resistor with every LED"
  ],
  goals: [
    "explain digital output: a pin set HIGH (1, 3.3 V) or LOW (0, 0 V);",
    "connect an LED the right way round (long leg + to the pin, short leg − to GND) with a 330 Ω resistor, and say why the resistor is needed;",
    "use <code>Pin(n, Pin.OUT)</code>, <code>value(1)</code> / <code>value(0)</code> and <code>on()</code> / <code>off()</code>;",
    "program a timed sequence of three LEDs: a traffic light."
  ],
  runsheet: [
    { start: 0, end: 3, id: "hello", title: "Hello + Wokwi check" },
    { start: 3, end: 6, id: "recap", title: "Recap Session 1" },
    { start: 6, end: 10, id: "project", title: "Today's project + components" },
    { start: 10, end: 16, id: "theory", title: "LEDs, resistors, HIGH/LOW" },
    { start: 16, end: 30, id: "build", title: "Guided build: external LED" },
    { start: 30, end: 50, id: "traffic", title: "Project: traffic light" },
    { start: 50, end: 55, id: "wrap", title: "Share screens + quiz" }
  ],

  components: [
    { name: "Raspberry Pi Pico", detail: "(virtual, in Wokwi)", qty: 1, type: "virtual", connects: "Wokwi simulator in the browser", usedFor: "Runs our code" },
    { name: "LEDs", detail: "red, yellow, green", qty: 3, type: "virtual", connects: "Anode (+) to GP2 / GP3 / GP4 through a resistor, cathode (−) to GND", usedFor: "Blink + traffic light" },
    { name: "Resistors", detail: "330 Ω", qty: 3, type: "virtual", connects: "In series with each LED", usedFor: "Protect the LEDs from too much current" },
    { name: "Laptop with Chrome", detail: "+ Wokwi account from Session 1", qty: 1, type: "tool", connects: "—", usedFor: "Wokwi + video class" }
  ],
  externalNote: "None to buy or keep ready. Today's LEDs and resistors are virtual parts students add in Wokwi.",

  parentMessage: `Hi! Tomorrow's BigBoT MakerPy class: we'll build a traffic light 🚦
Please keep ready:
• Laptop with Google Chrome
• Your child signed in to wokwi.com (the account from last class)
• Webcam and microphone working
No hardware is needed for this class. Please join 5 minutes early. Thank you!`,

  prep: [
    "Build both circuits in your own Wokwi project and run every code block on this page, so you know where students get stuck.",
    "Keep two Wokwi tabs ready to screen-share: an empty MicroPython Pico project, and your finished traffic light as a backup demo.",
    "Practise adding a part in Wokwi (the blue <strong>+</strong> button), setting a resistor to 330 Ω and drawing wires. You'll demo this live.",
    "Check the <a href=\"#components\">components list</a>: everything is virtual today.",
    "Send the reminder message below to parents the day before. Note anyone who couldn't sign in to Wokwi last class and check with the parent."
  ],

  sections: [
    {
      id: "hello", title: "Hello + Wokwi check",
      lead: "Get all 5 students signed in to Wokwi before teaching starts.",
      blocks: [
        { type: "teacher", items: [
          "Greet each student by name and ask one quick question, like <span class=\"say\">Did you try the SOS blink at home?</span>",
          "Ask everyone to open wokwi.com, sign in and start a new MicroPython Pico project (wokwi.com → Pi Pico → MicroPython template).",
          "If someone can't sign in, they can work without saving today. Don't hold up the class."
        ] }
      ]
    },
    {
      id: "recap", title: "Do you remember?",
      lead: "Last session we met the Pico and blinked the onboard LED. Ask one student per question.",
      blocks: [
        { type: "quiz", items: [
          { q: "What did we print in our very first program?", a: "<code>print(\"Hello, Pi Pico!\")</code>" },
          { q: "What voltage do the Pico's pins use?", a: "3.3 V" },
          { q: "How did we set up the onboard LED?", a: "<code>led = Pin(\"LED\", Pin.OUT)</code>" },
          { q: "What does <code>time.sleep(1)</code> do?", a: "Pauses the program for 1 second" }
        ] },
        { type: "teacher", html: "Bridge to today: <span class=\"say\">The onboard LED is already wired for us. Today we connect our own LEDs to the Pico's pins, and build something you see on every road.</span>" }
      ]
    },
    {
      id: "project", title: "Today's project: a traffic light",
      lead: "Three LEDs, red, yellow and green, switching in the same order and timing as a real traffic signal.",
      blocks: [
        { type: "widget", name: "traffic-light" },
        { type: "teacher", html: "Leave the simulator running while you introduce the project. <span class=\"say\">By the end of class, your Pico will run this exact code.</span>" },
        { type: "h3", text: "The real-life problem" },
        { type: "problem", withTitle: "With a traffic light",
          without: [
            "At a busy crossing, cars from every side try to go at once, causing jams and accidents.",
            "People crossing the road can't tell when it's safe.",
            "A police officer would have to stand at every junction, all day."
          ],
          with: [
            "Each road gets a fair turn: green to go, yellow to get ready, red to stop.",
            "Everyone understands the colors, without any words.",
            "A small computer switches the lights on time, all day and night."
          ] },
        { type: "h3", text: "Where the same idea is used" },
        { type: "apps", items: [
          { icon: "🚦", title: "Traffic signals", text: "A microcontroller switches the lamps in a fixed, timed order." },
          { icon: "🚑", title: "Emergency vehicles", text: "Flashing lights on ambulances and fire engines use fast LED blink patterns." },
          { icon: "🪔", title: "Festival lights", text: "Strings of LEDs chase and blink in sequences, just like our code." },
          { icon: "🔢", title: "Countdown timers", text: "Pedestrian signals show a countdown made of LEDs." }
        ] },
        { type: "teacher", html: "Ask: <span class=\"say\">Why does the yellow light come between green and red?</span> (To warn drivers so they can stop safely.)" },
        { type: "h3", text: "Components we'll use", id: "components" },
        { type: "components" }
      ]
    },
    {
      id: "theory", title: "LEDs, resistors and digital output",
      blocks: [
        { type: "h3", text: "What is an LED?" },
        { type: "p", html: "<strong>LED</strong> stands for <strong>Light Emitting Diode</strong>. It's like a tiny light bulb that uses very little electricity and doesn't get hot. TV remotes, phone screens, traffic lights and the lights on a Wi-Fi router all use LEDs." },
        { type: "image", src: "s02-led-legs.png", alt: "LED symbol and a red LED: the long leg is the anode (+), the short leg is the cathode (−)", caption: "Long leg = anode (+), goes to the pin. Short leg = cathode (−), goes to GND." },
        { type: "p", html: "A diode lets current flow <strong>only one way</strong>. If an LED is put in backwards, it simply won't light up." },
        { type: "h3", text: "What is a resistor?" },
        { type: "p", html: "A <strong>resistor</strong> slows down the flow of electricity. An LED on its own lets far too much current through and burns out. A <strong>330 Ω</strong> resistor in series with the LED keeps the current small and safe." },
        { type: "h3", text: "Digital output: HIGH and LOW" },
        { type: "p", html: "When a pin is an <strong>output</strong>, our code decides its voltage: <code>value(1)</code> makes it <strong>HIGH</strong> (3.3 V) and <code>value(0)</code> makes it <strong>LOW</strong> (0 V). Like a light switch: 1 is on, 0 is off. Only two choices, so it's called <strong>digital</strong>." },
        { type: "widget", name: "led-circuit" },
        { type: "teacher", items: [
          "Share your screen on the circuit lab. Ask a student to tell you what to click: first set GP2 LOW, then HIGH; then flip the LED; finally remove the resistor and watch it burn out.",
          "Ask: <span class=\"say\">Why didn't the LED light when it was backwards?</span> (Current only flows one way through a diode.)",
          "The current number is a typical value for a red LED; real LEDs differ a little."
        ] }
      ]
    },
    {
      id: "build", title: "Guided build: external LED",
      lead: "Students build along with you, one step at a time. Wait until all 5 are done before moving on.",
      blocks: [
        { type: "steps", items: [
          { title: "Add the parts in Wokwi", min: 4, blocks: [
            { type: "list", ordered: true, items: [
              "In the simulator, click the blue <strong>+</strong> (Add a new part) button and search for <strong>LED</strong>. Add one.",
              "Click <strong>+</strong> again, search <strong>Resistor</strong> and add one. Click the resistor and set its value to <strong>330</strong> Ω.",
              "Drag the parts so they sit next to the Pico."
            ] },
            { type: "teacher", html: "Do it once slowly while screen-sharing, then let students do it. In Wokwi the LED's anode (+) is the leg with the bend. Hover over a leg to see its name: <strong>A</strong> = anode, <strong>C</strong> = cathode." }
          ] },
          { title: "Wire the circuit", min: 4, blocks: [
            { type: "p", html: "Click a leg or pin to start a wire, then click where it should end:" },
            { type: "list", items: [
              "<strong>GP2</strong> → one end of the resistor",
              "Other end of the resistor → <strong>anode (+)</strong> of the LED",
              "<strong>Cathode (−)</strong> of the LED → any <strong>GND</strong> pin"
            ] },
            { type: "image", src: "s02-led-circuit.png", alt: "Wokwi circuit: a red LED and a resistor connected to the Pico, red wire from the resistor to GP2 and black wire from the LED to GND", caption: "One LED: GP2 → 330 Ω resistor → LED → GND." },
            { type: "teacher", items: [
              "Ask each student to share their screen for 10 seconds, or post a screenshot in the chat. Check the LED's direction and the GND wire.",
              "Ask everyone to count the pins down the Pico's left side to find GP2. It's the 4th pin from the top (pin 1 is GP0, then GP1, GND, GP2)."
            ] }
          ] },
          { title: "Blink the external LED", min: 3, blocks: [
            { type: "code", label: "main.py", code: `from machine import Pin
import time

led = Pin(2, Pin.OUT)    # external LED on GP2, as an output

while True:
    led.value(1)         # 1 = HIGH = LED on
    time.sleep(1)
    led.value(0)         # 0 = LOW = LED off
    time.sleep(1)` },
            { type: "p", html: "<code>Pin(2, Pin.OUT)</code> tells the Pico that pin GP2 is an output, and we give it the name <code>led</code>. <code>led.value(1)</code> switches it on, <code>led.value(0)</code> switches it off." },
            { type: "p", html: "<code>led.on()</code> and <code>led.off()</code> do exactly the same as <code>value(1)</code> and <code>value(0)</code>. Use whichever is easier to remember." },
            { type: "widget", name: "blink", led: "external" },
            { type: "teacher", items: [
              "We use <code>from machine import Pin</code> as decided in Session 1. The deck's <code>from machine import *</code> version also works, if a student prefers it.",
              "If the LED doesn't light: is the LED backwards? Is the wire on GP2 (not pin number 2 on the board, which is GP1)? Is there a GND wire?"
            ] }
          ] },
          { title: "Assignment 1: blink pattern", min: 3, blocks: [
            { type: "p", html: "Make the LED on GP2 blink <strong>three times quickly</strong> (0.2 s on, 0.2 s off), then pause for <strong>2 seconds</strong>, and repeat." },
            { type: "details", summary: "Hint", html: "<p>Copy the on / sleep / off / sleep lines three times inside the loop, with 0.2 seconds. Then add one longer sleep at the end.</p>" },
            { type: "code", label: "Assignment 1 solution", solution: true, code: `from machine import Pin
import time

led = Pin(2, Pin.OUT)

while True:
    # First blink
    led.value(1)
    time.sleep(0.2)
    led.value(0)
    time.sleep(0.2)
    # Second blink
    led.value(1)
    time.sleep(0.2)
    led.value(0)
    time.sleep(0.2)
    # Third blink
    led.value(1)
    time.sleep(0.2)
    led.value(0)
    time.sleep(0.2)
    # Pause
    time.sleep(2)` },
            { type: "teacher", html: "The deck's answer slide uses the onboard LED (pin 25). The task is about the <strong>external LED on GP2</strong>, so this solution uses <code>Pin(2, Pin.OUT)</code>. Students who finish early can try making it shorter; a <code>for</code> loop comes in a later session." }
          ] }
        ] },
        { type: "teacher", title: "Real MakerPy board: different pins", html: "On Wokwi any GPIO pin works. On the real MakerPy board, GPIO 2, 3 and 4 are already taken (IR sensor, NeoPixel ring and Button 1), and the board has its own RGB LED on GPIO 18/19/20, which students use from Session 10. If a student tries this circuit on a real board later, don't use these pins." }
      ]
    },
    {
      id: "traffic", title: "Project: traffic light",
      lead: "Three LEDs, three pins, one sequence: green 5 s, yellow 2 s, red 5 s, repeated forever.",
      blocks: [
        { type: "h3", text: "Build the circuit" },
        { type: "list", items: [
          "Add a yellow and a green LED and two more 330 Ω resistors (click an LED to change its color).",
          "Red LED anode (through a resistor) → <strong>GP2</strong>",
          "Yellow LED anode (through a resistor) → <strong>GP3</strong>",
          "Green LED anode (through a resistor) → <strong>GP4</strong>",
          "All three cathodes → <strong>GND</strong>"
        ] },
        { type: "image", src: "s02-traffic-circuit.png", alt: "Wokwi circuit: red, yellow and green LEDs, each with a resistor, wired to GP2, GP3 and GP4, all cathodes wired to GND", caption: "Red on GP2, yellow on GP3, green on GP4, every LED with its own resistor." },
        { type: "teacher", html: "Give 5 minutes for wiring. Check each student's circuit on screen-share before they start coding. A missing resistor or a backwards LED is easier to fix now." },
        { type: "h3", text: "Write the code" },
        { type: "code", label: "traffic.py", code: `from machine import Pin
import time

red_led = Pin(2, Pin.OUT)       # red LED on GP2
yellow_led = Pin(3, Pin.OUT)    # yellow LED on GP3
green_led = Pin(4, Pin.OUT)     # green LED on GP4

while True:
    # Green on, others off: GO
    green_led.value(1)
    yellow_led.value(0)
    red_led.value(0)
    time.sleep(5)

    # Yellow on, others off: GET READY
    green_led.value(0)
    yellow_led.value(1)
    red_led.value(0)
    time.sleep(2)

    # Red on, others off: STOP
    green_led.value(0)
    yellow_led.value(0)
    red_led.value(1)
    time.sleep(5)` },
        { type: "list", items: [
          "<code>red_led = Pin(2, Pin.OUT)</code>: GP2 is an output, and we name it <code>red_led</code>. Good names make code easy to read: from now on <code>red_led</code> means \"the LED on GP2\".",
          "Each block switches <strong>one LED on and the other two off</strong>, then waits.",
          "Why switch the other two off every time? So we never have two lights on together, whatever happened before."
        ] },
        { type: "widget", name: "traffic-light" },
        { type: "teacher", items: [
          "Use the simulator to show the code block that's running. Switch to 3× faster to show the whole cycle quickly.",
          "Ask: <span class=\"say\">How long does one full cycle take?</span> (5 + 2 + 5 = 12 seconds.)",
          "Common bugs: two lights on at once (a <code>value(0)</code> line missing), the wrong color lighting (pin numbers swapped), or <code>NameError</code> (a typo in <code>yellow_led</code>)."
        ] },
        { type: "h3", text: "Bonus: blinking yellow" },
        { type: "p", html: "Some traffic lights blink yellow 3 times before turning red. Change your code so the yellow LED blinks 3 times (0.3 s on, 0.3 s off) instead of staying on for 2 seconds." },
        { type: "code", label: "Bonus: replace the yellow block with this", solution: true, partial: true, code: `    # Yellow blinks 3 times: GET READY
    green_led.value(0)
    red_led.value(0)
    yellow_led.value(1)
    time.sleep(0.3)
    yellow_led.value(0)
    time.sleep(0.3)
    yellow_led.value(1)
    time.sleep(0.3)
    yellow_led.value(0)
    time.sleep(0.3)
    yellow_led.value(1)
    time.sleep(0.3)
    yellow_led.value(0)
    time.sleep(0.3)` },
        { type: "teacher", title: "Running the project online", items: [
          "Give 10 minutes of quiet work after the wiring check. Cameras stay on; students post \"done\" in the chat.",
          "If a student is stuck for more than 3 minutes, ask them to share their screen and read their code aloud.",
          "Early finishers try the blinking-yellow bonus, or change the timings to match a signal near their home."
        ] }
      ]
    },
    {
      id: "wrap", title: "Share screens + quiz",
      lead: "Two or three students demo their traffic light, then everyone answers the quiz in the chat.",
      blocks: [
        { type: "teacher", html: "Ask 2–3 students to share their screen and run their traffic light. Ask each: <span class=\"say\">What was the hardest bug you fixed today?</span>" },
        { type: "quiz", items: [
          { q: "What does LED stand for?", a: "Light Emitting Diode" },
          { q: "Which LED leg goes to the GPIO pin, the long one or the short one?", a: "The long leg (anode, +). The short leg (cathode, −) goes to GND." },
          { q: "Why do we put a 330 Ω resistor with every LED?", a: "To limit the current, so the LED (and the Pico pin) aren't damaged" },
          { q: "What is the difference between <code>red_led.value(1)</code> and <code>red_led.value(0)</code>?", a: "<code>value(1)</code> sets the pin HIGH (3.3 V), LED on; <code>value(0)</code> sets it LOW (0 V), LED off" },
          { q: "In our traffic light, how long is one full cycle?", a: "12 seconds (green 5 + yellow 2 + red 5)" }
        ] },
        { type: "h3", text: "What we learned today" },
        { type: "list", items: [
          "A digital output pin is either HIGH (1, 3.3 V) or LOW (0, 0 V).",
          "An LED needs the right direction and a resistor in series.",
          "<code>Pin(n, Pin.OUT)</code> with <code>value()</code> or <code>on()</code> / <code>off()</code> controls an LED.",
          "A sequence of on/off steps with <code>time.sleep()</code> makes a traffic light."
        ] },
        { type: "callout", html: "<strong>Try at home (optional):</strong> time a real traffic light near your home. How long are its green, yellow and red? Change your code to match." },
        { type: "teacher", html: "Before ending, ask students to save their Wokwi project as <code>traffic-light</code>." }
      ]
    }
  ],

  troubleshooting: [
    { symptom: "LED never lights", cause: "LED backwards, or no wire to GND", fix: "Anode (A, bent leg) to the resistor, cathode (C) to GND. Hover over each leg in Wokwi to check." },
    { symptom: "Wrong LED lights up", cause: "Wire on a different GP pin than the code", fix: "Read the pin label in Wokwi (hover over the Pico pin) and match it to <code>Pin(2)</code>, <code>Pin(3)</code>, <code>Pin(4)</code>." },
    { symptom: "Two lights on at the same time", cause: "A <code>value(0)</code> line missing in one block", fix: "Every block needs one <code>value(1)</code> and two <code>value(0)</code> lines." },
    { symptom: "NameError: name 'yellow_led' isn't defined", cause: "Typo in the name, or the Pin line is missing", fix: "The name must be spelled exactly the same everywhere, including underscores." },
    { symptom: "Wire goes to the wrong place in Wokwi", cause: "Clicked a nearby pin", fix: "Click the wire and press Delete, then draw it again. Zoom in with the mouse wheel." }
  ]
};
