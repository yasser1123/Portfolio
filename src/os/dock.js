/**
 * The dock.
 *
 * Left of the separator: launchers, each with a running indicator. Right of it:
 * one tile per minimised window, which is also the target the genie animation
 * flies into. Hovering magnifies under the cursor and nudges neighbours aside,
 * the way the real one does.
 */
import { h, svg, clear, prefersReducedMotion } from './dom.js';
import { ICONS } from './icons.js';

const MAG_AMP = 0.55;    // peak scale bump under the cursor
const MAG_SIGMA = 78;    // px falloff
const MAG_SPREAD = 17;   // px neighbours slide outward

export function createDock({ mount, bus, apps }) {
  const dock = h('div', { class: 'dock', role: 'toolbar' });
  const sep = h('div', { class: 'dock-sep', hidden: true });
  const winTiles = new Map();   // window id -> dock tile
  const launchers = new Map();  // app id -> element

  for (const app of apps) {
    const icon = h('div', { class: 'dock-icon' }, svg(ICONS[app.icon] || ICONS.finder));
    const item = h('button', {
      class: 'dock-item', dataset: { appId: app.id },
      'aria-label': app.label, title: '',
      onclick: () => { bounce(item); app.onClick(); }
    }, icon, h('div', { class: 'dock-tip' }, app.label), h('div', { class: 'dock-dot' }));
    launchers.set(app.id, item);
    dock.appendChild(item);
  }

  dock.appendChild(sep);
  mount.appendChild(dock);

  function bounce(item) {
    if (prefersReducedMotion()) return;
    item.classList.remove('is-bouncing');
    void item.offsetWidth;
    item.classList.add('is-bouncing');
    setTimeout(() => item.classList.remove('is-bouncing'), 760);
  }

  // ── Magnification ────────────────────────────────────────────────────────
  function magnify(px) {
    const items = Array.from(dock.querySelectorAll('.dock-item'));
    for (const it of items) {
      const r = it.getBoundingClientRect();
      const d = px - (r.left + r.width / 2);
      const s = 1 + MAG_AMP * Math.exp(-(d * d) / (2 * MAG_SIGMA * MAG_SIGMA));
      const tx = -Math.sign(d) * (s - 1) * MAG_SPREAD;
      it.style.transform = `translateX(${tx.toFixed(2)}px) scale(${s.toFixed(3)})`;
    }
  }
  function demagnify() {
    for (const it of dock.querySelectorAll('.dock-item')) it.style.transform = '';
  }
  if (!prefersReducedMotion() && window.matchMedia('(hover: hover)').matches) {
    dock.addEventListener('pointermove', (e) => magnify(e.clientX));
    dock.addEventListener('pointerleave', demagnify);
  }

  // ── Open-window tiles ───────────────────────────────────────────────────
  // Every open window gets a tile to the right of the separator, the way a
  // taskbar lists what is running. Minimised ones dim; the focused one is
  // marked. The tile is also the rect the genie animation flies into, which is
  // why it is created on open rather than on minimise.
  function tileInitial(title) {
    return String(title || '?').replace(/^\d+\s*[—-]\s*/, '').trim().charAt(0).toUpperCase();
  }

  function addTile(win) {
    if (winTiles.has(win.id)) return winTiles.get(win.id);
    const tile = h('button', {
      class: 'dock-item dock-min', dataset: { winId: win.id },
      'aria-label': win.title,
      onclick: () => {
        if (win.minimized) { win.restore(); return; }
        // Clicking the front window's tile tucks it away again.
        if (!win.el.classList.contains('is-blurred')) win.minimize();
        else win.focus();
      }
    },
      h('div', { class: 'dock-icon' },
        h('div', { class: 'dock-min-thumb' },
          h('div', { class: 'dock-min-bar' }),
          h('div', { class: 'dock-min-body' }, tileInitial(win.title))
        )
      ),
      h('div', { class: 'dock-tip' }, win.title)
    );
    winTiles.set(win.id, tile);
    dock.appendChild(tile);
    sep.hidden = false;
    return tile;
  }

  function dropTile(winId) {
    const tile = winTiles.get(winId);
    if (!tile) return;
    winTiles.delete(winId);
    tile.remove();
    if (winTiles.size === 0) sep.hidden = true;
  }

  function markTile(winId, cls, on) {
    const tile = winTiles.get(winId);
    if (tile) tile.classList.toggle(cls, on);
  }

  function retitle(win) {
    const tile = winTiles.get(win.id);
    if (!tile) return;
    tile.setAttribute('aria-label', win.title);
    tile.querySelector('.dock-tip').textContent = win.title;
    tile.querySelector('.dock-min-body').textContent = tileInitial(win.title);
  }

  function syncRunning(all) {
    const live = new Set(all.map((w) => w.appId));
    for (const [appId, el] of launchers) el.classList.toggle('is-running', live.has(appId));
  }

  bus.on('win:open', (win) => addTile(win));
  bus.on('win:close', (win) => dropTile(win.id));
  bus.on('win:title', (win) => retitle(win));
  bus.on('win:minimize', (win) => markTile(win.id, 'is-tucked', true));
  bus.on('win:restore', (win) => markTile(win.id, 'is-tucked', false));
  bus.on('win:focus', (win) => {
    for (const [id, tile] of winTiles) tile.classList.toggle('is-active', Boolean(win) && id === win.id);
  });
  bus.on('wm:sync', syncRunning);

  return {
    el: dock,
    bounceApp(appId) { const it = launchers.get(appId); if (it) bounce(it); },
    /** The rect the genie animation aims at. */
    minimizeTarget(win) { return winTiles.get(win.id) || launchers.get(win.appId) || dock; },
    syncRunning
  };
}
