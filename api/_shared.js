/**
 * Adapter so one handler works on both Vercel (req, res) and Netlify Functions
 * v2 (Request, context). Detected by whether the second argument looks like a
 * Node response object.
 */
export function adapt(req, res) {
  const isNode = Boolean(res && typeof res.status === 'function');

  return {
    isNode,
    method: req.method,

    async body() {
      if (isNode) {
        if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
        return req.body || {};
      }
      try { return await req.json(); } catch { return {}; }
    },

    ip() {
      const get = (k) => (isNode ? req.headers[k] : req.headers.get(k));
      const fwd = get('x-forwarded-for') || '';
      return String(fwd).split(',')[0].trim() || 'unknown';
    },

    send(status, payload) {
      if (isNode) return res.status(status).json(payload);
      return new Response(JSON.stringify(payload), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}

/**
 * Best-effort per-IP limiter. Serverless instances are ephemeral and not shared,
 * so this trims obvious abuse but is not a security control. Put a real WAF or
 * edge rate limit in front if this ever matters.
 */
const buckets = new Map();
export function rateLimited(ip, { limit = 20, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.start > windowMs) {
    buckets.set(ip, { start: now, count: 1 });
    return false;
  }
  b.count += 1;
  if (buckets.size > 5000) buckets.clear();
  return b.count > limit;
}

/**
 * Daily caps: one per visitor, one for the whole deployment.
 *
 * The model costs money per call and this endpoint is open to the internet, so
 * the global cap is the thing that actually protects the bill. Like the limiter
 * above it lives in instance memory, so a platform running several instances
 * enforces the cap per instance rather than globally. It is a spend guard, not
 * a security control.
 *
 * Returns null when the call is allowed, or 'ip' / 'global' naming the cap that
 * stopped it. Counting happens here, so call it once per request.
 */
const today = { key: '', total: 0, byIp: new Map() };

export function dailyCapped(ip, { perIp = 40, global = 1000 } = {}) {
  const key = new Date().toISOString().slice(0, 10);
  if (today.key !== key) {
    today.key = key;
    today.total = 0;
    today.byIp.clear();
  }

  if (today.total >= global) return 'global';
  const used = today.byIp.get(ip) || 0;
  if (used >= perIp) return 'ip';

  if (today.byIp.size > 20_000) today.byIp.clear();
  today.byIp.set(ip, used + 1);
  today.total += 1;
  return null;
}
