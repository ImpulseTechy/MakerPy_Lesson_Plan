// Session 10 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 10,
  "status": "outline",
  "wiring": "onboard",
  "phase": 2,
  "module": 5,
  "moduleTopic": "Digital Output",
  "title": "RGB LED on MakerPy — Real Hardware",
  "level": "Beginner",
  "electronics": "Onboard RGB LED circuit — 100Ω current limiting resistors already on PCB, R = GPIO 18, G = GPIO 19, B = GPIO 20",
  "coding": "Pin.OUT, .value(), set_color() function, Boolean inputs to function, while True",
  "activities": [
    {
      "min": 10,
      "text": "Compare Wokwi RGB circuit vs MakerPy PCB"
    },
    {
      "min": 20,
      "text": "RGB cycle code on MakerPy via MicroLab"
    },
    {
      "min": 20,
      "text": "Rainbow loop + student color challenge"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "MakerPy board, MicroLab, USB cable",
  "output": "RGB LED cycling all colors on MakerPy"
};
