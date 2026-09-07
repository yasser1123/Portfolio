/** Case files. Each becomes a window in the Finder and a `.case` document. */
export const PROJECTS = [
  {
    id: 'halo',
    num: '01', year: '2026', kind: 'Project', title: 'Halo Retrieval',
    date: '12 Feb 2026',
    client: 'Meridian Health', discipline: 'RAG · Evaluation', slot: 'System diagram',
    blurb: 'Clinical retrieval over 40 years of scanned records, with citations a physician can open and check.',
    summary: 'A clinical retrieval layer that answers questions over 40 years of scanned patient records, with citations a physician can open and check.',
    tags: ['Hybrid retrieval', 'Reranking', 'Citations', 'vLLM'],
    reel: 'Motion reel — retrieval walkthrough',
    demoLabel: 'halo · inference sandbox',
    prompts: [
      { q: 'Summarise this patient\u2019s cardiac history', a: 'Three prior events on record.\n\n1998 — angioplasty, LAD [chart 04-118]\n2011 — stent placement, two vessels [chart 11-902]\n2023 — managed AFib, on anticoagulant [note 23-4471]\n\nEvery line above resolves to a page image. Retrieval ran over 12,400 scanned pages; the reranker kept 6.' },
      { q: 'What changed in the 2023 notes?', a: 'Anticoagulant switched from warfarin to apixaban in March 2023 [note 23-4471, p2].\n\nDosage stable since. No bleeding events logged in the 18 months that follow.' },
      { q: 'Show me where this came from', a: 'Top source: scan 11-902, page 3, region (0.42, 0.18)–(0.88, 0.31).\nConfidence 0.91 · rerank position 1 of 6.\n\nThe viewer opens on the exact crop, so a clinician confirms in one glance instead of trusting the model.' }
    ],
    steps: [
      { label: 'Ingest', slot: 'OCR pipeline diagram', caption: 'Scanned pages pass through layout-aware OCR. Tables and margin notes survive as structure, not as flattened text — most of the accuracy gain came from this stage, not the model.' },
      { label: 'Retrieve', slot: 'Hybrid search diagram', caption: 'BM25 and dense vectors run in parallel, results fused with reciprocal rank. Sparse matching catches drug names and codes that embeddings routinely miss.' },
      { label: 'Rerank', slot: 'Cross-encoder chart', caption: 'A cross-encoder cuts 200 candidates to 6. Costs 180ms and removed most of the confident-but-wrong answers we saw in early testing.' },
      { label: 'Ground', slot: 'Citation UI screen', caption: 'Every claim carries a page-region pointer. If the model cannot cite, it says so rather than filling the gap.' }
    ],
    metrics: [
      { label: 'Answer accuracy, clinician-graded', value: '94%' },
      { label: 'Median latency, end to end', value: '1.3s' },
      { label: 'Pages indexed', value: '12.4M' }
    ],
    gallery: ['Citation viewer', 'Eval dashboard', 'Ingest monitor'],
    credits: [
      { role: 'My role', name: 'Lead AI engineer — retrieval, eval harness, serving' },
      { role: 'Team', name: '2 engineers, 1 clinical advisor' },
      { role: 'Stack', name: 'Python, vLLM, Qdrant, Postgres, Modal' },
      { role: 'Duration', name: '7 months, shipped Feb 2026' }
    ]
  },
  {
    id: 'sentinel',
    num: '02', year: '2025', kind: 'Project', title: 'Drift Sentinel',
    date: '03 Sep 2025',
    client: 'Internal tooling', discipline: 'MLOps · Monitoring', slot: 'Drift dashboard',
    blurb: 'Watches embedding distributions and raises a case file before accuracy shows up in a weekly report.',
    summary: 'Production models degrade quietly. Sentinel watches embedding distributions and raises a case file with the evidence before accuracy shows up in a weekly report.',
    tags: ['Drift detection', 'Observability', 'Alerting', 'Kafka'],
    reel: 'Motion reel — an alert firing live',
    demoLabel: 'sentinel · replay',
    prompts: [
      { q: 'Why did the classifier drop last Tuesday?', a: 'Input drift on field `description`.\n\nJS divergence 0.31 (threshold 0.12) starting 04:00 UTC.\nCause: an upstream form change began truncating text at 120 characters.\n\nDetected 6 hours before the accuracy metric moved.' },
      { q: 'Which features moved most?', a: 'description_len   -68%   ██████████\ntoken_entropy     -22%   ███\nlang_confidence    -4%   ▌\n\nThe first one explains the other two.' },
      { q: 'Open the case file', a: 'Case #2291 · severity high · owner: search-relevance\n\nAttached: drift chart, 40 sampled inputs before and after, the upstream deploy diff.\n\nMean time to a named root cause fell from 3 days to 40 minutes once the evidence arrived pre-assembled.' }
    ],
    steps: [
      { label: 'Sample', slot: 'Sampling architecture', caption: 'A 2% reservoir sample of live traffic streams to cold storage. Cheap enough to leave on permanently, dense enough to see a shift within an hour.' },
      { label: 'Compare', slot: 'Distribution chart', caption: 'Each window is compared against a rolling baseline on both raw features and embedding centroids. Embeddings catch semantic shifts that per-feature stats sail past.' },
      { label: 'Explain', slot: 'Attribution view', caption: 'An alert without a cause gets ignored. Sentinel ranks contributing features and pulls concrete before-and-after examples into the alert body.' },
      { label: 'Route', slot: 'Alert routing map', caption: 'Cases go to the team that owns the upstream service, not to a shared channel. Acknowledgement rate went from a third to nearly all of them.' }
    ],
    metrics: [
      { label: 'Median detection lead time', value: '6h' },
      { label: 'Time to root cause', value: '-93%' },
      { label: 'Models under watch', value: '31' }
    ],
    gallery: ['Alert case file', 'Drift timeline', 'Routing rules'],
    credits: [
      { role: 'My role', name: 'Sole engineer — design, build, rollout' },
      { role: 'Adopted by', name: '4 product teams' },
      { role: 'Stack', name: 'Python, Kafka, ClickHouse, Grafana' },
      { role: 'Duration', name: '4 months, 2025' }
    ]
  },
  {
    id: 'kite',
    num: '03', year: '2024', kind: 'Project', title: 'Kite',
    date: '28 Jun 2024',
    client: 'Independent', discipline: 'On-device · Speech', slot: 'Device benchmark',
    blurb: 'A 90M-parameter speech model distilled and quantised into a 34MB binary that runs with no network.',
    summary: 'A speech model small enough to run inside a phone with no network. Distilled from a 1.5B teacher down to 90M parameters, quantised, and shipped as a 34MB binary.',
    tags: ['Distillation', 'Quantisation', 'ONNX', 'Edge'],
    reel: 'Motion reel — offline transcription on device',
    demoLabel: 'kite · on-device',
    prompts: [
      { q: 'Transcribe with airplane mode on', a: '"...meet me by the north entrance around six"\n\n0 bytes sent. 41ms per second of audio on an A15.\nNothing leaves the handset, which is the whole reason the project exists.' },
      { q: 'How small did it get?', a: 'teacher   1.5B params   2.9GB\nstudent    90M params    172MB\nint8       90M params     34MB\n\nWord error rate went 4.1% → 5.8%. Acceptable for the target use, and the only version that fits in a phone memory budget.' },
      { q: 'Where does it fail?', a: 'Heavy background music, overlapping speakers, and code-switching mid-sentence.\n\nAll three are documented in the model card with audio examples. A limits section is more useful to whoever ships this than another benchmark table.' }
    ],
    steps: [
      { label: 'Distil', slot: 'Distillation curve', caption: 'Layer-wise distillation from a 1.5B teacher on 4,000 hours of speech. Matching intermediate representations beat matching outputs alone by a clear margin.' },
      { label: 'Prune', slot: 'Sparsity heatmap', caption: 'Structured pruning of attention heads. A third came out with no measurable loss, which says something about how the teacher was trained.' },
      { label: 'Quantise', slot: 'Precision comparison', caption: 'int8 with per-channel scales. Naive quantisation destroyed the audio front-end, so those layers stayed in fp16.' },
      { label: 'Ship', slot: 'Mobile integration', caption: 'Exported to ONNX with a Core ML delegate. 34MB, cold start under 200ms, no server bill.' }
    ],
    metrics: [
      { label: 'Binary size', value: '34MB' },
      { label: 'Word error rate', value: '5.8%' },
      { label: 'Realtime factor', value: '0.04x' }
    ],
    gallery: ['Model card', 'Latency benchmarks', 'Demo app'],
    credits: [
      { role: 'My role', name: 'Everything — training, export, demo app' },
      { role: 'Compute', name: '8×A100, 11 days total' },
      { role: 'Stack', name: 'PyTorch, ONNX Runtime, Core ML, Swift' },
      { role: 'Duration', name: '5 months, 2024' }
    ]
  }
];

export const findProject = (id) => PROJECTS.find((p) => p.id === id) || null;
export const projectIndex = (id) => PROJECTS.findIndex((p) => p.id === id);
