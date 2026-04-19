import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { blogCollections, getAdjacentPosts, getAllBlogPosts, getBlogPost } from '@/data/blogPosts';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { previous, next } = getAdjacentPosts(post);
  const collection = blogCollections[post.category];

  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title={`session://blog/${post.slug}`}>
        <section className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              <span className="text-emerald-400">$</span> cat posts/{post.slug}.md
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-500">
              <Link href="/blog" className="transition hover:text-emerald-300">
                blog
              </Link>
              <span>/</span>
              <Link href={`/blog/${post.category}`} className="transition hover:text-emerald-300">
                {collection.label}
              </Link>
              <span>/</span>
              <span className="text-zinc-300">{post.dateLabel}</span>
            </div>
            <div className="space-y-3">
              <p className="content-accent-cool text-sm uppercase tracking-[0.24em]">
                ### {post.seriesPart ? `Part ${post.seriesPart} of 7` : post.categoryLabel}
              </p>
              <h1 className="content-title text-3xl leading-tight sm:text-4xl">{post.title}</h1>
              <p className="content-subtitle text-base leading-8">{post.summary}</p>
            </div>
          </div>

          {post.heroImage ? (
            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70">
              <div className="relative aspect-[16/8] w-full">
                <Image src={post.heroImage} alt={post.title} fill className="object-cover" sizes="100vw" priority />
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> render article --theme terminal-notes
          </p>
          <article
            className="blog-content border-l border-zinc-800 pl-4 text-sm text-zinc-300 sm:text-base"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </section>

        <section className="space-y-5">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> ls related/
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {previous ? (
              <Link
                href={previous.href}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition hover:border-zinc-700 hover:text-emerald-300"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Previous</p>
                <h2 className="content-title mt-2 text-lg">{previous.title}</h2>
                <p className="content-subtitle mt-2 text-sm leading-7">{previous.summary}</p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/35 p-5 text-zinc-600">
                Earlier entry not available in this lane.
              </div>
            )}

            {next ? (
              <Link
                href={next.href}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition hover:border-zinc-700 hover:text-emerald-300"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Next</p>
                <h2 className="content-title mt-2 text-lg">{next.title}</h2>
                <p className="content-subtitle mt-2 text-sm leading-7">{next.summary}</p>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/35 p-5 text-zinc-600">
                This is the latest entry in this lane.
              </div>
            )}
          </div>
        </section>
      </TerminalWindow>
    </main>
  );
}
