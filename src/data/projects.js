/**
 * Case files. Each becomes a window in the Finder and a `.case` document.
 *
 * Every figure here is drawn from the repository it describes — commit counts,
 * file counts and dates come from git, and the engineering details come from
 * the code. Nothing is estimated. If you cannot point at the line that proves a
 * claim, it does not belong in this file.
 */
export const PROJECTS = [
  {
    id: 'comfab',
    num: '01', year: '2026', kind: 'Project', title: 'ComFab',
    date: '01 Sep 2026',
    client: 'Medical compression garments', discipline: 'Full-stack · E-commerce',
    slot: 'Storefront and admin screens',
    repo: 'https://github.com/yasser1123/ComFab',
    blurb: 'An Arabic-first e-commerce platform for medical compression garments, built and hardened over six months.',
    summary: 'An Arabic-first storefront for medical compression garments — burns treatment, post-surgical, varicose and neck support. Six months of solo work, 204 TypeScript files, and a hardening pass that fixed the money and concurrency bugs before anyone hit them.',
    tags: ['Next.js 15', 'Drizzle ORM', 'PostgreSQL', 'NextAuth v5', 'Playwright'],
    reel: '',
    demoLabel: 'comfab · engineering decisions',
    prompts: [
      { q: 'How does it handle money?', a: 'Integer minor units, everywhere.\n\nTotals are computed in piastres, not floating-point pounds. Floats accumulate error across line items, tax and shipping, and the failure only shows up as a receipt that is off by one unit — usually after a real customer has been charged.\n\nThe schema stores minor units, and formatting to a decimal string happens once, at the display edge.' },
      { q: 'What happens if a cart is created twice?', a: 'The database enforces one cart per identity, and getOrCreate tolerates losing the race.\n\nTwo requests arriving together used to create two carts; whichever wrote last silently orphaned the other one, along with the items in it.\n\nThe fix has two halves: a uniqueness constraint that merges any duplicates that already exist, and a getOrCreate that catches the conflict, re-reads, and returns the winner instead of throwing.' },
      { q: 'How is it tested?', a: 'Vitest for units, Playwright for the flows that carry money.\n\nE2E covers the paths where a bug costs a real order — browse, cart, checkout — because those are the ones no unit test can honestly claim to cover.\n\nCoverage is not complete and the repo does not pretend otherwise; the harness is there and the critical paths are the ones wired up first.' }
    ],
    steps: [
      { label: 'Schema', slot: 'Drizzle schema and relations', caption: 'Drizzle ORM over Neon Postgres, with the schema as the source of truth. Migrations are checked in, and a documented pass marked every table and column nothing actually reads — dead schema is a maintenance tax you pay forever.' },
      { label: 'Auth', slot: 'Auth flow', caption: 'NextAuth v5 with optional Google sign-in, and environment validation that throws a named error at boot rather than failing somewhere deep in a request. Zod validates at every trust boundary.' },
      { label: 'Storefront', slot: 'Product and checkout screens', caption: 'Next.js 15 App Router with Tailwind and shadcn/ui. Arabic is the primary locale through next-intl, not an afterthought bolted on — which shapes layout direction and copy from the first component.' },
      { label: 'Harden', slot: 'Remediation log', caption: 'A tracked remediation pass with severity labels. Money precision, cart race conditions, an analytics retention policy, structured logging replacing console calls, and a size filter that was not actually filtering.' }
    ],
    metrics: [
      { label: 'TypeScript source files', value: '204' },
      { label: 'Commits, solo', value: '82' },
      { label: 'Build span', value: '6 months' }
    ],
    gallery: ['Storefront — screenshot pending', 'Checkout — screenshot pending', 'Admin — screenshot pending'],
    credits: [
      { role: 'My role', name: 'Sole developer — schema, auth, storefront, testing' },
      { role: 'Stack', name: 'Next.js 15, TypeScript, Drizzle, Neon Postgres, NextAuth v5' },
      { role: 'Testing', name: 'Vitest, Playwright' },
      { role: 'Duration', name: 'March — September 2026' }
    ]
  },
  {
    id: 'seniocare',
    num: '02', year: '2026', kind: 'Project', title: 'SenioCare',
    date: '25 May 2026',
    client: 'Graduation project', discipline: 'Multi-agent AI · Healthcare',
    slot: 'Agent pipeline diagram',
    repo: 'https://github.com/yasser1123/SenioCare',
    blurb: 'A six-stage agent pipeline that answers elderly users health questions in Egyptian Arabic, and refuses when it should.',
    summary: 'A healthcare assistant for elderly users in Egypt. Six specialised agents pass a request down a pipeline — intent, safety, retrieval, generation, judgement, formatting — so that an unsafe question is caught before a model ever answers it, and every answer arrives in warm Egyptian Arabic.',
    tags: ['Google ADK', 'Multi-agent', 'FastAPI', 'Flutter', 'Arabic NLP'],
    reel: '',
    demoLabel: 'seniocare · pipeline',
    prompts: [
      { q: 'Why six agents instead of one prompt?', a: 'Because the failure modes are different, and one prompt cannot be held accountable for all of them.\n\nIntent -> Safety -> Fetch -> Generate -> Judge -> Format\n\nSafety screens for medical emergencies before generation runs at all. The Judge validates what was generated and can send it back. Splitting them means each stage has one job you can test, and a refusal is a designed path rather than a prompt that happened to hold.' },
      { q: 'What happens on "I have chest pain"?', a: 'Safety intercepts it and generation never runs.\n\nThe pipeline short-circuits straight to the formatter, which directs the user to local emergency services in Egyptian Arabic.\n\nAn assistant for elderly users that tries to be helpful about chest pain is more dangerous than one that refuses. The emergency path is the feature.' },
      { q: 'What does the Judge actually do?', a: 'It rejects, and the pipeline loops back.\n\nThe Feature agent generates, the Judge validates against the user health profile — conditions, medications, allergies — and an answer that fails goes back for another pass rather than out to the user.\n\nSelf-correction inside the pipeline, rather than hoping one generation was right.' }
    ],
    steps: [
      { label: 'Intent', slot: 'Intent routing', caption: 'The Intent agent classifies what was asked — meal planning, medication reminders, exercise, or general health — and routes accordingly. Built on Google ADK, which handles the agent hand-offs and shared session state.' },
      { label: 'Safety', slot: 'Safety screening', caption: 'Screens for medical emergencies and unsafe requests before anything is generated. Chest pain and stroke signs short-circuit the whole pipeline to an emergency response. Blocking early is cheaper and safer than filtering late.' },
      { label: 'Generate', slot: 'Feature agents', caption: 'A Feature agent handles the actual task, working from the user health profile so the answer accounts for their conditions, medications and allergies rather than being generically correct.' },
      { label: 'Judge & format', slot: 'Judge and formatter', caption: 'The Judge validates the draft and can reject it back to the generator. Only an approved answer reaches the Formatter, which renders it in warm Egyptian Arabic — the register a family member would use, not clinical translation.' }
    ],
    metrics: [
      { label: 'Agents in the pipeline', value: '6' },
      { label: 'Primary language', value: 'Egyptian Arabic' },
      { label: 'Safety path', value: 'Pre-generation' }
    ],
    gallery: ['App screens — pending', 'Pipeline trace — pending', 'Arabic output — pending'],
    credits: [
      { role: 'My role', name: 'Sole builder — agents, API, mobile client' },
      { role: 'Stack', name: 'Google ADK, Python, FastAPI, Flutter' },
      { role: 'Status', name: 'Active — evaluation and auth in progress' },
      { role: 'Context', name: 'Graduation project' }
    ]
  },
  {
    id: 'qattara',
    num: '03', year: '2025', kind: 'Project', title: 'Qattara Depression',
    date: '01 Feb 2025',
    client: 'Independent research', discipline: 'Geospatial · Concurrency · ML',
    slot: 'Pipeline architecture',
    repo: 'https://github.com/yasser1123/Qattara-Depression-GEE',
    blurb: 'A threaded Earth Engine pipeline that pulls decades of weather data, forecasts it, and writes the result as a report someone can open.',
    summary: 'Satellite and weather analysis of Egypt Qattara Depression. A three-stage threaded pipeline pulls Earth Engine data, derives meteorological variables, forecasts with a Random Forest, and writes seasonal Excel reports with charts embedded — output a non-programmer can actually open.',
    tags: ['Google Earth Engine', 'Threading', 'scikit-learn', 'NDVI/NDWI', 'openpyxl'],
    reel: '',
    demoLabel: 'qattara · pipeline',
    prompts: [
      { q: 'Why threads and not a simple loop?', a: 'Because Earth Engine throttles, and a serial loop spends most of its life waiting.\n\nThree stages run concurrently, connected by queues:\n\n  DataFetcher  -> queue -> DataOrganizer -> queue -> Writers\n\nDataFetcher pulls chunked date ranges from Earth Engine. DataOrganizer fans results out to three consumer queues. The writers drain them independently. A threadlock guards the shared state.\n\nThe fetch stage is I/O-bound, so threads are the right tool — no GIL problem to solve here.' },
      { q: 'How is the forecast validated?', a: 'TimeSeriesSplit, not a random split.\n\nRandom K-fold on time-series data lets the model train on the future and predict the past, which produces a beautiful score and a useless model.\n\nRandomForestRegressor, tuned with RandomizedSearchCV then GridSearchCV, scored on R2, RMSE and MAE. The split respects time order.' },
      { q: 'What comes out the other end?', a: 'Excel workbooks and GeoTIFFs.\n\nSeasonal sheets — real and predicted written by separate threads — with aggregated statistics per year and variable, auto-fitted column widths, and matplotlib charts embedded into the sheet rather than shipped as loose PNGs.\n\nSeparately, NDVI and NDWI layers export as GeoTIFF for use in GIS tooling.' }
    ],
    steps: [
      { label: 'Fetch', slot: 'DataFetcher thread', caption: 'DataFetcher subclasses threading.Thread and pulls Earth Engine data in chunked date ranges, pushing onto a queue. Chunking exists because the API throttles large pulls; concurrency exists because the wait dominates the work.' },
      { label: 'Derive', slot: 'Meteorological derivation', caption: 'Relative and specific humidity are computed from temperature, dewpoint and pressure. Earth Engine gives the raw variables; the ones the analysis actually needs have to be derived.' },
      { label: 'Forecast', slot: 'Model training', caption: 'A Random Forest regressor over the organised series, tuned in two passes and validated with TimeSeriesSplit. The trained model is pickled so a forecast run does not retrain.' },
      { label: 'Report', slot: 'Excel and GeoTIFF output', caption: 'A BaseWeatherWriter class subclassed into real and predicted writers, each running on its own thread. Seasonal sheets, aggregated statistics, embedded charts. The audience was researchers, so the deliverable is a spreadsheet, not a notebook.' }
    ],
    metrics: [
      { label: 'Pipeline stages, concurrent', value: '3' },
      { label: 'Validation', value: 'TimeSeriesSplit' },
      { label: 'Outputs', value: 'XLSX + GeoTIFF' }
    ],
    gallery: ['NDVI map — pending', 'Excel report — pending', 'Forecast plot — pending'],
    credits: [
      { role: 'My role', name: 'Sole author — pipeline, model, reporting' },
      { role: 'Stack', name: 'Python, Google Earth Engine, scikit-learn, pandas, openpyxl' },
      { role: 'Concurrency', name: 'threading, queue, matplotlib' },
      { role: 'Region', name: 'Qattara Depression, Egypt' }
    ]
  },
  {
    id: 'chalet',
    num: '04', year: '2025', kind: 'Project', title: 'Chalet Rental',
    date: '01 Feb 2025',
    client: 'Brokers and renters', discipline: 'Mobile · Firebase',
    slot: 'App screens',
    repo: 'https://github.com/yasser1123/Chalet-Rental-App',
    blurb: 'A booking app for chalet brokers, built around the one thing that actually breaks their business: double bookings.',
    summary: 'A React Native booking app for chalet brokers and renters. Role-based access separates what an admin can do from what an assistant can do, and the booking model is built so the same chalet cannot be reserved twice for overlapping dates.',
    tags: ['React Native', 'Expo', 'Firebase', 'Firestore', 'RBAC'],
    reel: '',
    demoLabel: 'chalet · design decisions',
    prompts: [
      { q: 'What problem does it actually solve?', a: 'Double bookings.\n\nBrokers managing several chalets across phone calls and notebooks eventually reserve the same property twice for overlapping dates. That is not an inconvenience — it is a refund, an argument, and a lost client.\n\nThe booking model treats conflict detection as the core feature rather than a validation afterthought.' },
      { q: 'Why role-based access?', a: 'Because assistants take bookings, but should not be able to delete a chalet.\n\nAdmins add, edit and remove properties. Assistants manage reservations only.\n\nThe distinction is enforced in the data layer, not just hidden in the UI — a hidden button is not an authorisation model.' },
      { q: 'Why Firebase?', a: 'One developer, real-time needs, no server to run.\n\nFirestore gives live sync so two assistants see the same availability without a refresh, and Firebase Authentication removes a whole auth surface from a solo build.\n\nFor a small brokerage the operational simplicity is worth more than the flexibility a custom backend would have bought.' }
    ],
    steps: [
      { label: 'Model', slot: 'Firestore data model', caption: 'Chalets, reservations and users in Firestore, shaped so an overlapping reservation is detectable at write time rather than discovered later by a person.' },
      { label: 'Roles', slot: 'RBAC rules', caption: 'Role-based access control separating admin capabilities from assistant capabilities, enforced where the data is written.' },
      { label: 'Client', slot: 'React Native screens', caption: 'React Native with Expo, React Navigation and React Native Paper. Brokers work from a phone, so the phone is the product rather than a companion to a web app.' },
      { label: 'Ship', slot: 'Demo and documentation', caption: 'Recorded walkthrough and a written documentation set — the parts most side projects skip, and the only way to show a mobile app to someone who will not install it.' }
    ],
    metrics: [
      { label: 'Platform', value: 'iOS + Android' },
      { label: 'Roles', value: 'Admin / assistant' },
      { label: 'Backend', value: 'Firebase' }
    ],
    gallery: ['Booking flow — pending', 'Admin view — pending', 'Demo video — pending'],
    credits: [
      { role: 'My role', name: 'Sole developer — app, data model, auth' },
      { role: 'Stack', name: 'React Native, Expo, Firebase, Firestore' },
      { role: 'Libraries', name: 'React Navigation, React Native Paper' },
      { role: 'Artefacts', name: 'Demo recording and documentation' }
    ]
  },
  {
    id: 'queryflow',
    num: '05', year: '2025', kind: 'Team project', title: 'QueryFlow',
    date: '14 Jan 2025',
    client: 'University team project', discipline: 'Developer tooling · Visualization',
    slot: 'Query results on a map',
    repo: 'https://github.com/FCI-Suez-2021-2025/QueryFlow',
    blurb: 'A team-built SQL transpiler over many data sources. My part: the map visualization, the parameter-driven query builder, and the Earth Engine data layer.',
    summary: 'QueryFlow is a transpiler that runs SQL SELECT syntax against SQLite, MSSQL, CSV, JSON, XML, Excel, HTML and remote Google Earth Engine, behind a desktop GUI. It was built by a university team; my contribution was the visualization and data side rather than the compiler.',
    tags: ['Python', 'Google Earth Engine', 'Data visualization', 'Desktop GUI'],
    reel: '',
    demoLabel: 'queryflow · my contribution',
    prompts: [
      { q: 'What did you build, specifically?', a: 'The parts between the query and the user.\n\n- Map rendering of query results\n- The parameter-selection flow: a user picks parameters, those become a query, the query becomes Python, and the result lands on the map\n- Error surfacing in the UI\n- The ETL layer that collects and processes Google Earth Engine data\n\nThe lexer, grammar and code generation were teammates work. I have not written them up as mine.' },
      { q: 'Why a parameter picker over writing SQL?', a: 'Because the people who need the data are not the people who write SQL.\n\nA researcher knows which region and which date range they want; asking them to also know the query syntax puts the tool behind a wall.\n\nThe picker turns their selections into the query, so the DSL underneath stays available to anyone who wants it without being mandatory.' },
      { q: 'Where can I see the pipeline code?', a: 'In my own repository.\n\nThe Earth Engine collection and processing work is the same pattern I wrote up independently as the Qattara Depression project — threaded chunked fetching, derived variables, and output shaped for a non-programmer.\n\nThat repo is entirely mine and is the honest place to read the code.' }
    ],
    steps: [
      { label: 'Collect', slot: 'Earth Engine collector', caption: 'The ETL layer that reaches remote Google Earth Engine and pulls the requested imagery and measurements — the same chunked, threaded approach as the Qattara project.' },
      { label: 'Select', slot: 'Parameter picker', caption: 'A parameter-selection interface that translates what a user chose into the query language, then into executable Python, without requiring them to write either.' },
      { label: 'Render', slot: 'Map output', caption: 'Query results drawn onto an interactive map, alongside the table view, so a geospatial result is read as geography rather than as rows.' },
      { label: 'Explain', slot: 'Error surfacing', caption: 'Error frames and detail popups that carry a compiler or data-source failure to the surface in a form the user can act on, rather than a stack trace in a console.' }
    ],
    metrics: [
      { label: 'My scope', value: 'Viz + ETL' },
      { label: 'Data sources supported', value: '8' },
      { label: 'Team size', value: 'University team' }
    ],
    gallery: ['Map view — pending', 'Parameter picker — pending', 'Error frame — pending'],
    credits: [
      { role: 'My role', name: 'Map visualization, parameter-driven query builder, error UI, Earth Engine ETL' },
      { role: 'Not my work', name: 'Lexer, grammar, AST and code generation — built by teammates' },
      { role: 'Stack', name: 'Python, Google Earth Engine, desktop GUI' },
      { role: 'Related', name: 'Pipeline code readable in Qattara-Depression-GEE' }
    ]
  },
  {
    id: 'artify',
    num: '06', year: '2025', kind: 'Project', title: 'Artify',
    date: '02 Feb 2025',
    client: 'Independent', discipline: 'Mobile · Computer vision',
    slot: 'Editor screens',
    repo: 'https://github.com/yasser1123/Artify',
    blurb: 'A React Native image editor that runs OpenCV in a hidden WebView, because React Native has no OpenCV.',
    summary: 'A mobile image editor with real-time brightness, contrast, saturation and sharpness, plus filters and rotation. OpenCV has no React Native binding, so the app runs OpenCV.js inside an invisible WebView and passes images across the bridge as base64.',
    tags: ['React Native', 'Expo', 'OpenCV.js', 'WebView', 'NativeWind'],
    reel: '',
    demoLabel: 'artify · the bridge',
    prompts: [
      { q: 'Why a WebView in a native app?', a: 'Because OpenCV has no React Native binding, and the alternative was writing one.\n\nOpenCV.js does run in a browser context. So the app mounts a WebView with opacity 0, height 0, width 0 — present in the tree, invisible to the user — and treats it as a compute surface rather than a view.\n\nImages cross as base64, get processed by OpenCV.js, and come back as base64 to be displayed natively.' },
      { q: 'What is the catch?', a: 'The bridge, mostly.\n\nBase64 across the React Native bridge is not free, and it is the ceiling on how large an image can be handled comfortably.\n\nThe honest tradeoff: a WebView bridge shipped in days, where a native module would have taken weeks and needed maintaining on two platforms. For an editor of this scope that was the right trade, and it would be the wrong one at higher resolutions.' },
      { q: 'What can it actually do?', a: 'Real-time adjustment plus OpenCV operations.\n\nSliders for brightness, contrast, saturation and sharpness. Grayscale, sepia, cool, warm and vintage filters. Thresholding, blurring and intensity work through OpenCV.js. Rotation in 90-degree steps.\n\nEdited images save straight to the device gallery through Expo Media Library.' }
    ],
    steps: [
      { label: 'Bridge', slot: 'WebView bridge', caption: 'An invisible WebView hosts OpenCV.js. The React Native side posts base64 image data in and listens for the processed result — a compute surface disguised as a view.' },
      { label: 'Adjust', slot: 'Slider controls', caption: 'Brightness, contrast, saturation and sharpness driven by sliders, with state held in React hooks and updates fed through the bridge as the user drags.' },
      { label: 'Filter', slot: 'Filter presets', caption: 'Grayscale, sepia, cool, warm and vintage presets, plus OpenCV operations like thresholding and blurring that would be awkward to hand-roll in JavaScript.' },
      { label: 'Save', slot: 'Gallery export', caption: 'Expo Media Library and Image Picker handle getting a photo in and the edited result back out to the device gallery, with the permission flow that implies.' }
    ],
    metrics: [
      { label: 'Processing', value: 'OpenCV.js' },
      { label: 'Filters', value: '5 presets' },
      { label: 'Platform', value: 'iOS + Android' }
    ],
    gallery: ['Editor UI — pending', 'Before/after — pending', 'Filter row — pending'],
    credits: [
      { role: 'My role', name: 'Sole developer — bridge, UI, processing' },
      { role: 'Stack', name: 'React Native, Expo, OpenCV.js, NativeWind' },
      { role: 'Native modules', name: 'Expo Media Library, Expo Image Picker' },
      { role: 'Related', name: 'A Python/Tkinter desktop take on the same idea exists separately' }
    ]
  }
];

export const findProject = (id) => PROJECTS.find((p) => p.id === id) || null;
export const projectIndex = (id) => PROJECTS.findIndex((p) => p.id === id);
