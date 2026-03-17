import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function BlogPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://blog">
        <section className="space-y-6">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> cat posts/index.txt
          </p>
          <ul className="space-y-5">
            {siteData.posts.map((post) => (
              <li key={post.title} className="space-y-1 border-l border-zinc-800 pl-4">
                <p className="text-xs text-zinc-500">{post.date}</p>
                <h2 className="text-zinc-100">{post.title}</h2>
                <p className="text-zinc-300">{post.summary}</p>
                {post.href ? <Link href={post.href} className="text-sm text-emerald-300 hover:text-emerald-200">Open note ↗</Link> : null}
              </li>
            ))}
          </ul>
        </section>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
