export const RESUME = {
  fileName: '07 — Ahmed Yasser Résumé.pdf',
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
  intro: 'I build complete systems on my own — production web and mobile apps, and the multi-agent AI pipelines behind them. Arabic-first by default, and careful about the parts that quietly go wrong: money precision, concurrent writes, and validation that respects time order.',
  roles: [
    { when: '2026', what: 'Software Engineering Intern', where: 'Employer — to confirm', note: 'Built ComFab solo: an Arabic-first e-commerce platform, 204 TypeScript files across 82 commits, with a Playwright and Vitest harness and a tracked hardening pass.' },
    { when: '2025 — 2026', what: 'Independent projects', where: 'Self-directed', note: 'SenioCare (six-agent healthcare assistant), Qattara Depression (threaded Earth Engine pipeline with Random Forest forecasting), and two shipped React Native apps.' },
    { when: '2025', what: 'Team contributor', where: 'QueryFlow — university project', note: 'Map visualization, parameter-driven query builder, error UI, and the Google Earth Engine ETL layer of a SQL transpiler.' }
  ],
  blocks: [
    { title: 'Stack', items: ['TypeScript, Python', 'Next.js 15, React, React Native', 'Drizzle, PostgreSQL, Firebase', 'FastAPI, Google ADK'] },
    { title: 'Focus', items: ['Multi-agent AI pipelines', 'Full-stack product engineering', 'Concurrency & data pipelines', 'Arabic-first interfaces'] },
    { title: 'Also', items: ['B.Sc. — Suez University', 'Arabic (native), English', 'Playwright, Vitest', 'Earth Engine, scikit-learn'] }
  ]
};
