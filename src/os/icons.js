/** Dock and title-bar icons, drawn in the portfolio's paper palette. */

export const ICONS = {
  finder: `
<svg viewBox="0 0 48 48" role="img" aria-hidden="true">
  <defs><linearGradient id="fdA" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d8b273"/><stop offset="1" stop-color="#b98f45"/></linearGradient>
    <linearGradient id="fdB" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d3ac6c"/><stop offset="0.58" stop-color="#c0954f"/><stop offset="1" stop-color="#ab8339"/></linearGradient></defs>
  <path d="M4 12a3 3 0 0 1 3-3h11l3 4h-17Z" fill="url(#fdA)"/>
  <rect x="9" y="11" width="30" height="20" rx="1.5" fill="#fdfaf3"/>
  <rect x="11.5" y="9.5" width="26" height="20" rx="1.5" fill="#f3ecdb"/>
  <path d="M4 13h40v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill="url(#fdB)"/>
  <path d="M4 13h40v3H4Z" fill="rgba(255,255,255,0.22)"/>
</svg>`,

  resume: `
<svg viewBox="0 0 48 48" role="img" aria-hidden="true">
  <path d="M10 5h19l9 9v29a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="#fdfaf3"/>
  <path d="M29 5l9 9h-9Z" fill="#e0d5bb"/>
  <rect x="14" y="19" width="20" height="2" rx="1" fill="#2a251d" opacity="0.75"/>
  <rect x="14" y="25" width="16" height="1.6" rx="0.8" fill="#8d8065"/>
  <rect x="14" y="30" width="18" height="1.6" rx="0.8" fill="#8d8065"/>
  <rect x="14" y="35" width="12" height="1.6" rx="0.8" fill="#8d8065"/>
  <rect x="14" y="10" width="11" height="5" rx="1" fill="#c8452b"/>
</svg>`,

  contact: `
<svg viewBox="0 0 48 48" role="img" aria-hidden="true">
  <rect x="4" y="11" width="40" height="27" rx="3" fill="#f3ecdb"/>
  <path d="M4 14.5 24 27 44 14.5V14a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3Z" fill="#e2d6ba"/>
  <path d="M4 15.6 24 28.2 44 15.6V17L24 29.6 4 17Z" fill="rgba(42,37,29,0.18)"/>
  <circle cx="37" cy="12" r="7" fill="#c8452b"/>
  <path d="M37 8.4v7.2M33.4 12h7.2" stroke="#fdfaf3" stroke-width="1.8" stroke-linecap="round"/>
</svg>`,

  agent: `
<svg viewBox="0 0 48 48" role="img" aria-hidden="true">
  <rect x="4" y="7" width="40" height="30" rx="7" fill="#2a251d"/>
  <path d="M17 37h14l-5 7Z" fill="#2a251d"/>
  <circle cx="17.5" cy="21" r="3.2" fill="#f6eedb"/>
  <circle cx="30.5" cy="21" r="3.2" fill="#f6eedb"/>
  <circle cx="18.6" cy="22" r="1.3" fill="#2a251d"/>
  <circle cx="31.6" cy="22" r="1.3" fill="#2a251d"/>
  <rect x="19" y="28.5" width="10" height="1.8" rx="0.9" fill="#6d6045"/>
  <circle cx="38.5" cy="11.5" r="4.5" fill="#c8452b"/>
</svg>`,

  dossier: `
<svg viewBox="0 0 48 48" role="img" aria-hidden="true">
  <rect x="6" y="10" width="36" height="30" rx="3" fill="#5a5142"/>
  <rect x="6" y="10" width="36" height="6" rx="3" fill="#4a4235"/>
  <rect x="10" y="16" width="28" height="24" rx="2" fill="#fdfaf3"/>
  <rect x="14" y="22" width="20" height="2" rx="1" fill="#2a251d" opacity="0.7"/>
  <rect x="14" y="28" width="14" height="1.6" rx="0.8" fill="#8d8065"/>
  <rect x="14" y="33" width="17" height="1.6" rx="0.8" fill="#8d8065"/>
  <rect x="18" y="6" width="12" height="5" rx="1.5" fill="#c8452b"/>
</svg>`,

  caseFile: `
<svg viewBox="0 0 48 48" role="img" aria-hidden="true">
  <path d="M11 5h17l9 9v29a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="#f3ecdb"/>
  <path d="M28 5l9 9h-9Z" fill="#dccfb4"/>
  <rect x="15" y="21" width="17" height="1.7" rx="0.85" fill="#6d6045"/>
  <rect x="15" y="26" width="13" height="1.7" rx="0.85" fill="#8d8065"/>
  <rect x="15" y="31" width="15" height="1.7" rx="0.85" fill="#8d8065"/>
</svg>`
};

/** 13×16 page glyph used in title bars. */
export const TITLE_GLYPH = {
  folder: '<svg class="win-title-icon" viewBox="0 0 15 12"><path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H5l1.4 2H15v8.5A1.5 1.5 0 0 1 13.5 12h-12A1.5 1.5 0 0 1 0 10.5Z" fill="#d8b273"/></svg>',
  page: '<svg class="win-title-icon" viewBox="0 0 13 16"><path d="M0 1a1 1 0 0 1 1-1h7l5 5v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1Z" fill="#e9dfc6"/><path d="M8 0l5 5H8Z" fill="#c9bda2"/></svg>',
  agent: '<svg class="win-title-icon" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="#c8452b"/></svg>',
  mail: '<svg class="win-title-icon" viewBox="0 0 16 12"><rect width="16" height="12" rx="1.5" fill="#e9dfc6"/><path d="M0 1.6 8 7l8-5.4V3L8 8.4 0 3Z" fill="#a2957c"/></svg>'
};
