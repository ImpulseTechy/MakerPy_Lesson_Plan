// Session 9 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 9,
  "status": "outline",
  "wiring": "onboard",
  "phase": 2,
  "module": 5,
  "moduleTopic": "Setup",
  "title": "MakerPy Unboxing + MicroLab Setup",
  "level": "Beginner",
  "electronics": "PCB anatomy — traces, pads, components. Power path: 9V jack → L7805 (5V) → AMS1117 (3.3V), with 3 power indicator LEDs. USB vs barrel jack (motors need the 9V adapter)",
  "coding": "MicroLab IDE tour — editor, serial monitor, REPL, file manager. First connection to Pico W (onboard LED = Pin(\"LED\"); pin number 25 from the plain Pico does not work here)",
  "activities": [
    {
      "min": 10,
      "text": "Unboxing + identify every component on board"
    },
    {
      "min": 20,
      "text": "Flash Pico W MicroPython firmware (BOOTSEL method)"
    },
    {
      "min": 20,
      "text": "MicroLab setup — connect, blink onboard LED"
    },
    {
      "min": 5,
      "text": "Verify all boards working"
    }
  ],
  "componentsText": "MakerPy board, USB cable, laptop with Chrome, MicroLab",
  "output": "Onboard LED blinking via MicroLab"
};
