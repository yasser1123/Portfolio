/**
 * Agent window — toggled from the dock.
 *
 * Owns the transcript; asks src/agent/client.js for an answer and replays any
 * tool calls that came back against the window manager. Whether the answer came
 * from Claude or the offline engine is shown in the status bar rather than
 * hidden, because a visitor deserves to know which one they are talking to.
 */
import { h, clear } from '../os/dom.js';
import { ask, isRemoteAvailable } from '../agent/client.js';
import { CHIPS } from '../agent/local.js';
import { createRunner } from '../agent/tools.js';

const GREETING = 'I am the agent for this portfolio. I know his files, his stack, and where everything lives — ask, or tap a chip below.';

export function openAgent(ctx) {
  return ctx.wm.open({
    id: 'agent', appId: 'agent',
    title: 'Agent — ask about Ahmed', glyph: 'agent',
    width: 460, height: 580,
    content: () => build(ctx)
  });
}

/** Dock click toggles: open if closed, close if already open. */
export function toggleAgent(ctx) {
  const existing = ctx.wm.get('agent');
  if (existing && !existing.minimized) { existing.close(); return null; }
  return openAgent(ctx);
}

function build(ctx) {
  const runActions = createRunner(ctx.actions);
  const history = [];
  let busy = false;

  const log = h('div', { class: 'ag-log' });
  const source = h('span', { class: 'ag-source' });
  const input = h('input', {
    class: 'ag-input', placeholder: 'Ask about his experience…',
    autocomplete: 'off', 'aria-label': 'Ask the agent'
  });
  const sendBtn = h('button', { class: 'ag-send', type: 'submit' }, 'Send');

  function bubble(who, text) {
    const el = h('div', { class: `ag-msg ag-msg--${who}` }, text);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function thinking() {
    const el = h('div', { class: 'ag-msg ag-msg--think' }, '…');
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    let n = 0;
    const t = setInterval(() => { n = (n + 1) % 3; el.textContent = '.'.repeat(n + 1); }, 320);
    return { el, stop: () => { clearInterval(t); el.remove(); } };
  }

  async function submit(question) {
    const q = (question || '').trim();
    if (!q || busy) return;
    busy = true;
    sendBtn.disabled = true;
    input.value = '';

    bubble('me', q);
    history.push({ role: 'user', content: q });
    const pending = thinking();

    try {
      const reply = await ask(q, history);
      pending.stop();
      bubble('bot', reply.text);
      history.push({ role: 'assistant', content: reply.text });
      source.textContent = reply.source === 'remote' ? 'Claude' : 'offline answers';
      source.className = 'ag-source' + (reply.source === 'remote' ? ' is-live' : '');
      runActions(reply.actions);
    } catch (err) {
      pending.stop();
      bubble('bot', 'Something went wrong reaching me. Try again, or email him directly at ayasser.hashem@gmail.com.');
    } finally {
      busy = false;
      sendBtn.disabled = false;
      input.focus({ preventScroll: true });
    }
  }

  const chips = h('div', { class: 'ag-chips' },
    ...CHIPS.map((c) => h('button', { class: 'ag-chip', onclick: () => submit(c) }, c))
  );

  const form = h('form', {
    class: 'ag-form',
    onsubmit: (e) => { e.preventDefault(); submit(input.value); }
  }, input, sendBtn);

  bubble('bot', GREETING);
  source.textContent = isRemoteAvailable() ? 'connecting…' : 'offline answers';

  setTimeout(() => input.focus({ preventScroll: true }), 80);

  // Let anything else in the app talk to the agent (e.g. a "ask about this" link).
  ctx.bus.on('agent:ask', (q) => submit(q));

  return h('div', { class: 'win-body ag' },
    log,
    chips,
    form,
    h('div', { class: 'win-status ag-status' },
      h('span', null, 'Answers come from his real files'),
      source
    )
  );
}
