// Session 6 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 6,
  "status": "outline",
  "wiring": "simulation",
  "phase": 1,
  "module": 3,
  "moduleTopic": "PWM",
  "title": "PWM — Dimming & Buzzer Tones",
  "level": "Intermediate",
  "electronics": "Pulse Width Modulation (PWM), duty cycle, frequency, how PWM controls brightness/sound",
  "coding": "PWM class, .freq(), .duty_u16(), for loops, range(), lists",
  "activities": [
    {
      "min": 10,
      "text": "Theory — PWM, duty cycle animation"
    },
    {
      "min": 20,
      "text": "Wokwi — LED dimming with PWM"
    },
    {
      "min": 20,
      "text": "Buzzer playing musical scale using PWM freq"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "Wokwi, LED, buzzer, potentiometer",
  "output": "LED dimmer + buzzer playing a 8-note scale"
};
