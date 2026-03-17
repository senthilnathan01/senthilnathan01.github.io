import { BlogCard } from '@/components/BlogCard';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { blogCollections, getBlogPostsByCategory } from '@/data/blogPosts';

export default function TechBlogPage() {
  const posts = getBlogPostsByCategory('tech');

  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://blog/tech">
        <section className="space-y-4">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> find blog/tech -type f
          </p>
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">### {blogCollections.tech.title}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">{blogCollections.tech.blurb}</p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </section>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
