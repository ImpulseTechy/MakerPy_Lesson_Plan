// Session 13 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 13,
  "status": "outline",
  "wiring": "onboard",
  "phase": 2,
  "module": 6,
  "moduleTopic": "Temperature",
  "title": "LM35 Temperature Sensor",
  "level": "Intermediate",
  "electronics": "Analog sensor, ADC0 (GPIO 26), voltage output formula: V=raw×3.3/65535, temp=V×100. Note: the board powers the LM35 from 3.3V (rated minimum 4V) — check readings against a thermometer before class",
  "coding": "ADC class, read_u16(), float arithmetic, round(), f-strings, while loop with sensor read",
  "activities": [
    {
      "min": 10,
      "text": "Theory — LM35 datasheet basics, formula"
    },
    {
      "min": 20,
      "text": "Read temp and print to serial monitor"
    },
    {
      "min": 20,
      "text": "Temp alert — LED turns red + buzzer if > 30°C"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "MakerPy board (LM35 GPIO 26, RGB GPIO 18/19/20, buzzer GPIO 7)",
  "output": "Temperature alarm on MakerPy"
};
