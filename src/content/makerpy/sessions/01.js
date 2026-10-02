// Session 1 — Intro to Raspberry Pi Pico W & MicroPython. FULL lesson, written from the
// "Getting started with Pico" class deck and following the structure of 14.js.
// Everything runs on the Wokwi simulator, so students need no hardware today.

export default {
  number: 1,
  status: "full",
  wiring: "simulation",
  phase: 1,
  module: 1,
  moduleTopic: "Introduction",
  title: "Intro to Raspberry Pi Pico W & MicroPython",
  level: "Beginner",
  electronics: "What is a microcontroller? GPIO pins, voltage levels (3.3V), digital vs analog",
  coding: "Python basics: print(), variables, data types (int, str, bool), MicroPython vs Python",
  activities: [
    { min: 10, text: "Welcome + what is BigBoT MakerPy" },
    { min: 20, text: "Wokwi tour — create account, explore interface" },
    { min: 20, text: "Hello World — blink onboard LED on Wokwi (Pico W: Pin(\"LED\", Pin.OUT))" },
    { min: 5, text: "Recap + quiz" }
  ],
  componentsText: "Wokwi (browser), Raspberry Pi Pico W model, onboard LED",
  output: "Onboard LED blinks on Wokwi simulator",

  // ---------- Full lesson ----------
  mission: "Today every student meets the Raspberry Pi Pico W, sets up their own Wokwi simulator, prints their first message and makes the onboard LED blink.",
  facts: [
    "Runs on <b>Wokwi</b>, no hardware needed",
    "Onboard LED: <b>Pin(\"LED\")</b>"
  ],
  goals: [
    "explain what a microcontroller is, and what the Pico W's GPIO pins, 3.3 V and digital/analog signals mean;",
    "set up a Wokwi account and start a MicroPython project for the Pico;",
    "use <code>print()</code>, variables and the data types <code>int</code>, <code>str</code> and <code>bool</code>;",
    "blink the onboard LED with <code>Pin</code>, <code>while True</code> and <code>time.sleep()</code>, written in three import styles."
  ],
  runsheet: [
    { start: 0, end: 4, id: "hello", title: "Welcome + introductions" },
    { start: 4, end: 7, id: "project", title: "Today's project" },
    { start: 7, end: 12, id: "theory", title: "Pico W, circuits, MicroPython" },
    { start: 12, end: 22, id: "wokwi", title: "Wokwi setup" },
    { start: 22, end: 30, id: "hello-world", title: "Hello World + variables" },
    { start: 30, end: 44, id: "build", title: "Blink the onboard LED" },
    { start: 44, end: 50, id: "challenge", title: "Challenge: fast blink + strobe" },
    { start: 50, end: 55, id: "wrap", title: "Quiz + wrap-up" }
  ],

  components: [
    { name: "Raspberry Pi Pico", detail: "(virtual, in Wokwi; same pins as our Pico W)", qty: 1, type: "virtual", connects: "Wokwi simulator in the browser", usedFor: "Runs our code" },
    { name: "Onboard LED", detail: "on the Pico", qty: 1, type: "virtual", connects: "Pin(\"LED\"), already on the board", usedFor: "Our first blinking light" },
    { name: "Laptop with Chrome", detail: "", qty: 1, type: "tool", connects: "—", usedFor: "Wokwi + video class" },
    { name: "Google account", detail: "(a parent's is fine)", qty: 1, type: "tool", connects: "—", usedFor: "Signing in to Wokwi to save projects" }
  ],
  externalNote: "None today. Everything happens in the Wokwi simulator, so students need no board, wires or parts. If they already have a MakerPy board, they can hold it up to the camera when we talk about the Pico W.",

  parentMessage: `Hi! Welcome to BigBoT MakerPy 🤖
Tomorrow is our first class. Please keep ready:
• A laptop with Google Chrome
• A Google account your child can use to sign in to wokwi.com (a parent's account is fine)
• A working webcam and microphone
No hardware is needed for this class. Please join 5 minutes early so we can check sound and video. Thank you!`,

  prep: [
    "Create your own Wokwi account and run every code block on this page in a Wokwi Pico project, so you know what students will see.",
    "Keep a Wokwi tab open with a fresh MicroPython Pico project, ready to screen-share.",
    "Check the <a href=\"#components\">components list</a>: today students only need a laptop with Chrome and a Google account to sign in to Wokwi.",
    "Send the welcome message below to parents the day before. Ask them to have a Google account ready, because signing up takes the longest if it isn't.",
    "If you have a MakerPy board, keep it next to you to show on camera. Students meet the real board in Session 9."
  ],

  sections: [
    {
      id: "hello", title: "Welcome + introductions",
      lead: "This is the first class, so learn names and make everyone talk before any teaching starts.",
      blocks: [
        { type: "teacher", items: [
          "Greet each student by name. Ask each one: <span class=\"say\">What's your name, and what would you like to build with a robot?</span> With 5 students, this takes about two minutes.",
          "Explain the class rules in one sentence each: cameras on, mute when not speaking, raise a hand or use the chat to ask.",
          "Introduce BigBoT MakerPy: <span class=\"say\">In this course we'll learn electronics and coding together. First on a simulator, then on your own MakerPy board, and by the end you'll build robots.</span>"
        ] }
      ]
    },
    {
      id: "project", title: "Today's project: a blinking status light",
      lead: "We'll make the Pico W's own light blink, the same kind of light that tells you a device is on and working.",
      blocks: [
        { type: "widget", name: "blink" },
        { type: "teacher", html: "Share your screen on the simulator above and leave it blinking while you introduce the project. <span class=\"say\">By the end of today, your own code will do this.</span>" },
        { type: "h3", text: "The real-life problem" },
        { type: "problem", withTitle: "With a status light",
          without: [
            "You can't tell if a charger, router or speaker is switched on, or if it has stopped working.",
            "You can't tell if a phone is charging or already full.",
            "Someone could leave a device running all night without noticing."
          ],
          with: [
            "A small light shows at a glance that the device is on.",
            "Different blinks mean different things: slow blink = charging, steady light = full.",
            "A blinking light grabs attention when something needs you."
          ] },
        { type: "h3", text: "Where the same idea is used" },
        { type: "apps", items: [
          { icon: "🔌", title: "Chargers", text: "A light shows when power is coming in, or when charging is complete." },
          { icon: "📶", title: "Wi-Fi routers", text: "Blinking lights show the internet is working and data is moving." },
          { icon: "🚲", title: "Bicycle lights", text: "Rear lights blink so cars can see the cyclist at night." },
          { icon: "🔥", title: "Smoke alarms", text: "A short blink every minute says \"I'm working, my battery is OK\"." }
        ] },
        { type: "teacher", items: [
          "Ask each student, <span class=\"say\">Which device at home has a blinking light, and what does the blink tell you?</span>",
          "Keep this short; the theory comes next."
        ] },
        { type: "h3", text: "What we'll use", id: "components" },
        { type: "components" }
      ]
    },
    {
      id: "theory", title: "Pico W, circuits and MicroPython",
      blocks: [
        { type: "h3", text: "What is a microcontroller?" },
        { type: "p", html: "A <strong>microcontroller</strong> is a tiny computer on one chip. It doesn't have a screen or keyboard. It runs one program that reads sensors and controls things like lights, buzzers and motors. Washing machines, microwave ovens and toys all have one inside." },
        { type: "p", html: "Our microcontroller board is the <strong>Raspberry Pi Pico W</strong>. Its brain is the <strong>RP2040</strong> chip, with two cores, 264 KB of memory to run programs and 2 MB of storage for our code. The <strong>W</strong> means it also has a Wi-Fi chip. A USB cable powers it and carries our code to it." },
        { type: "image", src: "s01-pico-pinout.png", alt: "Raspberry Pi Pico pinout: 40 pins along both long edges, labelled GP0 to GP28, GND, 3V3, VSYS and VBUS, with the USB port and onboard LED at the top", caption: "The Pico's 40 pins. The green GP labels are the GPIO pins we program." },
        { type: "h3", text: "GPIO pins" },
        { type: "list", items: [
          "<strong>GPIO</strong> means General-Purpose Input/Output. The Pico has 26 of them, labelled GP0–GP22 and GP26–GP28.",
          "<strong>Output</strong>: the pin sends a signal out, for example to switch an LED or a motor on.",
          "<strong>Input</strong>: the pin reads a signal in, for example from a button or a sensor.",
          "<strong>Power pins</strong>: 3V3 gives 3.3 V to parts like sensors, and the GND pins are ground, which completes the circuit."
        ] },
        { type: "callout", html: "<strong>3.3 V rule:</strong> the Pico's pins work at <strong>3.3 volts</strong>. HIGH means about 3.3 V, LOW means 0 V. Connecting 5 V or 9 V to a GPIO pin can damage the Pico." },
        { type: "h3", text: "Digital vs analog" },
        { type: "table", head: ["", "Digital", "Analog"], rows: [
          ["Values", "Only two: HIGH (1) or LOW (0)", "Any level in between, like a dimmer"],
          ["Example", "A light switch: on or off", "A volume knob, or how bright the room is"],
          ["On the Pico", "Every GPIO pin", "Only GP26, GP27 and GP28 can read analog levels"]
        ] },
        { type: "h3", text: "What is a circuit?" },
        { type: "p", html: "A <strong>circuit</strong> is a closed loop that electricity flows around. It needs a power source, a component (like an LED) and a path back to ground. If the loop is broken anywhere, nothing works. Today Wokwi gives us a ready-made circuit inside the Pico; next class we'll build our own." },
        { type: "image", src: "s01-simple-circuit.png", alt: "A 9 volt battery connected in a loop to a 220 ohm resistor and an LED, shown as a picture and as a circuit diagram", caption: "A simple circuit: battery → resistor → LED → back to the battery." },
        { type: "h3", text: "What is MicroPython?" },
        { type: "p", html: "<strong>MicroPython</strong> is a small version of the Python language, made to run on tiny devices with little memory, like the Pico. It works like normal Python, plus it has extra modules such as <code>machine</code> to control the hardware: pins, LEDs, sensors and motors. Other boards that run MicroPython include the ESP32 and ESP8266." },
        { type: "teacher", items: [
          "Keep theory to 5 minutes. Students remember more once they've seen the LED blink, and you'll come back to these ideas all course.",
          "Quick check: <span class=\"say\">If a pin can only be on or off, is it digital or analog?</span> (Digital.)",
          "If a student has a MakerPy board already, ask them to show the Pico W on it to the camera."
        ] }
      ]
    },
    {
      id: "wokwi", title: "Wokwi setup",
      lead: "Wokwi is a free website that simulates the Pico, so students can build circuits and run code without any hardware. Everyone sets it up together.",
      blocks: [
        { type: "steps", items: [
          { title: "Sign up", min: 4, blocks: [
            { type: "p", html: "Go to <a href=\"https://wokwi.com\" target=\"_blank\" rel=\"noopener\">wokwi.com</a>, click <strong>Sign up</strong> at the top right, and choose <strong>Google</strong>." },
            { type: "image", src: "s01-wokwi-signup.png", alt: "Wokwi sign-in window with Google, GitHub and Email buttons" },
            { type: "teacher", items: [
              "Signing up is the slowest part of the class. While students sign in, ask the others to explore the Wokwi home page.",
              "If a student has no Google account available, let them continue without signing in. Wokwi still runs projects; they just can't save them. Fix the account after class with the parent."
            ] }
          ] },
          { title: "Choose the Pi Pico", min: 2, blocks: [
            { type: "p", html: "On the home page, under <strong>Simulate with Wokwi Online</strong>, click <strong>Pi Pico</strong>." },
            { type: "image", src: "s01-wokwi-board.png", alt: "Wokwi board choices: Arduino, ESP32, STM32 and Pi Pico" }
          ] },
          { title: "Start a MicroPython project", min: 2, blocks: [
            { type: "p", html: "Scroll down to <strong>Starter Templates</strong> and choose <strong>MicroPython</strong>." },
            { type: "image", src: "s01-wokwi-templates.png", alt: "Wokwi starter templates for the Pi Pico: Pi Pico, Pi Pico W (beta) and MicroPython" },
            { type: "teacher", html: "Make sure students pick <strong>MicroPython</strong>, not the first \"Pi Pico\" template, which uses a different language. If anyone sees C++ code, go back and choose again." }
          ] },
          { title: "Tour the playground", min: 2, blocks: [
            { type: "p", html: "On the left is the <strong>code editor</strong> (<code>main.py</code>). On the right is the <strong>simulator</strong> with the Pico. The green ▶ button starts the simulation and the terminal at the bottom shows what the program prints." },
            { type: "image", src: "s01-wokwi-playground.png", alt: "Wokwi project: code editor on the left, simulated Pico board on the right, green start button above it" },
            { type: "teacher", html: "Ask everyone to point (with the mouse, on screen-share if needed) to the code editor, the start button and the Pico. Ask one student to share their screen so others can see it's the same." }
          ] }
        ] }
      ]
    },
    {
      id: "hello-world", title: "Hello World + variables",
      lead: "Every programmer's first program prints a message. Then we store information in variables.",
      blocks: [
        { type: "h3", text: "Activity 0: Hello, Pi Pico!" },
        { type: "p", html: "Delete what is in <code>main.py</code>, type this, and click the green ▶ <strong>Start Simulation</strong> button." },
        { type: "code", label: "main.py", code: `import time

time.sleep(0.1)    # wait a moment for the USB connection to be ready
print("Hello, Pi Pico!")` },
        { type: "list", items: [
          "<code>import time</code> brings in the <code>time</code> module, which has tools for waiting and timing.",
          "<code>time.sleep(0.1)</code> pauses for 0.1 seconds, so the message isn't lost before the terminal is ready.",
          "<code>print()</code> shows text, numbers or variables in the terminal."
        ] },
        { type: "teacher", items: [
          "Ask every student to post a screenshot or the terminal line in the chat when they see <code>Hello, Pi Pico!</code>",
          "Then ask them to change the message to their own name and run it again."
        ] },
        { type: "h3", text: "Variables and data types" },
        { type: "p", html: "A <strong>variable</strong> is a labelled box that stores a value. Each value has a <strong>type</strong>:" },
        { type: "code", label: "main.py", code: `name = "Asha"           # str: text, always in quotes
age = 11                # int: a whole number
likes_robots = True     # bool: only True or False

print("Hi, I am", name)
print("Next year I will be", age + 1)
print("I like robots:", likes_robots)
print(type(age))        # shows the type of a variable` },
        { type: "table", head: ["Type", "Stores", "Example"], rows: [
          ["<code>str</code>", "Text", "<code>\"Asha\"</code>"],
          ["<code>int</code>", "Whole numbers", "<code>11</code>"],
          ["<code>bool</code>", "True or False", "<code>True</code>"]
        ] },
        { type: "teacher", items: [
          "Students put in their own name and age. Ask: <span class=\"say\">What happens if you write <code>\"11\" + 1</code>?</span> (An error: you can't add text and a number. Good moment to show why types matter.)",
          "MicroPython vs Python: <span class=\"say\">This is normal Python. MicroPython is the same language, just smaller, with extra tools for hardware, which we use next.</span>"
        ] }
      ]
    },
    {
      id: "build", title: "Blink the onboard LED",
      lead: "We'll write the same blink program three ways. Each uses a different style of import, and students will meet all three in other people's code.",
      blocks: [
        { type: "teacher", html: "On the Pico W, the onboard LED is connected to the Wi-Fi chip, so we always use <code>Pin(\"LED\", Pin.OUT)</code>, not pin 25. Older tutorials use 25 because that was the LED on the original Pico. <code>Pin(\"LED\")</code> works on both the Wokwi Pico and the real Pico W on the MakerPy board, so students learn the version that always works." },
        { type: "steps", items: [
          { title: "Activity 1: import machine", min: 5, blocks: [
            { type: "code", label: "main.py", code: `import machine
import time

# Set up the onboard LED as an output
led = machine.Pin("LED", machine.Pin.OUT)

while True:
    led.on()          # turn the LED on
    time.sleep(1)     # wait 1 second
    led.off()         # turn the LED off
    time.sleep(1)     # wait 1 second` },
            { type: "p", html: "Click ▶. The small LED next to the USB port on the simulated Pico blinks once a second. To stop, click <strong>Stop Simulation</strong>." },
            { type: "h3", text: "What is while True?" },
            { type: "p", html: "<code>while True:</code> is a loop that runs <strong>forever</strong>. It repeats the indented lines inside it until we stop the program, so the LED keeps blinking instead of blinking only once." },
            { type: "callout", html: "<strong>Indentation matters:</strong> the 4 spaces before <code>led.on()</code> tell Python which lines belong inside the loop." },
            { type: "teacher", items: [
              "Type it live while screen-sharing. Explain each line as you type it.",
              "Ask everyone to say \"blink!\" every time their LED turns on. That's a quick way to check all 5 are running.",
              "The most common error is wrong indentation or a missing colon after <code>while True</code>."
            ] }
          ] },
          { title: "Understand the code", min: 3, blocks: [
            { type: "list", items: [
              "<code>import</code> brings in a <strong>module</strong>: a box of ready-made tools, so we don't have to write everything ourselves.",
              "The <code>machine</code> module controls the Pico's hardware: pins, timers and PWM (dimming LEDs, controlling motors).",
              "<code>machine.Pin(name, mode)</code> creates a pin object. <code>Pin.OUT</code> means output (we drive it), <code>Pin.IN</code> means input (we read it).",
              "<code>led.on()</code> sets the pin HIGH (1) and <code>led.off()</code> sets it LOW (0)."
            ] },
            { type: "widget", name: "blink" },
            { type: "teacher", html: "Use the simulator above to show which line is running. Change the ON and OFF times and ask: <span class=\"say\">If I want the LED on longer than off, which number do I change?</span>" }
          ] },
          { title: "Activity 2: from machine import *", min: 3, blocks: [
            { type: "code", label: "main.py", code: `# Import everything from the modules
from machine import *
from time import *

led = Pin("LED", Pin.OUT)

while True:
    led.on()
    sleep(1)     # no "time." needed now
    led.off()
    sleep(1)` },
            { type: "p", html: "<code>from module import *</code> imports <strong>everything</strong>, so we can write <code>Pin</code> and <code>sleep</code> without the module name in front. Shorter, and handy for quick experiments." },
            { type: "callout", html: "With many modules, <code>import *</code> gets confusing: you can't tell which module a name came from. Activity 3 is the better habit." }
          ] },
          { title: "Activity 3: import only what you need", min: 3, blocks: [
            { type: "code", label: "main.py", code: `from machine import Pin    # only the Pin class
import time                # for delays

led = Pin("LED", Pin.OUT)

while True:
    led.on()          # LED on
    time.sleep(1)     # wait 1 second
    led.off()         # LED off
    time.sleep(1)     # wait 1 second` },
            { type: "p", html: "<code>from machine import Pin</code> imports only what we use. The code stays short, uses less memory, and anyone reading it knows exactly where <code>Pin</code> came from. <strong>We'll use this style for the rest of the course.</strong>" },
            { type: "teacher", html: "Ask: <span class=\"say\">All three programs do the same thing. Which one would you choose, and why?</span> Accept any reason; then explain why we pick Activity 3." }
          ] }
        ] }
      ]
    },
    {
      id: "challenge", title: "Challenge: fast blink + strobe",
      lead: "Two short tasks. Students work on their own, cameras on, and post in the chat when done.",
      blocks: [
        { type: "h3", text: "Task 1: make the LED blink faster" },
        { type: "details", summary: "Hint", html: "<p>The number inside <code>time.sleep()</code> is the waiting time in seconds. What happens if you make it smaller?</p>" },
        { type: "code", label: "Task 1 solution", solution: true, code: `from machine import Pin
import time

led = Pin("LED", Pin.OUT)

while True:
    led.on()
    time.sleep(0.2)     # shorter wait = faster blink
    led.off()
    time.sleep(0.2)` },
        { type: "h3", text: "Task 2: strobe effect" },
        { type: "p", html: "Make the LED flash very fast <strong>20 times</strong>, then stop and print a message." },
        { type: "details", summary: "Hint", html: "<p>Use a variable to count the flashes. Start it at 0, add 1 after every flash, and keep looping only while the count is less than 20: <code>while count &lt; 20:</code></p>" },
        { type: "code", label: "Task 2 solution", solution: true, code: `from machine import Pin
import time

led = Pin("LED", Pin.OUT)
count = 0                  # how many flashes so far

while count < 20:
    led.on()
    time.sleep(0.05)
    led.off()
    time.sleep(0.05)
    count = count + 1      # one more flash done

print("Strobe finished after", count, "flashes")` },
        { type: "teacher", title: "Running the challenge online", items: [
          "Give 5 minutes. Most students will finish Task 1 quickly; Task 2 uses variables from earlier, so connect it back.",
          "Whoever finishes Task 2 first shares their screen and explains how their counter works.",
          "If a student's strobe never stops, they probably forgot <code>count = count + 1</code>, or put it outside the loop (wrong indentation)."
        ] }
      ]
    },
    {
      id: "wrap", title: "Quiz + wrap-up",
      lead: "Everyone answers in the chat at the same time, then reveal the answer.",
      blocks: [
        { type: "quiz", items: [
          { q: "What is the name of the chip that is the Pico's brain?", a: "RP2040" },
          { q: "What voltage do the Pico's GPIO pins work at?", a: "3.3 V" },
          { q: "Which line sets up the Pico W's onboard LED?", a: "<code>led = Pin(\"LED\", Pin.OUT)</code>" },
          { q: "What does <code>while True:</code> do?", a: "Repeats the code inside it forever, until we stop the program" },
          { q: "What type of data is <code>True</code>? And <code>\"Asha\"</code>?", a: "<code>True</code> is a bool, <code>\"Asha\"</code> is a str (text)" }
        ] },
        { type: "h3", text: "What we learned today" },
        { type: "list", items: [
          "A microcontroller is a tiny computer that controls hardware. Ours is the Raspberry Pi Pico W, and its pins work at 3.3 V.",
          "Wokwi lets us run Pico projects in the browser, without hardware.",
          "<code>print()</code> shows messages, and variables store values of types like <code>int</code>, <code>str</code> and <code>bool</code>.",
          "<code>Pin(\"LED\", Pin.OUT)</code>, <code>while True</code> and <code>time.sleep()</code> make the onboard LED blink."
        ] },
        { type: "callout", html: "<strong>Try at home (optional):</strong> make the LED blink an SOS signal: 3 short, 3 long, 3 short flashes." },
        { type: "p", html: "<strong>Next session:</strong> external LEDs. We'll connect our own LEDs and resistors in Wokwi and build a traffic light." },
        { type: "teacher", html: "Before ending, ask signed-in students to click <strong>Save</strong> in Wokwi and name the project <code>blink</code>. Note anyone who couldn't sign up, and message their parent after class." }
      ]
    }
  ],

  troubleshooting: [
    { symptom: "Can't sign up to Wokwi", cause: "No Google account available, or a school account that blocks sign-ins", fix: "Continue without signing in for today (projects can't be saved). Ask the parent to sign in after class." },
    { symptom: "Code editor shows C++ code (void setup)", cause: "Picked the wrong starter template", fix: "Go back to wokwi.com → Pi Pico → Starter Templates → MicroPython." },
    { symptom: "IndentationError", cause: "Missing or mixed spaces inside <code>while True:</code>", fix: "Each line inside the loop needs exactly 4 spaces in front." },
    { symptom: "SyntaxError on the while line", cause: "Missing colon", fix: "It must be <code>while True:</code> with a capital T and a colon." },
    { symptom: "LED doesn't blink, no error", cause: "Simulation not started, or <code>sleep</code> missing so it blinks too fast to see", fix: "Click the green ▶ button. Check both <code>time.sleep()</code> lines are there." },
    { symptom: "NameError: name 'sleep' isn't defined", cause: "Used <code>sleep(1)</code> with <code>import time</code>", fix: "Write <code>time.sleep(1)</code>, or use <code>from time import *</code> as in Activity 2." }
  ]
};
