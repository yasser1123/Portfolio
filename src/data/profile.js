export const PROFILE = {
  name: 'Ahmed Yasser',
  role: 'AI Engineer',
  place: 'Cairo · remote-friendly',
  email: 'hello@ahmedyasser.dev',
  lede: 'I build the parts of AI systems that have to hold up in production — retrieval that cites its sources, models small enough to run on a phone, monitoring that catches a problem before a user does.',
  sub: 'Three years across clinical NLP, on-device speech, and ML infrastructure. I like problems where the model is the easy half.',
  skills: ['Python', 'PyTorch', 'RAG', 'vLLM', 'Quantisation', 'Kubernetes', 'Evaluation', 'ONNX'],
  links: [
    { label: 'Email', value: 'hello@ahmedyasser.dev', href: 'mailto:hello@ahmedyasser.dev' },
    { label: 'GitHub', value: 'github.com/ahmedyasser', href: '#' },
    { label: 'LinkedIn', value: 'in/ahmedyasser', href: '#' }
  ]
};

export const STORY = [
  'I started in embedded systems, writing C for boards that gave you 64KB and no second chances. That is still how I think about models: a budget you spend, not a magic box you call.',
  'The route here went embedded → backend → data pipelines → machine learning, and I kept every layer. When a retrieval system is slow, I can tell whether it is the index, the query planner, the network hop, or the model, because I have shipped all four.',
  'Depth sits in one column: retrieval, evaluation, compression, and serving of language and speech models. That is the part I go read papers about and the part companies hire me for.',
  'Breadth is the reason the depth ships. Someone has to write the ingestion job, the Terraform, the dashboard, and the demo app before anyone can judge the model — on small teams that someone is me.'
];

export const DOMAINS = ['Healthcare', 'Consumer audio', 'Internal platforms', 'Fintech data', 'Embedded / IoT', 'Freelance product work'];

export const TBAR = ['Backend', 'Data eng', 'Infra', 'Frontend', 'Edge', 'Product'];

export const TRACK = [
  {
    when: '2025 — now', what: 'Lead AI Engineer', where: 'Meridian Health',
    stack: ['Python', 'vLLM', 'Qdrant', 'Postgres', 'Modal', 'Terraform'],
    bullets: [
      'Own the clinical retrieval stack end to end: OCR ingestion, hybrid search, reranking, serving, and the eval harness that gates every release.',
      'Wrote the ingestion pipeline in Airflow before writing a line of model code — layout-aware OCR was worth more accuracy than any model swap we tried.',
      'Run the on-call rotation for inference. Latency budget is 1.5s; the p95 has stayed under it through three model upgrades.',
      'Mentor two engineers and sit in clinical review sessions, which is where most of the actual requirements come from.'
    ]
  },
  {
    when: '2023 — 2025', what: 'ML Engineer', where: 'Internal platform team',
    stack: ['Kafka', 'ClickHouse', 'Grafana', 'Kubernetes', 'React', 'scikit-learn'],
    bullets: [
      'Built and rolled out drift monitoring for 31 models across four product teams, including the alert routing and the dashboards people actually opened.',
      'Ran the ranking model for internal search before LLMs were on the table — XGBoost, hand-built features, and an A/B harness.',
      'Wrote the front end for the alert console myself in React because the design queue was six weeks long.',
      'Cut GPU spend 38% by right-sizing batch sizes and moving batch jobs to spot capacity.'
    ]
  },
  {
    when: '2021 — 2023', what: 'Software Engineer, independent', where: 'Freelance / contract',
    stack: ['PyTorch', 'ONNX', 'Core ML', 'Swift', 'FastAPI', 'Docker'],
    bullets: [
      'Delivered on-device speech models for two clients, from distillation through the iOS integration and the demo app.',
      'Built the boring half repeatedly: FastAPI services, Postgres schemas, auth, billing webhooks, CI pipelines.',
      'Scoped and priced my own work, which taught me to cut features early rather than negotiate deadlines late.'
    ]
  },
  {
    when: '2019 — 2021', what: 'Embedded / firmware, part-time', where: 'University lab & contracts',
    stack: ['C', 'C++', 'RTOS', 'I2C/SPI', 'Jetson', 'MATLAB'],
    bullets: [
      'Firmware for sensor nodes: interrupt-driven drivers, power budgets, and debugging with a logic analyser instead of a stack trace.',
      'First exposure to models under constraint — a classifier that had to run on a microcontroller, which is the same problem as quantising for a phone, just smaller.'
    ]
  }
];

