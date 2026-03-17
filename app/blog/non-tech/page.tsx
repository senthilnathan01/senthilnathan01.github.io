import { BlogCard } from '@/components/BlogCard';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { blogCollections, getBlogPostsByCategory } from '@/data/blogPosts';

export default function NonTechBlogPage() {
  const posts = getBlogPostsByCategory('non-tech');

  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://blog/non-tech">
        <section className="space-y-4">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> find blog/non-tech -type f
          </p>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-sm uppercase tracking-[0.24em] text-amber-300">
              ### {blogCollections['non-tech'].title}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
              {blogCollections['non-tech'].blurb}
            </p>
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
