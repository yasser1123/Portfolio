/** A .case document window: one project, top to bottom. */
import { h, clear, prefersReducedMotion } from '../os/dom.js';
import { PROJECTS, findProject, projectIndex } from '../data/projects.js';

export function openCaseFile(ctx, id) {
  const p = findProject(id) || PROJECTS[0];
  const winId = `case:${p.id}`;

  return ctx.wm.open({
    // Case files are documents belonging to the Portfolio folder, so they light
    // that dock item's running indicator rather than needing a launcher of their own.
    id: winId, appId: 'finder',
    title: `${p.num} — ${p.title}.case`, glyph: 'page',
    width: 1040, height: 700,
    content: (win) => build(ctx, win, p)
  });
}

function build(ctx, win, project) {
  const scroll = h('div', { class: 'win-scroll doc' });
  let timer = null;

  function render(p) {
    if (timer) { clearInterval(timer); timer = null; }
    win.setTitle(`${p.num} — ${p.title}.case`);
    clear(scroll);

    // ── Header ──────────────────────────────────────────────────────────
    scroll.appendChild(h('div', { class: 'doc-pad' },
      h('div', { class: 'case-head' },
        h('div', null,
          h('h1', { class: 'case-title' }, p.title),
          h('div', { class: 'label' }, `${p.client} · ${p.discipline}`)
        ),
        h('div', null,
          h('p', { class: 'case-summary' }, p.summary),
          h('div', { class: 'chips' }, ...p.tags.map((t) => h('span', { class: 'chip' }, t)))
        )
      ),

      // ── Reel placeholder ───────────────────────────────────────────────
      h('div', { class: 'reel' },
        h('div', { class: 'reel-grain' }),
        h('div', { class: 'reel-mid' },
          h('div', { class: 'reel-play' }, '▶'),
          h('div', { class: 'label reel-label' }, p.reel)
        ),
        h('div', { class: 'reel-note' }, 'Drop walkthrough video here · 1920×1080')
      ),

      // ── Try it ─────────────────────────────────────────────────────────
      section('Try it', demo(p)),

      // ── Pipeline ───────────────────────────────────────────────────────
      section('The pipeline', pipeline(p)),

      // ── Outcome ────────────────────────────────────────────────────────
      section('Outcome', h('div', { class: 'metrics' },
        ...p.metrics.map((m) => h('div', { class: 'metric' },
          h('span', { class: 'label' }, m.label),
          h('span', { class: 'metric-value' }, m.value)
        ))
      )),

      // ── Gallery ────────────────────────────────────────────────────────
      h('div', { class: 'gallery' },
        ...p.gallery.map((g) => h('div', { class: 'gallery-cell' }, h('span', { class: 'label' }, g)))
      ),

      // ── Credits ────────────────────────────────────────────────────────
      section('Role & stack', h('div', { class: 'credits' },
        ...p.credits.map((c) => h('div', null,
          h('div', { class: 'label' }, c.role),
          h('div', { class: 'credit-name' }, c.name)
        ))
      ), true),

      // ── Next ───────────────────────────────────────────────────────────
      nextLink(p)
    ));
  }

  function section(title, body, ruled) {
    return h('div', { class: 'doc-section' + (ruled ? ' is-ruled' : '') },
      h('div', { class: 'label doc-section-label' }, title),
      h('div', { class: 'doc-section-body' }, body)
    );
  }

  // ── The inference sandbox: types the canned answer out ────────────────
  function demo(p) {
    const out = h('pre', { class: 'demo-out' });
    const caret = h('span', { class: 'demo-caret' }, '▌');
    const query = h('div', { class: 'demo-query' });
    const state = h('span', null, 'complete');
    let active = 0;

    const buttons = p.prompts.map((pr, i) =>
      h('button', {
        class: 'demo-btn', onclick: () => run(i)
      }, pr.q)
    );

    function run(i) {
      active = i;
      buttons.forEach((b, j) => b.classList.toggle('is-on', j === i));
      const full = p.prompts[i].a;
      query.textContent = `> ${p.prompts[i].q}`;
      if (timer) clearInterval(timer);

      if (prefersReducedMotion()) {
        out.textContent = full;
        state.textContent = 'complete';
        caret.style.display = 'none';
        return;
      }
      out.textContent = '';
      state.textContent = 'generating';
      caret.style.display = '';
      let n = 0;
      timer = setInterval(() => {
        n += 3;
        if (n >= full.length) {
          clearInterval(timer); timer = null;
          out.textContent = full;
          state.textContent = 'complete';
          caret.style.display = 'none';
          return;
        }
        out.textContent = full.slice(0, n);
      }, 16);
    }

    const node = h('div', null,
      h('div', { class: 'demo-btns' }, ...buttons),
      h('div', { class: 'demo-screen' },
        h('div', { class: 'demo-bar' },
          h('span', null, p.demoLabel),
          state
        ),
        query,
        h('div', { class: 'demo-body' }, out, caret)
      )
    );
    setTimeout(() => run(0), 120);
    return node;
  }

  // ── Pipeline stages ───────────────────────────────────────────────────
  function pipeline(p) {
    let step = 0;
    const slot = h('div', { class: 'stage-slot' }, h('span', { class: 'label' }));
    const caption = h('p', { class: 'stage-caption' });
    const tabs = p.steps.map((s, i) =>
      h('button', { class: 'stage-tab', onclick: () => pick(i) }, `${i + 1}. ${s.label}`)
    );

    function pick(i) {
      step = i;
      tabs.forEach((t, j) => t.classList.toggle('is-on', j === i));
      slot.querySelector('.label').textContent = p.steps[i].slot;
      caption.textContent = p.steps[i].caption;
    }

    const node = h('div', null,
      h('div', { class: 'stage-tabs' }, ...tabs),
      h('div', { class: 'stage-grid' },
        slot,
        h('div', { class: 'stage-side' },
          caption,
          h('button', {
            class: 'btn-solid',
            onclick: () => pick((step + 1) % p.steps.length)
          }, 'Next stage →')
        )
      )
    );
    pick(0);
    return node;
  }

  function nextLink(p) {
    const i = projectIndex(p.id);
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    return h('button', {
      class: 'next-file',
      onclick: () => { render(next); scroll.scrollTo({ top: 0, behavior: 'smooth' }); }
    },
      h('div', null,
        h('div', { class: 'label' }, 'Next file'),
        h('div', { class: 'next-title' }, next.title)
      ),
      h('div', { class: 'next-arrow' }, 'Slide it out →')
    );
  }

  // Stop the typewriter when the window goes away.
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
  ctx.bus.on('win:close', (w) => { if (w === win) stop(); });

  render(project);
  return scroll;
}
