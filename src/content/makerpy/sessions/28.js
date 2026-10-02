// Session 28 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 28,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 11,
  "moduleTopic": "Multi-Sensor",
  "title": "Multi-Sensor Integration — Environment Monitor",
  "level": "Advanced",
  "electronics": "Sensor array concept, data logging basics, display multiplexing, system architecture",
  "coding": "Dictionaries, formatted output, multiple ADC reads in one loop, LCD multi-line display, round()",
  "activities": [
    {
      "min": 10,
      "text": "Theory — environment monitoring systems"
    },
    {
      "min": 20,
      "text": "Read LM35 + LDR + ultrasonic simultaneously"
    },
    {
      "min": 20,
      "text": "Display all 3 on LCD with labels, LED status indicators"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "MakerPy board, LCD (GPIO 0/1), LM35 (GPIO 26), LDR (GPIO 27), HC-SR04 (GPIO 21/22), breadboard",
  "output": "3-sensor environment dashboard on LCD"
};
