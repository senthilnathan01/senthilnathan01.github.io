import type { Metadata } from 'next';
import { CommandSection } from '@/components/CommandSection';
import { LinkList } from '@/components/LinkList';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: {
    absolute: 'Senthilnathan | Home',
  },
};

export default function Home() {
  const homeLinks = siteData.nav
    .filter((item) => item.href !== '/')
    .map((item) => ({
      label: item.label,
      href: item.href,
    }));

  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://home">
        <CommandSection command="whois senthil" withCursor>
          <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="aspect-square overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
              <picture className="block h-full w-full">
                <source srcSet="/images/profile.avif" type="image/avif" />
                <source srcSet="/images/profile.webp" type="image/webp" />
                <img
                  src="/images/profile.jpg"
                  alt="Portrait of Senthilnathan"
                  width={960}
                  height={960}
                  className="block h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </div>

            <dl className="space-y-3 text-sm sm:text-base">
              {siteData.profileFacts.map((fact) => (
                <div key={fact.label} className="grid gap-1 text-zinc-300 sm:grid-cols-[92px_18px_minmax(0,1fr)]">
                  <dt className="text-zinc-500">{fact.label}</dt>
                  <span className="hidden text-zinc-700 sm:inline">:</span>
                  <dd className={fact.label === 'role' ? 'content-accent-warm' : 'content-title'}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </CommandSection>

        <CommandSection command="cat current_status.txt">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 sm:px-5 sm:py-4">
            <div className="space-y-2">
              {siteData.summary ? <p className="content-title text-base">{siteData.summary}</p> : null}
              {siteData.current_status.map((paragraph) => (
                <p key={paragraph} className="content-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </CommandSection>

        <CommandSection command="cat links.txt">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
            <LinkList items={homeLinks} />
          </div>
        </CommandSection>
      </TerminalWindow>
    </main>
  );
}
