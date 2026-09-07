/**
 * Offline agent.
 *
 * Runs when no ANTHROPIC_API_KEY is configured, when /api/agent is missing
 * (a plain static host), or when the network call fails. Same return shape as
 * the remote path — { text, actions } — so the UI never branches.
 */
export function answerLocally(question) {
  const s = (question || '').toLowerCase();
  const has = (...w) => w.some((x) => s.indexOf(x) >= 0);
  const act = (name, input = {}) => [{ name, input }];

  if (has('t-shape', 't shaped', 'tshape', 'breadth', 'generalist'))
    return {
      text: 'Yes, and the dossier shows the shape directly. Depth is AI systems — retrieval, evaluation, compression, serving. Breadth covers backend, data engineering, infra, frontend, mobile/edge, vision, speech, classical ML, and embedded firmware.\n\nOpening the Toolbox tab so you can see the depth labels per domain.',
      actions: act('show_dossier', { tab: 'toolbox' })
    };

  if (has('resume', 'résumé', 'cv', 'pdf'))
    return {
      text: 'Opening file 04 — the one-page résumé. It is the summarised, job-targeted version; the dossier has the unabridged one.',
      actions: act('open_resume')
    };

  if (has('best project', 'strongest', 'proudest', 'halo', 'retrieval', 'rag', 'clinical'))
    return {
      text: 'File 01, Halo Retrieval — clinical retrieval over 12.4M scanned pages, 94% clinician-graded accuracy, 1.3s median latency. Opening it now.',
      actions: act('open_project', { id: 'halo' })
    };

  if (has('drift', 'monitoring', 'mlops', 'sentinel', 'observability'))
    return {
      text: 'File 02, Drift Sentinel — drift monitoring across 31 models, 6-hour median detection lead time. Opening it.',
      actions: act('open_project', { id: 'sentinel' })
    };

  if (has('kite', 'on-device', 'edge', 'quantis', 'mobile', 'speech', 'distill'))
    return {
      text: 'File 03, Kite — a 1.5B speech teacher distilled to 90M and quantised into a 34MB binary that runs with no network. Opening it.',
      actions: act('open_project', { id: 'kite' })
    };

  if (has('tool', 'stack', 'tech', 'language', 'framework'))
    return {
      text: 'Deep: PyTorch, vLLM, Qdrant, ONNX Runtime, evaluation harnesses. Broad: FastAPI, Postgres, Kafka, Airflow, ClickHouse, Kubernetes, Terraform, React, TypeScript, Swift/Core ML, OpenCV, scikit-learn, and C on microcontrollers.\n\nThe Toolbox tab lists them by domain with an honest depth label.',
      actions: act('show_dossier', { tab: 'toolbox' })
    };

  if (has('experience', 'years', 'history', 'worked', 'job', 'role', 'career'))
    return {
      text: 'Five years of paid engineering: embedded firmware (2019–21), independent software and on-device ML (2021–23), platform ML (2023–25), and lead AI engineer at Meridian Health since 2025.\n\nTaking you to the full track record.',
      actions: act('show_dossier', { tab: 'track' })
    };

  if (has('education', 'degree', 'cert', 'university', 'study'))
    return {
      text: 'B.Sc. Computer Engineering, AWS ML Specialty, CKA, and an NVIDIA course on deploying transformers. Opening the Credentials tab.',
      actions: act('show_dossier', { tab: 'credentials' })
    };

  if (has('hire', 'available', 'contact', 'email', 'freelance', 'salary', 'reach', 'talk'))
    return {
      text: 'He is open to senior AI engineering roles and selective contract work, remote or Cairo-based. Opening the Contact window — the email route is fastest, and he answers within a day.',
      actions: act('open_contact', { subject: 'A role' })
    };

  if (has('project', 'files', 'portfolio', 'work'))
    return {
      text: 'Three case files: 01 Halo Retrieval (clinical RAG), 02 Drift Sentinel (MLOps monitoring), 03 Kite (on-device speech). Opening the folder — double-click any row.',
      actions: act('open_folder')
    };

  if (has('principle', 'process', 'philosophy', 'how does he work'))
    return {
      text: 'Evaluation set before model. The boring layer decides the result. Write the limits down. Ship a whole slice.\n\nOpening the Beyond tab, which has these in full.',
      actions: act('show_dossier', { tab: 'beyond' })
    };

  return {
    text: 'I can cover his projects, his stack, his track record, credentials, or how he works — and I can open any of them for you. Try one of the chips, or ask about a specific tool or domain.',
    actions: []
  };
}

export const CHIPS = [
  'Is he T-shaped?',
  'Best project',
  'Open the résumé',
  'Tools he knows',
  'How do I hire him?'
];
