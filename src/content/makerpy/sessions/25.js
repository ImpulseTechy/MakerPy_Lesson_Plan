// Session 25 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 25,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 10,
  "moduleTopic": "Motor + Sensor",
  "title": "Temperature-Based Fan Control",
  "level": "Advanced",
  "electronics": "Automation concept, closed-loop control, motor as actuator, sensor as input",
  "coding": "if/elif/else logic chains, PWM speed control, while True automation loop, threshold variables",
  "activities": [
    {
      "min": 10,
      "text": "Theory — what is automation? Input → Process → Output"
    },
    {
      "min": 20,
      "text": "Connect DC motor + fan blade to J5 M_1 (Motor A, onboard driver)"
    },
    {
      "min": 20,
      "text": "LM35 controls fan speed — cool=slow, hot=fast, danger=stop"
    },
    {
      "min": 5,
      "text": "Demo"
    }
  ],
  "componentsText": "DC motor + fan on J5 M_1, onboard TB6612FNG (Motor A: GPIO 11/12/13, STBY 14), LM35 (GPIO 26), MakerPy board, 9V adapter",
  "output": "Automatic temperature-controlled fan"
};
