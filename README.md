# BigBoT Teacher Hub

A private website where BigBoT teachers prepare and run online classes.
The first course is **MakerPy** (32 sessions on the MakerPy board).

## What's inside

- **Home**: "Continue where you left off", courses, quick links, latest updates
- **MakerPy course**: all 32 sessions by phase and module, with filters and search
- **Lesson pages**: class clock and run sheet, Teacher / Screen-share view, real-life project,
  components list, guided build with code, challenge, quiz, troubleshooting,
  plus Previous / Next and a session switcher
- **Resources**: Pin Map, Components, Code library, Troubleshooting, Teaching Online Guide, Updates

Session 14 (LDR Light Sensor) is the first fully written lesson. The other 31 show the
curriculum outline until they are written.

## Run it on your computer

Install [Node.js 22 or newer](https://nodejs.org), then in this folder:

```bash
npm run dev     # opens a preview at http://localhost:4321
npm test        # checks content, pins, links and lesson code
```

No `npm install` is needed: the project has no dependencies.
You can also open `dist/index.html` directly after `npm run build`.

## Put it online (private to teachers)

1. Push this folder to a private GitHub repository.
2. **Cloudflare Pages** → Create project → connect the repository.
   Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION` = `22`.
3. Add a custom domain, for example `teachers.thebigbot.org`.
4. **Cloudflare Zero Trust → Access → Applications** → add a self-hosted application for that domain.
   Policy: *Allow* → *Emails* → list each teacher's email. Login method: *One-time PIN*.
5. To add or remove a teacher, edit that email list. Nothing in the site needs to change.

## Writing lessons

Open this folder in Claude Code. `CLAUDE.md` explains the structure, the hardware rules
and the steps for turning an outline into a full lesson. Every lesson's code must be run
on a real MakerPy board before it's marked as full.
