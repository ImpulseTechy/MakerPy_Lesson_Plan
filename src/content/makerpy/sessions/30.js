// Session 30 — outline imported from makerpy_lesson_plan_v2.xlsx.
// To write the full lesson, follow the structure of 14.js and set status to "full"
// only after every code block has been run on a real MakerPy board.
export default {
  "number": 30,
  "status": "outline",
  "wiring": "external",
  "phase": 3,
  "module": 12,
  "moduleTopic": "Save to File",
  "title": "Data Logging — Save Sensor Data to File",
  "level": "Advanced",
  "electronics": "SD card concept (note: using Pico internal flash for simplicity), file systems, data formats (CSV)",
  "coding": "open(), write(), read(), with statement, CSV format string, appending data, file-based data storage",
  "activities": [
    {
      "min": 10,
      "text": "Theory — data logging, why it matters in real engineering"
    },
    {
      "min": 20,
      "text": "Log LM35 readings to a .csv file on Pico flash every 5 sec"
    },
    {
      "min": 20,
      "text": "Read back and display log on LCD"
    },
    {
      "min": 5,
      "text": "Download file via MicroLab + open in Excel"
    }
  ],
  "componentsText": "MakerPy board, LM35 (GPIO 26), LCD, MicroLab file manager",
  "output": "CSV sensor log file downloadable via MicroLab"
};
