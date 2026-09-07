/** Menu bar: active window name on the left, clock and fullscreen toggle right. */
import { h, clear } from './dom.js';
import { PROFILE } from '../data/profile.js';

export function createMenubar({ mount, bus, actions }) {
  const appName = h('div', { class: 'menubar-app' }, 'Finder');
  const clock = h('div', { class: 'menubar-clock' });

  const fsToggle = h('button', {
    class: 'menubar-fs', title: 'Toggle fullscreen (F11)',
    onclick: async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch { /* ignore */ }
    }
  }, h('span', null, '⤢'));

  clear(mount).append(
    h('div', { class: 'menubar-mark' }, 'AY'),
    appName,
    h('button', { class: 'menubar-item menubar-hide-sm', onclick: () => actions.openFinder() }, 'File'),
    h('button', { class: 'menubar-item menubar-hide-sm', onclick: () => actions.openDossier() }, 'Dossier'),
    h('button', { class: 'menubar-item menubar-hide-sm', onclick: () => actions.openContact() }, 'Contact'),
    h('button', { class: 'menubar-item menubar-hide-sm', onclick: () => actions.openAgent() }, 'Agent'),
    h('div', { class: 'menubar-spacer' }),
    h('div', { class: 'menubar-right' },
      h('span', { class: 'menubar-item menubar-hide-sm' }, PROFILE.place.split(' · ')[0]),
      fsToggle,
      clock
    )
  );

  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  tick();
  setInterval(tick, 15000);

  bus.on('win:focus', (win) => { appName.textContent = win ? win.title.split(' — ')[0] || win.title : 'Finder'; });
  bus.on('win:title', (win) => { appName.textContent = win.title; });

  return { el: mount };
}
