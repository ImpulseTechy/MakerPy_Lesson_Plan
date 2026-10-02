// Session 24 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 24,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 10,
  "moduleTopic": "IR Sensor",
  "title": "IR Obstacle Detection Sensor",
  "level": "Intermediate",
  "electronics": "Infrared light, IR LED + photodiode pair, digital output when obstacle detected, GPIO 2",
  "coding": "Pin.IN, digital read, if/else obstacle logic, controlling buzzer + LED from IR input",
  "activities": [
    {
      "min": 10,
      "text": "Theory — IR reflection, how module works"
    },
    {
      "min": 20,
      "text": "Wire IR sensor to GPIO 2, test obstacle detection"
    },
    {
      "min": 20,
      "text": "IR triggers buzzer + red LED; green LED when clear"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "IR sensor module (power from 3.3V), breadboard, MakerPy board (GPIO 2, buzzer GPIO 7, RGB)",
  "output": "Obstacle alarm system with LED + buzzer feedback"
};