export const TOOLBOX = [
  { domain: 'AI / ML systems', depth: 'Deep — the vertical bar', did: 'Retrieval, reranking, evaluation harnesses, distillation, quantisation, and serving under a latency budget.', tools: ['PyTorch', 'vLLM', 'Transformers', 'Qdrant', 'FAISS', 'Ragas', 'ONNX Runtime', 'TensorRT'] },
  { domain: 'Backend & APIs', depth: 'Strong', did: 'Production services behind every model I have shipped — schemas, auth, queues, retries, the parts that page you.', tools: ['FastAPI', 'Postgres', 'Redis', 'gRPC', 'Celery', 'Node'] },
  { domain: 'Data engineering', depth: 'Strong', did: 'Batch and streaming pipelines that feed both training and monitoring, with backfills that do not corrupt history.', tools: ['Airflow', 'Kafka', 'dbt', 'Spark', 'ClickHouse', 'Parquet'] },
  { domain: 'Infra & DevOps', depth: 'Working', did: 'GPU scheduling, cluster deploys, CI/CD, cost work. I own my own deploys rather than filing tickets for them.', tools: ['Kubernetes', 'Docker', 'Terraform', 'GitHub Actions', 'Modal', 'AWS'] },
  { domain: 'Frontend', depth: 'Working', did: 'Internal consoles, eval dashboards, and demo apps — enough React and TypeScript to make a model reviewable by non-engineers.', tools: ['React', 'TypeScript', 'D3', 'Tailwind', 'Vite'] },
  { domain: 'Mobile & edge', depth: 'Working', did: 'On-device inference shipped inside an iOS app; benchmarking on Jetson and phone-class hardware.', tools: ['Swift', 'Core ML', 'Android NDK', 'Jetson', 'int8 quantisation'] },
  { domain: 'Computer vision', depth: 'Working', did: 'Layout-aware OCR and document parsing for scanned medical records, including the annotation tooling.', tools: ['OpenCV', 'Tesseract', 'PaddleOCR', 'Detectron2'] },
  { domain: 'Speech & audio', depth: 'Strong', did: 'ASR distillation, VAD, streaming decode, and the evaluation sets that make WER numbers mean something.', tools: ['torchaudio', 'Whisper', 'Kaldi features', 'WebRTC VAD'] },
  { domain: 'Classical ML & stats', depth: 'Strong', did: 'Ranking, forecasting, and experiment design from the years before an LLM was the default answer.', tools: ['scikit-learn', 'XGBoost', 'statsmodels', 'A/B testing'] },
  { domain: 'Embedded', depth: 'Past life, still useful', did: 'C firmware on microcontrollers. Where the habit of counting bytes and cycles came from.', tools: ['C', 'C++', 'RTOS', 'SPI/I2C', 'Logic analysers'] },
  { domain: 'Product & communication', depth: 'Working', did: 'Specs, model cards, clinical review sessions, and pricing my own contracts. I write the doc before the code.', tools: ['Figma', 'Notion', 'User interviews', 'Technical writing'] }
];

export const CREDS = [
  { title: 'Education', items: [
    { name: 'B.Sc. Computer Engineering', meta: '2017 — 2021 · graduation project on embedded ML' },
    { name: 'Deep Learning specialisation', meta: 'Self-paced, 2021 · the on-ramp out of firmware' }
  ] },
  { title: 'Certifications', items: [
    { name: 'AWS Certified Machine Learning — Specialty', meta: '2024' },
    { name: 'Certified Kubernetes Administrator (CKA)', meta: '2023' },
    { name: 'NVIDIA — Deploying transformers at scale', meta: '2025' }
  ] },
  { title: 'Languages & reach', items: [
    { name: 'Arabic — native · English — fluent', meta: 'Worked with teams in Cairo, Berlin, Toronto' },
    { name: 'Open source', meta: 'Contributions to retrieval and quantisation tooling' },
    { name: 'Talks', meta: 'Two local meetup talks on evaluation harnesses' }
  ] }
];

export const PRINCIPLES = [
  { title: 'Measure before modelling', body: 'The first week of any project goes to an evaluation set. Without one, every later decision is taste.' },
  { title: 'The boring layer decides', body: 'Ingestion, indexing, and serving usually explain more of the result than the model choice does.' },
  { title: 'Write the limits down', body: 'Model cards with a failure section. Whoever inherits the system needs the failures more than the benchmarks.' },
  { title: 'Ship the whole slice', body: 'A model behind an API behind a UI someone can click. Half a slice teaches you nothing.' }
];

export const OFFCLOCK = [
  { label: 'Teaching', body: 'Weekend sessions for juniors moving from web work into ML. Most of my explanations got clearer this way.' },
  { label: 'Reading', body: 'Papers on retrieval and compression, plus a steady diet of postmortems from other outages.' },
  { label: 'Building', body: 'Small tools I never publish — a receipt parser, a home audio transcriber, a chess move classifier.' },
  { label: 'Away from screens', body: 'Long walks, film photography, and cooking that takes longer than it should.' }
];

export const DOSSIER = [
  { tag: 'A', label: 'Profile', title: 'Who is behind the files', note: 'The résumé version, unfolded. Where the depth is, and why the breadth exists.' },
  { tag: 'B', label: 'Track record', title: 'Every role, in full', note: 'The same history as the résumé, with the bullets that did not fit on one page.' },
  { tag: 'C', label: 'Toolbox', title: 'Tools, by domain', note: 'One deep column, ten adjacent ones. Depth labels are honest, not aspirational.' },
  { tag: 'D', label: 'Credentials', title: 'Education & papers', note: 'Degrees, certifications, languages, and where I have spoken.' },
  { tag: 'E', label: 'Beyond', title: 'How I work, and after hours', note: 'Working principles and what happens when the laptop closes.' }
];
