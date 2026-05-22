import type { Metadata } from 'next';
import Link from 'next/link';
import { CommandSection } from '@/components/CommandSection';
import { ContentPreview } from '@/components/content/ContentPreview';
import { LinkList } from '@/components/LinkList';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: {
    absolute: 'Nathan | Home',
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
        <CommandSection command="whois nathan" withCursor>
          <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="aspect-square overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
              <picture className="block h-full w-full">
                <source srcSet="/images/profile.avif" type="image/avif" />
                <source srcSet="/images/profile.webp" type="image/webp" />
                <img
                  src="/images/profile.jpg"
                  alt="Portrait of Nathan"
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

        <CommandSection command="cat what-i-bring.txt">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 sm:p-5">
            <p className="command-blurb content-title">
              I bring a rare mix of research discipline, engineering fluency, and practical judgment. That makes me useful in both research labs and companies: I can reason carefully, build quickly, and still understand the fundamentals underneath the tools.
            </p>
            <ul className="mt-5 space-y-4">
              <li>
                <h2 className="content-accent-warm text-sm font-medium uppercase tracking-[0.16em]">
                  Research discipline
                </h2>
                <p className="mt-2">
                  I have the mathematical and scientific rigor, and the patience, to sit with hard problems, test assumptions, and do the careful work that serious research requires.
                </p>
              </li>
              <li>
                <h2 className="content-accent-warm text-sm font-medium uppercase tracking-[0.16em]">
                  Engineering fluency
                </h2>
                <p className="mt-2">
                  I bring strong CS fundamentals, practical development skill, and up-to-date knowledge of the AI tooling landscape. That helps me move fast without becoming dependent on tools I do not understand.
                </p>
              </li>
              <li>
                <h2 className="content-accent-warm text-sm font-medium uppercase tracking-[0.16em]">
                  Research-to-execution bridge
                </h2>
                <p className="mt-2">
                  Many researchers pick up development skills only when a project forces them to. I actively keep my engineering toolkit current, which helps me recognize solvable problems earlier, ask right questions, and build useful systems faster.
                </p>
              </li>
            </ul>
            <p className="content-subtitle mt-5">
              To understand who I am beyond the technical work, spend some time with my{' '}
              <Link href="/blog/non-tech" className="underline decoration-emerald-500/60 underline-offset-4 transition hover:text-emerald-200">
                non-technical posts
              </Link>{' '}
              and the{' '}
              <Link href="/about" className="underline decoration-emerald-500/60 underline-offset-4 transition hover:text-emerald-200">
                about page
              </Link>
              .
            </p>
          </div>
        </CommandSection>

        <ContentPreview />

        <CommandSection command="cat links.txt">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
            <LinkList items={homeLinks} gridClassName="sm:grid-cols-3 lg:grid-cols-6" />
          </div>
        </CommandSection>
      </TerminalWindow>
    </main>
  );
}
