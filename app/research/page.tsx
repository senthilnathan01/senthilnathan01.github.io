import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Research',
};

export default function ResearchPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://research">
        <section className="space-y-6">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> ls research/
          </p>
          {siteData.research.length ? (
            <ul className="space-y-5">
              {siteData.research.map((item) => (
                <li key={item.title} className="space-y-2 border-l border-zinc-800 pl-4">
                  <h2 className="content-title">{item.title}</h2>
                  <p className="text-sm text-zinc-500">{item.venue} · {item.year}</p>
                  <p className="content-body">{item.summary}</p>
                  {item.href ? <Link href={item.href} className="text-sm text-emerald-300 hover:text-emerald-200">Read more ↗</Link> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500">Research highlights will show up here when they are ready.</p>
          )}
        </section>
      </TerminalWindow>
    </main>
  );
}
