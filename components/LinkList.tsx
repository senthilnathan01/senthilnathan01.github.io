import Link from 'next/link';
import { ExternalLink } from '@/data/siteData';

type LinkListProps = {
  items: ExternalLink[];
};

export function LinkList({ items }: LinkListProps) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="inline-flex items-center gap-2 text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            {item.label}
          </Link>
          {item.note ? <span className="ml-3 text-xs text-zinc-500">{item.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}
