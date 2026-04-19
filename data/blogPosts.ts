import rawPosts from './blogPosts.generated.json';
import { localBlogConfigs, localBlogPosts } from './localBlogPosts';

export type BlogCategory = 'tech' | 'non-tech';

type RawBlogPost = {
  title: string;
  mediumUrl: string;
  publishedAt: string;
  heroImage?: string;
  contentHtml: string;
};

type BlogConfig = {
  slug: string;
  category: BlogCategory;
  categoryLabel: string;
  collectionTitle: string;
  collectionBlurb: string;
  summaryOverride?: string;
  sortOrder?: number;
  seriesPart?: number;
  introHtml?: string;
  removeSnippets?: string[];
  replacements?: Array<{
    from: string;
    toSlug: string;
    label?: string;
  }>;
};

export type BlogPost = {
  title: string;
  slug: string;
  href: string;
  mediumUrl: string;
  publishedAt: string;
  dateLabel: string;
  heroImage?: string;
  summary: string;
  contentHtml: string;
  category: BlogCategory;
  categoryLabel: string;
  collectionTitle: string;
  collectionBlurb: string;
  sortOrder?: number;
  seriesPart?: number;
};

export const blogCollections: Record<
  BlogCategory,
  {
    label: string;
    title: string;
    blurb: string;
    indexCommand: string;
  }
> = {
  tech: {
    label: 'Tech',
    title: 'Tech Writings',
    blurb: 'Systems, ML, LLMs, and the engineering details that decide whether ideas survive reality.',
    indexCommand: 'cat featured/tech.log',
  },
  'non-tech': {
    label: 'Beyond Tech',
    title: 'Beyond Tech',
    blurb: 'Notes on growth, mindset, inner architecture, and the human side of becoming better.',
    indexCommand: 'cat featured/beyond-tech.log',
  },
};

const normalizedLocalBlogConfigs: Record<string, BlogConfig> = Object.fromEntries(
  Object.entries(localBlogConfigs).map(([url, config]) => [
    url,
    {
      ...config,
      categoryLabel: blogCollections[config.category].label,
      collectionTitle: blogCollections[config.category].title,
      collectionBlurb: blogCollections[config.category].blurb,
    },
  ]),
);

