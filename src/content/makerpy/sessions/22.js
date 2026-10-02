// Session 22 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 22,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 9,
  "moduleTopic": "I2C LCD",
  "title": "I2C LCD Display (16×2)",
  "level": "Intermediate",
  "electronics": "I2C protocol — SDA/SCL lines, device addressing (0x27), why I2C (fewer wires), pull-up resistors",
  "coding": "I2C class, I2cLcd library, .putstr(), .clear(), .move_to(), uploading library files via MicroLab",
  "activities": [
    {
      "min": 10,
      "text": "Theory — I2C protocol, address scanning"
    },
    {
      "min": 15,
      "text": "Upload lcd_api.py + pico_i2c_lcd.py via MicroLab file manager"
    },
    {
      "min": 25,
      "text": "Display 'Hello MakerPy!', then display live LM35 temperature"
    },
    {
      "min": 5,
      "text": "Recap"
    }
  ],
  "componentsText": "I2C LCD 16x2 (SDA→GPIO 0, SCL→GPIO 1; prefer 3.3V backpack power — 5V pulls SDA/SCL to 5V), MakerPy board, breadboard",
  "output": "Live temperature displayed on LCD screen"
};
