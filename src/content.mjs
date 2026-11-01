export const profile = {
  name: 'Ratnadeep Patil', role: 'AI / ML & Agentic Development Engineer',
  email: 'ratnadeepp2007@gmail.com', github: 'https://github.com/Ratnadeep-2007', linkedin: 'https://www.linkedin.com/in/ratnadeep-patil/',
  bio: 'I build AI agents, connect scattered knowledge, and automate the work between tools.',
  about: 'I’m pursuing my B.Tech at Universal AI University, Mumbai. My work brings together applied AI, backend systems, and the interfaces people use to make decisions.',
  experience: [
    { dates: '2025 — 2026', company: 'Exprivia', role: 'Microsoft 365 workflow automation', detail: 'Connected document handling, approvals, and reporting in Microsoft 365 workflows.' },
    { dates: '2025 — 2026', company: 'Spider Smart Solutions', role: 'Full-stack inventory management', detail: 'Built inventory management software with React, TypeScript, FastAPI, and PostgreSQL.' },
    { dates: 'B.Tech', company: 'Universal AI University, Mumbai', role: 'Education', detail: 'Studying at the intersection of AI and software engineering.' }
  ],
  toolkit: [
    ['Languages', 'Python, TypeScript, JavaScript, SQL'],
    ['Interfaces & APIs', 'React, Next.js, FastAPI, Flask'],
    ['AI & knowledge', 'LLM integration, agents, embeddings, semantic retrieval'],
    ['Data & delivery', 'PostgreSQL, Git, pytest, Playwright, workflow automation']
  ]
};

