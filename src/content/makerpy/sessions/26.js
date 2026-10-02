// Session 26 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 26,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 10,
  "moduleTopic": "Ultrasonic Robot",
  "title": "Obstacle-Avoiding Robot",
  "level": "Advanced",
  "electronics": "Sensor-actuator feedback loop, obstacle avoidance logic, motor direction timing",
  "coding": "Functions for each movement (forward/backward/left/right/stop), nested if logic, timing control",
  "activities": [
    {
      "min": 10,
      "text": "Theory — robot obstacle avoidance algorithm"
    },
    {
      "min": 20,
      "text": "Mount ultrasonic + motors on robot chassis"
    },
    {
      "min": 20,
      "text": "Code + test obstacle avoidance in corridor"
    },
    {
      "min": 5,
      "text": "Demo race"
    }
  ],
  "componentsText": "DC motors x2 (J5 / J6), HC-SR04 (Trig GPIO 21, Echo GPIO 22 via divider), onboard TB6612FNG, MakerPy board, 9V adapter, robot chassis",
  "output": "Robot that stops and turns when obstacle detected"
};
