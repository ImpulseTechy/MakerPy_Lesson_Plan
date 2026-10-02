// Session 4 — Analog Input: Potentiometer & ADC. FULL lesson, written from the
// "Analog input with Pico" class deck and following the structure of 14.js.
// Everything runs on the Wokwi simulator. On the real MakerPy board GPIO 26 is the LM35,
// so a potentiometer goes on the J7 header (GPIO 28) instead: see the teacher note in "build".

export default {
  number: 4,
  status: "full",
  wiring: "simulation",
  phase: 1,
  module: 2,
  moduleTopic: "Analog Input",
  title: "Analog Input — Potentiometer & ADC",
  level: "Beginner",
  electronics: "Analog vs digital signals, ADC (Analog to Digital Converter), voltage divider concept",
  coding: "ADC class, read_u16() (0–65535 range), math mapping, f-strings, print() output",
  activities: [
    { min: 10, text: "Theory — analog signals, ADC on Pico (GPIO 26/27/28)" },
    { min: 20, text: "Wokwi — potentiometer → ADC → print values" },
    { min: 20, text: "LED bar graph — pot value lights 1, 2 or 3 LEDs (threshold mapping)" },
    { min: 5, text: "Recap" }
  ],
  componentsText: "Wokwi, potentiometer, LEDs x3, resistors",
  output: "Potentiometer value displayed in serial monitor",

  // ---------- Full lesson ----------
  mission: "Today every student reads a knob with the Pico's ADC, turns the number into a percentage, and builds a three-color temperature indicator.",
  facts: [
    "Knob on <b>GP26 (ADC0)</b>",
    "<b>read_u16()</b>: 0 to 65535"
  ],
  goals: [
    "explain the difference between digital (on/off) and analog (any level in between) signals;",
    "explain how a potentiometer works as a voltage divider, and how the ADC turns a voltage into a number;",
    "read the knob with <code>ADC(Pin(26))</code> and <code>read_u16()</code>, and turn the reading into a percentage with an f-string;",
    "use <code>if / elif / else</code> to light the right LED for low, medium and high values."
  ],
  runsheet: [
    { start: 0, end: 3, id: "hello", title: "Hello + Wokwi check" },
    { start: 3, end: 6, id: "recap", title: "Recap Session 3" },
    { start: 6, end: 10, id: "project", title: "Today's project + components" },
    { start: 10, end: 18, id: "theory", title: "Analog, ADC, potentiometer" },
    { start: 18, end: 30, id: "build", title: "Guided build: read the knob" },
    { start: 30, end: 50, id: "challenge", title: "Challenge: temperature indicator" },
    { start: 50, end: 55, id: "wrap", title: "Quiz + wrap-up" }
  ],

  components: [
    { name: "Raspberry Pi Pico", detail: "(virtual, in Wokwi)", qty: 1, type: "virtual", connects: "Wokwi simulator in the browser", usedFor: "Runs our code" },
    { name: "Potentiometer", detail: "(rotary knob)", qty: 1, type: "virtual", connects: "VCC → 3V3, SIG → GP26, GND → GND", usedFor: "Our analog input" },
    { name: "LEDs", detail: "red, yellow, green", qty: 3, type: "virtual", connects: "Anode through a resistor to GP2 (red) / GP3 (yellow) / GP4 (green), cathode to GND", usedFor: "Temperature indicator" },
    { name: "Resistors", detail: "330 Ω", qty: 3, type: "virtual", connects: "In series with each LED", usedFor: "Protect the LEDs" },
    { name: "Laptop with Chrome", detail: "+ Wokwi account", qty: 1, type: "tool", connects: "—", usedFor: "Wokwi + video class" }
  ],
  externalNote: "None to buy or keep ready. The potentiometer, LEDs and resistors are virtual parts students add in Wokwi.",

  parentMessage: `Hi! Tomorrow's BigBoT MakerPy class is about knobs and sensors 🎛️
We'll read a turning knob with the Pico and build a temperature indicator.
Please keep ready:
• Laptop with Google Chrome
• Your child signed in to wokwi.com
• Webcam and microphone working
No hardware is needed for this class. Please join 5 minutes early. Thank you!`,

  prep: [
    "Build the potentiometer circuit and the three-LED indicator in your own Wokwi project, and run every code block on this page.",
    "Keep two Wokwi tabs ready to screen-share: an empty MicroPython Pico project and your finished temperature indicator as a backup demo.",
    "In Wokwi, practise turning the potentiometer during the simulation: click it, then drag the knob or use the arrow keys.",
    "Check the <a href=\"#components\">components list</a>: everything is virtual today.",
    "Send the reminder message below to parents the day before."
  ],

  sections: [
    {
      id: "hello", title: "Hello + Wokwi check",
      lead: "Get all 5 students signed in to Wokwi before teaching starts.",
      blocks: [
        { type: "teacher", items: [
          "Greet each student by name. Ask: <span class=\"say\">Did anyone build the press counter at home?</span>",
          "Ask everyone to open wokwi.com, sign in and start a new MicroPython Pico project.",
          "If someone can't connect, start the recap and help them while others answer."
        ] }
      ]
    },
    {
      id: "recap", title: "Do you remember?",
      lead: "Last session we read a push button. Ask one student per question.",
      blocks: [
        { type: "quiz", items: [
          { q: "What does digital input mean?", a: "The Pico reads a pin as only 1 (HIGH) or 0 (LOW): on or off" },
          { q: "How did the button control the LED?", a: "<code>if button.value() == 1:</code> LED on, <code>else:</code> LED off" },
          { q: "With <code>Pin.PULL_UP</code>, what does a pressed button read?", a: "0: active LOW" }
        ] },
        { type: "teacher", html: "Bridge to today: <span class=\"say\">A button can only say yes or no. But how loud is the music? How hot is the room? Today we read things that have many levels.</span>" }
      ]
    },
    {
      id: "project", title: "Today's project: a temperature indicator",
      lead: "A knob stands in for a temperature sensor. Turn it up and the light changes from green (cool) to yellow (comfortable) to red (hot).",
      blocks: [
        { type: "widget", name: "pot" },
        { type: "teacher", html: "Share your screen and drag the knob slowly from left to right. <span class=\"say\">The number goes from 0 to 65535, and the LEDs change as it passes 21845 and 43690. You'll build this today.</span>" },
        { type: "h3", text: "The real-life problem" },
        { type: "problem", withTitle: "With an analog input",
          without: [
            "A fan with only an on/off switch is either full speed or nothing.",
            "A speaker with only on/off would be silent or blasting.",
            "A machine that only knows \"hot\" or \"not hot\" can't warn you before it gets dangerous."
          ],
          with: [
            "A regulator knob picks any speed in between.",
            "A volume knob sets exactly the loudness you want.",
            "The machine knows how hot it is, so it can warn early (yellow) before it's too hot (red)."
          ] },
        { type: "h3", text: "Where the same idea is used" },
        { type: "apps", items: [
          { icon: "🔊", title: "Volume knobs", text: "Turning the knob changes a voltage, and the amplifier reads it." },
          { icon: "🌀", title: "Fan regulators", text: "The knob position decides how fast the fan spins." },
          { icon: "🕹️", title: "Joysticks", text: "Two potentiometers inside measure how far the stick is pushed." },
          { icon: "🌡️", title: "Thermostats", text: "A temperature sensor gives an analog value; the controller compares it with limits." }
        ] },
        { type: "h3", text: "Components we'll use", id: "components" },
        { type: "components" }
      ]
    },
    {
      id: "theory", title: "Analog, ADC and the potentiometer",
      blocks: [
        { type: "h3", text: "What is analog?" },
        { type: "p", html: "<strong>Analog input</strong> means reading a <em>range</em> of values, not just on or off. It's like asking <em>how</em> bright or <em>how</em> loud, instead of yes/no." },
        { type: "table", head: ["", "Digital input", "Analog input"], rows: [
          ["Detects", "Two states: on/off", "A range of values"],
          ["Values", "Only 1 or 0", "Many levels in between"],
          ["Example", "Light switch", "Thermometer: 20 °C, 25 °C, 31 °C…"],
          ["Used for", "Buttons, switches, simple sensors", "Temperature, light and sound sensors, knobs"]
        ] },
        { type: "image", src: "s04-analog-sensors.png", alt: "Four analog parts: rotary and slide potentiometers, an LM35 temperature sensor, an LDR light sensor and a sound sensor module", caption: "All of these give a voltage that can be anywhere between 0 and 3.3 V." },
        { type: "h3", text: "ADC: from voltage to a number" },
        { type: "p", html: "The Pico's brain only understands numbers. The <strong>ADC (Analog to Digital Converter)</strong> measures the voltage on a pin and turns it into a number. <code>read_u16()</code> gives a number from <strong>0</strong> (0 V) to <strong>65535</strong> (3.3 V). 65536 different values is 2<sup>16</sup>, which is why it's called <em>16-bit</em>." },
        { type: "callout", html: "<strong>Only three pins can read analog:</strong> GP26 (ADC0), GP27 (ADC1) and GP28 (ADC2). Every other pin is digital only." },
        { type: "h3", text: "What is a potentiometer?" },
        { type: "p", html: "A <strong>potentiometer</strong> (\"pot\") is a knob with three legs. The outer legs go to 3.3 V and GND. The middle leg, the <strong>wiper</strong>, slides along a resistor inside. It splits the 3.3 V into two parts, like a <strong>voltage divider</strong>: turn one way and the middle gets closer to 3.3 V, turn the other way and it gets closer to 0 V." },
        { type: "image", src: "s04-pot-pins.png", alt: "A blue trimmer potentiometer with its three legs labelled VCC, OUTPUT and GND, next to the potentiometer symbol: a resistor with an arrow (output) pointing at it between Vref and Ground", caption: "Outer legs: VCC and GND. Middle leg: the output voltage that changes as you turn." },
        { type: "teacher", items: [
          "Use the knob lab above to connect the three ideas: knob angle → voltage → number.",
          "Ask: <span class=\"say\">If the knob is exactly halfway, what number do you expect?</span> (About 32768, half of 65535.) Then drag it there to check.",
          "On the real MakerPy board, the LM35 temperature sensor and the LDR light sensor work exactly like this. Students meet them in Sessions 13 and 14."
        ] }
      ]
    },
    {
      id: "build", title: "Guided build: read the knob",
      lead: "Students build along with you, one step at a time. Wait until all 5 are done before moving on.",
      blocks: [
        { type: "steps", items: [
          { title: "Wire the potentiometer", min: 3, blocks: [
            { type: "list", items: [
              "Add a <strong>Potentiometer</strong> in Wokwi.",
              "<strong>GND</strong> → a GND pin, <strong>VCC</strong> → <strong>3V3</strong>, <strong>SIG</strong> (the middle leg) → <strong>GP26</strong>."
            ] },
            { type: "image", src: "s04-pot-circuit.png", alt: "Wokwi circuit: a potentiometer with a black wire to GND, a red wire to 3V3 and a yellow signal wire to GP26", caption: "Black: GND. Red: VCC to 3V3. Yellow: SIG to GP26 (ADC0)." },
            { type: "teacher", html: "GP26 is pin 31 on the right side. Check that VCC goes to <strong>3V3</strong> (pin 36), not VBUS or VSYS (5 V): the Pico's pins only handle 3.3 V." }
          ] },
          { title: "Read raw values", min: 4, blocks: [
            { type: "code", label: "main.py", code: `from machine import ADC, Pin
import time

pot = ADC(Pin(26))    # potentiometer on GP26 (ADC0)

while True:
    pot_value = pot.read_u16()      # a number from 0 to 65535
    print("Raw value:", pot_value)
    time.sleep(0.1)` },
            { type: "p", html: "Run it, then click the potentiometer in the simulator and drag the knob (or use the arrow keys). The numbers change as you turn the knob." },
            { type: "teacher", items: [
              "Explain <code>ADC(Pin(26))</code>: <span class=\"say\">We tell the ADC to measure the voltage on pin 26.</span>",
              "Ask everyone to turn the knob all the way left and all the way right, and post both numbers in the chat. (About 0 and 65535.)"
            ] }
          ] },
          { title: "Turn it into a percentage", min: 5, blocks: [
            { type: "p", html: "65535 isn't easy to understand. Let's <strong>map</strong> it to 0–100 %, and print it with an <strong>f-string</strong>." },
            { type: "code", label: "main.py", code: `from machine import ADC, Pin
import time

pot = ADC(Pin(26))

while True:
    pot_value = pot.read_u16()
    percent = pot_value * 100 // 65535     # map 0-65535 to 0-100
    volts = pot_value * 3.3 / 65535        # map 0-65535 to 0-3.3 V
    print(f"Knob: {percent}%  ({volts:.2f} V)")
    time.sleep(0.2)` },
            { type: "list", items: [
              "<code>percent = pot_value * 100 // 65535</code>: multiply first, then divide. <code>//</code> divides and drops the decimals, so we get a whole number.",
              "An <strong>f-string</strong> starts with <code>f</code> before the quotes. Anything in <code>{ }</code> is replaced by its value, so <code>f\"Knob: {percent}%\"</code> prints <code>Knob: 75%</code>.",
              "<code>{volts:.2f}</code> shows the number with 2 decimal places."
            ] },
            { type: "teacher", html: "Ask: <span class=\"say\">What would you change to map the knob from 0 to 10 instead of 0 to 100?</span> (<code>* 10</code> instead of <code>* 100</code>.)" }
          ] }
        ] },
        { type: "h3", text: "Making more than two choices: elif" },
        { type: "p", html: "<code>if / else</code> chooses between two things. <code>elif</code> (\"else if\") adds more choices. Python checks from the top and runs the <strong>first</strong> block that is True:" },
        { type: "code", label: "Example", code: `if pot_value <= 21845:
    print("low")
elif pot_value <= 43690:
    print("medium")
else:
    print("high")` },
        { type: "teacher", title: "Real MakerPy board: different pins", html: "On Wokwi, GP26 is free. On the real MakerPy board, GPIO 26 is the onboard LM35 temperature sensor and GPIO 27 is the LDR, so a potentiometer plugs into the <strong>J7 header</strong> on GPIO 28 instead (Session 19). GPIO 2/3/4 are also taken on the real board." }
      ]
    },
    {
      id: "challenge", title: "Challenge: temperature indicator",
      lead: "The knob pretends to be a temperature sensor. Light green for low, yellow for medium and red for high.",
      blocks: [
        { type: "list", items: [
          "Add three LEDs with 330 Ω resistors, wired like the traffic light in Session 2: <strong>red → GP2</strong>, <strong>yellow → GP3</strong>, <strong>green → GP4</strong>, all cathodes → GND.",
          "<strong>Green</strong>: low (0–21845). <strong>Yellow</strong>: medium (21846–43690). <strong>Red</strong>: high (43691–65535)."
        ] },
        { type: "callout", html: "Where do the numbers come from? 65535 ÷ 3 = 21845. We split the range into three equal parts." },
        { type: "details", summary: "Hint", html: "<p>Use <code>if pot_value &lt;= 21845:</code>, then <code>elif pot_value &lt;= 43690:</code>, then <code>else:</code>. In each block, turn one LED on and the other two off.</p>" },
        { type: "code", label: "Challenge solution", solution: true, code: `from machine import ADC, Pin
import time

pot = ADC(Pin(26))               # knob on GP26
red_led = Pin(2, Pin.OUT)        # red on GP2
yellow_led = Pin(3, Pin.OUT)     # yellow on GP3
green_led = Pin(4, Pin.OUT)      # green on GP4

while True:
    pot_value = pot.read_u16()
    print("Raw value:", pot_value)

    if pot_value <= 21845:       # low
        green_led.on()
        yellow_led.off()
        red_led.off()
    elif pot_value <= 43690:     # medium
        green_led.off()
        yellow_led.on()
        red_led.off()
    else:                        # high
        green_led.off()
        yellow_led.off()
        red_led.on()

    time.sleep(0.1)` },
        { type: "teacher", items: [
          "The deck puts green on GP2 and red on GP4. Here we keep Session 2's traffic-light wiring (red GP2, yellow GP3, green GP4), so students can reuse that circuit. Either works if the code matches the wires.",
          "Ask: <span class=\"say\">Why don't we need to write <code>pot_value &gt; 21845 and</code> in the elif?</span> (If we reach the elif, the first check was already False, so the value must be above 21845.)",
          "If two LEDs light at once, an <code>off()</code> line is missing in one block."
        ] },
        { type: "h3", text: "Assignment: print a message too" },
        { type: "p", html: "Make the Pico also print a message: low → <code>It's cool!</code>, medium → <code>Comfortable temperature</code>, high → <code>It's hot!</code>" },
        { type: "code", label: "Assignment solution: add one print to each block", solution: true, partial: true, code: `    if pot_value <= 21845:
        green_led.on()
        yellow_led.off()
        red_led.off()
        print("It's cool!")
    elif pot_value <= 43690:
        green_led.off()
        yellow_led.on()
        red_led.off()
        print("Comfortable temperature")
    else:
        green_led.off()
        yellow_led.off()
        red_led.on()
        print("It's hot!")` },
        { type: "h3", text: "Bonus: LED bar graph" },
        { type: "p", html: "Instead of one LED per zone, make a <strong>bar graph</strong>: low lights 1 LED, medium lights 2, high lights all 3. Try the <em>Bar graph</em> mode in the knob lab at the top of the lesson to see how it should look." },
        { type: "code", label: "Bonus solution", solution: true, code: `from machine import ADC, Pin
import time

pot = ADC(Pin(26))
red_led = Pin(2, Pin.OUT)
yellow_led = Pin(3, Pin.OUT)
green_led = Pin(4, Pin.OUT)

while True:
    pot_value = pot.read_u16()
    green_led.value(pot_value > 0)          # True = on, False = off
    yellow_led.value(pot_value > 21845)
    red_led.value(pot_value > 43690)
    time.sleep(0.1)` },
        { type: "teacher", title: "Running the challenge online", items: [
          "Give 5 minutes for wiring, then check circuits on screen-share before students start coding.",
          "Cameras stay on; students post \"done\" in the chat. Whoever finishes first demos by turning the knob slowly through all three colors.",
          "The bar-graph bonus shows a neat trick: a comparison like <code>pot_value &gt; 21845</code> is itself True or False, so it can go straight into <code>value()</code>."
        ] }
      ]
    },
    {
      id: "wrap", title: "Quiz + wrap-up",
      lead: "Everyone answers in the chat at the same time, then reveal the answer.",
      blocks: [
        { type: "quiz", items: [
          { q: "What is the difference between digital and analog input?", a: "Digital is only on/off (1 or 0). Analog can be any level in between." },
          { q: "What does ADC stand for?", a: "Analog to Digital Converter" },
          { q: "What range of numbers does <code>read_u16()</code> give?", a: "0 to 65535 (0 V to 3.3 V)" },
          { q: "Which Pico pins can read analog values?", a: "GP26, GP27 and GP28 (ADC0, ADC1, ADC2)" },
          { q: "The knob reads 30000. Which LED lights in our temperature indicator?", a: "Yellow: 30000 is between 21846 and 43690" }
        ] },
        { type: "h3", text: "What we learned today" },
        { type: "list", items: [
          "Analog signals have many levels; the ADC turns a voltage into a number from 0 to 65535.",
          "A potentiometer is a voltage divider: turning it changes the voltage on its middle leg.",
          "We mapped the reading to a percentage and printed it with an f-string.",
          "<code>if / elif / else</code> chooses between more than two options."
        ] },
        { type: "callout", html: "<strong>Try at home (optional):</strong> make the knob a \"volume meter\" that prints a bar of <code>#</code> characters, e.g. <code>print(\"#\" * (percent // 10))</code>." },
        { type: "p", html: "<strong>Next session:</strong> the RGB LED. We'll mix red, green and blue light to make any color." },
        { type: "teacher", html: "Before ending, ask students to save their Wokwi project as <code>temperature-indicator</code>." }
      ]
    }
  ],

  troubleshooting: [
    { symptom: "Value stays at 0", cause: "SIG wired to the wrong pin, or VCC not connected", fix: "SIG must go to GP26 and VCC to 3V3. Check the code says <code>Pin(26)</code>." },
    { symptom: "Value never changes", cause: "Simulation not running, or the knob isn't being turned", fix: "Start the simulation, then click the potentiometer and drag the knob (or use the arrow keys)." },
    { symptom: "Value goes the opposite way", cause: "VCC and GND swapped", fix: "That's fine electrically, but swap the two outer wires if you want right = higher." },
    { symptom: "ValueError when creating the ADC", cause: "<code>ADC(Pin(…))</code> on a pin without an ADC", fix: "Only 26, 27 and 28 can be ADC pins." },
    { symptom: "Two LEDs on at once", cause: "Missing <code>off()</code> line in one block", fix: "Each block needs one <code>on()</code> and two <code>off()</code> lines." },
    { symptom: "SyntaxError on the print line", cause: "Missing <code>f</code> before the quotes, or a missing <code>}</code>", fix: "It must look like <code>print(f\"Knob: {percent}%\")</code>." }
  ]
};
