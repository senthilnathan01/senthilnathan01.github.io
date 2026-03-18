export type NavItem = {
  label: string;
  href: string;
};

export type LinkItem = {
  label: string;
  href: string;
  note?: string;
};

export type ProfileFact = {
  label: string;
  value: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
};

export type ProjectItem = {
  title: string;
  description: string;
  stack: string[];
  href: string;
};

export type PrincipleItem = {
  title: string;
  description: string;
};

export type UpdateItem = {
  date: string;
  text: string;
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
  name: 'Senthilnathan',
  role: 'Applied AI Engineer',
  status: 'building practical AI systems',
  summary: '',
  focusAreas: [
    'applied machine learning',
    'LLMs',
    'statistical modeling',
  ],
  profileFacts: [
    { label: 'name', value: 'Senthilnathan' },
    { label: 'role', value: 'Applied AI Engineer' },
    { label: 'company', value: 'Loading...' },
    { label: 'previously', value: 'Featurely AI, Caterpillar, ...' },
    { label: 'education', value: 'B.Tech + M.Tech at IIT Madras' },
  ] as ProfileFact[],
  about: ['Currently I am learning inference engineering and building for agents.'],
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Experience', href: '/experience' },
    { label: 'Projects', href: '/projects' },
    { label: 'Principles', href: '/principles' },
    { label: 'CV', href: '/cv/senthilnathan_t.pdf' },
    { label: 'Contact', href: '/contact' },
  ] as NavItem[],
  links: [
    { label: 'github', href: 'https://github.com/senthilnathan01', note: '@senthilnathan01' },
    { label: 'linkedin', href: 'https://linkedin.com/in/senthilnathan_t', note: '@senthilnathan_t' },
    { label: 'x', href: 'https://x.com/cybersenth', note: '@cybersenth' },
    { label: 'email', href: 'mailto:tsnsenthil01@gmail.com', note: 'tsnsenthil01@gmail.com' },
  ] as LinkItem[],
  experienceIntro:
    'A focused view of internships, leadership, and team experience.',
  experience: [
    {
      company: 'Featurely AI (San Francisco Bay Area Based)',
      role: 'Applied AI Intern',
      location: 'Bangalore, India',
      period: 'June 2025 - July 2025',
      description:
        'Worked on explainable human-behavior simulation systems for product understanding under tight data constraints.',
      highlights: [
        'Featurely is a US AI startup backed by Bling Capital, whose partners have backed companies such as Palantir and Lyft.',
        'Built an explainable human-behavior simulation model using LLMs, probabilistic modeling, graph-based memory, and user-system simulation ideas.',
        'Engineered an episodic memory system using Neo4j and Pinecone with recursive retrieval across vector RAG and graph RAG patterns.',
        'Deployed the system with FastAPI, Docker, AWS EC2, and a Vector-based frontend so stakeholders could test it remotely.',
      ],
    },
    {
      company: 'Caterpillar',
      role: 'Machine Learning Intern, Global Data Science Team (Optimization Pod)',
      location: 'Chennai, India',
      period: 'Jan 2025 - May 2025',
      description:
        'Worked on optimization and reinforcement-learning systems for mining-fleet dispatch and simulation workflows.',
      highlights: [
        'Developed a multi-agent reinforcement learning dispatch system for mining fleets using proximal policy optimization.',
        'Built a multi-objective reward framework balancing productivity, truck congestion, and power efficiency.',
        'Automated mine-layout generation to cut setup time from hours to minutes for faster experimentation across many site layouts.',
      ],
    },
    {
      company: 'IIT Madras',
      role: 'Core Team Member, Wellness Team',
      location: 'Chennai, India',
      period: 'Aug 2022 - May 2025',
      description:
        'Contributed to student wellness initiatives while helping coordinate peer support and campus events over a three-year stretch.',
      highlights: [
        'Managed a team of 50 coordinators across wellness initiatives and student support efforts.',
        'Led numerous wellness events for the IIT Madras student community.',
        'Offered peer counselling support to students.',
      ],
    },
  ] as ExperienceItem[],
  projectsIntro:
    'Selected technical projects I want to feature right now.',
  projects: [
    {
      title: 'Implementation of Custom Deep Learning Architectures for Computer Vision',
      description:
        'Built a broad computer vision portfolio spanning neural style transfer, YOLOv2 vehicle detection, FaceNet-style recognition, U-Net segmentation, ResNet50 classification, and CNN-based visual classifiers.',
      stack: ['Python', 'Deep Learning', 'Computer Vision'],
      href: 'https://github.com/senthilnathan01/my_ml_projects',
    },
    {
      title: 'Foundational Machine Learning and Statistical Modeling',
      description:
        'Implemented a wide range of statistical and machine learning methods from scratch, including Bayes classifiers, Bayesian regression, clustering, ensemble methods, EM for mixture models, PCA plus k-NN, and regularized regression.',
      stack: ['Python', 'Statistical ML', 'Pattern Recognition'],
      href: 'https://github.com/senthilnathan01/prml-project',
    },
  ] as ProjectItem[],
  growthPhilosophy:
    "I'm all about becoming my absolute best. I want to see what my full potential is, and I believe broad capability matters because becoming exceptional in one domain usually requires getting strong across many.",
  principles: [
    {
      title: 'Embrace bold risks',
      description:
        'I believe real growth comes from taking bold risks and learning through failure. If nothing has gone wrong lately, that usually means the work was not ambitious enough.',
    },
    {
      title: 'Act fast and take ownership',
      description:
        'I try to move with urgency and high agency. When something matters, I want to be the person who carries it forward instead of waiting for ideal conditions.',
    },
    {
      title: 'Follow boundless curiosity',
      description:
        'My natural curiosity is the engine behind everything else. It keeps me exploring new ideas, new domains, and better ways to think and build.',
    },
  ] as PrincipleItem[],
  interests: ['math', 'AI', 'computer science', 'finance', 'philosophy'],
  contactBlurb:
    'If you want to talk about AI, machine learning, systems, or ambitious ideas worth building, feel free to reach out :)',
  cv: {
    href: '/cv/senthilnathan_t.pdf',
    downloadName: 'senthilnathan_t.pdf',
  },
  updates: [] as UpdateItem[],
  posts: [] as PostItem[],
  research: [] as ResearchItem[],
};
