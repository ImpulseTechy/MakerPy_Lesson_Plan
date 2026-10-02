// Session 3 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 3,
  "status": "outline",
  "wiring": "simulation",
  "phase": 1,
  "module": 1,
  "moduleTopic": "Digital Input",
  "title": "Digital Input — Push Button",
  "level": "Beginner",
  "electronics": "What is digital input? Pull-up vs pull-down resistors, button debounce concept",
  "coding": "if/else statements, Pin.IN, Pin.PULL_DOWN, .value() method, conditional logic",
  "activities": [
    {
      "min": 10,
      "text": "Theory — digital input, pull-up/pull-down"
    },
    {
      "min": 20,
      "text": "Wokwi — button controls LED (if/else)"
    },
    {
      "min": 20,
      "text": "3 buttons → 3 LEDs (RGB mapping)"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "Wokwi, push buttons x3, LEDs x3, resistors",
  "output": "Button-controlled LED on Wokwi"
};
