/** The long-form dossier: five tabbed panels on the desktop, below the fold. */
import { h, clear } from '../os/dom.js';
import { DOSSIER, STORY, DOMAINS, TBAR, TRACK, TOOLBOX, CREDS, PRINCIPLES, OFFCLOCK } from '../data/profile.js';
import { PROJECTS } from '../data/projects.js';

/** Derived so adding a case file does not leave this line lying. */
const CASE_RANGE = `01–${String(PROJECTS.length).padStart(2, '0')}`;

export function renderDossier(ctx) {
  let active = 0;
  const title = h('h2', { class: 'dos-title' });
  const note = h('p', { class: 'dos-note' });
  const panel = h('div', { class: 'dos-panel' });

  const tabs = DOSSIER.map((t, i) => h('button', {
    class: 'dos-tab', onclick: () => select(i)
  }, h('span', { class: 'dos-tab-tag' }, t.tag), h('span', null, t.label)));

  function select(i) {
    active = i;
    tabs.forEach((t, j) => t.classList.toggle('is-on', j === i));
    title.textContent = DOSSIER[i].title;
    note.textContent = DOSSIER[i].note;
    clear(panel).appendChild(PANELS[i]());
  }

  const PANELS = [profilePanel, trackPanel, toolboxPanel, credsPanel, beyondPanel];

  const section = h('section', { class: 'dos', id: 'dossier' },
    h('div', { class: 'dos-inner' },
      h('div', { class: 'dos-kicker' },
        h('span', { class: 'label' }, 'Dossier, the long version'),
        h('span', { class: 'label dim' }, 'Everything the résumé had to cut')
      ),
      h('div', { class: 'dos-tabs' }, ...tabs),
      h('div', { class: 'dos-card' },
        h('div', { class: 'dos-head' }, title, note),
        panel,
        h('div', { class: 'dos-foot' },
          h('span', { class: 'label' }, `Projects live in files ${CASE_RANGE}. Open the folder above`),
          h('button', { class: 'label link-btn accent', onclick: () => ctx.actions.openResume() }, 'Open the one-page résumé →')
        )
      )
    )
  );

  select(0);
  section.selectTab = select;
  return section;
}

function profilePanel() {
  return h('div', { class: 'dos-two' },
    h('div', { class: 'dos-story' }, ...STORY.map((p) => h('p', null, p))),
    h('div', { class: 'dos-aside' },
      h('div', null,
        h('div', { class: 'label' }, 'The shape of it'),
        h('div', { class: 'tshape' },
          h('div', { class: 'tshape-bar' }, ...TBAR.map((b) => h('div', { class: 'tshape-cell' }, b))),
          h('div', { class: 'tshape-stem' }, 'AI systems', h('br'), 'depth'),
          h('p', { class: 'tshape-note' }, 'Wide enough to build the whole thing alone. Deep in the part that decides whether it works.')
        )
      ),
      h('div', null,
        h('div', { class: 'label' }, 'Domains I have shipped in'),
        h('div', { class: 'chips' }, ...DOMAINS.map((d) => h('span', { class: 'chip' }, d)))
      )
    )
  );
}

function trackPanel() {
  return h('div', null, ...TRACK.map((r) => h('div', { class: 'track-row' },
    h('div', null,
      h('div', { class: 'label' }, r.when),
      h('div', { class: 'track-what' }, r.what),
      h('div', { class: 'label' }, r.where),
      h('div', { class: 'chips chips--tight' }, ...r.stack.map((s) => h('span', { class: 'chip chip--sq' }, s)))
    ),
    h('div', { class: 'track-bullets' }, ...r.bullets.map((b) => h('div', { class: 'bullet' },
      h('span', { class: 'bullet-dash' }, '–'), h('span', null, b)
    )))
  )));
}

function toolboxPanel() {
  return h('div', null, ...TOOLBOX.map((t) => h('div', { class: 'tool-row' },
    h('div', null,
      h('div', { class: 'tool-domain' }, t.domain),
      h('div', { class: 'label' + (t.depth.startsWith('Deep') ? ' accent' : '') }, t.depth)
    ),
    h('p', { class: 'tool-did' }, t.did),
    h('div', { class: 'chips chips--tight' }, ...t.tools.map((x) => h('span', { class: 'chip chip--sq' }, x)))
  )));
}

function credsPanel() {
  return h('div', { class: 'dos-cols' }, ...CREDS.map((c) => h('div', null,
    h('div', { class: 'label' }, c.title),
    h('div', null, ...c.items.map((it) => h('div', { class: 'cred-item' },
      h('div', { class: 'cred-name' }, it.name),
      h('div', { class: 'label' }, it.meta)
    )))
  )));
}

function beyondPanel() {
  return h('div', { class: 'dos-cols dos-cols--2' },
    h('div', null,
      h('div', { class: 'label' }, 'How I work'),
      ...PRINCIPLES.map((p) => h('div', { class: 'cred-item' },
        h('div', { class: 'principle-title' }, p.title),
        h('p', { class: 'principle-body' }, p.body)
      ))
    ),
    h('div', null,
      h('div', { class: 'label' }, 'Off the clock'),
      ...OFFCLOCK.map((o) => h('div', { class: 'cred-item off-row' },
        h('div', { class: 'label' }, o.label),
        h('p', { class: 'principle-body' }, o.body)
      ))
    )
  );
}
