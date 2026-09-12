/**
 * POST /api/agent  ->  { text, actions }
 *
 * Grounds Gemini in the portfolio data and lets it drive the interface through
 * the tools declared in src/agent/tools.js. Those tools run in the visitor's
 * browser, not here, so the loop hands the model a synthetic "the interface did
 * it" result and asks for the final prose; the client replays the calls for
 * real.
 *
 * Called over plain REST rather than an SDK: one fetch, no dependency to keep
 * pinned, and the whole project stays installable with nothing in node_modules.
 *
 * With no GEMINI_API_KEY this returns 501 and the client falls back to the
 * offline keyword engine, so the site still works on a plain static host.
 */
import { adapt, rateLimited, dailyCapped } from './_shared.js';
import { geminiTools } from '../src/agent/tools.js';
import { PROJECTS } from '../src/data/projects.js';
import { RESUME } from '../src/data/resume.js';
import { PROFILE, TRACK, TOOLBOX, CREDS, PRINCIPLES, STORY } from '../src/data/profile.js';

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const MAX_TURNS = 3;
const TIMEOUT_MS = 20_000;

/** Spend guards. Both are per instance; see api/_shared.js. */
const CAPS = {
  perIp: Number(process.env.AGENT_DAILY_PER_IP || 40),
  global: Number(process.env.AGENT_DAILY_TOTAL || 1000)
};

