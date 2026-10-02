// Session 16 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 16,
  "status": "outline",
  "wiring": "external",
  "phase": 2,
  "module": 7,
  "moduleTopic": "DC Motors",
  "title": "DC Motor Control — TB6612FNG",
  "level": "Advanced",
  "electronics": "H-bridge motor driver concept, TB6612FNG pinout, STBY pin, IN1/IN2 direction logic, PWM speed",
  "coding": "Multiple PWM objects, Pin.OUT for direction, stby.value(1) CRITICAL, forward/backward/stop functions",
  "activities": [
    {
      "min": 10,
      "text": "Theory — H-bridge, TB6612FNG truth table"
    },
    {
      "min": 20,
      "text": "Motor A forward + backward + stop"
    },
    {
      "min": 20,
      "text": "2-motor robot: forward, backward, left turn, right turn"
    },
    {
      "min": 5,
      "text": "Demo robot movements"
    }
  ],
  "componentsText": "MakerPy board (Motor A → J5 M_1: PWMA GPIO 11, AIN2 GPIO 12, AIN1 GPIO 13 | Motor B → J6 M_2: PWMB GPIO 15, BIN2 GPIO 16, BIN1 GPIO 17 | STBY GPIO 14), 9V adapter, DC motors",
  "output": "2-motor robot with directional control"
};
