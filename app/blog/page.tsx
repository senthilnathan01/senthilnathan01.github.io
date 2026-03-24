import Link from 'next/link';
import { BlogCard, BlogPlaceholderCard } from '@/components/BlogCard';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { blogCollections, getBlogPostsByCategory, getFeaturedPosts } from '@/data/blogPosts';

export default function BlogPage() {
  const featuredTechPosts = getFeaturedPosts('tech', 3);
  const featuredNonTechPosts = getFeaturedPosts('non-tech', 3);
  const techPostCount = getBlogPostsByCategory('tech').length;
  const nonTechPostCount = getBlogPostsByCategory('non-tech').length;
  const nonTechPlaceholders = Math.max(0, 3 - featuredNonTechPosts.length);

  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://blog">
        <section className="space-y-5">
          <div className="space-y-4 md:flex md:items-end md:justify-between md:gap-4 md:space-y-0">
            <div className="space-y-1">
              <p className="text-sm text-zinc-400">
                <span className="text-emerald-400">$</span> {blogCollections.tech.indexCommand}
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-zinc-300 align-middle" aria-hidden="true" />
              </p>
              <h2 className="text-2xl text-zinc-100">{blogCollections.tech.title}</h2>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">{blogCollections.tech.blurb}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{techPostCount} tech articles</p>
            </div>
            <Link
              href="/blog/tech"
              className="inline-block text-sm text-emerald-300 transition hover:text-emerald-200 md:text-right"
            >
              Show more tech posts ({techPostCount}) ↗
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredTechPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-4 md:flex md:items-end md:justify-between md:gap-4 md:space-y-0">
            <div className="space-y-1">
              <p className="text-sm text-zinc-400">
                <span className="text-emerald-400">$</span> {blogCollections['non-tech'].indexCommand}
              </p>
              <h2 className="text-2xl text-zinc-100">{blogCollections['non-tech'].title}</h2>
              <p className="max-w-2xl text-sm leading-7 text-zinc-400">{blogCollections['non-tech'].blurb}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{nonTechPostCount} non-tech articles</p>
            </div>
            <Link
              href="/blog/non-tech"
              className="inline-block text-sm text-emerald-300 transition hover:text-emerald-200 md:text-right"
            >
              Show more beyond-tech posts ({nonTechPostCount}) ↗
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {featuredNonTechPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
            {Array.from({ length: nonTechPlaceholders }).map((_, index) => (
              <BlogPlaceholderCard
                key={`non-tech-placeholder-${index}`}
                title="More non-tech writing soon"
                note="Two essays are live right now. The third featured slot stays warm for the next one."
              />
            ))}
          </div>
        </section>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
