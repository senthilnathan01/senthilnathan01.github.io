import Link from 'next/link';
import { LinkItem } from '@/data/siteData';

type LinkListProps = {
  items: LinkItem[];
  gridClassName?: string;
};

export function LinkList({ items, gridClassName }: LinkListProps) {
  return (
    <ul className={`grid gap-3 ${gridClassName ?? 'sm:grid-cols-2 xl:grid-cols-4'}`}>
      {items.map((item) => (
        <li key={item.label} className="min-w-0">
          {/*
            Open external destinations and document files in a new tab while
            keeping internal pages in the same tab.
          */}
          {/*
            Use compact cards so the same component works well on both the home
            page and the dedicated contact page.
          */}
          <Link
            href={item.href}
            className="group block h-full rounded-md border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-sm transition hover:border-emerald-400/50 hover:bg-zinc-900 hover:text-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            target={item.href.startsWith('http') || item.href.endsWith('.pdf') ? '_blank' : undefined}
            rel={item.href.startsWith('http') || item.href.endsWith('.pdf') ? 'noreferrer' : undefined}
          >
            <span className="content-title transition group-hover:text-emerald-200">{item.label}</span>
            {item.note ? <span className="content-muted mt-1 block text-xs">{item.note}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
