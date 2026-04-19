import fs from 'node:fs';
import path from 'node:path';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export type LocalRawBlogPost = {
  title: string;
  mediumUrl: string;
  publishedAt: string;
  heroImage?: string;
  contentHtml: string;
};

export type LocalBlogConfig = {
  slug: string;
  category: 'tech' | 'non-tech';
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

type Frontmatter = {
  title?: string;
  slug?: string;
  category?: 'tech' | 'non-tech';
  publishedAt?: string;
  summary?: string;
  mediumUrl?: string;
  heroImage?: string;
  sortOrder?: number;
  seriesPart?: number;
};

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeKatex)
  .use(rehypeStringify);

function parseScalarValue(value: string) {
  const trimmed = value.trim();

  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }

  if (/^-?\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  return trimmed;
}

function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n*/);

  if (!match) {
    return {
      frontmatter: {} as Frontmatter,
      body: markdown,
    };
  }

  const frontmatter: Frontmatter = {};

  for (const line of match[1].split('\n')) {
    const separatorIndex = line.indexOf(':');

    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1);
    const value = parseScalarValue(rawValue);

    if (key === 'sortOrder' || key === 'seriesPart') {
      if (typeof value === 'number') {
        frontmatter[key] = value;
      }

      continue;
    }

    if (key === 'category') {
      if (value === 'tech' || value === 'non-tech') {
        frontmatter.category = value;
      }

      continue;
    }

    if (
      key === 'title' ||
      key === 'slug' ||
      key === 'publishedAt' ||
      key === 'summary' ||
      key === 'mediumUrl' ||
      key === 'heroImage'
    ) {
      if (typeof value === 'string' && value.length > 0) {
        frontmatter[key] = value;
      }
    }
  }

  return {
    frontmatter,
    body: markdown.slice(match[0].length),
  };
}

function slugFromFileName(fileName: string) {
  return fileName.replace(/\.md$/i, '').replace(/_/g, '-');
}

function extractMarkdownTitle(markdown: string) {
  const match = markdown.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : undefined;
}

function stripMarkdownTitle(markdown: string, title?: string) {
  if (!title) {
    return markdown;
  }

  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return markdown.replace(new RegExp(`^#\\s+${escapedTitle}\\s*\\n+`, 'i'), '');
}

function readMarkdownArticles() {
  const articlesDir = path.join(process.cwd(), 'data', 'md_articles');

  if (!fs.existsSync(articlesDir)) {
    return [];
  }

  return fs
    .readdirSync(articlesDir)
    .filter((fileName) => fileName.endsWith('.md'))
    .sort()
    .map((fileName) => ({
      fileName,
      markdown: fs.readFileSync(path.join(articlesDir, fileName), 'utf8'),
    }));
}

function renderMarkdownToHtml(markdown: string) {
  return String(markdownProcessor.processSync(markdown));
}

const localMarkdownEntries = readMarkdownArticles().map(({ fileName, markdown }) => {
  const { frontmatter, body } = parseFrontmatter(markdown);
  const title = frontmatter.title ?? extractMarkdownTitle(body);

  if (!title) {
    throw new Error(`Missing title for markdown article ${fileName}`);
  }

  const slug = frontmatter.slug ?? slugFromFileName(fileName);
  const category = frontmatter.category ?? 'tech';
  const publishedAt = frontmatter.publishedAt;

  if (!publishedAt) {
    throw new Error(`Missing publishedAt in markdown frontmatter for ${fileName}`);
  }

  const contentMarkdown = stripMarkdownTitle(body, title).trim();

  return {
    rawPost: {
      title,
      mediumUrl: frontmatter.mediumUrl ?? `local://${slug}`,
      publishedAt,
      heroImage: frontmatter.heroImage,
      contentHtml: renderMarkdownToHtml(contentMarkdown),
    } satisfies LocalRawBlogPost,
    config: {
      slug,
      category,
      summaryOverride: frontmatter.summary,
      sortOrder: frontmatter.sortOrder,
      seriesPart: frontmatter.seriesPart,
    } satisfies LocalBlogConfig,
  };
});

export const localBlogPosts: LocalRawBlogPost[] = localMarkdownEntries.map((entry) => entry.rawPost);

export const localBlogConfigs: Record<string, LocalBlogConfig> = Object.fromEntries(
  localMarkdownEntries.map((entry) => [entry.rawPost.mediumUrl, entry.config]),
);
