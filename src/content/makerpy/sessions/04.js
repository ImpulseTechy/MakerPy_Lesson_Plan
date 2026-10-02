// Session 4 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 4,
  "status": "outline",
  "wiring": "simulation",
  "phase": 1,
  "module": 2,
  "moduleTopic": "Analog Input",
  "title": "Analog Input — Potentiometer & ADC",
  "level": "Beginner",
  "electronics": "Analog vs digital signals, ADC (Analog to Digital Converter), voltage divider concept",
  "coding": "ADC class, read_u16() (0–65535 range), math mapping, f-strings, print() output",
  "activities": [
    {
      "min": 10,
      "text": "Theory — analog signals, ADC on Pico (GPIO 26/27/28)"
    },
    {
      "min": 20,
      "text": "Wokwi — potentiometer → ADC → print values"
    },
    {
      "min": 20,
      "text": "LED bar graph — pot value lights 1, 2 or 3 LEDs (threshold mapping)"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "Wokwi, potentiometer, LEDs x3, resistors",
  "output": "Potentiometer value displayed in serial monitor"
};