export const projects = [
  {
    id: 'synora', name: 'Synora', index: '01', category: 'PROJECT MEMORY & PROVENANCE', short: 'Keep the context. Keep the source.',
    summary: 'A shared project-memory layer that connects meetings, messages, and uploads to evidence-linked knowledge and a living architecture workspace.',
    repo: 'https://github.com/Ratnadeep-2007/Synora', source: 'https://github.com/Ratnadeep-2007/Synora/blob/main/README.md',
    stack: ['Python', 'FastAPI', 'Next.js', 'SQLAlchemy', 'Excalidraw'],
    problem: 'Project decisions arrive through different conversations and documents. A useful memory system needs to connect that information to the right project without losing where it came from.',
    context: 'Synora normalizes Google Meet, WhatsApp, and manual text/document/image inputs through source-specific adapters. Normalized evidence feeds project routing, context intelligence, and project-bounded memory. Excalidraw is an output surface, not a second source of truth.',
    contribution: ['Developed a shared ingestion path with validation, deduplication, and project routing.', 'Connected project requirements, decisions, and architecture updates to a database-backed Project Atlas.', 'Kept source provenance attached as evidence becomes contextual project knowledge.'],
    decisions: [
      ['One memory path', 'Source adapters normalize their inputs before the shared pipeline. Source-specific details stay available without creating a separate memory store for every connector.'],
      ['Evidence before visualization', 'Project state is persisted before visual synthesis. The read-only atlas reflects stored evidence and memory; editing the drawing does not silently create new evidence.'],
      ['Explicit uncertainty', 'Ambiguous communication routing is isolated for review. Manual file routing has different unmatched-input behavior; this portfolio does not imply that every upload is automatically accepted.']
    ],
    architecture: ['Meet / WhatsApp / uploads', 'Normalized evidence', 'Project memory', 'Excalidraw atlas'],
    boundary: 'Connector setup, capture services, and AI providers must be configured for their corresponding paths. The README describes deterministic layout fallback. This case study explains architecture; it does not claim a public live service is running.',
    related: 'contextguard', color: '#DBA77A', diagramLabel: 'Original architecture study · based on the Synora README'
  },
  {
    id: 'contextguard', name: 'ContextGuard', index: '02', category: 'EVIDENCE REVIEW & DECISION HISTORY', short: 'A better question before kickoff.',
    summary: 'An evidence-linked review workspace for finding gaps, recording clarifications, and preparing a project-kickoff brief.',
    repo: 'https://github.com/Ratnadeep-2007/ContextGurd', source: 'https://github.com/Ratnadeep-2007/ContextGurd/blob/main/README.md',
    stack: ['Python', 'FastAPI', 'React', 'SQLite', 'LLM integration'],
    problem: 'A project can start with unresolved assumptions, conflicting documents, and missing approvals. A useful review needs to make those gaps inspectable, then record what a person actually decided.',
    context: 'The workspace accepts a decision and source documents. Typed review stages produce findings; deterministic verification checks citation existence and report structure. Clarifications retain source locations and history. Confirmed decisions can be recalled within the same project.',
    contribution: ['Built a source-linked review flow from intake to findings, clarification, and export.', 'Connected saved decisions, owners, source passages, and input fingerprints to local review history.', 'Kept project memory scoped and distinguished confirmed user context from document facts.'],
    decisions: [
      ['Citations you can inspect', 'The verifier checks that a quoted passage exists. That is deliberately narrower than claiming the model’s interpretation is correct.'],
      ['Memory with boundaries', 'Local SQLite recall works independently. A configured Mem0 adapter can add semantic retrieval, but its presence is not presented as a verified live deployment.'],
      ['A brief with open questions', 'Exports separate clarifications, unresolved decisions, and accepted risks. A saved answer is a user statement, not an automatic readiness certification.']
    ],
    architecture: ['Decision + sources', 'Evidence-linked review', 'Clarification history', 'Kickoff brief'],
    boundary: 'This is a local, single-user application. Sample replay is a fixed fictional fixture, not a live detection benchmark. Provider output can miss issues or flag false positives; exact quotation checks cannot prove semantic accuracy.',
    related: 'synora', color: '#B7C4AD', diagramLabel: 'Original architecture study · based on the ContextGuard README'
  },
  {
    id: 'termwise', name: 'TermWise AI', index: '03', category: 'DOCUMENTS & CASH-FLOW SCENARIOS', short: 'Put payment terms on a timeline.',
    summary: 'A payment-term analysis workspace with source review, a Decimal-based ledger, stress scenarios, and a bounded search for alternative advance schedules.',
    repo: 'https://github.com/Ratnadeep-2007/TermWise-AI', source: 'https://github.com/Ratnadeep-2007/TermWise-AI/blob/main/README.md',
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'Decimal'],
    problem: 'Payment percentages alone do not explain whether a project can fund its costs. Timing, reserves, delayed receipts, and earlier expenses all change the cash position.',
    context: 'The workflow takes uploaded or entered payment terms through source confirmation before calculation. A shared event ledger then drives the cash timeline, stress transformations, and candidate advance schedules. Changed inputs invalidate old results.',
    contribution: ['Built document intake and a source-review checkpoint before calculation.', 'Implemented a Decimal-based event ledger for cash shortfalls and reserve funding.', 'Developed bounded schedule search and explicit stale-result invalidation.'],
    decisions: [
      ['Exact amounts, explicit ordering', 'Money uses Decimal with two decimal places. Outgoing events precede incoming events on shared dates so a temporary reserve breach remains visible.'],
      ['Confirm before calculating', 'Rule-based extraction is the default. Optional semantic extraction needs provider configuration and still requires review of material fields.'],
      ['Bound the answer', 'The search uses chosen dates and disclosed bounds. A no-match result means none of the tested candidates worked, not that every possible schedule is infeasible.']
    ],
    architecture: ['Payment document', 'Review source terms', 'Decimal event ledger', 'Compare scenarios'],
    boundary: 'One currency per deal; no tax, FX, holiday, or business-day modeling. Data is held in the browser tab and request memory. This is conditional decision support, not a prediction or guarantee of payment.',
    related: 'contextguard', color: '#C5AD91', diagramLabel: 'Original architecture study · based on the TermWise AI README'
  },
  {
    id: 'face-web-blockchain', name: 'Face → Web → Blockchain', index: '04', category: 'COMPUTER VISION & CONTENT FINGERPRINTS', short: 'From image to verifiable record.',
    summary: 'A CLI study connecting face embeddings, web discovery, candidate comparison, and content-fingerprint verification on the Polygon Amoy testnet.',
    repo: 'https://github.com/Ratnadeep-2007/face-web-blockchain', source: 'https://github.com/Ratnadeep-2007/face-web-blockchain/blob/main/README.md',
    stack: ['Python', 'InsightFace', 'SerpApi', 'Solidity', 'web3.py'],
    problem: 'A discovered web result can change after it is inspected. This project explores linking a candidate match to a reproducible content fingerprint and checking that fingerprint later.',
    context: 'A local face embedding feeds a Google Lens discovery path through SerpApi. Candidate images are compared with cosine similarity. A canonical JSON payload is hashed and registered through a Solidity contract on Polygon Amoy, with re-verification and a tamper demonstration.',
    contribution: ['Connected face detection and embeddings with web discovery and candidate re-checking.', 'Canonicalized selected result metadata before generating a SHA-256 fingerprint.', 'Implemented a testnet registry path and a CLI re-verification/tamper demonstration.'],
    decisions: [
      ['Fingerprint, not photograph', 'Only a bytes32 content hash is stored on-chain. The image is not uploaded to the contract.'],
      ['Similarity is conditional', 'A configurable similarity threshold is a comparison rule, not proof of identity. Quality, pose, and age can affect matching.'],
      ['Keep the scope visible', 'Offline mock search and live discovery are separate paths. A mock run is not evidence of an actual web discovery or blockchain transaction.']
    ],
    architecture: ['Face embedding', 'Web candidate search', 'Canonical SHA-256', 'Testnet registry'],
    boundary: 'This is a CLI prototype on a test network, with external search quotas and inaccessible/private social-page limits. On-chain integrity of a hash does not certify identity, consent, ownership, or the truth of the underlying content.',
    related: 'termwise', color: '#B7B6AD', diagramLabel: 'Original architecture study · based on the project README'
  }
];

export const studyRecords = [
  { id: 'meeting', label: 'Meeting note', kind: '01 / TRANSCRIPT', quote: 'Keep the original source attached to every project update.', context: 'A provenance requirement is added to project memory, with a pointer back to the meeting note.', decision: 'Show the supporting source alongside the architecture update.', source: 'Illustrative meeting note · passage 04' },
  { id: 'brief', label: 'Project brief', kind: '02 / DOCUMENT', quote: 'Confirm the dependency before preparing the kickoff brief.', context: 'The dependency is recorded as an open question. It is not silently converted into an approved fact.', decision: 'Keep the dependency open until a person records a clarification.', source: 'Illustrative project brief · paragraph 07' },
  { id: 'architecture', label: 'Architecture note', kind: '03 / TECHNICAL NOTE', quote: 'The visual workspace should reflect the persisted project state.', context: 'An architecture constraint links the visualization to the shared memory layer.', decision: 'Update the atlas from stored evidence; keep the visualization read-only.', source: 'Illustrative architecture note · section 02' }
];
