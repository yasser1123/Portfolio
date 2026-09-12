/**
 * Tools the agent can call.
 *
 * These are the single source of truth: /api/agent sends `SCHEMAS` to Claude as
 * its tool definitions, and whatever Claude calls comes back as `[{name, input}]`
 * for `runActions` to execute against the window manager. Adding a capability
 * means adding one entry here — the serverless function needs no edit.
 */
import { PROJECTS } from '../data/projects.js';

export const SCHEMAS = [
  {
    name: 'open_project',
    description: 'Open one of the three case-file windows. Use when the visitor asks about a specific project or when a project is the best evidence for their question.',
    input_schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          enum: PROJECTS.map((p) => p.id),
          // Generated from the data so a new project needs no edit here.
          description: 'Project id. ' + PROJECTS.map((p) => `${p.id} (${p.discipline})`).join('; ')
        }
      },
      required: ['id']
    }
  },
  {
    name: 'open_resume',
    description: 'Open the one-page résumé window.',
    input_schema: { type: 'object', properties: {} }
  },
  {
    name: 'open_folder',
    description: 'Open the Portfolio folder in the Finder so the visitor can browse all four files.',
    input_schema: { type: 'object', properties: {} }
  },
  {
    name: 'open_contact',
    description: 'Open the Contact window. Use when the visitor wants to get in touch, hire, or ask about availability.',
    input_schema: {
      type: 'object',
      properties: { subject: { type: 'string', description: 'Optional pre-filled subject line.' } }
    }
  },
  {
    name: 'show_dossier',
    description: 'Scroll the desktop to the long-form dossier and select a tab.',
    input_schema: {
      type: 'object',
      properties: {
        tab: {
          type: 'string',
          enum: ['profile', 'track', 'toolbox', 'credentials', 'beyond'],
          description: 'Which dossier tab to show.'
        }
      },
      required: ['tab']
    }
  }
];

const TAB_INDEX = { profile: 0, track: 1, toolbox: 2, credentials: 3, beyond: 4 };

/** Bind the schemas to real UI actions. */
export function createRunner(actions) {
  const impl = {
    open_project: ({ id }) => actions.openProject(id),
    open_resume: () => actions.openResume(),
    open_folder: () => actions.openFinder(),
    open_contact: ({ subject } = {}) => actions.openContact(subject),
    show_dossier: ({ tab }) => actions.showDossier(TAB_INDEX[tab] ?? 0)
  };

  return function runActions(list, { delay = 420 } = {}) {
    if (!Array.isArray(list) || !list.length) return;
    list.forEach((call, i) => {
      const fn = impl[call && call.name];
      if (!fn) return;
      setTimeout(() => {
        try { fn(call.input || {}); }
        catch (err) { console.warn('[agent] tool failed', call.name, err); }
      }, delay + i * 260);
    });
  };
}
