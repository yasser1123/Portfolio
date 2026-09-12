import { PROJECTS } from './projects.js';

/** The résumé is the last file in the folder, so its number follows the case files. */
const RESUME_NUM = String(PROJECTS.length + 1).padStart(2, '0');

export const RESUME = {
  num: RESUME_NUM,
  fileName: `${RESUME_NUM} Ahmed Yasser Résumé.pdf`,
  date: '12 Sep 2026',
  size: 'PDF pending',
  /** Drop a real PDF at this path and the Download button goes live. */
  pdfHref: './public/ahmed-yasser-resume.pdf',
  head: { name: 'Ahmed Yasser', role: 'AI & Full-Stack Engineer', place: 'Cairo · remote-friendly' },
  links: [
    { label: 'Email', value: 'ayasser.hashem@gmail.com', href: 'mailto:ayasser.hashem@gmail.com' },
    { label: 'GitHub', value: 'github.com/yasser1123', href: 'https://github.com/yasser1123' },
    { label: 'LinkedIn', value: 'in/ahmed-yasser-dev', href: 'https://linkedin.com/in/ahmed-yasser-dev' },
    { label: 'PDF', value: 'Download résumé', href: './public/ahmed-yasser-resume.pdf' }
  ],
  intro: 'I build complete systems on my own: production web and mobile apps, and the multi-agent AI pipelines behind them. Arabic-first by default, and careful about the parts that quietly go wrong, such as money precision, concurrent writes, and validation that respects time order.',
  roles: [
    { when: 'Dec 2025 to Jul 2026', what: 'Software Engineer Intern', where: 'Neama Shehata', note: 'Built ComFab solo: an Arabic-first e-commerce platform, 204 TypeScript files across 82 commits, with a Playwright and Vitest harness and a tracked hardening pass.' },
    { when: '2025 to 2026', what: 'Independent projects', where: 'Self-directed', note: 'SenioCare (six-agent healthcare assistant), the Qattara Depression pipeline (threaded Earth Engine ETL with Random Forest forecasting), and two shipped React Native apps.' },
    { when: '2025', what: 'Team contributor', where: 'QueryFlow, university project', note: 'Map visualization, parameter-driven query builder, error UI, and the Google Earth Engine ETL layer of a SQL transpiler.' }
  ],
  blocks: [
    { title: 'Stack', items: ['TypeScript, Python', 'Next.js 15, React, React Native', 'Drizzle, PostgreSQL, Firebase', 'FastAPI, Google ADK'] },
    { title: 'Focus', items: ['Multi-agent AI pipelines', 'Full-stack product engineering', 'Concurrency & data pipelines', 'Arabic-first interfaces'] },
    { title: 'Also', items: ['B.Sc., Suez University, 2026', 'Arabic (native), English', 'Playwright, Vitest', 'Earth Engine, scikit-learn'] }
  ]
};
