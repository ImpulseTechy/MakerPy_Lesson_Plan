// Session 29 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 29,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 12,
  "moduleTopic": "Advanced NeoPixel",
  "title": "Advanced NeoPixel Patterns + Sensor Reactive",
  "level": "Advanced",
  "electronics": "WS2812B timing protocol deep dive, color theory (HSV vs RGB), pattern algorithms",
  "coding": "wheel() function, math module, sin() for breathing effect, random module, modular pattern functions",
  "activities": [
    {
      "min": 10,
      "text": "Theory — HSV color model, pattern math"
    },
    {
      "min": 20,
      "text": "Implement 5 patterns: rainbow, breathing, meteor, theater chase, sparkle"
    },
    {
      "min": 20,
      "text": "IR sensor triggers pattern change"
    },
    {
      "min": 5,
      "text": "Light show"
    }
  ],
  "componentsText": "12-LED NeoPixel ring (GPIO 3), IR sensor (GPIO 2), MakerPy board",
  "output": "IR-triggered NeoPixel pattern switcher"
};
