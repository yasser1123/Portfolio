/**
 * Contact window.
 *
 * Posts to /api/contact when that route is deployed and configured. When it is
 * not (a plain static host, or no RESEND_API_KEY) it falls back to opening the
 * visitor's own mail client with everything pre-filled, so the form is never a
 * dead end and never silently swallows a message.
 */
import { h } from '../os/dom.js';
import { CONTACT } from '../data/contact.js';
import { CONFIG } from '../config.js';

export function openContact(ctx, subject) {
  const win = ctx.wm.open({
    id: 'contact', appId: 'contact',
    title: 'Contact · Ahmed Yasser', glyph: 'mail',
    width: 720, height: 620,
    content: () => build(ctx)
  });
  if (subject) {
    const sel = win.el.querySelector('[name="subject"]');
    if (sel) sel.value = subject;
  }
  return win;
}

function mailtoFallback({ name, email, subject, message }) {
  const body = `${message}\n\n${name}\nReply to: ${email}`;
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function build(ctx) {
  const note = h('div', { class: 'ct-note' });
  const submit = h('button', { class: 'btn-solid', type: 'submit' }, 'Send message');

  const field = (label, control) => h('label', { class: 'ct-field' },
    h('span', { class: 'label' }, label), control
  );

  const nameInput = h('input', { class: 'ct-input', name: 'name', required: true, autocomplete: 'name', placeholder: 'Your name' });
  const emailInput = h('input', { class: 'ct-input', name: 'email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@company.com' });
  const subjectSel = h('select', { class: 'ct-input', name: 'subject' },
    ...CONTACT.subjects.map((s) => h('option', { value: s }, s))
  );
  const messageInput = h('textarea', { class: 'ct-input ct-area', name: 'message', required: true, rows: '6', placeholder: 'What are you working on?' });
  // Hidden from people, irresistible to bots.
  const honeypot = h('input', { class: 'ct-honey', name: 'company', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true' });

  const form = h('form', { class: 'ct-form', novalidate: true, onsubmit: send },
    field('Name', nameInput),
    field('Reply-to', emailInput),
    field('About', subjectSel),
    field('Message', messageInput),
    honeypot,
    h('div', { class: 'ct-actions' }, submit, note)
  );

  function values() {
    return {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectSel.value,
      message: messageInput.value.trim(),
      company: honeypot.value
    };
  }

  function say(text, kind) {
    note.textContent = text;
    note.className = 'ct-note' + (kind ? ` is-${kind}` : '');
  }

  async function send(ev) {
    ev.preventDefault();
    const v = values();
    if (!v.name || !v.message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) {
      say('Name, a valid reply-to address, and a message, please.', 'bad');
      return;
    }

    submit.disabled = true;
    say('Sending…');

    try {
      if (!CONFIG.endpoints.contact) throw new Error('no endpoint');
      const res = await fetch(CONFIG.endpoints.contact, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v)
      });
      if (res.status === 404 || res.status === 501) throw new Error('not configured');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `send failed (${res.status})`);
      }
      say('Sent. He answers within a day.', 'good');
      form.reset();
    } catch (err) {
      // No delivery route: hand the message to the visitor's mail client.
      window.location.href = mailtoFallback(v);
      say('Opening your mail app with the message ready to send.', 'good');
    } finally {
      submit.disabled = false;
    }
  }

  const channels = h('div', { class: 'ct-channels' },
    ...CONTACT.channels.map((c) => h('a', {
      class: 'ct-channel', href: c.href,
      target: c.href.startsWith('http') ? '_blank' : null,
      rel: c.href.startsWith('http') ? 'noopener noreferrer' : null
    },
      h('span', { class: 'label' }, c.label),
      h('span', { class: 'ct-channel-value' }, c.value)
    ))
  );

  const facts = h('div', { class: 'ct-facts' },
    h('div', null, h('span', { class: 'label' }, 'Based in'), h('div', null, CONTACT.location)),
    h('div', null, h('span', { class: 'label' }, 'Status'), h('div', { class: 'ct-open' }, CONTACT.availability)),
    h('div', null, h('span', { class: 'label' }, 'Replies'), h('div', null, CONTACT.responseTime))
  );

  return h('div', { class: 'win-body' },
    h('div', { class: 'win-scroll ct' },
      h('div', { class: 'ct-pad' },
        h('h1', { class: 'ct-title' }, CONTACT.headline),
        h('p', { class: 'ct-lede' }, CONTACT.note),
        facts,
        channels,
        h('div', { class: 'ct-rule' }),
        form
      )
    ),
    h('div', { class: 'win-status' },
      h('span', null, 'Or just email him directly'),
      h('a', { href: `mailto:${CONTACT.email}` }, CONTACT.email)
    )
  );
}
