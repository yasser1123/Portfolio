/** Finder: the Portfolio folder. Double-click a row to open that document. */
import { h, clear, isTouch } from '../os/dom.js';
import { PROJECTS } from '../data/projects.js';
import { RESUME } from '../data/resume.js';

export function openFinder(ctx) {
  return ctx.wm.open({
    id: 'finder', appId: 'finder',
    title: 'Portfolio', glyph: 'folder',
    width: 720, height: 470,
    content: (win) => build(ctx, win)
  });
}

function entries(ctx) {
  return [
    ...PROJECTS.map((p) => ({
      name: `${p.num} — ${p.title}.case`,
      date: p.date,
      kind: 'Case file',
      size: '— ',
      open: () => ctx.actions.openProject(p.id)
    })),
    {
      name: RESUME.fileName,
      date: RESUME.date,
      kind: 'PDF document',
      size: RESUME.size,
      open: () => ctx.actions.openResume()
    }
  ];
}

function build(ctx, win) {
  const rows = entries(ctx);
  let selected = null;

  const status = h('span', null, `${rows.length} items`);
  const list = h('div', { class: 'fx-list', role: 'listbox', tabindex: '0' });

  function paint() {
    clear(list);
    rows.forEach((e, i) => {
      const on = selected === i;
      const row = h('div', {
        class: 'fx-row' + (on ? ' is-selected' : ''),
        role: 'option', 'aria-selected': on ? 'true' : 'false',
        onclick: (ev) => {
          ev.stopPropagation();
          selected = i;
          paint();
          if (isTouch()) e.open();
        },
        ondblclick: () => { selected = i; paint(); e.open(); }
      },
        h('div', { class: 'fx-name' },
          h('div', { class: 'fx-icon' }),
          h('span', null, e.name)
        ),
        h('span', { class: 'fx-kind' }, e.kind),
        h('span', { class: 'fx-date' }, e.date)
      );
      list.appendChild(row);
    });
    status.textContent = selected == null
      ? `${rows.length} items`
      : `${rows.length} items · 1 selected`;
  }

  // Keyboard: arrows move, Enter opens — the way a file list should behave.
  list.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      const dir = ev.key === 'ArrowDown' ? 1 : -1;
      selected = selected == null ? 0 : Math.min(rows.length - 1, Math.max(0, selected + dir));
      paint();
    } else if (ev.key === 'Enter' && selected != null) {
      ev.preventDefault();
      rows[selected].open();
    }
  });

  const sidebar = h('aside', { class: 'fx-sidebar' },
    h('div', { class: 'fx-side-title' }, 'Favourites'),
    h('button', { class: 'fx-side-item is-active' }, 'Portfolio'),
    h('button', { class: 'fx-side-item', onclick: () => ctx.actions.openResume() }, 'Résumé'),
    h('button', { class: 'fx-side-item', onclick: () => ctx.actions.showDossier(0) }, 'Dossier'),
    h('button', { class: 'fx-side-item', onclick: () => ctx.actions.openContact() }, 'Contact'),
    h('div', { class: 'fx-side-title' }, 'Agent'),
    h('button', { class: 'fx-side-item', onclick: () => ctx.actions.openAgent() }, 'Ask about Ahmed')
  );

  const main = h('div', { class: 'fx-main' },
    h('div', { class: 'win-toolbar fx-crumbs' },
      h('span', { class: 'fx-nav' }, '‹'),
      h('span', { class: 'fx-nav is-off' }, '›'),
      h('div', { class: 'fx-path' },
        h('span', null, 'Macintosh HD'), h('span', { class: 'sep' }, '▸'),
        h('span', null, 'Ahmed Yasser'), h('span', { class: 'sep' }, '▸'),
        h('strong', null, 'Portfolio')
      )
    ),
    h('div', { class: 'fx-head' },
      h('span', null, 'Name'), h('span', null, 'Kind'), h('span', null, 'Date modified')
    ),
    h('div', { class: 'fx-scroll', onclick: () => { selected = null; paint(); } }, list),
    h('div', { class: 'win-status' },
      status,
      h('span', { style: { opacity: '0.72' } }, isTouch() ? 'Tap to open' : 'Double-click to open')
    )
  );

  paint();
  setTimeout(() => list.focus({ preventScroll: true }), 60);
  return h('div', { class: 'fx' }, sidebar, main);
}
