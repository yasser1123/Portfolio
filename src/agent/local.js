/**
 * Offline agent.
 *
 * Runs when no model API key is configured, when /api/agent is missing (a plain
 * static host), or when the network call fails. Same return shape as the remote
 * path — { text, actions } — so the UI never branches.
 *
 * Every answer is grounded in src/data. Questions outside it get a plain
 * "I don't have that" rather than an improvisation.
 */
export function answerLocally(question) {
  const s = (question || '').toLowerCase();
  const has = (...w) => w.some((x) => s.indexOf(x) >= 0);
  const act = (name, input = {}) => [{ name, input }];

  if (has('comfab', 'e-commerce', 'ecommerce', 'commerce', 'storefront', 'shop', 'garment'))
    return {
      text: 'ComFab — an Arabic-first e-commerce platform for medical compression garments. 204 TypeScript files across 82 commits, Next.js 15 with Drizzle over Neon Postgres, and a hardening pass that moved money to integer minor units and ended duplicate carts with a database constraint. Opening it.',
      actions: act('open_project', { id: 'comfab' })
    };

  if (has('seniocare', 'multi-agent', 'elderly', 'healthcare', 'adk', 'graduation'))
    return {
      text: 'SenioCare — a six-agent healthcare assistant for elderly users in Egypt, built on Google ADK. Intent, safety, fetch, generate, judge, format: safety screening runs before generation, and the judge can reject an answer back to the generator. Opening it.',
      actions: act('open_project', { id: 'seniocare' })
    };

  if (has('qattara', 'geospatial', 'earth engine', 'satellite', 'thread', 'concurren', 'random forest', 'forecast'))
    return {
      text: 'Qattara Depression — a three-stage threaded Earth Engine pipeline. Fetcher, organiser and writers run concurrently over queues; a Random Forest validated on TimeSeriesSplit does the forecasting, and the output is a seasonal Excel workbook with charts embedded. Opening it.',
      actions: act('open_project', { id: 'qattara' })
    };

  if (has('chalet', 'booking', 'rental', 'firebase', 'rbac'))
    return {
      text: 'Chalet Rental — a React Native booking app for chalet brokers, built around preventing double bookings. Firebase backing, with role-based access separating what an admin can do from what an assistant can do. Opening it.',
      actions: act('open_project', { id: 'chalet' })
    };

  if (has('queryflow', 'transpiler', 'compiler', 'dsl', 'sql'))
    return {
      text: 'QueryFlow — a team-built SQL transpiler running SELECT syntax against eight data sources. His part was the map visualization, the parameter-driven query builder, the error UI and the Earth Engine ETL layer; the lexer, grammar and code generation were teammates work. Opening it.',
      actions: act('open_project', { id: 'queryflow' })
    };

  if (has('artify', 'image', 'opencv', 'photo', 'filter', 'webview'))
    return {
      text: 'Artify — a React Native image editor that runs OpenCV.js inside an invisible WebView, because OpenCV has no React Native binding. Images cross the bridge as base64. Opening it.',
      actions: act('open_project', { id: 'artify' })
    };

  if (has('best project', 'strongest', 'proudest', 'favourite', 'favorite'))
    return {
      text: 'Two, for different reasons. ComFab is the deepest codebase — 204 files, a real test suite, and correctness work on money and concurrency. SenioCare is the most interesting architecture — six agents with safety before generation and a judge that can reject. Opening ComFab first.',
      actions: act('open_project', { id: 'comfab' })
    };

  if (has('resume', 'résumé', 'cv', 'pdf'))
    return { text: 'Opening the one-page résumé. The dossier below has the longer version.', actions: act('open_resume') };

  if (has('stack', 'tech', 'language', 'framework', 'tool', 'skill'))
    return {
      text: 'Deep: Next.js 15 with TypeScript, Drizzle and Postgres on the web side; Google ADK multi-agent pipelines on the AI side. Alongside those: React Native, Expo, Flutter, FastAPI, Firebase, scikit-learn, Google Earth Engine, Playwright and Vitest.\n\nThe Toolbox tab lists them by domain with an honest depth label — every entry points at a repository you can read.',
      actions: act('show_dossier', { tab: 'toolbox' })
    };

  if (has('experience', 'history', 'worked', 'job', 'role', 'intern', 'career'))
    return {
      text: 'A software engineering internship in 2026, where he built ComFab solo, plus independent projects through 2025 and 2026 — SenioCare, the Qattara pipeline, and two React Native apps. Taking you to the full track record.',
      actions: act('show_dossier', { tab: 'track' })
    };

  if (has('education', 'degree', 'university', 'study', 'school', 'graduate'))
    return {
      text: 'B.Sc. from the Faculty of Computers and Informatics, Suez University, with SenioCare as the graduation project. Opening the Credentials tab.',
      actions: act('show_dossier', { tab: 'credentials' })
    };

  if (has('hire', 'available', 'contact', 'email', 'freelance', 'reach', 'talk', 'salary'))
    return {
      text: 'He is open to AI and full-stack engineering roles, Cairo or remote. Email is fastest — ayasser.hashem@gmail.com — and he answers within a day. Opening the contact window.',
      actions: act('open_contact', { subject: 'A role' })
    };

  if (has('principle', 'process', 'philosophy', 'how does he work', 'approach'))
    return {
      text: 'Constraints belong in the database, not in application code. Precision before features. Refusing is a feature. Ship it where the user can actually open it.\n\nOpening the Beyond tab, which has these in full.',
      actions: act('show_dossier', { tab: 'beyond' })
    };

  if (has('arabic', 'egypt', 'localis', 'localiz', 'i18n'))
    return {
      text: 'Almost everything he builds is Arabic-first. ComFab runs Arabic as its primary locale through next-intl, and SenioCare answers in Egyptian Arabic rather than translated clinical language. It is a design constraint, not a translation step bolted on at the end.',
      actions: []
    };

  if (has('project', 'files', 'portfolio', 'work', 'built', 'show me'))
    return {
      text: 'Six case files: ComFab (e-commerce), SenioCare (multi-agent AI), Qattara Depression (geospatial and ML), Chalet Rental (mobile booking), QueryFlow (team SQL transpiler) and Artify (mobile image editing). Opening the folder.',
      actions: act('open_folder')
    };

  return {
    text: 'I can cover his six projects, his stack, his track record, his education, or how he works — and I can open any of them for you. Try a chip below, or ask about a specific tool. Anything I do not have on file, I will say so rather than guess.',
    actions: []
  };
}

export const CHIPS = [
  'What has he built?',
  'Best project',
  'Tools he knows',
  'Open the résumé',
  'How do I hire him?'
];
