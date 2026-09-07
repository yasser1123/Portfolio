/**
 * POST /api/agent  ->  { text, actions }
 *
 * Grounds Claude in the portfolio data and lets it drive the interface through
 * the tools declared in src/agent/tools.js. Those tools run in the visitor's
 * browser, not here, so the loop hands Claude a synthetic "the interface did it"
 * result and asks for the final prose; the client replays the calls for real.
 *
 * With no ANTHROPIC_API_KEY this returns 501 and the client falls back to the
 * offline keyword engine — the site still works on a plain static host.
 */
import Anthropic from '@anthropic-ai/sdk';
import { adapt, rateLimited } from './_shared.js';
import { SCHEMAS } from '../src/agent/tools.js';
import { PROJECTS } from '../src/data/projects.js';
import { RESUME } from '../src/data/resume.js';
import { PROFILE, TRACK, TOOLBOX, CREDS, PRINCIPLES, STORY } from '../src/data/profile.js';

const MODEL = process.env.AGENT_MODEL || 'claude-opus-5';
const MAX_TURNS = 3;

function buildSystem() {
  const projects = PROJECTS.map((p) =>
    `- ${p.num} ${p.title} (id: ${p.id}) — ${p.year}, ${p.client}, ${p.discipline}.\n` +
    `  ${p.summary}\n` +
    `  Stack/tags: ${p.tags.join(', ')}\n` +
    `  Outcomes: ${p.metrics.map((m) => `${m.label} ${m.value}`).join(' · ')}\n` +
    `  Credits: ${p.credits.map((c) => `${c.role}: ${c.name}`).join(' · ')}`
  ).join('\n');

  const track = TRACK.map((r) =>
    `- ${r.when} · ${r.what} · ${r.where}\n  ${r.bullets.join('\n  ')}`
  ).join('\n');

  const toolbox = TOOLBOX.map((t) => `- ${t.domain} [${t.depth}]: ${t.did} (${t.tools.join(', ')})`).join('\n');
  const creds = CREDS.map((c) => `- ${c.title}: ${c.items.map((i) => `${i.name} (${i.meta})`).join('; ')}`).join('\n');

  return `You are the agent embedded in ${PROFILE.name}'s portfolio site, which is presented as a small desktop operating system. Visitors are usually recruiters, hiring managers, or engineers.

Answer questions about ${PROFILE.name} using ONLY the facts below. If something is not here, say you do not have it and point them at the contact window — never invent a detail, a number, an employer, or a date.

Keep answers short: two to four sentences of plain prose. No markdown headers, no bullet lists unless you are quoting figures. Speak about him in the third person.

You can drive the interface. When a project, the résumé, the folder, the contact window, or a dossier tab is the best evidence for what was asked, call the matching tool and mention in your reply that you are opening it. Prefer one tool call per reply; never call more than two.

=== WHO ===
${PROFILE.name} — ${PROFILE.role}, ${PROFILE.place}. Contact: ${PROFILE.email}.
${PROFILE.lede}
${PROFILE.sub}

=== BACKGROUND, IN HIS WORDS ===
${STORY.join('\n')}

=== CASE FILES ===
${projects}

=== TRACK RECORD ===
${track}

=== TOOLBOX (depth labels are deliberate and honest) ===
${toolbox}

=== CREDENTIALS ===
${creds}

=== HOW HE WORKS ===
${PRINCIPLES.map((p) => `- ${p.title}: ${p.body}`).join('\n')}

=== RÉSUMÉ SUMMARY ===
${RESUME.intro}
${RESUME.roles.map((r) => `- ${r.when} ${r.what}, ${r.where}: ${r.note}`).join('\n')}`;
}

const SYSTEM = buildSystem();

export default async function handler(req, res) {
  const io = adapt(req, res);

  if (io.method !== 'POST') return io.send(405, { error: 'Method not allowed' });
  if (!process.env.ANTHROPIC_API_KEY) {
    return io.send(501, { error: 'Agent not configured', hint: 'Set ANTHROPIC_API_KEY to enable the model-backed agent.' });
  }
  if (rateLimited(io.ip())) return io.send(429, { error: 'Too many requests' });

  const body = await io.body();
  const question = typeof body.question === 'string' ? body.question.trim().slice(0, 2000) : '';
  if (!question) return io.send(400, { error: 'Missing question' });

  const history = Array.isArray(body.history)
    ? body.history
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-16)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))
    : [];

  const client = new Anthropic();
  const messages = [...history, { role: 'user', content: question }];
  const actions = [];
  let text = '';

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 2048,
        system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
        tools: SCHEMAS,
        messages,
        // Chat needs to feel instant; this is not a reasoning-heavy task.
        output_config: { effort: 'low' },
        // Rescue a policy decline on the same call rather than dead-ending.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default'
      });

      if (response.stop_reason === 'refusal') {
        return io.send(200, {
          text: 'I cannot answer that one. Ask me about his projects, his stack, or how to get in touch.',
          actions: []
        });
      }

      text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();

      const calls = response.content.filter((b) => b.type === 'tool_use');
      if (!calls.length) break;

      for (const call of calls) actions.push({ name: call.name, input: call.input || {} });

      // The tools live in the browser. Acknowledge, then let Claude finish the prose.
      messages.push({ role: 'assistant', content: response.content });
      messages.push({
        role: 'user',
        content: calls.map((c) => ({
          type: 'tool_result',
          tool_use_id: c.id,
          content: 'Done — the interface performed this action for the visitor. Reply with the short explanation now; do not call more tools.'
        }))
      });
    }

    return io.send(200, {
      text: text || 'Opening that now.',
      actions: actions.slice(0, 2)
    });
  } catch (err) {
    const status = err && err.status;
    if (status === 429) return io.send(429, { error: 'Rate limited upstream' });
    if (status === 401 || status === 403) return io.send(501, { error: 'Agent credentials rejected' });
    console.error('[api/agent]', err && err.message);
    return io.send(502, { error: 'Agent unavailable' });
  }
}
