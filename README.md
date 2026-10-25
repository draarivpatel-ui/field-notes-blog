# Field Notes - Engineering & Design Blog

Fullstack technical blog and interactive engineering notebook built for the Hack Club Stardance "Build Your Own Blog" mission. Combines a complete **Next.js + React + Mongoose + MongoDB** backend (`models/`, `lib/`, `pages/api/`, `pages/`) with a **static interactive runtime** (`index.html`, `about.html`, `app.js`, `styles.css`) so the live GitHub Pages deployment works out of the box without requiring a visitor to spin up a database first.

![Field Notes engineering blog](screenshot.png)

Live: https://aariv.me/field-notes-blog/

## Pre-loaded technical dispatches

1. **Supervising Parallel Coding Agents in Electron with Regatta** (`#electron`, `#devtools`, `#architecture`): How `node-pty`, `xterm.js` 16ms frame batching, and isolated `git worktree` lanes prevent concurrent coding agents from colliding.
2. **Auditing Coding Session Telemetry and Commit Cadence in wasitme** (`#telemetry`, `#devtools`, `#architecture`): Correlating local git commit timestamps with editor heartbeat windows in the browser.
3. **Designing Accessible, Zero-Maintenance Websites for Community Nonprofits** (`#accessibility`, `#design`, `#css`): Lessons from my pro-bono web studio and the Digital Design Club at Dulles High School on replacing fragile page builders with high-contrast semantic HTML/CSS for groups like MSA.
4. **Procedural Vector Microgames and Tempo Scaling in Godot 4 (Garlic Panic)** (`#godot`, `#games`, `#audio`): Tying physics speed and Web Audio synth pitch to a single BPM clock in a five-second reflex arcade.

## Core & bonus features implemented

- **Browse, read, and navigate**: Homepage dispatch feed (`index.html` / `pages/index.js`), full article reader (`pages/posts/[slug].js`), and About page (`about.html` / `pages/about.js`).
- **Account registration & login**: Create a new author account or sign in with the pre-seeded author credentials (`user: aariv`, `pass: stardance2026`). Backed by `/api/auth/register` and `/api/auth/login` (bcrypt + JWT) in Next.js mode and persisted in `localStorage` in static mode.
- **Full post CRUD when signed in**: Create new dispatches, edit existing articles, and delete posts (`/api/posts` and `/api/posts/[id]`).
- **Four "Ideas to take it further" features**:
  1. **Tag filtering & instant full-text search**: Filter by `#electron`, `#telemetry`, `#accessibility`, `#godot`, or `Bookmarked Only`, and press `/` to search across titles, summaries, and Markdown bodies.
  2. **Live reading-time & word-count estimator**: Computed automatically at 200 WPM in both the Mongoose `PostSchema.pre("save")` hook and the live editor header.
  3. **Split-pane live Markdown preview editor**: Two-column authoring workbench that renders headings, fenced code blocks, bullet lists, and inline code as you type.
  4. **Post reactions, reading queue bookmarks, & theme switcher**: Increment *Insightful* and *Shipped* counters, save articles to a persistent sidebar reading queue, and toggle between Dark and Light editorial themes.

## Running locally

### Mode A: Instant Static Interactive Runtime (zero install)

```bash
python3 -m http.server 3000
# Visit http://localhost:3000
```

### Mode B: Fullstack Next.js + MongoDB Server

1. Copy `.env.example` to `.env.local` and set your `MONGODB_URI` and `JWT_SECRET`.
2. Install dependencies and start the Next.js development server:

```bash
npm install
npm run dev
```

## Why I built this

Every time I finished shipping a project over the past year, the real architectural lessons (like batching `node-pty` IPC frames in `Regatta` or checking WCAG contrast ratios for nonprofit sites) ended up scattered across commit messages and scratch notes. I built *Field Notes* so I would have a fast, structured place to publish long-form technical postmortems and test Markdown drafts before sharing them.

## Honest AI note

Built by AI coding agents under Aariv Patel's direction for the Hack Club Stardance "Build Your Own Blog" mission. Aariv specified the dual Next.js/Mongoose and static GitHub Pages architecture, the four technical post topics based on his real builds, and the four bonus features, and reviewed and verified the deployed application.

## License

MIT.
