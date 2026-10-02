// Session 17 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 17,
  "status": "outline",
  "wiring": "onboard",
  "phase": 2,
  "module": 7,
  "moduleTopic": "Sensor Fusion",
  "title": "Combining Sensors — Multi-Sensor Dashboard",
  "level": "Advanced",
  "electronics": "Reading multiple sensors simultaneously, sensor sampling rate, data aggregation concept",
  "coding": "Multiple ADC objects, dictionaries, formatted print output, round(), time-based polling",
  "activities": [
    {
      "min": 10,
      "text": "Theory — sensor fusion, why combine sensors"
    },
    {
      "min": 20,
      "text": "Read LM35 + LDR simultaneously, print formatted dashboard"
    },
    {
      "min": 20,
      "text": "Dashboard with color-coded LED status (temp + light)"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "MakerPy board (LM35 GPIO 26, LDR GPIO 27, RGB GPIO 18/19/20)",
  "output": "Live sensor dashboard in serial monitor"
};
