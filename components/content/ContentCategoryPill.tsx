import { contentCategoryLabels, type ContentCategory } from '@/lib/contentEntries';

type ContentCategoryPillProps = {
  category: ContentCategory;
};

export function ContentCategoryPill({ category }: ContentCategoryPillProps) {
  return (
    <span className="inline-flex rounded-full border border-zinc-700 bg-zinc-900/60 px-2 py-0.5 text-[0.68rem] uppercase tracking-[0.18em] text-zinc-400">
      {contentCategoryLabels[category]}
    </span>
  );
}
