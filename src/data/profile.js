export const PROFILE = {
  name: 'Ahmed Yasser',
  role: 'AI & Full-Stack Engineer',
  place: 'Cairo · remote-friendly',
  email: 'ayasser.hashem@gmail.com',
  lede: 'I build complete systems on my own: an Arabic-first storefront with its money handled in integer minor units, a six-agent healthcare pipeline that refuses before it answers, a threaded Earth Engine pipeline that ends in a spreadsheet a researcher can open.',
  sub: 'Full-stack and AI engineering, mostly solo, mostly shipped end to end. I am drawn to the parts everyone skips: the race condition, the validation split, the refusal path.',
  skills: ['TypeScript', 'Python', 'Next.js', 'React Native', 'Multi-agent AI', 'PostgreSQL', 'Playwright', 'Earth Engine'],
  links: [
    { label: 'Email', value: 'ayasser.hashem@gmail.com', href: 'mailto:ayasser.hashem@gmail.com' },
    { label: 'GitHub', value: 'github.com/yasser1123', href: 'https://github.com/yasser1123' },
    { label: 'LinkedIn', value: 'in/ahmed-yasser-dev', href: 'https://linkedin.com/in/ahmed-yasser-dev' }
  ]
};

export const STORY = [
  'Most of what I have built, I built alone and all the way through: schema, API, interface, tests, and the deployment at the end. That is not a preference so much as how the projects arrived, and it left me comfortable owning a whole system rather than a slice of one.',
  'The work splits in two directions that keep feeding each other. On one side, production web and mobile: a 204-file Arabic-first storefront with a real test suite. On the other, AI systems: a six-agent pipeline where safety screening runs before generation and a judge can send an answer back.',
  'What I care about sits underneath both. Money computed in integer minor units because floats drift. One cart per identity because two requests will arrive at once. TimeSeriesSplit instead of random folds because a model that trains on the future scores beautifully and predicts nothing.',
  'Almost everything I build is Arabic-first, for users in Egypt. That is a design constraint as much as a language one. It decides layout direction, register, and who the product is actually for.'
];

export const DOMAINS = ['E-commerce', 'Healthcare', 'Geospatial research', 'Property rental', 'Developer tooling', 'Mobile & creative tools'];

export const TBAR = ['Frontend', 'Mobile', 'Backend', 'Data eng', 'Testing', 'Product'];

export const TRACK = [
  {
    when: 'Dec 2025 to Jul 2026', what: 'Software Engineer Intern', where: 'Neama Shehata',
    stack: ['Next.js 15', 'TypeScript', 'Drizzle ORM', 'PostgreSQL', 'NextAuth v5', 'Playwright'],
    bullets: [
      'Built ComFab, an Arabic-first e-commerce platform for medical compression garments, solo across 82 commits and 204 TypeScript source files.',
      'Designed the schema on Drizzle over Neon Postgres, with checked-in migrations and a documented audit marking every table and column nothing read.',
      'Ran a tracked hardening pass with severity labels: money recomputed in integer minor units, a uniqueness constraint plus conflict-tolerant getOrCreate to end duplicate carts, an analytics retention policy, and structured logging in place of console calls.',
      'Stood up the test harness: Vitest for units, Playwright for the browse, cart and checkout flows where a bug costs a real order.'
    ]
  },
  {
    when: '2025 to 2026', what: 'Independent projects', where: 'Self-directed',
    stack: ['Python', 'Google ADK', 'FastAPI', 'React Native', 'Firebase', 'scikit-learn'],
    bullets: [
      'Built SenioCare, a six-agent healthcare assistant for elderly users in Egypt, where safety screening runs before generation and a judge agent can reject an answer back to the generator.',
      'Wrote a three-stage threaded Earth Engine pipeline for the Qattara Depression, forecasting with a Random Forest validated on TimeSeriesSplit and reporting into seasonal Excel workbooks with embedded charts.',
      'Carried the same data layer into QueryFlow, a university team SQL transpiler, contributing the Earth Engine ETL, the parameter-driven query builder, the map rendering and the error UI.',
      'Shipped two React Native apps: a chalet booking tool with role-based access and double-booking prevention, and an image editor that runs OpenCV.js inside a hidden WebView.'
    ]
  }
];

