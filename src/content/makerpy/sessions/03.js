// Session 3 — Digital Input: Push Button. FULL lesson, written from the
// "Digital input with Pico" class deck and following the structure of 14.js.
// Everything runs on the Wokwi simulator. GP0/GP16/GP17 are fine in Wokwi, but on the real
// MakerPy board those pins are taken (LCD SDA, motor driver): see the teacher note in "build".

export default {
  number: 3,
  status: "full",
  wiring: "simulation",
  phase: 1,
  module: 1,
  moduleTopic: "Digital Input",
  title: "Digital Input — Push Button",
  level: "Beginner",
  electronics: "What is digital input? Pull-up vs pull-down resistors, button debounce concept",
  coding: "if/else statements, Pin.IN, Pin.PULL_DOWN, .value() method, conditional logic",
  activities: [
    { min: 10, text: "Theory — digital input, pull-up/pull-down" },
    { min: 20, text: "Wokwi — button controls LED (if/else)" },
    { min: 20, text: "3 buttons → 3 LEDs (RGB mapping)" },
    { min: 5, text: "Recap" }
  ],
  componentsText: "Wokwi, push buttons x3, LEDs x3, resistors",
  output: "Button-controlled LED on Wokwi",

  // ---------- Full lesson ----------
  mission: "Today every student teaches the Pico to listen: a push button tells it when to switch an LED on, and they build a pedestrian crossing button.",
  facts: [
    "Button on <b>GP0</b>, LEDs on <b>GP16 / GP17</b>",
    "<b>Pin.IN</b> + <b>Pin.PULL_DOWN</b>"
  ],
  goals: [
    "explain digital input: the Pico reads a pin as 1 (HIGH, 3.3 V) or 0 (LOW, 0 V);",
    "explain pull-down and pull-up resistors, and the difference between active HIGH and active LOW buttons;",
    "read a button with <code>Pin(0, Pin.IN, Pin.PULL_DOWN)</code> and <code>button.value()</code>;",
    "use <code>if / else</code> to make decisions, and build a pedestrian crossing and a toggle switch."
  ],
  runsheet: [
    { start: 0, end: 3, id: "hello", title: "Hello + Wokwi check" },
    { start: 3, end: 6, id: "recap", title: "Recap Session 2" },
    { start: 6, end: 10, id: "project", title: "Today's project + components" },
    { start: 10, end: 18, id: "theory", title: "Digital input, pull-up/pull-down" },
    { start: 18, end: 32, id: "build", title: "Guided build: button + LED" },
    { start: 32, end: 50, id: "challenge", title: "Challenges: crossing + emergency light" },
    { start: 50, end: 55, id: "wrap", title: "Quiz + wrap-up" }
  ],

  components: [
    { name: "Raspberry Pi Pico", detail: "(virtual, in Wokwi)", qty: 1, type: "virtual", connects: "Wokwi simulator in the browser", usedFor: "Runs our code" },
    { name: "Push button", detail: "", qty: 1, type: "virtual", connects: "One side to 3V3, other side to GP0", usedFor: "Our digital input" },
    { name: "LEDs", detail: "red, green", qty: 2, type: "virtual", connects: "Anode through a resistor to GP16 (red) / GP17 (green), cathode to GND", usedFor: "Light controlled by the button" },
    { name: "Resistors", detail: "330 Ω", qty: 2, type: "virtual", connects: "In series with each LED", usedFor: "Protect the LEDs" },
    { name: "Laptop with Chrome", detail: "+ Wokwi account", qty: 1, type: "tool", connects: "—", usedFor: "Wokwi + video class" }
  ],
  externalNote: "None to buy or keep ready. The button, LEDs and resistors are virtual parts students add in Wokwi.",

  parentMessage: `Hi! Tomorrow's BigBoT MakerPy class is about buttons 🔘
We'll make the Pico react when a button is pressed, and build a pedestrian crossing.
Please keep ready:
• Laptop with Google Chrome
• Your child signed in to wokwi.com
• Webcam and microphone working
No hardware is needed for this class. Please join 5 minutes early. Thank you!`,

  prep: [
    "Build the button + LED circuit in your own Wokwi project and run every code block on this page, including both challenges.",
    "Keep two Wokwi tabs ready to screen-share: an empty MicroPython Pico project and your finished pedestrian crossing as a backup demo.",
    "Practise wiring the Wokwi push button: its two top legs are joined together, and so are its two bottom legs. Pressing it connects top to bottom.",
    "Check the <a href=\"#components\">components list</a>: everything is virtual today.",
    "Send the reminder message below to parents the day before."
  ],

  sections: [
    {
      id: "hello", title: "Hello + Wokwi check",
      lead: "Get all 5 students signed in to Wokwi before teaching starts.",
      blocks: [
        { type: "teacher", items: [
          "Greet each student by name. Ask: <span class=\"say\">Did anyone time a real traffic light at home? How long was the red?</span>",
          "Ask everyone to open wokwi.com, sign in and start a new MicroPython Pico project.",
          "If someone can't connect, start the recap and help them while others answer."
        ] }
      ]
    },
    {
      id: "recap", title: "Do you remember?",
      lead: "Last session we connected external LEDs and built a traffic light. Ask one student per question.",
      blocks: [
        { type: "quiz", items: [
          { q: "How do we set a pin up to <em>send</em> a signal to an LED?", a: "<code>Pin(2, Pin.OUT)</code>: <code>Pin.OUT</code> makes it an output" },
          { q: "Which LED leg goes to the pin?", a: "The long leg (anode, +), through a resistor. The short leg goes to GND." },
          { q: "What do <code>value(1)</code> and <code>value(0)</code> do on an output pin?", a: "1 = HIGH (3.3 V), LED on. 0 = LOW (0 V), LED off." }
        ] },
        { type: "teacher", html: "Bridge to today: <span class=\"say\">So far the Pico only talks: it switches LEDs on and off. Today it learns to listen, and reacts when we press a button.</span>" }
      ]
    },
    {
      id: "project", title: "Today's project: a button that controls a light",
      lead: "Press the button, the LED turns on. Release it, the LED turns off. Then we turn it into a pedestrian crossing.",
      blocks: [
        { type: "widget", name: "crossing" },
        { type: "teacher", html: "Share your screen on this demo and ask a student to tell you when to press. <span class=\"say\">By the end of class, you'll build this crossing yourself.</span>" },
        { type: "h3", text: "The real-life problem" },
        { type: "problem", withTitle: "With a button input",
          without: [
            "A machine that can't take input runs the same way all the time, whatever people need.",
            "At a crossing with no button, people wait through full cycles even when no one is crossing.",
            "A lift without buttons wouldn't know which floor you want."
          ],
          with: [
            "The machine reacts the moment a person presses the button.",
            "The crossing only stops cars when someone actually wants to cross.",
            "One small button tells the computer exactly what we want."
          ] },
        { type: "h3", text: "Where the same idea is used" },
        { type: "apps", items: [
          { icon: "🔔", title: "Doorbells", text: "Press the button, the bell rings. A digital input in its simplest form." },
          { icon: "🛗", title: "Lift buttons", text: "Each floor button is an input that tells the lift's controller where to go." },
          { icon: "🎮", title: "Game controllers", text: "Every button is read as pressed (1) or not pressed (0), many times a second." },
          { icon: "🚸", title: "Crossing buttons", text: "Pedestrians press a button to ask for the green walking light." }
        ] },
        { type: "h3", text: "Components we'll use", id: "components" },
        { type: "components" }
      ]
    },
    {
      id: "theory", title: "Digital input, pull-up and pull-down",
      blocks: [
        { type: "h3", text: "What is digital input?" },
        { type: "p", html: "<strong>Digital input</strong> means the Pico checks whether something is on or off, like a yes/no question. It reads the voltage on a pin:" },
        { type: "table", head: ["Reading", "Voltage", "Means"], rows: [
          ["<code>1</code> (HIGH)", "3.3 V", "There is a signal, like a switch turned on"],
          ["<code>0</code> (LOW)", "0 V", "No signal, like a switch turned off"]
        ] },
        { type: "p", html: "Last class, <code>Pin.OUT</code> made a pin <em>send</em> a signal. Today <code>Pin.IN</code> makes a pin <em>receive</em> one, and <code>button.value()</code> tells us whether it's 1 or 0." },
        { type: "h3", text: "What is a push button?" },
        { type: "p", html: "A <strong>push button</strong> is a switch. When you press it, it connects two points in the circuit and electricity can flow. When you release it, the connection breaks." },
        { type: "h3", text: "Pull-down and pull-up resistors" },
        { type: "p", html: "When the button is <em>not</em> pressed, the pin isn't connected to anything. It \"floats\" and can read random 1s and 0s. A <strong>pull resistor</strong> holds it at a fixed value until the button is pressed. The Pico has them built in, so no extra part is needed:" },
        { type: "table", head: ["", "Pull-down: <code>Pin.PULL_DOWN</code>", "Pull-up: <code>Pin.PULL_UP</code>"], rows: [
          ["Button wired to", "3.3 V", "GND"],
          ["Not pressed", "0 (LOW)", "1 (HIGH)"],
          ["Pressed", "1 (HIGH)", "0 (LOW)"],
          ["Called", "<strong>Active HIGH</strong>", "<strong>Active LOW</strong>"],
          ["Code checks", "<code>button.value() == 1</code>", "<code>button.value() == 0</code>"]
        ] },
        { type: "widget", name: "button" },
        { type: "teacher", items: [
          "Share your screen on the button lab. Hold the button in <em>Active HIGH</em> mode, then switch to <em>Active LOW</em> and hold again. Ask: <span class=\"say\">The LED does the same thing both times. What changed?</span> (The number the Pico reads: 1 when pressed vs 0 when pressed.)",
          "Active LOW matters: the three buttons on the real MakerPy board (GPIO 4/5/6) are wired with pull-ups, so they read 0 when pressed. Students will meet them in Session 11."
        ] },
        { type: "h3", text: "Other digital inputs" },
        { type: "image", src: "s03-digital-sensors.png", alt: "Four digital sensors: a PIR motion sensor, an IR obstacle sensor, a limit switch and a tilt sensor", caption: "These sensors also answer yes/no: motion or not, obstacle or not, touched or not, tilted or not." }
      ]
    },
    {
      id: "build", title: "Guided build: button + LED",
      lead: "Students build along with you, one step at a time. Wait until all 5 are done before moving on.",
      blocks: [
        { type: "steps", items: [
          { title: "Wire the circuit in Wokwi", min: 5, blocks: [
            { type: "list", items: [
              "Add a <strong>Pushbutton</strong>: one top leg → <strong>GP0</strong>, one bottom leg → <strong>3V3</strong>.",
              "Add an LED and a 330 Ω resistor: <strong>GP16</strong> → resistor → LED anode (+), LED cathode (−) → <strong>GND</strong>."
            ] },
            { type: "image", src: "s03-button-circuit.png", alt: "Wokwi circuit: a push button wired to GP0 and 3V3, and a red LED with a resistor wired to GP16 and GND", caption: "Button: 3V3 → button → GP0. LED: GP16 → resistor → LED → GND. The 10 kΩ resistor from GP0 to GND in this picture is an external pull-down; with Pin.PULL_DOWN in the code it's optional." },
            { type: "teacher", items: [
              "GP0 is the very first pin (top left). GP16 is pin 21, bottom right. 3V3 is pin 36 on the right side.",
              "The Wokwi button's top legs are joined together, and so are its bottom legs. If a student wires both wires to the top legs, pressing changes nothing."
            ] }
          ] },
          { title: "Print the button state", min: 4, blocks: [
            { type: "code", label: "main.py", code: `from machine import Pin
import time

button = Pin(0, Pin.IN, Pin.PULL_DOWN)   # GP0 is an input, held LOW until pressed

while True:
    if button.value() == 1:    # 1 = pressed (active HIGH)
        print("Button pressed")
    else:
        print("Button released")
    time.sleep(0.5)            # check twice a second` },
            { type: "p", html: "Run it, then click and hold the button in the simulator. The terminal changes from <em>released</em> to <em>pressed</em>." },
            { type: "teacher", items: [
              "<code>Pin.IN</code> is the opposite of <code>Pin.OUT</code>: the pin listens instead of talking.",
              "Ask: <span class=\"say\">Why do we need Pin.PULL_DOWN?</span> (So the pin reads 0, not random values, when the button isn't pressed.)",
              "Quick check: everyone holds the button and types \"pressed\" in the chat when the terminal shows it."
            ] }
          ] },
          { title: "Control the LED with the button", min: 5, blocks: [
            { type: "code", label: "main.py", code: `from machine import Pin
import time

button = Pin(0, Pin.IN, Pin.PULL_DOWN)   # button on GP0
led = Pin(16, Pin.OUT)                   # LED on GP16

while True:
    if button.value() == 1:    # button pressed?
        led.on()               # yes: LED on
    else:
        led.off()              # no: LED off
    time.sleep(0.1)            # small delay` },
            { type: "h3", text: "Making decisions with if and else" },
            { type: "list", items: [
              "<code>if</code> checks a question that is True or False: <em>is the button pressed?</em> If True, it runs the indented lines below it.",
              "<code>else</code> runs when the question is False: <em>the button isn't pressed</em>.",
              "<code>==</code> means \"is equal to\" (a question). A single <code>=</code> stores a value in a variable."
            ] },
            { type: "teacher", items: [
              "Common mistake: <code>if button.value() = 1:</code> with one <code>=</code>. Python gives a SyntaxError. Use it as a teaching moment.",
              "Ask: <span class=\"say\">How would you make the LED turn OFF when you press the button?</span> (Swap <code>led.on()</code> and <code>led.off()</code>.)"
            ] }
          ] }
        ] },
        { type: "teacher", title: "Real MakerPy board: different pins", html: "On Wokwi any GPIO pin works. On the real MakerPy board, GPIO 0 is the LCD's SDA line and GPIO 16/17 drive the motor driver, so don't use them for this circuit. The board has its own three buttons on GPIO 4/5/6 (active LOW) and an RGB LED on GPIO 18/19/20, which students use from Session 10." }
      ]
    },
    {
      id: "challenge", title: "Challenges: pedestrian crossing + emergency light",
      lead: "Two real-life systems. Students work on their own with cameras on, and post in the chat when done.",
      blocks: [
        { type: "h3", text: "Challenge 1: pedestrian crossing button" },
        { type: "p", html: "The red LED is on. When someone presses the button, the red light turns off and a <strong>green LED</strong> turns on for <strong>10 seconds</strong> so people can cross. Then it goes back to red." },
        { type: "list", items: [
          "Keep the red LED on <strong>GP16</strong>.",
          "Add a green LED with a 330 Ω resistor on <strong>GP17</strong> (pin 22, next to GP16)."
        ] },
        { type: "widget", name: "crossing" },
        { type: "details", summary: "Hint", html: "<p>Before the loop, switch red on and green off. Inside the loop, use <code>if button.value() == 1:</code> and put four steps inside it: red off, green on, wait 10 seconds, green off and red on again.</p>" },
        { type: "code", label: "Challenge 1 solution", solution: true, code: `from machine import Pin
import time

button = Pin(0, Pin.IN, Pin.PULL_DOWN)   # crossing button
red_led = Pin(16, Pin.OUT)               # red: wait
green_led = Pin(17, Pin.OUT)             # green: cross

red_led.on()          # start with red on
green_led.off()

while True:
    if button.value() == 1:    # someone pressed the button
        red_led.off()
        green_led.on()
        time.sleep(10)         # 10 seconds to cross
        green_led.off()
        red_led.on()
    time.sleep(0.1)            # check the button 10 times a second` },
        { type: "teacher", items: [
          "The deck's answer slide waits 5 seconds but the task says 10. This solution uses 10.",
          "Ask: <span class=\"say\">What happens if someone presses the button again while it's green?</span> (Nothing: the Pico is busy in <code>sleep(10)</code>, so it doesn't check the button. The demo above works the same way.)",
          "The <code>time.sleep(0.1)</code> at the end also helps with <strong>button bounce</strong>: a real button's metal contacts flicker on and off for a few milliseconds when pressed. A short delay means we don't read that flicker as many presses."
        ] },
        { type: "h3", text: "Challenge 2: emergency exit light (toggle)" },
        { type: "p", html: "Press the button once: the red emergency light turns <strong>on and stays on</strong>. Press it again: it turns off. This time, use an <strong>active LOW</strong> button." },
        { type: "list", items: [
          "Rewire the button: move the wire from <strong>3V3</strong> to <strong>GND</strong>. If you added the 10 kΩ resistor, remove it.",
          "In the code, use <code>Pin.PULL_UP</code> and check for <code>button.value() == 0</code>."
        ] },
        { type: "details", summary: "Hint", html: "<p>Use a variable <code>led_state = False</code> to remember whether the light is on. On each press, flip it with <code>led_state = not led_state</code>. Then wait until the button is released, so one press only counts once.</p>" },
        { type: "code", label: "Challenge 2 solution", solution: true, code: `from machine import Pin
import time

button = Pin(0, Pin.IN, Pin.PULL_UP)   # button to GND: active LOW
led = Pin(16, Pin.OUT)                 # emergency light
led_state = False                      # is the light on?
led.off()

while True:
    if button.value() == 0:            # pressed (active LOW reads 0)
        led_state = not led_state      # flip: False -> True, True -> False
        led.value(led_state)
        while button.value() == 0:     # wait until the button is released
            time.sleep(0.01)
        time.sleep(0.05)               # ignore bounce on release
    time.sleep(0.01)` },
        { type: "teacher", items: [
          "<code>not</code> flips a bool: <code>not False</code> is <code>True</code>. That's what makes it a toggle.",
          "The deck's answer waits 0.3 s instead of waiting for release. Holding the button there makes the light flicker on and off. Show both and ask which is better.",
          "Use the <em>Toggle</em> mode in the <a href=\"#theory\">button lab</a> to show how it should behave.",
          "If the LED never turns on, the student most likely kept the button wired to 3V3, or left the 10 kΩ pull-down in place."
        ] }
      ]
    },
    {
      id: "wrap", title: "Quiz + wrap-up",
      lead: "Everyone answers in the chat at the same time, then reveal the answer.",
      blocks: [
        { type: "quiz", items: [
          { q: "What is the difference between <code>Pin.IN</code> and <code>Pin.OUT</code>?", a: "<code>Pin.IN</code> reads a signal (button), <code>Pin.OUT</code> sends a signal (LED)" },
          { q: "With <code>Pin.PULL_DOWN</code>, what does <code>button.value()</code> read when the button is pressed?", a: "1 (HIGH): active HIGH" },
          { q: "With <code>Pin.PULL_UP</code>, what does it read when the button is pressed?", a: "0 (LOW): active LOW" },
          { q: "When does the code inside <code>else:</code> run?", a: "When the <code>if</code> condition is False" },
          { q: "What is button bounce, and how did we deal with it?", a: "The contacts flicker on/off for a moment when pressed. A short <code>sleep()</code> (or waiting for release) stops one press counting as many." }
        ] },
        { type: "h3", text: "What we learned today" },
        { type: "list", items: [
          "Digital input reads a pin as 1 (HIGH) or 0 (LOW) with <code>Pin.IN</code> and <code>value()</code>.",
          "Pull-down resistors make a button active HIGH; pull-up resistors make it active LOW.",
          "<code>if / else</code> lets the code decide what to do.",
          "We built a pedestrian crossing and a toggle switch."
        ] },
        { type: "callout", html: "<strong>Try at home (optional):</strong> count button presses. Print <code>Presses: 1</code>, <code>Presses: 2</code>… each time the button is pressed." },
        { type: "p", html: "<strong>Next session:</strong> analog input. Instead of just on/off, we'll read a knob that can be anywhere in between." },
        { type: "teacher", html: "Before ending, ask students to save their Wokwi project as <code>button-crossing</code>." }
      ]
    }
  ],

  troubleshooting: [
    { symptom: "Pressing the button changes nothing", cause: "Both wires on legs that are joined inside the button", fix: "Wokwi's top two legs are connected; so are the bottom two. Use one top leg and one bottom leg." },
    { symptom: "Terminal shows random pressed/released", cause: "No pull resistor (<code>Pin.PULL_DOWN</code> missing), so the pin floats", fix: "Write <code>Pin(0, Pin.IN, Pin.PULL_DOWN)</code>." },
    { symptom: "Always shows pressed", cause: "Button wired to GND with <code>PULL_DOWN</code>, or wired straight to 3V3", fix: "For active HIGH: button between 3V3 and GP0. For active LOW: button between GND and GP0 with <code>PULL_UP</code>." },
    { symptom: "SyntaxError on the if line", cause: "<code>=</code> instead of <code>==</code>, or a missing colon", fix: "It must be <code>if button.value() == 1:</code>" },
    { symptom: "Toggle flickers while the button is held", cause: "No wait for release", fix: "Add the <code>while button.value() == 0:</code> loop from the solution." },
    { symptom: "Toggle LED never turns on (Challenge 2)", cause: "Button still wired to 3V3, or the 10 kΩ pull-down is still there", fix: "Button between GP0 and GND, no external resistor, <code>Pin.PULL_UP</code> in code." }
  ]
};
