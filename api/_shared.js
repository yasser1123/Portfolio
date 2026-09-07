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
 * so this trims obvious abuse but is not a security control — put a real WAF or
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
