import type { Metadata } from 'next';
import { BlogCard } from '@/components/BlogCard';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { blogCollections, getBlogPostsByCategory } from '@/data/blogPosts';

export const metadata: Metadata = {
  title: 'Tech Blog',
};

export default function TechBlogPage() {
  const posts = getBlogPostsByCategory('tech');
  const postCount = posts.length;

  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://blog/tech">
        <section className="space-y-4">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> find blog/tech -type f
          </p>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="content-accent-cool text-sm uppercase tracking-[0.24em]">### {blogCollections.tech.title}</p>
            <p className="content-subtitle mt-4 text-sm leading-7 sm:text-base">{blogCollections.tech.blurb}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{postCount} tech articles</p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </section>
      </TerminalWindow>
    </main>
  );
}
