/* Interactive lesson widgets. Each widget is a [data-widget="name"] element rendered by lib/blocks.js. */
(function () {
  "use strict";
  var store = window.BigBoT && window.BigBoT.store;

  /* ---------- ldr-lab: light level -> LDR resistance -> voltage -> read_u16() ---------- */
  // Model of a typical LDR (GL5528-like): about 15 kΩ at 10 lux, slope 0.7, capped at 1 MΩ in the dark.
  // Divider on the MakerPy board: LDR from 3.3 V to GPIO 27, 4.7 kΩ from GPIO 27 to GND.
  var SCENES = [[0, "Covered with a finger"], [22, "Dark room"], [40, "Hand shadow"], [60, "Room light"], [82, "By a sunny window"], [94, "Phone torch"]];
  var DARK = 15000, BRIGHT = 40000;
  function fmtR(k) {
    if (k >= 1000) return (k / 1000).toFixed(2).replace(/\.?0+$/, "") + " MΩ";
    if (k >= 1) return k.toFixed(k >= 100 ? 0 : 1) + " kΩ";
    return Math.round(k * 1000) + " Ω";
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="ldr-lab"]'), function (lab) {
    var input = lab.querySelector('[data-in="light"]');
    var out = function (name) { return lab.querySelector('[data-out="' + name + '"]'); };
    var update = function () {
      var s = Number(input.value);
      var lux = Math.pow(10, s / 100 * 5 - 1);           // 0.1 .. 10,000 lux
      var r = Math.min(15 * Math.pow(lux / 10, -0.7), 1000); // kΩ
      var v = 3.3 * 4.7 / (r + 4.7);
      var adc = Math.round(v / 3.3 * 65535);
      var b = adc >= BRIGHT ? 0 : adc <= DARK ? 1 : (BRIGHT - adc) / (BRIGHT - DARK);
      var name = SCENES[0][1];
      SCENES.forEach(function (sc) { if (s >= sc[0]) name = sc[1]; });
      out("scene").textContent = name;
      out("r").textContent = fmtR(r);
      out("v").textContent = v.toFixed(2) + " V";
      out("adc").textContent = adc.toLocaleString("en-US");
      out("state").textContent = adc > BRIGHT ? "Bright" : adc > DARK ? "Dim" : "Dark";
      out("halo").setAttribute("opacity", b.toFixed(2));
      out("bulb").setAttribute("opacity", (b * 0.95).toFixed(2));
      out("ledtxt").textContent = "Night light: " + (b === 0 ? "off" : Math.round(b * 100) + "%");
    };
    input.addEventListener("input", update);
    update();
  });

  /* ---------- light-test: per-student readings -> personal DARK / BRIGHT thresholds ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="light-test"]'), function (box) {
    var key = "lighttest." + box.getAttribute("data-key");
    var data = (store && store.get(key, null)) || { names: ["Student 1", "Student 2", "Student 3", "Student 4", "Student 5"], read: [[], [], [], [], []] };
    var tbody = box.querySelector("tbody");
    var save = function () { if (store) store.set(key, data); };
    var mid = function (a, b) {
      if (a === "" || b === "" || a == null || b == null || isNaN(a) || isNaN(b)) return null;
      return Math.round((Number(a) + Number(b)) / 2);
    };
    for (var i = 0; i < 5; i++) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td><input type="text" aria-label="Student name" data-name="' + i + '"></td>' +
        [0, 1, 2, 3].map(function (j) { return '<td><input type="number" inputmode="numeric" min="0" max="65535" aria-label="Reading" data-r="' + i + '" data-j="' + j + '"></td>'; }).join("") +
        '<td class="out" data-d="' + i + '">–</td><td class="out" data-b="' + i + '">–</td>';
      tbody.appendChild(tr);
    }
    var refresh = function () {
      for (var i = 0; i < 5; i++) {
        var r = data.read[i] || [];
        var d = mid(r[0], r[1]), b = mid(r[1], r[2]);
        box.querySelector('[data-d="' + i + '"]').textContent = d === null ? "–" : d;
        box.querySelector('[data-b="' + i + '"]').textContent = b === null ? "–" : b;
      }
    };
    Array.prototype.forEach.call(box.querySelectorAll("[data-name]"), function (el) {
      var i = Number(el.getAttribute("data-name"));
      el.value = data.names[i] || "";
      el.addEventListener("input", function () { data.names[i] = el.value; save(); });
    });
    Array.prototype.forEach.call(box.querySelectorAll("[data-r]"), function (el) {
      var i = Number(el.getAttribute("data-r")), j = Number(el.getAttribute("data-j"));
      if (!data.read[i]) data.read[i] = [];
      el.value = data.read[i][j] == null ? "" : data.read[i][j];
      el.addEventListener("input", function () { data.read[i][j] = el.value; refresh(); save(); });
    });
    refresh();
  });
  /* ---------- shared helpers for the animated simulators ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function q(root, name) { return root.querySelector('[data-out="' + name + '"]'); }
  function lines(root, list) {
    Array.prototype.forEach.call(root.querySelectorAll(".sim-code .ln"), function (el) {
      el.classList.toggle("on", list.indexOf(Number(el.getAttribute("data-line"))) !== -1);
    });
  }
  function fmtS(v) { return (Math.round(v * 10) / 10) + " s"; }

  /* ---------- blink: an LED following led.on() / sleep / led.off() / sleep ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="blink"]'), function (box) {
    var onIn = box.querySelector('[data-in="on"]'), offIn = box.querySelector('[data-in="off"]');
    var play = box.querySelector("[data-play]");
    var codeLines = box.querySelectorAll(".sim-code .ln");
    var timer = null, running = !reduceMotion, count = 0, phase = 0;
    var setLed = function (on) {
      q(box, "bulb").setAttribute("opacity", on ? "1" : "0");
      q(box, "halo").setAttribute("opacity", on ? "1" : "0");
      q(box, "state").textContent = on ? "ON" : "OFF";
    };
    var syncCode = function () {
      // Lines 3 and 5 hold the two sleep() calls: keep their numbers in step with the sliders.
      codeLines[3].textContent = codeLines[3].textContent.replace(/sleep\([^)]*\)/, "sleep(" + Number(onIn.value) + ")");
      codeLines[5].textContent = codeLines[5].textContent.replace(/sleep\([^)]*\)/, "sleep(" + Number(offIn.value) + ")");
      q(box, "on").textContent = fmtS(onIn.value);
      q(box, "off").textContent = fmtS(offIn.value);
    };
    var step = function () {
      // phase 0: LED on, sleeping ON time; phase 1: LED off, sleeping OFF time
      if (phase === 0) { setLed(true); count++; q(box, "count").textContent = "Blinks: " + count; lines(box, [2, 3]); }
      else { setLed(false); lines(box, [4, 5]); }
      var wait = Number(phase === 0 ? onIn.value : offIn.value) * 1000;
      phase = 1 - phase;
      timer = setTimeout(step, wait);
    };
    var start = function () { clearTimeout(timer); if (running) step(); };
    var presets = box.querySelectorAll("[data-preset]");
    Array.prototype.forEach.call(presets, function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-preset").split(",");
        onIn.value = v[0]; offIn.value = v[1];
        Array.prototype.forEach.call(presets, function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        syncCode(); phase = 0; start();
      });
    });
    [onIn, offIn].forEach(function (el) {
      el.addEventListener("input", function () {
        Array.prototype.forEach.call(presets, function (o) { o.setAttribute("aria-pressed", "false"); });
        syncCode();
      });
    });
    play.addEventListener("click", function () {
      running = !running;
      play.textContent = running ? "Pause" : "Play";
      if (running) { phase = 0; start(); } else { clearTimeout(timer); setLed(false); lines(box, []); }
    });
    play.textContent = running ? "Pause" : "Play";
    syncCode(); setLed(false); start();
  });

  /* ---------- led-circuit: GPIO -> 330 Ω -> LED -> GND, with current flow ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="led-circuit"]'), function (box) {
    var pin = box.querySelector('[data-in="pin"]'), res = box.querySelector('[data-in="res"]'), flip = box.querySelector('[data-in="flip"]');
    var fix = q(box, "fix"), burnt = false;
    var update = function () {
      var high = pin.checked, hasRes = res.checked, back = flip.checked;
      if (high && !hasRes && !back) burnt = true;           // no resistor: too much current
      var flowing = high && !back && !burnt;
      var mA = flowing ? (3.3 - 2.0) / 330 * 1000 : 0;       // red LED drops about 2 V
      q(box, "v").textContent = high ? "3.3 V (HIGH)" : "0 V (LOW)";
      q(box, "pinlbl").textContent = high ? "HIGH" : "LOW";
      q(box, "res").setAttribute("opacity", hasRes ? "1" : "0.15");
      q(box, "ledg").setAttribute("transform", back ? "rotate(180 220 114)" : "");
      q(box, "bulb").setAttribute("opacity", flowing ? "1" : "0");
      q(box, "halo").setAttribute("opacity", flowing ? "1" : "0");
      q(box, "smoke").setAttribute("opacity", burnt ? "1" : "0");
      q(box, "flow").classList.toggle("run", flowing);
      var state, why;
      if (burnt) { state = "LED burnt out!"; why = "Without a resistor, far too much current rushes through. The LED (and even the Pico pin) can be damaged. Always put a resistor in series."; q(box, "i").textContent = "far too much!"; }
      else if (!high) { state = "LED off"; why = "The pin is LOW (0 V), so there is no push for the current. The loop is complete, but nothing flows."; q(box, "i").textContent = "0 mA"; }
      else if (back) { state = "LED off"; why = "An LED only lets current flow one way: long leg (+, anode) to the pin, short leg (−, cathode) to GND. Backwards, nothing flows (no damage)."; q(box, "i").textContent = "0 mA"; }
      else { state = "LED on, safe"; why = "Current flows from GP2, through the resistor and the LED, to GND. The 330 Ω resistor keeps it small and safe."; q(box, "i").textContent = "about " + mA.toFixed(1) + " mA"; }
      q(box, "state").textContent = state;
      q(box, "why").textContent = why;
      fix.hidden = !burnt;
    };
    [pin, res, flip].forEach(function (el) { el.addEventListener("change", update); });
    fix.addEventListener("click", function () { burnt = false; res.checked = true; update(); });
    update();
  });

  /* ---------- traffic-light: green 5 s, yellow 2 s, red 5 s, with the running code highlighted ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-widget="traffic-light"]'), function (box) {
    var PHASES = [
      { lamp: "g", secs: 5, name: "Green: go", lines: [1, 2, 3, 4] },
      { lamp: "y", secs: 2, name: "Yellow: get ready to stop", lines: [5, 6, 7, 8] },
      { lamp: "r", secs: 5, name: "Red: stop", lines: [9, 10, 11, 12] }
    ];
    var play = box.querySelector("[data-play]");
    var speedBtns = box.querySelectorAll("[data-speed]");
    var speed = 1, idx = 0, left = PHASES[0].secs, timer = null, running = !reduceMotion;
    var show = function () {
      var ph = PHASES[idx];
      ["r", "y", "g"].forEach(function (k) {
        q(box, "lamp-" + k).setAttribute("opacity", k === ph.lamp ? "1" : "0");
        q(box, "halo-" + k).setAttribute("opacity", k === ph.lamp ? "1" : "0");
      });
      q(box, "scene").textContent = ph.name;
      q(box, "left").textContent = left + " s left";
      lines(box, ph.lines);
    };
    var tick = function () {
      left--;
      if (left <= 0) { idx = (idx + 1) % PHASES.length; left = PHASES[idx].secs; }
      show();
      timer = setTimeout(tick, 1000 / speed);
    };
    var start = function () { clearTimeout(timer); if (running) timer = setTimeout(tick, 1000 / speed); };
    Array.prototype.forEach.call(speedBtns, function (b) {
      b.addEventListener("click", function () {
        speed = Number(b.getAttribute("data-speed"));
        Array.prototype.forEach.call(speedBtns, function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        start();
      });
    });
    play.addEventListener("click", function () {
      running = !running;
      play.textContent = running ? "Pause" : "Play";
      start();
    });
    play.textContent = running ? "Pause" : "Play";
    show(); start();
  });
})();
