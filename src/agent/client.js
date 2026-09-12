/**
 * Agent client.
 *
 * Tries the serverless route first; falls back to the offline engine on any
 * failure: missing endpoint, no API key, timeout, rate limit. The UI calls
 * `ask()` and always gets { text, actions, source } back.
 */
import { CONFIG } from '../config.js';
import { answerLocally } from './local.js';

let remoteAvailable = CONFIG.agent.preferRemote && Boolean(CONFIG.endpoints.agent);

export function isRemoteAvailable() { return remoteAvailable; }

/** Trim history to the configured window and drop anything but role/content. */
function packHistory(messages) {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .slice(-CONFIG.agent.historyTurns * 2)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));
}

export async function ask(question, history = []) {
  if (remoteAvailable) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CONFIG.agent.timeoutMs);

      const res = await fetch(CONFIG.endpoints.agent, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: packHistory(history)
        }),
        signal: controller.signal
      });
      clearTimeout(timer);

      if (res.status === 404 || res.status === 501) {
        // No function deployed, or no key configured. Stop trying for this session.
        remoteAvailable = false;
        throw new Error('agent endpoint unavailable');
      }
      if (!res.ok) {
        // Past the daily spend cap the endpoint will keep refusing, so stop
        // asking and let the offline engine answer for the rest of the session.
        if (res.status === 429) {
          const info = await res.json().catch(() => ({}));
          if (typeof info.code === 'string' && info.code.indexOf('daily_cap') === 0) remoteAvailable = false;
        }
        throw new Error(`agent ${res.status}`);
      }

      const data = await res.json();
      if (!data || typeof data.text !== 'string') throw new Error('malformed agent response');

      return {
        text: data.text,
        actions: Array.isArray(data.actions) ? data.actions : [],
        source: 'remote'
      };
    } catch (err) {
      if (err && err.name !== 'AbortError') console.info('[agent] falling back to local:', err.message);
    }
  }

  const local = answerLocally(question);
  return { ...local, source: 'local' };
}