export const TOOLBOX = [
  { domain: 'Full-stack web', depth: 'Deep, the vertical bar', did: 'Production Next.js 15 on the App Router: schema design, auth, server actions, and an Arabic-first internationalised front end.', tools: ['Next.js 15', 'TypeScript', 'React', 'Tailwind', 'shadcn/ui', 'Drizzle ORM', 'NextAuth v5', 'Zod'] },
  { domain: 'AI agent systems', depth: 'Deep, the vertical bar', did: 'Multi-agent pipelines with routing, pre-generation safety screening, and a judge stage that rejects and re-runs rather than shipping a bad answer.', tools: ['Google ADK', 'FastAPI', 'Multi-agent orchestration', 'Arabic NLP'] },
  { domain: 'Mobile', depth: 'Strong', did: 'Two shipped React Native apps plus a Flutter client, including a WebView bridge to run OpenCV.js where no native binding existed.', tools: ['React Native', 'Expo', 'Flutter', 'React Navigation', 'NativeWind'] },
  { domain: 'Databases & data modelling', depth: 'Strong', did: 'Relational schemas with migrations and constraints that enforce invariants at the database rather than in application code.', tools: ['PostgreSQL', 'Neon', 'Drizzle', 'Firebase/Firestore', 'SQLite'] },
  { domain: 'Data engineering', depth: 'Strong', did: 'Threaded producer-consumer pipelines over queues for rate-limited APIs, ending in reports a non-programmer can open.', tools: ['Python threading', 'queue', 'pandas', 'openpyxl', 'matplotlib'] },
  { domain: 'Machine learning', depth: 'Working', did: 'Regression on time-series data with temporally correct validation and two-pass hyperparameter search.', tools: ['scikit-learn', 'RandomForest', 'TimeSeriesSplit', 'GridSearchCV'] },
  { domain: 'Geospatial', depth: 'Working', did: 'Satellite imagery and weather analysis: vegetation and water indices, GeoTIFF export, and derived meteorological variables.', tools: ['Google Earth Engine', 'NDVI/NDWI', 'GeoTIFF', 'Landsat/Sentinel-2'] },
  { domain: 'Testing', depth: 'Working', did: 'Unit and end-to-end coverage aimed first at the flows where a defect costs money.', tools: ['Vitest', 'Playwright'] },
  { domain: 'Computer vision', depth: 'Working', did: 'Real-time image transforms on mobile and desktop: filters, thresholding, blurring, intensity adjustment.', tools: ['OpenCV', 'OpenCV.js', 'Tkinter'] },
  { domain: 'Internationalisation', depth: 'Working', did: 'Arabic-first products where the primary locale drives layout direction and register, rather than being translated in afterwards.', tools: ['next-intl', 'RTL layout', 'Egyptian Arabic'] }
];

export const CREDS = [
  { title: 'Education', items: [
    { name: 'B.Sc., Faculty of Computer and Information Technology, Suez University', meta: 'Class of 2026 · graduation project: SenioCare' }
  ] },
  { title: 'Selected work', items: [
    { name: 'ComFab, production e-commerce platform', meta: '204 TypeScript files · 82 commits · public repository' },
    { name: 'SenioCare, six-agent healthcare assistant', meta: 'Google ADK · graduation project' },
    { name: 'Qattara & QueryFlow, geospatial pipeline and query tool', meta: 'Threaded Earth Engine ETL · Random Forest forecasting' }
  ] },
  { title: 'Languages', items: [
    { name: 'Arabic, native', meta: 'Egyptian dialect; builds Arabic-first interfaces' },
    { name: 'English, professional', meta: 'Documentation, code and technical writing' }
  ] }
];

export const PRINCIPLES = [
  { title: 'Constraints belong in the database', body: 'A uniqueness constraint holds when two requests arrive at the same millisecond. A check in application code does not. Put the invariant where it cannot be bypassed.' },
  { title: 'Precision before features', body: 'Money in integer minor units, time-series validated on time order. These are not optimisations. They are the difference between a number that is right and a number that looks right.' },
  { title: 'Refusing is a feature', body: 'An assistant for elderly users that tries to be helpful about chest pain is worse than one that stops. Design the path where the system declines, and test it like any other.' },
  { title: 'Ship it where they can open it', body: 'Researchers wanted a spreadsheet, not a notebook. Brokers wanted a phone app, not a dashboard. The deliverable is whatever the user can actually open.' }
];

export const OFFCLOCK = [
  { label: 'Building', body: 'Small tools that scratch a specific itch: an image editor, an algorithm visualiser, whatever the current annoyance is.' },
  { label: 'Reading', body: 'Agent architectures and how people structure multi-step LLM systems, plus the postmortems where those systems fell over.' },
  { label: 'Arabic-first', body: 'Thinking about what software looks like when Arabic is the primary language rather than a translation layer added at the end.' },
  { label: 'Fundamentals', body: 'Revisiting the basics deliberately, compilers and sorting and concurrency, usually by building a small thing that demonstrates them.' }
];

export const DOSSIER = [
  { tag: 'A', label: 'Profile', title: 'Who is behind the files', note: 'How the work splits between production web and AI systems, and what connects them.' },
  { tag: 'B', label: 'Track record', title: 'What I have built', note: 'The internship, the independent projects, and what each one actually involved.' },
  { tag: 'C', label: 'Toolbox', title: 'Tools, by domain', note: 'Two deep columns, eight adjacent ones. Every entry is backed by a repository you can read.' },
  { tag: 'D', label: 'Credentials', title: 'Education & work', note: 'Degree, selected projects, and languages.' },
  { tag: 'E', label: 'Beyond', title: 'How I work, and after hours', note: 'The principles the code actually reflects, and what happens away from it.' }
];
