import Link from 'next/link';
import { UpdateItem } from '@/data/siteData';

type UpdateLogProps = {
  items: UpdateItem[];
};

export function UpdateLog({ items }: UpdateLogProps) {
  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li key={`${item.date}-${item.text}`} className="flex flex-col gap-1 border-l border-zinc-800 pl-4 sm:flex-row sm:items-baseline sm:gap-4">
          <time className="text-xs text-zinc-500">{item.date}</time>
          {item.href ? (
            <Link
              href={item.href}
              className="text-zinc-200 transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              {item.text}
            </Link>
          ) : (
            <p className="text-zinc-300">{item.text}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
