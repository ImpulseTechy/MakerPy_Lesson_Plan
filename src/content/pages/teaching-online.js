// Teaching Online Guide — shared by every course. Uses the same block types as lessons.

export default {
  title: "Teaching Online Guide",
  intro: "How we run BigBoT live classes: 5 students, 55 minutes, every student building on their own board at home.",
  sections: [
    {
      id: "new-batch",
      title: "Before a new batch starts",
      lead: "A 10-minute setup call per student before their first class saves you 20 minutes of the class itself.",
      blocks: [
        { type: "list", ordered: true, items: [
          "Join a short video call with the student and a parent.",
          "Check the laptop has Google Chrome, and open MicroLab together.",
          "Plug in the MakerPy board and click Connect. If it isn't found, try a different USB cable: many cables only charge.",
          "Run a one-line test so the onboard LED lights up: <code>from machine import Pin; Pin(\"LED\", Pin.OUT).on()</code>",
          "Agree where the camera will point so you can see the board during class.",
          "Share the class rules below with the parent."
        ] },
        { type: "copytext", label: "Welcome message for parents", text: `Welcome to BigBoT! 🤖
Your child's MakerPy classes are live online, 55 minutes, in a small batch of 5.
For every class, please keep ready:
• MakerPy board + USB data cable
• Laptop with Google Chrome
• A camera (webcam or phone) that can show the board
Please join 5 minutes early. If anything doesn't work, message us before class and we'll help.` }
      ]
    },
    {
      id: "rules",
      title: "Class rules for students",
      lead: "Share these in the first class and repeat them briefly whenever needed.",
      blocks: [
        { type: "list", items: [
          "Camera on, pointed so the teacher can see your board.",
          "Microphone muted unless you're speaking.",
          "Type numbers, errors and answers in the chat so everyone can see them.",
          "Raise your hand (or type ✋) when you're stuck. Being stuck is normal.",
          "Save your code on the board before class ends."
        ] }
      ]
    },
    {
      id: "every-class",
      title: "Every class",
      blocks: [
        { type: "table", head: ["When", "What to do"], rows: [
          ["15 min before", "Run the lesson's code on your own board. Open MicroLab and the lesson page. Check the <strong>Before class</strong> list on the lesson."],
          ["Day before", "Send the lesson's parent reminder, especially when external parts are needed."],
          ["First 3 minutes", "Greet each student by name and check every board is connected."],
          ["During class", "Press <strong>Start class</strong> on the lesson page. The clock shows which part you should be on and how much time is left."],
          ["When screen-sharing", "Switch to <strong>Screen-share view</strong> so answers and solutions are hidden."],
          ["Last 5 minutes", "Quiz in the chat, recap, and a quick look at next session."]
        ] }
      ]
    },
    {
      id: "five",
      title: "Running a batch of 5",
      blocks: [
        { type: "list", items: [
          "<strong>Name every student.</strong> Ask questions to a specific student by name, and rotate so everyone answers in every class.",
          "<strong>Wait for all 5</strong> at each guided step. Ask everyone to show their board or paste their output before moving on.",
          "<strong>Don't let one problem stop the class.</strong> If a student's setup breaks, give the others the next step, then help that student. If it takes more than 3 minutes, note it and follow up after class.",
          "<strong>Use fast finishers.</strong> Give them the bonus task, or ask them to explain their solution to the group.",
          "<strong>Celebrate working projects.</strong> Let each student show their result on camera, even if it's small."
        ] }
      ]
    },
    {
      id: "debugging",
      title: "Fixing problems remotely",
      lead: "You can't touch the student's board, so use these in order.",
      blocks: [
        { type: "list", ordered: true, items: [
          "Ask them to share their screen in MicroLab.",
          "Read the error message together. The line number tells you where to look.",
          "Ask them to read the problem line aloud. Students often spot their own typo this way.",
          "Ask them to point the camera at the board to check cables, connectors and wiring.",
          "Compare their pin numbers with the <a href=\"../makerpy/pin-map/index.html\">Pin Map</a>."
        ] },
        { type: "p", html: "Known problems and fixes are on the <a href=\"../makerpy/troubleshooting/index.html\">Troubleshooting</a> page." }
      ]
    },
    {
      id: "safety",
      title: "Safety",
      blocks: [
        { type: "list", items: [
          "Students unplug the board before changing any wiring.",
          "Never connect 5 V or 9 V to a GPIO pin. Pico GPIO pins are 3.3 V only.",
          "Motor lessons use the 9 V adapter: ask a parent to plug it in.",
          "If anything gets hot or smells, unplug immediately and tell the teacher.",
          "NeoPixel rings are very bright: keep brightness low and don't stare at them."
        ] }
      ]
    },
    {
      id: "after",
      title: "After class",
      blocks: [
        { type: "copytext", label: "After-class message for parents", text: `Hi! Today in BigBoT class we [what we built].
Your child [one specific thing they did well].
Optional practice at home: [home task from the lesson].
Next class: [next session title]. See you then!` },
        { type: "p", html: "Replace the parts in brackets. One specific sentence about the child matters more to parents than a long message." }
      ]
    }
  ]
};
