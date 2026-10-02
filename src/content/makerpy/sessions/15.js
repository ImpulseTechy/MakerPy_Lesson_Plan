// Session 15 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 15,
  "status": "outline",
  "wiring": "onboard",
  "phase": 2,
  "module": 7,
  "moduleTopic": "Servo Motors",
  "title": "Servo Motor Control",
  "level": "Intermediate",
  "electronics": "Servo motor internals, PWM control signal (50Hz, 1ms–2ms pulse), angle vs duty cycle",
  "coding": "PWM, .freq(50), duty_u16(), set_angle() function, integer mapping, for loop sweep",
  "activities": [
    {
      "min": 10,
      "text": "Theory — servo internals, PWM pulse diagram"
    },
    {
      "min": 20,
      "text": "Single servo sweep 0°→90°→180° on GPIO 8"
    },
    {
      "min": 20,
      "text": "Button-controlled servo position (3 buttons = 3 angles)"
    },
    {
      "min": 5,
      "text": "Demo"
    }
  ],
  "componentsText": "MakerPy board (SRV_1 GPIO 8, SRV_2 GPIO 9, SRV_3 GPIO 10, buttons)",
  "output": "Button-controlled servo arm"
};