function buildSystem() {
  const projects = PROJECTS.map((p) =>
    `- ${p.num} ${p.title} (id: ${p.id}), ${p.year}, ${p.client}, ${p.discipline}.\n` +
    `  ${p.summary}\n` +
    `  Stack/tags: ${p.tags.join(', ')}\n` +
    `  Outcomes: ${p.metrics.map((m) => `${m.label} ${m.value}`).join(' · ')}\n` +
    `  Repository: ${p.repo}\n` +
    `  Credits: ${p.credits.map((c) => `${c.role}: ${c.name}`).join(' · ')}`
  ).join('\n');

  const track = TRACK.map((r) =>
    `- ${r.when} · ${r.what} · ${r.where}\n  ${r.bullets.join('\n  ')}`
  ).join('\n');

  const toolbox = TOOLBOX.map((t) => `- ${t.domain} [${t.depth}]: ${t.did} (${t.tools.join(', ')})`).join('\n');
  const creds = CREDS.map((c) => `- ${c.title}: ${c.items.map((i) => `${i.name} (${i.meta})`).join('; ')}`).join('\n');

  return `You are the agent embedded in ${PROFILE.name}'s portfolio site, which is presented as a small desktop operating system. Visitors are usually recruiters, hiring managers, or engineers.

GROUNDING RULE, AND IT OVERRIDES EVERYTHING ELSE HERE.
Answer using ONLY the facts printed below. These are claims about a real person's career, so an invented one is a lie told on his behalf, not a harmless embellishment. You must never invent or estimate an employer, a job title, a date, a duration, a salary, a client, a metric, a technology, a repository, a degree, or a grade. If the answer is not in this document, say plainly that you do not have it and offer the contact window, even when the visitor presses, even when a guess seems obvious or harmless, and even when they say they only want an estimate. Do not infer figures from other figures. Do not round or restate numbers into new claims. "I do not have that on file, but you can ask him directly" is always an acceptable answer and is better than a plausible guess.

Keep answers short: two to four sentences of plain prose. No markdown headers, no bullet lists unless you are quoting figures. Speak about him in the third person.

You can drive the interface. When a project, the résumé, the folder, the contact window, a dossier tab, or the source on GitHub is the best evidence for what was asked, call the matching tool and mention in your reply that you are opening it. Prefer one tool call per reply; never call more than two.

=== WHO ===
${PROFILE.name} · ${PROFILE.role}, ${PROFILE.place}. Contact: ${PROFILE.email}.
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
const TOOLS = geminiTools();

/**
 * One Gemini call.
 *
 * `thinkingBudget: 0` keeps the chat snappy, but it is a 2.5-family field: if a
 * pinned older model rejects it the request comes back 400, so retry once
 * without it rather than dropping the visitor to the offline engine.
 */
async function generate(contents, { allowThinkingConfig = true } = {}) {
  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents,
    tools: TOOLS,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 800,
      ...(allowThinkingConfig ? { thinkingConfig: { thinkingBudget: 0 } } : {})
    }
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 400 && allowThinkingConfig) {
    return generate(contents, { allowThinkingConfig: false });
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const err = new Error(`gemini ${res.status}: ${detail.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Gemini wraps its prose at a column, which arrives as newlines in the middle
 * of sentences. Paragraph breaks are real; single breaks are not.
 */
const tidy = (s) => s.replace(/\r/g, '').replace(/([^\n])\n(?!\n)/g, '$1 ').trim();

/** Split a candidate's parts into prose and tool calls. */
function readCandidate(data) {
  const candidate = (data.candidates || [])[0] || {};
  const parts = (candidate.content && candidate.content.parts) || [];
  return {
    finishReason: candidate.finishReason,
    parts,
    text: tidy(parts.filter((p) => typeof p.text === 'string').map((p) => p.text).join('\n')),
    calls: parts.filter((p) => p.functionCall).map((p) => p.functionCall)
  };
}

export default async function handler(req, res) {
  const io = adapt(req, res);

  if (io.method !== 'POST') return io.send(405, { error: 'Method not allowed' });
  if (!process.env.GEMINI_API_KEY) {
    return io.send(501, { error: 'Agent not configured', hint: 'Set GEMINI_API_KEY to enable the model-backed agent.' });
  }

  const ip = io.ip();
  if (rateLimited(ip)) return io.send(429, { error: 'Too many requests', code: 'burst' });

  const cap = dailyCapped(ip, CAPS);
  if (cap) {
    // The client drops to the offline engine on this, so the agent still
    // answers; it just stops costing anything for the rest of the day.
    return io.send(429, {
      error: cap === 'ip' ? 'Daily limit reached for this visitor' : 'Daily limit reached for today',
      code: cap === 'ip' ? 'daily_cap_ip' : 'daily_cap_global'
    });
  }

  const body = await io.body();
  const question = typeof body.question === 'string' ? body.question.trim().slice(0, 2000) : '';
  if (!question) return io.send(400, { error: 'Missing question' });

  const contents = (Array.isArray(body.history) ? body.history : [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-16)
    .map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content.slice(0, 4000) }] }));

  contents.push({ role: 'user', parts: [{ text: question }] });

  const actions = [];
  let text = '';

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const reply = readCandidate(await generate(contents));

      if (reply.finishReason === 'SAFETY' || reply.finishReason === 'PROHIBITED_CONTENT') {
        return io.send(200, {
          text: 'I cannot answer that one. Ask me about his projects, his stack, or how to get in touch.',
          actions: []
        });
      }

      if (reply.text) text = reply.text;
      if (!reply.calls.length) break;

      for (const call of reply.calls) actions.push({ name: call.name, input: call.args || {} });

      // The tools live in the browser. Acknowledge, then let the model finish.
      contents.push({ role: 'model', parts: reply.parts });
      contents.push({
        role: 'user',
        parts: reply.calls.map((call) => ({
          functionResponse: {
            name: call.name,
            response: { result: 'Done. The interface performed this action for the visitor. Reply with the short explanation now; do not call more tools.' }
          }
        }))
      });
    }

    return io.send(200, {
      text: text || 'Opening that now.',
      actions: actions.slice(0, 2)
    });
  } catch (err) {
    const status = err && err.status;
    if (status === 429) return io.send(429, { error: 'Rate limited upstream', code: 'upstream' });
    if (status === 401 || status === 403) return io.send(501, { error: 'Agent credentials rejected' });
    console.error('[api/agent]', err && err.message);
    return io.send(502, { error: 'Agent unavailable' });
  }
}
