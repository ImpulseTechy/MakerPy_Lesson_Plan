// Session 7 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 7,
  "status": "outline",
  "wiring": "simulation",
  "phase": 1,
  "module": 3,
  "moduleTopic": "Sensors",
  "title": "Sensors — LM35 Temperature Simulation",
  "level": "Intermediate",
  "electronics": "What is a sensor? Analog vs digital sensors, LM35 output characteristics (10mV/°C)",
  "coding": "while loops, ADC conversion formula, if/elif/else chains, comparison operators",
  "activities": [
    {
      "min": 10,
      "text": "Theory — sensor types, LM35 formula"
    },
    {
      "min": 20,
      "text": "Wokwi — simulate LM35 temperature reading"
    },
    {
      "min": 20,
      "text": "Trigger LED + buzzer if temp > threshold"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "Wokwi, LM35, LED, buzzer",
  "output": "Temperature alarm simulation on Wokwi"
};
