// Session 12 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 12,
  "status": "outline",
  "wiring": "onboard",
  "phase": 2,
  "module": 6,
  "moduleTopic": "Buzzer",
  "title": "Buzzer — Sound & Music",
  "level": "Intermediate",
  "electronics": "Passive buzzer, active-low operation, PWM frequency = pitch, duty cycle = volume",
  "coding": "PWM class, .freq(), .duty_u16(), lists of notes, for loop, time.sleep(), functions",
  "activities": [
    {
      "min": 10,
      "text": "Theory — buzzer types, active vs passive"
    },
    {
      "min": 20,
      "text": "Play musical scale (C major) on buzzer"
    },
    {
      "min": 20,
      "text": "Mini piano — 3 buttons play 3 notes + RGB color feedback"
    },
    {
      "min": 5,
      "text": "Demo"
    }
  ],
  "componentsText": "MakerPy board (buzzer GPIO 7, buttons GPIO 4/5/6)",
  "output": "3-button mini piano with color feedback"
};
