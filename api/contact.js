/**
 * POST /api/contact  ->  { ok: true }
 *
 * Sends the Contact window's message on with Resend. Without RESEND_API_KEY it
 * returns 501 and the client falls back to opening the visitor's own mail app
 * with the message pre-filled, so the form is never a dead end.
 */
import { adapt, rateLimited } from './_shared.js';

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default async function handler(req, res) {
  const io = adapt(req, res);

  if (io.method !== 'POST') return io.send(405, { error: 'Method not allowed' });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!key || !to || !from) {
    return io.send(501, { error: 'Contact delivery not configured' });
  }
  if (rateLimited(io.ip(), { limit: 5, windowMs: 10 * 60_000 })) {
    return io.send(429, { error: 'Too many messages. Try again later' });
  }

  const body = await io.body();
  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const subject = clean(body.subject, 160) || 'Portfolio enquiry';
  const message = clean(body.message, 5000);
  const honeypot = clean(body.company, 100);   // hidden field; bots fill it in

  if (honeypot) return io.send(200, { ok: true });          // silently drop
  if (!name || !message) return io.send(400, { error: 'Name and message are required' });
  if (!looksLikeEmail(email)) return io.send(400, { error: 'A valid reply-to address is required' });

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Portfolio] ${subject} · ${name}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`
      })
    });

    if (!r.ok) {
      console.error('[api/contact] resend', r.status, await r.text().catch(() => ''));
      return io.send(502, { error: 'Could not send right now' });
    }
    return io.send(200, { ok: true });
  } catch (err) {
    console.error('[api/contact]', err && err.message);
    return io.send(502, { error: 'Could not send right now' });
  }
}
