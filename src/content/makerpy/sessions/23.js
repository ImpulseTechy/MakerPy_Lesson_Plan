// Session 23 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 23,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 9,
  "moduleTopic": "Ultrasonic",
  "title": "Ultrasonic Distance Sensor (HC-SR04)",
  "level": "Intermediate",
  "electronics": "Ultrasonic waves, echo time → distance formula: distance = (time × 0.0343) / 2, trigger/echo pins. The 5V Echo signal needs a 1kΩ/2kΩ voltage divider for the 3.3V Pico",
  "coding": "Pin timing with ticks_us(), ticks_diff(), while loops for echo detection, float arithmetic",
  "activities": [
    {
      "min": 10,
      "text": "Theory — ultrasonic sound waves, distance formula"
    },
    {
      "min": 20,
      "text": "Wire HC-SR04 on breadboard (Trig→GPIO 21, Echo→GPIO 22 through 1kΩ/2kΩ divider)"
    },
    {
      "min": 20,
      "text": "Print distance to serial monitor, display on LCD"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "HC-SR04 ultrasonic sensor (or 3.3V HC-SR04P), 1kΩ + 2kΩ resistors, breadboard, MakerPy, LCD",
  "output": "Distance meter displaying cm on LCD"
};
