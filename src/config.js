/**
 * Deployment-time configuration. Everything here is safe to ship to the client —
 * secrets live in environment variables consumed by the functions in /api.
 */
export const CONFIG = {
  /** Serverless endpoints. Set to null to force the offline fallbacks. */
  endpoints: {
    agent: '/api/agent',
    contact: '/api/contact'
  },

  /** Where Contact mail goes when the serverless route is unavailable. */
  contactEmail: 'hello@ahmedyasser.dev',

  /** Boot gate. */
  boot: {
    skip: false,
    rememberPerSession: true
  },

  /** Agent behaviour. */
  agent: {
    preferRemote: true,
    timeoutMs: 20000,
    historyTurns: 8
  }
};
