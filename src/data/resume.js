export const RESUME = {
  fileName: '04 — Ahmed Yasser Résumé.pdf',
  date: '31 Aug 2026',
  size: '182 KB',
  /** Drop a real PDF at this path and the Download button becomes live. */
  pdfHref: './public/ahmed-yasser-resume.pdf',
  head: { name: 'Ahmed Yasser', role: 'AI Engineer', place: 'Cairo · remote-friendly' },
  links: [
    { label: 'Email', value: 'hello@ahmedyasser.dev', href: 'mailto:hello@ahmedyasser.dev' },
    { label: 'GitHub', value: 'github.com/ahmedyasser', href: '#' },
    { label: 'LinkedIn', value: 'in/ahmedyasser', href: '#' },
    { label: 'PDF', value: 'Download résumé', href: './public/ahmed-yasser-resume.pdf' }
  ],
  intro: 'I build retrieval and inference systems that hold up in production — evaluation harnesses, serving stacks, and the monitoring that catches a regression before a user does.',
  roles: [
    { when: '2025 — now', what: 'Lead AI Engineer', where: 'Meridian Health', note: 'Clinical retrieval over 12.4M scanned pages. Owned retrieval, eval harness and serving.' },
    { when: '2023 — 2025', what: 'ML Engineer', where: 'Internal platform team', note: 'Built drift monitoring adopted by four product teams. Cut time-to-root-cause by 93%.' },
    { when: '2021 — 2023', what: 'Software Engineer', where: 'Freelance / independent', note: 'On-device speech models, distillation and quantisation down to 34MB binaries.' }
  ],
  blocks: [
    { title: 'Stack', items: ['Python, PyTorch', 'vLLM, ONNX Runtime', 'Qdrant, Postgres, ClickHouse', 'Kubernetes, Modal, Kafka'] },
    { title: 'Focus', items: ['Retrieval & reranking', 'Evaluation harnesses', 'Quantisation & edge deploy', 'Production monitoring'] },
    { title: 'Also', items: ['B.Sc. Computer Engineering', 'Arabic, English', 'Writes model cards nobody asked for'] }
  ]
};
