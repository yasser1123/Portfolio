/**
 * Tools the agent can call.
 *
 * These are the single source of truth. /api/agent translates `SCHEMAS` into
 * Gemini function declarations, and whatever the model calls comes back as
 * `[{name, input}]` for `runActions` to execute against the window manager.
 * Adding a capability means adding one entry here; the serverless function
 * needs no edit.
 *
 * The schemas are written once in JSON Schema form. `geminiTools()` converts
 * them, so the two never drift apart.
 */
import { PROJECTS } from '../data/projects.js';

export const SCHEMAS = [
  {
    name: 'open_project',
    description: 'Open a case-file window. Use when the visitor asks about a specific project, or when a project is the best evidence for their question.',
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
    description: 'Open the Portfolio folder in the Finder so the visitor can browse every file.',
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
  },
  {
    name: 'open_github',
    description: 'Open source code on GitHub in a new tab. Pass a project id to open that repository, or omit it for the GitHub profile. Use when the visitor asks to see the code.',
    input_schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          enum: PROJECTS.map((p) => p.id),
          description: 'Optional project id. Omit for the GitHub profile. ' + PROJECTS.map((p) => `${p.id} (${p.repo})`).join('; ')
        }
      }
    }
  }
];

/**
 * Gemini speaks an OpenAPI subset: uppercase type names, `parameters` rather
 * than `input_schema`, and no empty property bags. Converted here so the
 * schemas above stay in one readable format.
 */
const GEMINI_TYPES = { object: 'OBJECT', string: 'STRING', number: 'NUMBER', integer: 'INTEGER', boolean: 'BOOLEAN', array: 'ARRAY' };

function toGeminiSchema(node) {
  const out = { type: GEMINI_TYPES[node.type] || 'STRING' };
  if (node.description) out.description = node.description;
  if (node.enum) out.enum = node.enum;
  if (node.properties) {
    out.properties = {};
    for (const [key, value] of Object.entries(node.properties)) out.properties[key] = toGeminiSchema(value);
  }
  if (node.required && node.required.length) out.required = node.required;
  return out;
}

export function geminiTools() {
  return [{
    functionDeclarations: SCHEMAS.map((tool) => {
      const decl = { name: tool.name, description: tool.description };
      // A parameterless tool must not carry an empty OBJECT; Gemini rejects it.
      const props = tool.input_schema && tool.input_schema.properties;
      if (props && Object.keys(props).length) decl.parameters = toGeminiSchema(tool.input_schema);
      return decl;
    })
  }];
}

const TAB_INDEX = { profile: 0, track: 1, toolbox: 2, credentials: 3, beyond: 4 };

/** Bind the schemas to real UI actions. */
export function createRunner(actions) {
  const impl = {
    open_project: ({ id }) => actions.openProject(id),
    open_resume: () => actions.openResume(),
    open_folder: () => actions.openFinder(),
    open_contact: ({ subject } = {}) => actions.openContact(subject),
    show_dossier: ({ tab }) => actions.showDossier(TAB_INDEX[tab] ?? 0),
    open_github: ({ id } = {}) => actions.openGithub(id)
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
