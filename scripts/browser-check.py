"""Browser check for the Teacher Hub.
Usage: npm run dev (in another terminal), then: python scripts/browser-check.py
Needs: pip install playwright && playwright install chromium
"""
import glob, os, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
os.makedirs("screenshots", exist_ok=True)
from playwright.sync_api import sync_playwright
BASE = "http://localhost:4321/"
pages = sorted(os.path.relpath(p, "dist").replace(os.sep, "/") for p in glob.glob("dist/**/*.html", recursive=True))
fails = []
def check(cond, msg):
    if not cond: fails.append(msg)
with sync_playwright() as p:
    b = p.chromium.launch()
    # 1. Every page: no JS errors, no failed local requests, no horizontal overflow at 390px and 1280px
    for width in (1280, 390):
        ctx = b.new_context(viewport={"width": width, "height": 850})
        for path in pages:
            if path == "404.html": continue
            pg = ctx.new_page(); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.on("requestfailed", lambda r: errs.append("failed " + r.url) if "localhost" in r.url else None)
            pg.on("response", lambda r: errs.append(f"{r.status} {r.url}") if "localhost" in r.url and r.status >= 400 else None)
            pg.goto(BASE + path); pg.wait_for_load_state("load")
            over = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            check(not errs, f"{width}px {path}: {errs}")
            check(over <= 0, f"{width}px {path}: page scrolls sideways by {over}px")
            pg.close()
        ctx.close()
    ctx = b.new_context(viewport={"width": 1280, "height": 850}); pg = ctx.new_page()
    # 2. Home: default continue -> Session 1
    pg.goto(BASE + "index.html")
    check("Session 1" in pg.inner_text("[data-continue-title]"), "home default continue")
    # 3. Search
    pg.fill("#q", "servo"); pg.wait_for_timeout(100)
    titles = pg.locator("#q-results a b").all_inner_texts()
    check(any("Servo" in t for t in titles), f"search servo: {titles}")
    pg.fill("#q", "gpio 27"); pg.wait_for_timeout(100)
    check("GPIO 27" in pg.locator("#q-results a b").first.inner_text(), "search gpio 27 first hit")
    pg.fill("#q", "ldr light"); pg.wait_for_timeout(100)
    with pg.expect_navigation(): pg.keyboard.press("Enter")
    check(pg.url.endswith("makerpy/session-14/index.html"), f"search Enter -> {pg.url}")
    # 4. Lesson: view toggle hides teacher content
    vis = lambda sel: pg.evaluate(f"getComputedStyle(document.querySelector('{sel}')).display")
    check(vis(".tnote") != "none", "teacher note visible in teacher view")
    pg.click("[data-mode=share]")
    check(vis(".tnote") == "none" and vis("#before") == "none", "share view hides notes + before")
    hidden_solutions = pg.evaluate("[...document.querySelectorAll('.badge')].every(b => b.offsetParent === null)")
    check(hidden_solutions, "share view hides every solution")
    check(pg.locator(".share-banner").is_visible(), "share banner visible")
    pg.reload(); check(vis(".tnote") == "none", "share view remembered after reload")
    pg.click("[data-mode=teacher]")
    # 5. Clock
    pg.click("[data-clock-go]"); pg.wait_for_timeout(2300)
    t = pg.inner_text("[data-clock-time]")
    check(t in ("00:02", "00:03"), f"clock shows {t}")
    check("Hello" in pg.inner_text("[data-clock-now]"), "clock current segment")
    check(pg.locator(".runsheet li.on").count() == 1, "one segment highlighted")
    pg.reload(); pg.wait_for_timeout(1200)
    check(pg.inner_text("[data-clock-go]") == "Pause", "clock keeps running after reload")
    pg.click("[data-clock-go]"); check(pg.inner_text("[data-clock-go]") == "Resume", "pause -> Resume")
    pg.click("[data-clock-reset]"); check(pg.inner_text("[data-clock-time]") == "00:00", "reset")
    # 6. Light lab
    pg.fill('[data-in="light"]', "0"); dark = pg.inner_text('[data-out="state"]'); led_dark = pg.text_content('[data-out="ledtxt"]')
    pg.fill('[data-in="light"]', "100"); bright = pg.inner_text('[data-out="state"]'); led_bright = pg.text_content('[data-out="ledtxt"]')
    check(dark == "Dark" and bright == "Bright", f"lab states {dark}/{bright}")
    check("100%" in led_dark and "off" in led_bright, f"lab LED {led_dark}/{led_bright}")
    # 7. Light test widget
    pg.fill('[data-r="0"][data-j="0"]', "300"); pg.fill('[data-r="0"][data-j="1"]', "16000"); pg.fill('[data-r="0"][data-j="2"]', "42000")
    check(pg.inner_text('[data-d="0"]') == "8150" and pg.inner_text('[data-b="0"]') == "29000", "light test thresholds")
    pg.reload(); check(pg.input_value('[data-r="0"][data-j="1"]') == "16000", "light test saved")
    # 8. Quiz reveal
    first_q = pg.locator(".q").first
    check(not first_q.locator(".ans").is_visible(), "answer hidden"); first_q.locator(".reveal").click()
    check(first_q.locator(".ans").is_visible(), "answer revealed")
    # 9. Prep checklist persists
    pg.locator("[data-prep]").first.check(); pg.reload()
    check(pg.locator("[data-prep]").first.is_checked(), "prep checklist saved")
    # 10. Switcher + pager
    with pg.expect_navigation(): pg.select_option("[data-switcher]", label="16. DC Motor Control — TB6612FNG")
    check(pg.url.endswith("session-16/index.html"), f"switcher -> {pg.url}")
    check("Outline only" in pg.inner_text(".notice"), "outline notice")
    with pg.expect_navigation(): pg.click(".pg.next")
    check(pg.url.endswith("session-17/index.html"), "next button")
    # 11. Home continue now points at last lesson
    pg.goto(BASE + "index.html")
    check("Session 17" in pg.inner_text("[data-continue-title]"), "continue shows last lesson")
    with pg.expect_navigation(): pg.click("[data-continue-link]")
    check(pg.url.endswith("session-17/index.html"), "continue link")
    # 12. Course filters
    pg.goto(BASE + "makerpy/index.html")
    count = lambda: pg.locator(".scard:visible").count()
    check(count() == 32, f"all cards {count()}")
    pg.click('[data-filter=phase] button[data-v="2"]'); check(count() == 12, f"phase 2 {count()}")
    pg.click('[data-filter=wiring] button[data-v="onboard"]'); check(count() == 9, f"phase 2 onboard {count()}")
    pg.click('[data-filter=phase] button[data-v=""]'); pg.click('[data-filter=wiring] button[data-v=""]')
    pg.click('[data-filter=status] button[data-v="full"]'); check(count() == 1, f"full {count()}")
    pg.click('[data-filter=status] button[data-v=""]')
    pg.fill("[data-filter-text]", "lcd"); lcd = sorted(int(x) for x in pg.locator(".scard:visible .snum").all_inner_texts())
    check(lcd == [22, 23, 28, 30], f"lcd filter {lcd}")
    pg.fill("[data-filter-text]", "zzzz"); check(pg.locator("[data-filter-empty]").is_visible(), "empty state")
    pg.click("[data-filter-clear]"); check(count() == 32, "clear filters")
    # 13. Resources menu
    pg.click(".menu summary"); check(pg.locator(".menu-panel").is_visible(), "menu opens")
    pg.click("h1"); check(not pg.locator(".menu-panel").is_visible(), "menu closes on outside click")
    # 14. Pin map anchor from search
    pg.goto(BASE + "makerpy/pin-map/index.html#gpio-22")
    check(pg.locator("#gpio-22").is_visible(), "pin anchor")
    # 15. 404
    r = pg.goto(BASE + "no-such-page/"); check(r.status == 404 and "Page not found" in pg.content(), "404 page")
    # 16. Opening from disk (file://) works with relative links
    fp = ctx.new_page(); errs = []; fp.on("pageerror", lambda e: errs.append(str(e)))
    fp.goto("file://" + os.path.abspath("dist/index.html").replace(os.sep, "/") if os.sep == "/" else "file:///" + os.path.abspath("dist/index.html").replace(os.sep, "/"))
    with fp.expect_navigation(): fp.click(".course-card")
    with fp.expect_navigation(): fp.click('a.scard[href*="session-14"]')
    check(fp.url.endswith("session-14/index.html") and not errs, f"file:// navigation {fp.url} {errs}")
    # Top bar stays on one row on laptop widths
    for w in (1280, 1440):
        c3 = b.new_context(viewport={"width": w, "height": 800}); tp = c3.new_page()
        for path in ("makerpy/session-14/index.html", "makerpy/index.html", "index.html"):
            tp.goto(BASE + path); h = tp.evaluate("document.querySelector('.topbar').offsetHeight")
            check(h < 75, f"top bar wraps at {w}px on {path} (height {h})")
        c3.close()
    # Screenshots
    for name, path, w, scheme in [("home", "index.html", 1280, "light"), ("course", "makerpy/index.html", 1280, "light"),
                                  ("lesson", "makerpy/session-14/index.html", 1280, "light"), ("lesson-dark", "makerpy/session-14/index.html", 1280, "dark"),
                                  ("outline", "makerpy/session-16/index.html", 1280, "light"), ("mobile", "makerpy/index.html", 390, "light"),
                                  ("pinmap", "makerpy/pin-map/index.html", 1280, "light")]:
        c2 = b.new_context(viewport={"width": w, "height": 900}, color_scheme=scheme); sp = c2.new_page()
        sp.goto(BASE + path); sp.wait_for_timeout(300); sp.screenshot(path=f"screenshots/{name}.png"); c2.close()
    b.close()
print(f"{len(pages)} pages checked at 2 widths")
print("FAILURES:" if fails else "ALL CHECKS PASSED", *fails, sep="\n  ")
sys.exit(1 if fails else 0)
