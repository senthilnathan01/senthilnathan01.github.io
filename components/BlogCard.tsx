import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/data/blogPosts';

type BlogCardProps = {
  post: BlogPost;
  showCategory?: boolean;
  showCollection?: boolean;
};

export function BlogCard({ post, showCategory = true, showCollection = false }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
      {post.heroImage ? (
        <div className="relative aspect-[16/9] border-b border-zinc-800">
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>
      ) : null}
      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
          <span>{post.dateLabel}</span>
          {showCategory ? (
            <>
              <span className="text-zinc-700">/</span>
              <span className="content-accent-cool">
                {post.seriesPart ? `Part ${post.seriesPart}` : post.categoryLabel}
              </span>
            </>
          ) : null}
          {showCollection ? (
            <>
              <span className="text-zinc-700">/</span>
              <span className="content-accent-warm">{post.collectionTitle}</span>
            </>
          ) : null}
        </div>

        <div>
          <h3 className="content-title text-sm leading-6 sm:text-base sm:leading-7">
            <Link href={post.href} className="transition hover:text-emerald-300">
              {post.title}
            </Link>
          </h3>
        </div>
      </div>
    </article>
  );
}

type BlogPlaceholderCardProps = {
  title: string;
  note: string;
};

export function BlogPlaceholderCard({ title, note }: BlogPlaceholderCardProps) {
  return (
    <article className="flex min-h-full flex-col justify-between rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/45 p-5">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-600">Queue Slot</p>
        <h3 className="content-title text-lg">{title}</h3>
        <p className="content-subtitle text-sm leading-7">{note}</p>
      </div>
      <p className="pt-6 text-sm text-zinc-600">More writing can drop here next.</p>
    </article>
  );
}
