/** Boot the machine and wire the parts together. */
import { $, h, createBus, clear } from './os/dom.js';
import { createWindowManager } from './os/wm.js';
import { createDock } from './os/dock.js';
import { createMenubar } from './os/menubar.js';
import { runBoot } from './os/boot.js';
import { renderHero } from './desktop/hero.js';
import { renderDossier } from './desktop/dossier.js';
import { openFinder } from './apps/finder.js';
import { openCaseFile } from './apps/caseFile.js';
import { openResume } from './apps/resumeApp.js';
import { openContact } from './apps/contactApp.js';
import { openAgent, toggleAgent } from './apps/agentApp.js';
import { PROFILE } from './data/profile.js';
import { findProject } from './data/projects.js';

const bus = createBus();
const osRoot = $('#os');
const desktop = $('#desktop');
const layer = $('#window-layer');

// Actions are the app's public verbs. The agent's tools, the dock, the menu bar
// and the in-page links all go through this one object.
const actions = {};
const ctx = { bus, actions, wm: null };

ctx.wm = createWindowManager({
  layer, root: osRoot, bus,
  getMinimizeTarget: (win) => dock.minimizeTarget(win)
});

// ── Desktop content ───────────────────────────────────────────────────────
let dossierSection = null;

function renderDesktop() {
  const mount = clear($('#desktop-content'));
  mount.appendChild(renderHero(ctx));
  dossierSection = renderDossier(ctx);
  mount.appendChild(dossierSection);
  mount.appendChild(h('footer', { class: 'foot' },
    h('span', { class: 'label' }, `${PROFILE.name} · ${PROFILE.role}`),
    h('div', { class: 'foot-links' },
      h('button', { class: 'label link-btn', onclick: () => actions.openContact() }, 'Contact'),
      ...PROFILE.links.slice(1).map((l) => h('a', {
        class: 'label', href: l.href,
        target: l.href.startsWith('http') ? '_blank' : null,
        rel: l.href.startsWith('http') ? 'noopener noreferrer' : null
      }, l.label))
    )
  ));
}

// ── Verbs ─────────────────────────────────────────────────────────────────
Object.assign(actions, {
  openFinder: () => openFinder(ctx),
  openProject: (id) => openCaseFile(ctx, id),
  openResume: () => openResume(ctx),
  openContact: (subject) => openContact(ctx, subject),
  openAgent: () => openAgent(ctx),
  toggleAgent: () => toggleAgent(ctx),
  openDossier: () => actions.showDossier(null),

  /**
   * The agent can offer the source. By the time its reply lands the click that
   * started it is long gone, so the browser may refuse the popup. When it does,
   * open the case file instead, which carries the same link for the visitor to
   * click themselves.
   */
  openGithub: (id) => {
    const project = id ? findProject(id) : null;
    const profileLink = PROFILE.links.find((l) => l.label === 'GitHub');
    const url = (project && project.repo) || (profileLink && profileLink.href);
    if (!url) return;
    const tab = window.open(url, '_blank', 'noopener,noreferrer');
    if (tab) return;
    // Blocked. Put the visitor somewhere the link is clickable by hand: the case
    // file carries its own repository link, and the folder leads to all of them.
    if (project) actions.openProject(project.id);
    else actions.openFinder();
  },

  /**
   * The dossier lives on the desktop, behind the windows, so getting to it
   * means clearing the desk first. Every open window tucks into the dock, then
   * we scroll. Nothing is closed: one click on a dock tile brings it all back.
   */
  showDossier: async (tab) => {
    if (!dossierSection) return;
    if (tab != null && dossierSection.selectTab) dossierSection.selectTab(tab);

    const open = ctx.wm.all().filter((w) => !w.minimized && !w.closing);
    if (open.length) await Promise.all(open.map((w) => w.minimize()));

    // Switching tabs changes the panel's height, so a pixel target computed
    // before the relayout lands in the wrong place. scrollIntoView resolves the
    // position itself and flushes layout first. Called directly rather than in a
    // rAF, which never fires while the tab is in the background.
    dossierSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// ── Dock ──────────────────────────────────────────────────────────────────
const dock = createDock({
  mount: $('#dock'), bus,
  apps: [
    { id: 'finder', label: 'Portfolio', icon: 'finder', onClick: () => actions.openFinder() },
    { id: 'resume', label: 'Résumé', icon: 'resume', onClick: () => actions.openResume() },
    { id: 'dossier', label: 'Dossier', icon: 'dossier', onClick: () => actions.showDossier(0) },
    { id: 'contact', label: 'Contact me', icon: 'contact', onClick: () => actions.openContact() },
    { id: 'agent', label: 'Agent', icon: 'agent', onClick: () => actions.toggleAgent() }
  ]
});

const syncDock = () => bus.emit('wm:sync', ctx.wm.all().filter((w) => !w.closing));
bus.on('win:open', syncDock);
bus.on('win:close', () => setTimeout(syncDock, 0));

// ── Menu bar ──────────────────────────────────────────────────────────────
createMenubar({ mount: $('#menubar'), bus, actions });

// ── Fullscreen chrome reveal ──────────────────────────────────────────────
// While a window is fullscreen the dock and menu bar hide; nudging the pointer
// at either edge brings them back, like macOS.
window.addEventListener('pointermove', (e) => {
  if (!osRoot.classList.contains('is-window-fullscreen')) return;
  const nearEdge = e.clientY < 6 || e.clientY > window.innerHeight - 70;
  osRoot.classList.toggle('reveal-chrome', nearEdge);
});

// ── Go ────────────────────────────────────────────────────────────────────
renderDesktop();

runBoot({
  mount: $('#boot'),
  onEnter: () => {
    osRoot.hidden = false;
    const dockWrap = $('#dock');
    dockWrap.classList.add('is-entering');
    // rAF gives the nicest slide-up, but it never fires in a background tab,
    // so a timer guarantees the dock arrives either way.
    const reveal = () => dockWrap.classList.remove('is-entering');
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    setTimeout(reveal, 120);
  }
});

// Kept for parity with the original build: a hook anything can drive.
window.portfolioOS = { ...actions, wm: ctx.wm, bus };
