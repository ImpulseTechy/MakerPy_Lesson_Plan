/* BigBoT Teacher Hub — shared page behaviour. No dependencies. Every feature checks its elements exist. */
(function () {
  "use strict";
  var ROOT = document.documentElement.getAttribute("data-root") || "./";

  /* ---------- storage (never throws: private mode or blocked storage just means nothing is saved) ---------- */
  var store = {
    get: function (k, fallback) {
      try { var v = localStorage.getItem("bigbot." + k); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set: function (k, v) { try { localStorage.setItem("bigbot." + k, JSON.stringify(v)); } catch (e) {} }
  };
  window.BigBoT = { store: store, root: ROOT };

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $all(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

  /* ---------- Resources menu: close on outside click / Escape ---------- */
  $all("details.menu").forEach(function (d) {
    document.addEventListener("click", function (e) { if (d.open && !d.contains(e.target)) d.open = false; });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") { d.open = false; d.querySelector("summary").focus(); } });
  });

  /* ---------- Search ---------- */
  var q = $("#q"), results = $("#q-results");
  if (q && results && window.BIGBOT_SEARCH) {
    var active = -1;
    var render = function () {
      var terms = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      active = -1;
      if (!terms.length) { results.hidden = true; results.innerHTML = ""; return; }
      var phrase = terms.join(" ");
      var hits = window.BIGBOT_SEARCH.map(function (it, i) {
        var title = it.t.toLowerCase(), hay = it.k + " " + title;
        if (!terms.every(function (t) { return hay.indexOf(t) !== -1; })) return null;
        // Rank: whole phrase in the title, then each term found in the title, then original order.
        var score = (title.indexOf(phrase) !== -1 ? 10 : 0) +
          terms.filter(function (t) { return title.indexOf(t) !== -1; }).length;
        return { it: it, score: score, i: i };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score || a.i - b.i; })
        .slice(0, 8).map(function (h) { return h.it; });
      results.innerHTML = hits.length
        ? hits.map(function (it) {
            return '<a role="option" href="' + ROOT + it.u + '"><b></b><span></span></a>';
          }).join("")
        : '<div class="none">No matches. Try a part name (servo, LCD) or a pin (GPIO 27).</div>';
      $all("a", results).forEach(function (a, i) {
        a.querySelector("b").textContent = hits[i].t;
        a.querySelector("span").textContent = hits[i].g + (hits[i].d ? " · " + hits[i].d : "");
      });
      results.hidden = false;
    };
    var move = function (dir) {
      var links = $all("a", results);
      if (!links.length) return;
      active = (active + dir + links.length) % links.length;
      links.forEach(function (a, i) { a.classList.toggle("active", i === active); });
      links[active].scrollIntoView({ block: "nearest" });
    };
    q.addEventListener("input", render);
    q.addEventListener("focus", render);
    q.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") {
        var links = $all("a", results);
        var pick = links[active >= 0 ? active : 0];
        if (pick) { e.preventDefault(); window.location.href = pick.href; }
      } else if (e.key === "Escape") { results.hidden = true; q.blur(); }
    });
    document.addEventListener("click", function (e) { if (!e.target.closest(".search")) results.hidden = true; });
  }

  /* ---------- Light / dark theme (the <head> script already applied the saved choice) ---------- */
  var themeBtn = $("[data-theme-toggle]");
  if (themeBtn) {
    var html = document.documentElement;
    var label = function () {
      themeBtn.setAttribute("aria-label", html.getAttribute("data-theme") === "dark" ? "Switch to light mode" : "Switch to dark mode");
    };
    themeBtn.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      store.set("theme", next);
      label();
    });
    label();
  }

  /* ---------- Session switcher ---------- */
  var sw = $("[data-switcher]");
  if (sw) sw.addEventListener("change", function () { window.location.href = sw.value; });

  /* ---------- Teacher / Screen-share view ---------- */
  var modeBtns = $all("[data-mode]");
  if (modeBtns.length) {
    var setMode = function (share) {
      document.body.classList.toggle("share", share);
      modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-mode") === "share") === share)); });
      store.set("share", share);
    };
    modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode") === "share"); }); });
    setMode(!!store.get("share", false));
  }

  /* ---------- Copy buttons ---------- */
  $all(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pre = btn.closest(".code").querySelector("pre");
      var text = pre.textContent;
      var done = function (label) { btn.textContent = label; setTimeout(function () { btn.textContent = "Copy"; }, 1500); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done("Copied"); }, function () { selectText(pre); done("Press Ctrl+C"); });
      } else { selectText(pre); done("Press Ctrl+C"); }
    });
  });
  function selectText(el) {
    var range = document.createRange(); range.selectNodeContents(el);
    var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
  }

  /* ---------- Quiz reveal ---------- */
  $all(".reveal").forEach(function (b) {
    b.addEventListener("click", function () {
      var box = b.closest(".q"); var open = box.classList.toggle("open");
      b.textContent = open ? "Hide answer" : "Show answer";
      b.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Lesson: remember last opened, prep checklist ---------- */
  var lessonPath = document.body.getAttribute("data-lesson");
  if (lessonPath) {
    store.set("last", { path: lessonPath, title: document.body.getAttribute("data-lesson-title") });
    var prep = store.get("prep." + lessonPath, {});
    $all("[data-prep]").forEach(function (c) {
      var i = c.getAttribute("data-prep");
      c.checked = !!prep[i];
      c.addEventListener("change", function () { prep[i] = c.checked; store.set("prep." + lessonPath, prep); });
    });
  }

  /* ---------- Home: continue where you left off ---------- */
  var cont = $("[data-continue]");
  if (cont) {
    var last = store.get("last", null);
    if (last && last.path && last.title) {
      $("[data-continue-label]", cont).textContent = "Continue where you left off";
      $("[data-continue-title]", cont).textContent = last.title;
      $("[data-continue-link]", cont).setAttribute("href", ROOT + last.path);
    }
  }

  /* ---------- Course roadmap filters ---------- */
  var cards = $all(".scard");
  if (cards.length && $("[data-filter-text]")) {
    var state = { text: "", phase: "", wiring: "", status: "" };
    var text = $("[data-filter-text]"), count = $("[data-filter-count]"), empty = $("[data-filter-empty]");
    var apply = function () {
      var shown = 0, terms = state.text.toLowerCase().trim().split(/\s+/).filter(Boolean);
      cards.forEach(function (c) {
        var ok = (!state.phase || c.getAttribute("data-phase") === state.phase)
          && (!state.wiring || c.getAttribute("data-wiring") === state.wiring)
          && (!state.status || c.getAttribute("data-status") === state.status)
          && terms.every(function (t) { return c.getAttribute("data-text").indexOf(t) !== -1; });
        c.hidden = !ok; if (ok) shown++;
      });
      $all("[data-module-block]").forEach(function (m) { m.hidden = !$all(".scard", m).some(function (c) { return !c.hidden; }); });
      $all("[data-phase-block]").forEach(function (p) { p.hidden = !$all(".scard", p).some(function (c) { return !c.hidden; }); });
      count.textContent = shown === cards.length ? "Showing all " + shown + " sessions" : "Showing " + shown + " of " + cards.length + " sessions";
      empty.hidden = shown !== 0;
    };
    text.addEventListener("input", function () { state.text = text.value; apply(); });
    $all("[data-filter]").forEach(function (group) {
      var key = group.getAttribute("data-filter");
      $all("button", group).forEach(function (b) {
        b.addEventListener("click", function () {
          state[key] = b.getAttribute("data-v");
          $all("button", group).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          apply();
        });
      });
    });
    $("[data-filter-clear]").addEventListener("click", function () {
      state = { text: "", phase: "", wiring: "", status: "" }; text.value = "";
      $all("[data-filter]").forEach(function (g) { $all("button", g).forEach(function (x, i) { x.setAttribute("aria-pressed", String(i === 0)); }); });
      apply();
    });
    apply();
  }

  /* ---------- Class clock ---------- */
  var clock = $("[data-clock]");
  if (clock) {
    var TOTAL = Number(clock.getAttribute("data-total")) * 60;
    var KEY = "clock." + clock.getAttribute("data-key");
    var segs = $all(".runsheet li").map(function (li) {
      return { li: li, s: Number(li.getAttribute("data-s")) * 60, e: Number(li.getAttribute("data-e")) * 60, name: li.querySelector("a").textContent };
    });
    var saved = store.get(KEY, { elapsed: 0, running: false, startedAt: 0 });
    var running = !!saved.running, base = Number(saved.elapsed) || 0, startedAt = Number(saved.startedAt) || 0, timer = null;
    var go = $("[data-clock-go]", clock);
    var elapsed = function () { return Math.min(TOTAL, base + (running ? (Date.now() - startedAt) / 1000 : 0)); };
    var mmss = function (t) { t = Math.max(0, Math.floor(t)); return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"); };
    var persist = function () { store.set(KEY, { elapsed: base, running: running, startedAt: startedAt }); };
    var draw = function () {
      var t = elapsed(), cur = null;
      $("[data-clock-time]", clock).textContent = mmss(t);
      $("[data-clock-bar]", clock).style.width = (t / TOTAL * 100) + "%";
      segs.forEach(function (sg) {
        var on = t > 0 && t >= sg.s && t < sg.e;
        sg.li.classList.toggle("done", t >= sg.e);
        sg.li.classList.toggle("on", on);
        if (on) cur = sg;
      });
      var now = $("[data-clock-now]", clock), left = $("[data-clock-left]", clock);
      if (t >= TOTAL) { now.textContent = "Class time is up"; left.textContent = ""; stop(); }
      else if (t === 0 && !running) { now.textContent = "Class not started"; left.textContent = ""; }
      else if (cur) { now.textContent = "Now: " + cur.name; left.textContent = mmss(cur.e - t) + " left in this part" + (running ? "" : " (paused)"); }
      go.textContent = running ? "Pause" : (t > 0 && t < TOTAL ? "Resume" : "Start class");
    };
    var start = function () { startedAt = Date.now(); running = true; persist(); timer = setInterval(draw, 1000); draw(); };
    var stop = function () { if (running) { base = elapsed(); running = false; persist(); } clearInterval(timer); };
    go.addEventListener("click", function () {
      if (running) { stop(); draw(); return; }
      if (elapsed() >= TOTAL) base = 0; // finished class: "Start class" starts a fresh one
      start();
    });
    $("[data-clock-reset]", clock).addEventListener("click", function () { clearInterval(timer); running = false; base = 0; startedAt = 0; persist(); draw(); });
    // A running clock survives a page reload (e.g. the teacher opens the Pin Map and comes back).
    if (running) timer = setInterval(draw, 1000);
    draw();
  }
})();
