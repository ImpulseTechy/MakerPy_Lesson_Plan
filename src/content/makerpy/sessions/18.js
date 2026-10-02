// Session 18 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 18,
  "status": "outline",
  "wiring": "external",
  "phase": 2,
  "module": 8,
  "moduleTopic": "NeoPixel",
  "title": "NeoPixel Ring — Addressable LEDs",
  "level": "Advanced",
  "electronics": "WS2812B LED protocol, addressable LEDs, RGB color model (0–255 per channel), data line GPIO 3 (external ring — not on the PCB)",
  "coding": "neopixel library (built-in), NeoPixel(), np[i]=(r,g,b), np.write(), for loops, wheel() function",
  "activities": [
    {
      "min": 10,
      "text": "Theory — WS2812B data protocol + wire ring to pin extender (DIN→GPIO 3, 5V, GND)"
    },
    {
      "min": 20,
      "text": "Basic patterns — color wipe, rainbow cycle"
    },
    {
      "min": 20,
      "text": "NeoPixel reacts to LDR (bright room = cool colors, dark = warm)"
    },
    {
      "min": 5,
      "text": "Light show demo"
    }
  ],
  "componentsText": "MakerPy board (LDR GPIO 27), external 12-LED NeoPixel ring on pin extender (DIN→GPIO 3, 5V, GND), jumper wires",
  "output": "LDR-reactive NeoPixel light show"
};
