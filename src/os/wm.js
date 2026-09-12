/**
 * Window manager.
 *
 * One window = one absolutely-positioned element inside #window-layer, with a
 * macOS-shaped title bar: traffic lights left, centred title, drag anywhere on
 * the bar. Close / minimise / fullscreen behave the way they do on a Mac, and
 * closing a window leaves the app "running" only while it still has windows.
 */
import { h, svg, clamp, prefersReducedMotion } from './dom.js';
import { minimizeTo, restoreFrom } from './genie.js';
import { TITLE_GLYPH } from './icons.js';

const CASCADE = 26;
const BAR_H = 34;

export function createWindowManager({ layer, root, bus, getMinimizeTarget }) {
  const windows = new Map();   // id -> Win
  const order = [];            // ids, back to front
  let seq = 0;
  let zTop = 10;

  const MIN_W = 300;
  const MIN_H = 160;

  // A hidden tab or an unlaid-out container measures 0, which would otherwise
  // produce negative window sizes. Fall back to the viewport, then to the
  // requested size, so a window is never born broken.
  const bounds = () => ({
    w: layer.clientWidth || window.innerWidth || 1024,
    h: layer.clientHeight || window.innerHeight || 720
  });
  const isSmall = () => bounds().w < 760;

  function place(width, height) {
    const b = bounds();
    if (isSmall()) {
      const w = Math.max(MIN_W, Math.min(width, b.w - 16));
      const hh = Math.max(MIN_H, Math.min(height, b.h - 92));
      return { left: Math.max(0, (b.w - w) / 2), top: 12, width: w, height: hh };
    }
    const w = Math.max(MIN_W, Math.min(width, b.w - 60));
    const hh = Math.max(MIN_H, Math.min(height, b.h - 110));
    const n = seq++ % 6;
    return {
      left: clamp((b.w - w) / 2 + n * CASCADE - 60, 16, Math.max(16, b.w - w - 16)),
      top: clamp((b.h - hh) / 2 + n * CASCADE - 70, 8, Math.max(8, b.h - hh - 90)),
      width: w,
      height: hh
    };
  }

  function focus(id) {
    const win = windows.get(id);
    if (!win || win.minimized) return;
    if (order[order.length - 1] !== id) {
      const i = order.indexOf(id);
      if (i >= 0) order.splice(i, 1);
      order.push(id);
    }
    win.el.style.zIndex = String(++zTop);
    for (const [wid, w] of windows) w.el.classList.toggle('is-blurred', wid !== id);
    bus.emit('win:focus', win);
  }

  function frontmost() {
    for (let i = order.length - 1; i >= 0; i--) {
      const w = windows.get(order[i]);
      if (w && !w.minimized) return w;
    }
    return null;
  }

  function makeBar(win, { title, glyph }) {
    const light = (cls, mark, label, fn) =>
      h('button', {
        class: `light light--${cls}`, title: label, 'aria-label': label,
        onclick: (e) => { e.stopPropagation(); fn(); }
      }, h('span', null, mark));

    const bar = h('div', { class: 'win-bar' },
      h('div', { class: 'win-lights' },
        light('close', '\u00d7', 'Close', () => win.close()),
        light('min', '\u2212', 'Minimise', () => win.minimize()),
        light('max', '\u2197', 'Fullscreen', () => win.toggleFullscreen())
      ),
      h('div', { class: 'win-title' },
        glyph ? svg(TITLE_GLYPH[glyph] || TITLE_GLYPH.page) : null,
        h('span', null, title)
      )
    );

    bar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.light')) return;
      win.toggleFullscreen();
    });
    return bar;
  }

  function enableDrag(win, handle) {
    handle.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || win.fullscreen || e.target.closest('.light')) return;
      focus(win.id);
      const r = win.el.getBoundingClientRect();
      const lr = layer.getBoundingClientRect();
      const offX = e.clientX - r.left;
      const offY = e.clientY - r.top;
      win.el.classList.add('is-dragging');
      handle.setPointerCapture(e.pointerId);

      const move = (ev) => {
        const b = bounds();
        win.el.style.left = clamp(ev.clientX - lr.left - offX, -r.width + 90, b.w - 90) + 'px';
        win.el.style.top = clamp(ev.clientY - lr.top - offY, 0, b.h - BAR_H) + 'px';
      };
      const up = (ev) => {
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', up);
        win.el.classList.remove('is-dragging');
        win.saveFrame();
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', up);
    });
  }

  function enableResize(win, grip) {
    grip.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || win.fullscreen) return;
      e.stopPropagation();
      focus(win.id);
      const r = win.el.getBoundingClientRect();
      const startX = e.clientX, startY = e.clientY;
      grip.setPointerCapture(e.pointerId);

      const move = (ev) => {
        const b = bounds();
        win.el.style.width = clamp(r.width + (ev.clientX - startX), 300, b.w - 8) + 'px';
        win.el.style.height = clamp(r.height + (ev.clientY - startY), 160, b.h - 8) + 'px';
      };
      const up = (ev) => {
        grip.releasePointerCapture(ev.pointerId);
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', up);
        win.saveFrame();
      };
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', up);
    });
  }

  function open(opts) {
    const {
      id, appId = id, title, glyph = 'page',
      width = 900, height = 620, resizable = true,
      content, onClose
    } = opts;

    // Singleton per id: a second launch focuses (or un-minimises) the window.
    if (windows.has(id)) {
      const w = windows.get(id);
      if (w.minimized) w.restore(); else focus(id);
      return w;
    }

    const frame = place(width, height);
    const el = h('div', {
      class: 'win is-opening',
      role: 'dialog', 'aria-label': title,
      dataset: { winId: id, appId },
      style: {
        left: frame.left + 'px', top: frame.top + 'px',
        width: frame.width + 'px', height: frame.height + 'px'
      }
    });

    const body = h('div', { class: 'win-body' });
    const grip = resizable ? h('div', { class: 'win-grip', title: 'Resize' }) : null;

    const win = {
      id, appId, el, body,
      minimized: false,
      fullscreen: false,
      savedFrame: { ...frame },
      title,

      saveFrame() {
        if (win.fullscreen) return;
        win.savedFrame = {
          left: parseFloat(el.style.left) || 0,
          top: parseFloat(el.style.top) || 0,
          width: el.offsetWidth,
          height: el.offsetHeight
        };
      },

      setTitle(next) {
        win.title = next;
        const span = el.querySelector('.win-title span');
        if (span) span.textContent = next;
        bus.emit('win:title', win);
      },

      focus: () => focus(id),

      toggleFullscreen() {
        if (win.minimized) return;
        win.fullscreen = !win.fullscreen;
        el.classList.add('is-snapping');
        if (win.fullscreen) {
          win.saveFrame();
          // Classes first: they widen the window layer to include the menu bar
          // strip, and bounds() has to measure the layer at its new size.
          el.classList.add('is-fullscreen');
          root.classList.add('is-window-fullscreen');
          const b = bounds();
          Object.assign(el.style, { left: '0px', top: '0px', width: b.w + 'px', height: b.h + 'px' });
          // Take the whole display too, where the browser allows it.
          if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } else {
          el.classList.remove('is-fullscreen');
          root.classList.remove('is-window-fullscreen');
          const f = win.savedFrame;
          Object.assign(el.style, {
            left: f.left + 'px', top: f.top + 'px',
            width: f.width + 'px', height: f.height + 'px'
          });
        }
        setTimeout(() => el.classList.remove('is-snapping'), 340);
        focus(id);
        bus.emit('win:fullscreen', win);
      },

      async minimize() {
        if (win.minimized) return;
        win.minimized = true;
        win.saveFrame();
        if (win.fullscreen) {
          // Leave fullscreen first, otherwise there is nothing to shrink from.
          win.fullscreen = false;
          el.classList.remove('is-fullscreen');
          root.classList.remove('is-window-fullscreen');
          const f = win.savedFrame;
          Object.assign(el.style, {
            left: f.left + 'px', top: f.top + 'px',
            width: f.width + 'px', height: f.height + 'px'
          });
        }
        bus.emit('win:minimize', win);          // dock creates the slot first…
        await Promise.resolve();
        const target = getMinimizeTarget ? getMinimizeTarget(win) : null;
        await minimizeTo(el, target);           // …then we fly into it.
        el.style.visibility = 'hidden';
        const next = frontmost();
        if (next) focus(next.id); else bus.emit('win:focus', null);
      },

      async restore() {
        if (!win.minimized) return;
        el.style.visibility = '';
        const target = getMinimizeTarget ? getMinimizeTarget(win) : null;
        win.minimized = false;
        bus.emit('win:restore', win);
        await restoreFrom(el, target);
        focus(id);
      },

      close() {
        if (win.closing) return;
        win.closing = true;
        el.classList.remove('is-opening');
        el.classList.add('is-closing');
        if (win.fullscreen) root.classList.remove('is-window-fullscreen');
        const done = () => {
          el.remove();
          windows.delete(id);
          const i = order.indexOf(id);
          if (i >= 0) order.splice(i, 1);
          bus.emit('win:close', win);
          if (onClose) onClose(win);
          const next = frontmost();
          if (next) focus(next.id); else bus.emit('win:focus', null);
        };
        prefersReducedMotion() ? done() : setTimeout(done, 200);
      }
    };

    const bar = makeBar(win, { title, glyph });
    el.append(bar, body);
    if (grip) el.append(grip);
    el.addEventListener('pointerdown', () => focus(id), true);

    enableDrag(win, bar);
    if (grip) enableResize(win, grip);

    windows.set(id, win);
    order.push(id);
    layer.appendChild(el);
    setTimeout(() => el.classList.remove('is-opening'), 400);

    // Content is built after mount so apps can measure their own body.
    if (content) body.appendChild(content(win));

    // Announce the window before focusing it: the dock builds its tile on
    // win:open, and the tile has to exist for win:focus to mark it active.
    bus.emit('win:open', win);
    focus(id);
    return win;
  }

  // Keep windows inside the viewport when it changes size.
  window.addEventListener('resize', () => {
    const b = bounds();
    for (const win of windows.values()) {
      if (win.fullscreen) {
        Object.assign(win.el.style, { width: b.w + 'px', height: b.h + 'px', left: '0px', top: '0px' });
        continue;
      }
      win.el.style.left = clamp(parseFloat(win.el.style.left) || 0, -win.el.offsetWidth + 90, b.w - 90) + 'px';
      win.el.style.top = clamp(parseFloat(win.el.style.top) || 0, 0, Math.max(0, b.h - BAR_H)) + 'px';
    }
  });

  // macOS-ish keyboard: Esc / Cmd-W close, Cmd-M minimise.
  window.addEventListener('keydown', (e) => {
    const top = frontmost();
    if (!top) return;
    const meta = e.metaKey || e.ctrlKey;
    if (e.key === 'Escape') { e.preventDefault(); top.fullscreen ? top.toggleFullscreen() : top.close(); }
    else if (meta && e.key.toLowerCase() === 'w') { e.preventDefault(); top.close(); }
    else if (meta && e.key.toLowerCase() === 'm') { e.preventDefault(); top.minimize(); }
  });

  return {
    open,
    focus,
    frontmost,
    get(id) { return windows.get(id) || null; },
    has(id) { return windows.has(id); },
    all() { return Array.from(windows.values()); },
    byApp(appId) { return Array.from(windows.values()).filter((w) => w.appId === appId); },
    closeAll(appId) { for (const w of this.byApp(appId)) w.close(); }
  };
}
