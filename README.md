# Portfolio OS — Ahmed Yasser

The portfolio as a small desktop operating system: a boot gate, a macOS-style
dock, real windows you can drag, resize, fullscreen and minimise, and an agent
that can answer questions *and* drive the interface.

Originally a Claude Design canvas artboard (`Portfolio Folder.dc.html`). That
file was not deployable — it used a proprietary template language (`<x-dc>`,
`{{ }}`, `<sc-if>`, `<sc-for>`) compiled at runtime by `support.js`, which
expects the canvas host to inject `window.React`. This is that design rebuilt as
a plain static site.

---

## Run it

```bash
npx serve . -l 5173
```

Then open <http://localhost:5173>. No build step, no bundler — the front end is
ES modules the browser loads directly.

To exercise the serverless routes locally, use `vercel dev` or `netlify dev`
instead (both read `.env`).

## Deploy it

The front end is static; the two API routes are serverless functions. Both hosts
work with zero extra config.

**Vercel**

```bash
vercel deploy --prod
```

**Netlify**

```bash
netlify deploy --prod
```

**Anywhere else** (GitHub Pages, S3, nginx): upload the repo as-is. `/api/*`
will 404, and the app degrades on purpose — the agent falls back to its offline
engine and the contact form falls back to `mailto:`. Everything else is
identical.

### Environment variables

All optional. Copy `.env.example` to `.env` and fill in what you want.

| Variable | Effect when set | Effect when unset |
|---|---|---|
| `ANTHROPIC_API_KEY` | `/api/agent` proxies to Claude with tools | Returns 501; client uses the offline keyword engine |
| `AGENT_MODEL` | Overrides the model | Defaults to `claude-opus-5` |
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | `/api/contact` sends real email | Returns 501; the form opens the visitor's mail client |

---

## Architecture

```
index.html          Boot gate, menu bar, desktop, window layer, dock
styles/             tokens.css holds the whole palette; change it there
src/
  config.js         Endpoints, boot behaviour, agent timeouts
  data/             All content. Editing the portfolio means editing only this
  os/               dom, wm (windows), dock, genie, boot, menubar, icons
  apps/             finder, caseFile, resumeApp, contactApp, agentApp
  desktop/          hero, dossier — the surface behind the windows
  agent/            tools (schemas + runner), local (offline), client (remote)
api/
  agent.js          Claude proxy; grounded in src/data, drives src/agent/tools
  contact.js        Resend proxy with a honeypot and a rate limit
```

Content and interface are fully separated: nothing in `src/data/` knows the UI
exists, and no component hardcodes a fact. Adding a fourth project means adding
one object to `src/data/projects.js` — the Finder row, the window, the dock
behaviour and the agent's knowledge of it all follow.

### The window manager

`src/os/wm.js` owns every window. Each gets macOS traffic lights (close /
minimise / fullscreen), a centred title, drag-by-titlebar, a resize grip, and
z-order focus — unfocused windows grey their lights and lighten their shadow,
as on a Mac. `Esc` and `Cmd/Ctrl-W` close the front window; `Cmd/Ctrl-M`
minimises it. Windows are singletons per id, so launching an open app focuses it
instead of stacking duplicates.

Fullscreen expands the window to the entire viewport, hides the menu bar and
dock, and also requests real browser fullscreen. Nudging the pointer at the top
or bottom edge brings the chrome back.

### The genie

`src/os/genie.js` approximates the macOS minimise warp. The web has no mesh
warp, so it combines a transform anchored at the window's bottom-centre — the
point that lands on the dock — with an animated `clip-path` funnel that pinches
the bottom edge inward. The funnel is what reads as *sucked in* rather than
merely shrunk. Both properties interpolate on the compositor.

One subtlety worth keeping: the minimise animation holds its last frame
(`fill: both`) so the window stays collapsed while hidden. That animation must
be cancelled before the restore animation starts, or clearing the restore snaps
the element back to the funnel shape.

### The agent

Three layers, so it works with or without a backend:

- `src/agent/tools.js` — one list of tool schemas, and a runner that binds them
  to real UI verbs. `/api/agent` sends these to Claude as tool definitions.
  Adding a capability is one entry here; the serverless function needs no edit.
- `src/agent/client.js` — tries `/api/agent`, falls back to local on 404, 501,
  timeout, or any error, and stops retrying for the session.
- `src/agent/local.js` — the keyword engine, same `{ text, actions }` shape.

The tools run in the browser, not on the server, so `api/agent.js` hands Claude
a synthetic "the interface did it" tool result and asks for the closing prose;
the client then replays the calls for real. The agent's status bar says whether
you are talking to Claude or the offline engine rather than hiding it.

The system prompt is built from `src/data/*` at module load, so the agent is
grounded in the same facts the site displays and is told not to invent anything
beyond them.

---

## Notes

- **The boot gate** asks for F11 because a desktop metaphor only lands
  edge-to-edge. F11 belongs to the browser and cannot be triggered from script,
  so the gate detects it, offers a Fullscreen API button as an alternative, and
  always lets the visitor walk straight past. It remembers per tab session.
- **Content is placeholder.** Meridian Health, the metrics, and the project
  details came over from the original artboard. Replace them in `src/data/`.
- **The résumé download** points at `public/ahmed-yasser-resume.pdf`. Drop a real
  PDF there and the button goes live.
- **Reduced motion** is respected throughout — the genie, the dock
  magnification, the typewriter, and the boot animation all collapse.
