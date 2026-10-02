// Session 19 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 19,
  "status": "outline",
  "wiring": "external",
  "phase": 2,
  "module": 8,
  "moduleTopic": "Potentiometer (J7)",
  "title": "Analog Input — Potentiometer on J7 Header (GPIO 28)",
  "level": "Advanced",
  "electronics": "J7 header (3.3V / signal / GND) on GPIO 28 = ADC2 — no sensor onboard, plug in a pot; potentiometer as voltage divider, analog control of digital systems",
  "coding": "ADC(Pin(28)), value mapping formula, real-time control loop, controlling servo/NeoPixel with pot",
  "activities": [
    {
      "min": 10,
      "text": "Theory — potentiometer as input device"
    },
    {
      "min": 20,
      "text": "Pot controls NeoPixel brightness (map 0–65535 → 0–12 LEDs)"
    },
    {
      "min": 20,
      "text": "Pot controls servo angle in real time"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "MakerPy board, potentiometer with 3-pin lead on J7 (GPIO 28), NeoPixel ring (GPIO 3), servo (GPIO 8)",
  "output": "Pot-controlled NeoPixel + servo"
};
