/**
 * Boot gate.
 *
 * Asks for F11 before letting anyone in, because the desktop metaphor only
 * really lands edge-to-edge. F11 is owned by the browser and cannot be
 * triggered from script, so we ask for it, detect when it happens, and also
 * offer a button that uses the Fullscreen API. Either way the visitor can
 * walk straight past. Never trap someone behind a display preference.
 */
import { h, clear, isTouch } from './dom.js';
import { CONFIG } from '../config.js';
import { PROFILE } from '../data/profile.js';
import { PROJECTS } from '../data/projects.js';

const SESSION_KEY = 'portfolio-os:booted';

/** Projects plus the résumé, as a file range: 001-007. */
const FILE_COUNT = PROJECTS.length + 1;
const FILE_RANGE = '001–' + String(FILE_COUNT).padStart(3, '0');

const isFullscreen = () =>
  Boolean(document.fullscreenElement) ||
  (window.innerHeight >= screen.height - 2 && window.innerWidth >= screen.width - 2);

export function runBoot({ mount, onEnter }) {
  const alreadyBooted = CONFIG.boot.rememberPerSession && sessionStorage.getItem(SESSION_KEY) === '1';
  if (CONFIG.boot.skip || alreadyBooted) {
    mount.hidden = true;
    onEnter();
    return;
  }

  document.body.classList.add('booting');

  // A phone has no F11 and no fullscreen key. Asking for one there is noise.
  const touch = isTouch();

  const status = h('div', { class: 'boot-status' },
    h('span', { class: 'led' }),
    h('span', { class: 'boot-status-text' }, 'Windowed')
  );
  const keycap = h('kbd', { class: 'keycap' }, 'F11');

  const enterBtn = h('button', { class: 'boot-btn', onclick: () => enter() }, 'Come in →');
  const fsBtn = h('button', {
    class: 'boot-btn boot-btn--ghost',
    onclick: async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch { /* the browser said no; the F11 route still works */ }
    }
  }, 'Or click to go fullscreen');

  const card = h('div', { class: 'boot-card-wrap' },
    h('div', { class: 'boot-tab' }, h('span', { class: 'dim' }, FILE_RANGE), h('span', null, 'Portfolio')),
    h('div', { class: 'boot-card' },
      h('div', { class: 'boot-name' }, 'Ahmed', h('br'), 'Yasser'),
      h('div', { class: 'boot-rule' }),
      h('div', { class: 'boot-step' },
        h('div', { class: 'boot-kicker' }, 'Before you open it'),
        h('div', { class: 'boot-instruction' },
          touch ? null : keycap,
          touch
            ? h('span', null, 'This portfolio is a desktop. It works best on a bigger screen, but it folds down to fit, so come in.')
            : h('span', null, 'Press ', h('strong', null, 'F11'), ' for fullscreen. This portfolio is a desktop. It wants the whole screen.')
        ),
        touch ? null : h('div', { class: 'boot-hint' }, status),
        h('div', { class: 'boot-actions' }, enterBtn, touch ? null : fsBtn)
      )
    ),
    h('div', { class: 'boot-stamp' }, PROFILE.role)
  );

  clear(mount).appendChild(card);
  mount.hidden = false;
  setTimeout(() => enterBtn.focus({ preventScroll: true }), 1200);

  function sync() {
    if (touch) return;
    const on = isFullscreen();
    mount.classList.toggle('is-fullscreen', on);
    const text = mount.querySelector('.boot-status-text');
    if (text) text.textContent = on ? 'Fullscreen ready' : 'Windowed';
    enterBtn.textContent = on ? 'Come in →' : 'Come in anyway →';
    fsBtn.textContent = on ? 'Exit fullscreen' : 'Or click to go fullscreen';
  }
  sync();

  document.addEventListener('fullscreenchange', sync);
  const onResize = () => sync();
  window.addEventListener('resize', onResize);

  const onKey = (e) => {
    if (e.key === 'F11') {
      keycap.classList.add('is-pressed');
      setTimeout(() => keycap.classList.remove('is-pressed'), 260);
      setTimeout(sync, 320);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); }
  };
  window.addEventListener('keydown', onKey);

  let entered = false;
  function enter() {
    if (entered) return;
    entered = true;
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('fullscreenchange', sync);
    sessionStorage.setItem(SESSION_KEY, '1');

    mount.classList.add('is-lifting');
    document.body.classList.remove('booting');
    onEnter();
    setTimeout(() => { mount.hidden = true; clear(mount); }, 950);
  }
}
