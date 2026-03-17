export type NavItem = {
  label: string;
  href: string;
};

export type ExternalLink = {
  label: string;
  href: string;
  note?: string;
};

export type UpdateItem = {
  date: string;
  text: string;
  href?: string;
};

export type ProjectItem = {
  title: string;
  description: string;
  stack: string[];
  href?: string;
};

export type PostItem = {
  title: string;
  date: string;
  summary: string;
  href?: string;
};

export type ResearchItem = {
  title: string;
  venue: string;
  year: string;
  summary: string;
  href?: string;
};

export const siteData = {
  brand: '~/senthil',
  name: 'Senthil Nathan',
  role: 'Independent researcher + software engineer',
  status: '[ OK ] Starting session',
  summary:
    'I build practical systems and conduct applied research at the intersection of language models, developer tools, and human-computer interaction.',
  focusAreas: [
    'LLM evaluation and alignment workflows',
    'Developer productivity tooling',
    'Information retrieval and ranking systems',
  ],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Research', href: '/research' },
    { label: 'Blog', href: '/blog' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
  ] as NavItem[],
  links: [
    { label: 'GitHub', href: 'https://github.com/your-handle', note: '@your-handle' },
    { label: 'X / Twitter', href: 'https://x.com/your-handle', note: '@your-handle' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle', note: 'professional profile' },
    { label: 'Email', href: 'mailto:you@example.com', note: 'you@example.com' },
  ] as ExternalLink[],
  updates: [
    { date: '2026-02-12', text: 'Shipped a lightweight benchmark runner for retrieval-augmented assistants.', href: '/projects' },
    { date: '2026-01-27', text: 'Published notes on evaluation design for multi-step coding agents.', href: '/blog' },
    { date: '2025-12-19', text: 'Presented a short talk on terminal-native UX patterns for research tooling.', href: '/research' },
  ] as UpdateItem[],
  projects: [
    {
      title: 'TermLab',
      description: 'A terminal-native interface for orchestrating reproducible LLM experiments with strict config snapshots.',
      stack: ['TypeScript', 'Next.js', 'SQLite'],
      href: '#',
    },
    {
      title: 'SignalRank',
      description: 'Hybrid reranking pipeline combining lexical and semantic relevance for technical knowledge bases.',
      stack: ['Python', 'FastAPI', 'PostgreSQL'],
      href: '#',
    },
    {
      title: 'TraceDeck',
      description: 'A compact observability layer for long-running agent workflows with timeline-first diagnostics.',
      stack: ['Go', 'OpenTelemetry', 'ClickHouse'],
      href: '#',
    },
  ] as ProjectItem[],
  posts: [
    {
      title: 'What good LLM evals look like in practice',
      date: '2026-01-27',
      summary: 'A practical checklist for writing fast, meaningful evaluations that keep teams honest.',
      href: '#',
    },
    {
      title: 'Designing command-line interfaces for thinking',
      date: '2025-11-18',
      summary: 'Why concise prompts, pacing, and whitespace matter more than visual ornamentation.',
      href: '#',
    },
  ] as PostItem[],
  research: [
    {
      title: 'Interactive Protocols for Human-in-the-Loop Agent Debugging',
      venue: 'Preprint',
      year: '2026',
      summary: 'Explores compact interaction loops that improve operator trust and intervention speed.',
      href: '#',
    },
    {
      title: 'Measuring Drift in Retrieval-Augmented Systems over Time',
      venue: 'Workshop on Reliable ML Systems',
      year: '2025',
      summary: 'Introduces a longitudinal benchmark for document freshness, citation quality, and answer stability.',
      href: '#',
    },
  ] as ResearchItem[],
};
