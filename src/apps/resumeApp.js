/** The one-page résumé, shown as a sheet of paper on a desk. */
import { h } from '../os/dom.js';
import { RESUME } from '../data/resume.js';

export function openResume(ctx) {
  return ctx.wm.open({
    id: 'resume', appId: 'resume',
    title: RESUME.fileName, glyph: 'page',
    width: 860, height: 720,
    content: () => build(ctx)
  });
}

function build(ctx) {
  const r = RESUME;

  const sheet = h('div', { class: 'sheet' },
    h('div', { class: 'sheet-head' },
      h('div', null,
        h('h1', { class: 'sheet-name' }, r.head.name),
        h('div', { class: 'label' }, `${r.head.role} · ${r.head.place}`)
      ),
      h('div', { class: 'stamp' }, 'One page')
    ),
    h('div', { class: 'sheet-rule' }),
    h('p', { class: 'sheet-intro' }, r.intro),

    h('div', { class: 'sheet-links' },
      ...r.links.map((l) => h('a', {
        class: 'sheet-link', href: l.href,
        target: l.href.startsWith('http') ? '_blank' : null,
        rel: l.href.startsWith('http') ? 'noopener noreferrer' : null
      },
        h('span', { class: 'label' }, l.label),
        h('span', { class: 'sheet-link-value' }, l.value)
      ))
    ),

    h('div', { class: 'sheet-roles' },
      ...r.roles.map((role) => h('div', { class: 'sheet-role' },
        h('div', { class: 'label' }, role.when),
        h('div', null,
          h('div', { class: 'sheet-role-what' }, role.what),
          h('div', { class: 'label' }, role.where),
          h('p', { class: 'sheet-role-note' }, role.note)
        )
      ))
    ),

    h('div', { class: 'sheet-blocks' },
      ...r.blocks.map((b) => h('div', null,
        h('div', { class: 'label sheet-block-title' }, b.title),
        h('div', { class: 'sheet-block-items' },
          ...b.items.map((it) => h('div', null, it))
        )
      ))
    )
  );

  return h('div', { class: 'win-body' },
    h('div', { class: 'win-toolbar sheet-bar' },
      h('span', null, `Page 1 of 1 · ${r.size}`),
      h('a', { class: 'sheet-dl', href: r.pdfHref, download: '' }, 'Download PDF')
    ),
    h('div', { class: 'win-scroll desk' }, sheet),
    h('div', { class: 'win-status' },
      h('span', null, 'The summarised version. The dossier has the rest'),
      h('button', { class: 'link-btn', onclick: () => ctx.actions.showDossier(1) }, 'Open the dossier →')
    )
  );
}