const postConfigByUrl: Record<string, BlogConfig> = {
  ...normalizedLocalBlogConfigs,
  'https://medium.com/@tsnsenthil01/do-not-let-llm-costs-kill-a-good-idea-too-early-2bbc5b2bc105': {
    slug: 'do-not-let-llm-costs-kill-a-good-idea-too-early',
    category: 'non-tech',
    categoryLabel: blogCollections['non-tech'].label,
    collectionTitle: blogCollections['non-tech'].title,
    collectionBlurb: blogCollections['non-tech'].blurb,
    sortOrder: 3,
  },
  'https://medium.com/@tsnsenthil01/it-is-high-time-to-start-documenting-your-life-and-work-1380ff294bef': {
    slug: 'it-is-high-time-to-start-documenting-your-life-and-work',
    category: 'non-tech',
    categoryLabel: blogCollections['non-tech'].label,
    collectionTitle: blogCollections['non-tech'].title,
    collectionBlurb: blogCollections['non-tech'].blurb,
  },
  'https://medium.com/@tsnsenthil01/why-crypto-has-not-beaten-wall-street-yet-and-why-that-question-might-be-wrong-0f2b8a8c0f56': {
    slug: 'why-crypto-has-not-beaten-wall-street-yet-and-why-that-question-might-be-wrong',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
  },
  'https://medium.com/@tsnsenthil01/vllm-a-more-efficient-way-to-serve-large-language-models-053c98b6543a': {
    slug: 'vllm-a-more-efficient-way-to-serve-large-language-models',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
  },
  'https://medium.com/@tsnsenthil01/git-worktrees-the-essential-git-feature-many-developers-still-do-not-use-ae6a8c547289': {
    slug: 'git-worktrees-the-essential-git-feature-many-developers-still-do-not-use',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    summaryOverride:
      'But there is a feature that quietly solves one of the most common sources of friction in everyday development. Many developers have heard about it. Very few actually use it in practice.',
  },
  'https://medium.com/@tsnsenthil01/google-analytics-worked-on-localhost-but-failed-on-github-pages-heres-what-i-learned-577ed97374cd': {
    slug: 'google-analytics-worked-on-localhost-but-failed-on-github-pages-heres-what-i-learned',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
  },
  'https://medium.com/@tsnsenthil01/what-it-actually-takes-to-be-a-strong-ai-ml-engineer-in-2026-dd7bcb4661a8': {
    slug: 'what-it-actually-takes-to-be-a-strong-ai-ml-engineer-in-2026',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    seriesPart: 1,
    replacements: [
      {
        from: 'Part 2: Training and Loss Functions (What you’re actually optimizing)',
        toSlug: 'part-2-training-and-loss-functions-what-youre-actually-optimizing',
      },
      {
        from: 'Part 3: LLMs and Modern ML (The new fundamentals)',
        toSlug: 'part-3-llms-and-modern-ml-the-new-fundamentals',
      },
      {
        from: 'Part 4: Production Systems (Where models die)',
        toSlug: 'part-4-production-systems-where-good-models-can-die',
      },
      {
        from: 'Part 5: The Critical Pieces (Observability, Agents, Security)',
        toSlug: 'part-5-the-critical-pieces-observability-agents-security',
      },
      {
        from: 'Part 6: Evals and Organizational Reality (What actually determines success)',
        toSlug: 'part-6-evals-optimization-and-organizational-reality-what-actually-determines-success',
      },
      {
        from: 'Part 7: Putting It All Together (What This Actually Means)',
        toSlug: 'part-7-putting-it-all-together-what-this-actually-means',
      },
      {
        from: 'Tomorrow: Part 2',
        toSlug: 'part-2-training-and-loss-functions-what-youre-actually-optimizing',
      },
    ],
  },
  'https://medium.com/@tsnsenthil01/part-2-training-and-loss-functions-what-youre-actually-optimizing-ce6d254c9c84': {
    slug: 'part-2-training-and-loss-functions-what-youre-actually-optimizing',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    seriesPart: 2,
    introHtml:
      '<p>Check out <a href="/blog/what-it-actually-takes-to-be-a-strong-ai-ml-engineer-in-2026">Part 1: “The Foundation — Data, Statistics and the basics everyone skips”</a> here.</p>',
    removeSnippets: [
      '<p>Check out Part 1: “The Foundation — Data, Statistics and the basics everyone skips” here:<br><a href="https://medium.com/@tsnsenthil01/what-it-actually-takes-to-be-a-strong-ai-ml-engineer-in-2026-dd7bcb4661a8">https://medium.com/@tsnsenthil01/what-it-actually-takes-to-be-a-strong-ai-ml-engineer-in-2026-dd7bcb4661a8</a></p>',
      '<p>Following this series? Part 3 drops tomorrow.</p>',
    ],
    replacements: [
      {
        from: 'Tomorrow: Part 3',
        toSlug: 'part-3-llms-and-modern-ml-the-new-fundamentals',
      },
    ],
  },
  'https://medium.com/@tsnsenthil01/part-3-llms-and-modern-ml-the-new-fundamentals-742a4e6dbff5': {
    slug: 'part-3-llms-and-modern-ml-the-new-fundamentals',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    seriesPart: 3,
    introHtml:
      '<p>Check out <a href="/blog/part-2-training-and-loss-functions-what-youre-actually-optimizing">Part 2: Training and Loss Functions (What You’re Actually Optimizing)</a> here.</p>',
    replacements: [
      {
        from: 'Tomorrow: Part 4 (Production systems — where models can die)',
        toSlug: 'part-4-production-systems-where-good-models-can-die',
      },
    ],
  },
  'https://medium.com/@tsnsenthil01/part-4-production-systems-where-good-models-can-die-5b75ee606c1e': {
    slug: 'part-4-production-systems-where-good-models-can-die',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    seriesPart: 4,
    introHtml:
      '<p>Check out <a href="/blog/part-3-llms-and-modern-ml-the-new-fundamentals">Part 3: LLMs and Modern ML (The New Fundamentals)</a> here.</p>',
    replacements: [
      {
        from: 'Next: Part 5',
        toSlug: 'part-5-the-critical-pieces-observability-agents-security',
      },
    ],
  },
  'https://medium.com/@tsnsenthil01/part-5-the-critical-pieces-observability-agents-security-c335368ba3bf': {
    slug: 'part-5-the-critical-pieces-observability-agents-security',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    seriesPart: 5,
    introHtml:
      '<p>Check out <a href="/blog/part-4-production-systems-where-good-models-can-die">Part 4: Production Systems (Where Good Models Can Die)</a> here.</p>',
    replacements: [
      {
        from: 'Tomorrow: Part 6',
        toSlug: 'part-6-evals-optimization-and-organizational-reality-what-actually-determines-success',
      },
    ],
  },
  'https://medium.com/@tsnsenthil01/part-6-evals-optimization-and-organizational-reality-what-actually-determines-success-1f44f7fbba6c': {
    slug: 'part-6-evals-optimization-and-organizational-reality-what-actually-determines-success',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    seriesPart: 6,
    introHtml:
      '<p>Check out <a href="/blog/part-5-the-critical-pieces-observability-agents-security">Part 5: The Critical Pieces: Observability, Agents, Security</a> here.</p>',
    replacements: [
      {
        from: 'Tomorrow: Part 7 (Final)',
        toSlug: 'part-7-putting-it-all-together-what-this-actually-means',
      },
    ],
  },
  'https://medium.com/@tsnsenthil01/part-7-putting-it-all-together-what-this-actually-means-ce673ae34ca3': {
    slug: 'part-7-putting-it-all-together-what-this-actually-means',
    category: 'tech',
    categoryLabel: blogCollections.tech.label,
    collectionTitle: blogCollections.tech.title,
    collectionBlurb: blogCollections.tech.blurb,
    seriesPart: 7,
    introHtml:
      '<p>Check out <a href="/blog/part-6-evals-optimization-and-organizational-reality-what-actually-determines-success">Part 6: Evals, Optimization and Organizational Reality (What Actually Determines Success)</a> here.</p>',
  },
  'https://medium.com/@tsnsenthil01/joy-is-the-key-to-greatness-a186739f9b1c': {
    slug: 'joy-is-the-key-to-greatness',
    category: 'non-tech',
    categoryLabel: blogCollections['non-tech'].label,
    collectionTitle: blogCollections['non-tech'].title,
    collectionBlurb: blogCollections['non-tech'].blurb,
    sortOrder: 1,
  },
  'https://medium.com/@tsnsenthil01/why-real-change-needs-a-bridge-between-who-you-are-and-who-you-want-to-become-88cf14e46c40': {
    slug: 'why-real-change-needs-a-bridge-between-who-you-are-and-who-you-want-to-become',
    category: 'non-tech',
    categoryLabel: blogCollections['non-tech'].label,
    collectionTitle: blogCollections['non-tech'].title,
    collectionBlurb: blogCollections['non-tech'].blurb,
    sortOrder: 2,
    replacements: [
      {
        from: 'joy is the key to greatness',
        toSlug: 'joy-is-the-key-to-greatness',
      },
    ],
  },
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const htmlEntityMap: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

function decodeHtmlEntities(value: string) {
  return value.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => htmlEntityMap[entity] ?? entity);
}

