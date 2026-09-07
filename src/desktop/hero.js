/** The desktop surface: the folder sitting on the paper, and who it belongs to. */
import { h, isTouch } from '../os/dom.js';
import { PROFILE } from '../data/profile.js';

export function renderHero(ctx) {
  const folder = h('button', {
    class: 'folder', 'aria-label': 'Open the Portfolio folder',
    ondblclick: () => { hint.remove(); ctx.actions.openFinder(); },
    // Double-tap is a poor touch gesture (and invites zoom), so one tap opens.
    onclick: () => {
      hint.classList.add('is-tapped');
      if (isTouch()) { hint.remove(); ctx.actions.openFinder(); }
    },
    onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctx.actions.openFinder(); } }
  },
    h('div', { class: 'folder-art' },
      h('div', { class: 'folder-tab' }),
      h('div', { class: 'folder-page folder-page--b' }),
      h('div', { class: 'folder-page folder-page--a' }),
      h('div', { class: 'folder-front' })
    ),
    h('div', { class: 'folder-name' }, 'Portfolio'),
    h('div', { class: 'label folder-meta' }, isTouch() ? '4 items · tap to open' : '4 items · double-click to open')
  );

  // The looping ghost cursor that teaches the double-click.
  const hint = h('div', { class: 'hint', 'aria-hidden': 'true' },
    h('div', { class: 'hint-cursor' },
      h('div', { class: 'hint-ring hint-ring--1' }),
      h('div', { class: 'hint-ring hint-ring--2' }),
      h('div', { class: 'hint-arrow' }),
      h('div', { class: 'hint-chip' }, 'Double-click')
    )
  );

  // The hint overlays the folder exactly, so the ghost cursor lands on it.
  const left = h('div', { class: 'hero-left' },
    h('div', { class: 'folder-zone' }, folder, hint)
  );

  const right = h('div', { class: 'hero-right' },
    h('h1', { class: 'hero-name' }, 'Ahmed', h('br'), 'Yasser'),
    h('p', { class: 'hero-lede' }, PROFILE.lede),
    h('p', { class: 'hero-sub' }, PROFILE.sub),
    h('div', { class: 'chips' }, ...PROFILE.skills.map((s) => h('span', { class: 'chip' }, s))),
    h('div', { class: 'hero-rule-note' },
      h('span', { class: 'rule' }),
      h('span', { class: 'label' }, isTouch()
        ? 'Tap the folder, then tap a file to open it'
        : 'Double-click the folder, then double-click a file to open it')
    )
  );

  const scrollCue = h('button', {
    class: 'scroll-cue', onclick: () => ctx.actions.showDossier(null)
  },
    h('span', { class: 'label' }, 'Scroll — the long version'),
    h('span', { class: 'scroll-arrow' }, '↓')
  );

  return h('section', { class: 'hero' },
    h('header', { class: 'hero-head' },
      h('span', { class: 'label' }, `${PROFILE.name} — ${PROFILE.role}`),
      h('div', { class: 'hero-head-right' },
        h('span', { class: 'label' }, '4 files'),
        h('button', { class: 'label link-btn', onclick: () => ctx.actions.openContact() }, PROFILE.email)
      )
    ),
    h('div', { class: 'hero-grid' }, left, right, scrollCue)
  );
}
