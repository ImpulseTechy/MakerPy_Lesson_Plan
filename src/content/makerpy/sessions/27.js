// Session 27 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 27,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 11,
  "moduleTopic": "Serial Comms",
  "title": "Serial Communication — Remote Control via Monitor",
  "level": "Advanced",
  "electronics": "UART serial protocol, baud rate, TX/RX lines, how serial monitor sends data to Pico",
  "coding": "sys.stdin, input() via serial, string comparison, command parsing, control flow from serial input",
  "activities": [
    {
      "min": 10,
      "text": "Theory — serial communication, REPL vs code"
    },
    {
      "min": 20,
      "text": "Send commands from MicroLab serial monitor to control LEDs"
    },
    {
      "min": 20,
      "text": "Full robot remote control via serial commands (F/B/L/R/S)"
    },
    {
      "min": 5,
      "text": "Demo"
    }
  ],
  "componentsText": "MakerPy board, MicroLab serial monitor, DC motors, MakerPy GPIO",
  "output": "Robot controlled by keyboard commands in serial monitor"
};