function cleanText(value: string) {
  return decodeHtmlEntities(value)
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function trimSummary(value: string, maxLength = 190) {
  if (value.length <= maxLength) {
    return value;
  }

  const trimmed = value.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`;
}

function extractSummary(contentHtml: string) {
  const paragraphs = [...contentHtml.matchAll(/<p>([\s\S]*?)<\/p>/g)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean);

  const summary =
    paragraphs.find(
      (paragraph) =>
        paragraph.length > 90 &&
        !paragraph.startsWith('Check out Part') &&
        !paragraph.startsWith('Following this series?') &&
        !paragraph.startsWith('Tomorrow:') &&
        !paragraph.includes('Part of the 7-Part series'),
    ) ??
    paragraphs.find((paragraph) => !paragraph.startsWith('Check out Part')) ??
    cleanText(contentHtml);

  return trimSummary(summary);
}

function buildContentHtml(
  contentHtml: string,
  currentSlug: string,
  config: Pick<BlogConfig, 'introHtml' | 'removeSnippets' | 'replacements'>,
) {
  let nextHtml = contentHtml.replace(/<figure>[\s\S]*?<\/figure>/g, '').trim();

  for (const snippet of config.removeSnippets ?? []) {
    nextHtml = nextHtml.replaceAll(snippet, '');
  }

  if (config.introHtml) {
    nextHtml = nextHtml.replace('</p>', `</p>${config.introHtml}`);
  }

  for (const replacement of config.replacements ?? []) {
    if (replacement.toSlug === currentSlug) {
      continue;
    }

    const label = replacement.label ?? replacement.from;
    nextHtml = nextHtml.replaceAll(replacement.from, `<a href="/blog/${replacement.toSlug}">${label}</a>`);
  }

  for (const [mediumUrl, config] of Object.entries(postConfigByUrl)) {
    if (config.slug === currentSlug) {
      continue;
    }

    nextHtml = nextHtml.replaceAll(`href="${mediumUrl}"`, `href="/blog/${config.slug}"`);
  }

  return nextHtml;
}

function mapBlogPost(rawPost: RawBlogPost): BlogPost {
  const config = postConfigByUrl[rawPost.mediumUrl];

  if (!config) {
    throw new Error(`Missing blog config for ${rawPost.mediumUrl}`);
  }

  return {
    title: rawPost.title,
    slug: config.slug,
    href: `/blog/${config.slug}`,
    mediumUrl: rawPost.mediumUrl,
    publishedAt: rawPost.publishedAt,
    dateLabel: dateFormatter.format(new Date(rawPost.publishedAt)),
    heroImage: rawPost.heroImage,
    summary: config.summaryOverride ?? extractSummary(rawPost.contentHtml),
    contentHtml: buildContentHtml(rawPost.contentHtml, config.slug, config),
    category: config.category,
    categoryLabel: config.categoryLabel,
    collectionTitle: config.collectionTitle,
    collectionBlurb: config.collectionBlurb,
    sortOrder: config.sortOrder,
    seriesPart: config.seriesPart,
  };
}

const blogPosts = [...(rawPosts as RawBlogPost[]), ...localBlogPosts]
  .map(mapBlogPost)
  .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());

export { blogPosts };

export function getAllBlogPosts() {
  return blogPosts;
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: BlogCategory) {
  return blogPosts.filter((post) => post.category === category);
}

export function getFeaturedPosts(category: BlogCategory, count: number) {
  return getBlogPostsByCategory(category).slice(0, count);
}

export function getAdjacentPosts(post: BlogPost) {
  const categoryPosts = getBlogPostsByCategory(post.category)
    .slice()
    .sort((left, right) => {
      if (left.sortOrder !== undefined || right.sortOrder !== undefined) {
        return (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER);
      }

      return new Date(left.publishedAt).getTime() - new Date(right.publishedAt).getTime();
    });

  const index = categoryPosts.findIndex((entry) => entry.slug === post.slug);

  return {
    previous: index > 0 ? categoryPosts[index - 1] : undefined,
    next: index < categoryPosts.length - 1 ? categoryPosts[index + 1] : undefined,
  };
}
