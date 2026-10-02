// Session 11 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 11,
  "status": "outline",
  "wiring": "onboard",
  "phase": 2,
  "module": 5,
  "moduleTopic": "Digital Input",
  "title": "Push Buttons on MakerPy",
  "level": "Beginner",
  "electronics": "External pull-up resistors on PCB (10kΩ), active-LOW logic, button bounce",
  "coding": "Pin.IN (no PULL_DOWN needed), value()==0 means pressed, debounce with time.sleep()",
  "activities": [
    {
      "min": 10,
      "text": "Theory — PCB pull-ups vs software pull-downs"
    },
    {
      "min": 20,
      "text": "Button controls RGB LED color"
    },
    {
      "min": 20,
      "text": "3-button RGB mixer (each button = one color channel)"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "MakerPy board (buttons GPIO 4/5/6, RGB GPIO 18/19/20)",
  "output": "3-button RGB color mixer"
};
