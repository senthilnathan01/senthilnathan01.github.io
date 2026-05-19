export const contentCategories = ['video', 'article', 'book', 'build'] as const;

export type ContentCategory = (typeof contentCategories)[number];

export type ContentEntry = {
  id: number;
  date: string;
  category: ContentCategory;
  title: string;
  url: string | null;
  notes: string | null;
  created_at?: string;
};

export const contentCategoryLabels: Record<ContentCategory, string> = {
  video: 'Video',
  article: 'Article',
  book: 'Book',
  build: 'Build',
};

export function isContentCategory(value: string): value is ContentCategory {
  return contentCategories.includes(value as ContentCategory);
}

export function formatContentDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
}
