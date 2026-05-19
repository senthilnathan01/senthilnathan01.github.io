import Link from 'next/link';
import { ContentCategoryPill } from './ContentCategoryPill';
import { formatContentDate, type ContentEntry } from '@/lib/contentEntries';

type ContentEntryCardProps = {
  entry: ContentEntry;
};

export function ContentEntryCard({ entry }: ContentEntryCardProps) {
  const hasNotes = Boolean(entry.notes);
  const titleContent = hasNotes ? (
    <Link href={`/content/entry?id=${entry.id}`} className="transition hover:text-emerald-300">
      {entry.title}
    </Link>
  ) : entry.url ? (
    <Link href={entry.url} target="_blank" rel="noreferrer" className="transition hover:text-emerald-300">
      {entry.title}
    </Link>
  ) : (
    entry.title
  );

  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-950/55 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <ContentCategoryPill category={entry.category} />
        <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{formatContentDate(entry.date)}</span>
      </div>
      <h3 className="content-title mt-3 text-base leading-7">{titleContent}</h3>
      {hasNotes ? (
        <Link href={`/content/entry?id=${entry.id}`} className="mt-3 inline-block text-sm text-emerald-300 transition hover:text-emerald-200">
          open notes ↗
        </Link>
      ) : null}
    </article>
  );
}
