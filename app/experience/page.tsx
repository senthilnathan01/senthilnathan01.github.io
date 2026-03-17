import Link from 'next/link';
import { CommandSection } from '@/components/CommandSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function ExperiencePage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://experience">
        <CommandSection command="cat experience.txt" withCursor>
          <p className="max-w-3xl text-zinc-300">{siteData.experienceIntro}</p>
        </CommandSection>

        <CommandSection command="ls experience/">
          <ul className="space-y-5">
            {siteData.experience.map((item) => (
              <li
                key={`${item.company}-${item.role}`}
                className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <div className="space-y-2">
                  <h2 className="text-lg text-zinc-100">{item.role}</h2>
                  <p className="text-sm text-zinc-500">
                    {item.company} · {item.location} · {item.period}
                  </p>
                  <p className="text-zinc-300">{item.description}</p>
                </div>

                <ul className="space-y-2 text-sm leading-6 text-zinc-400">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>- {highlight}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </CommandSection>

        <CommandSection command="cd projects">
          <Link href="/projects" className="inline-flex text-sm text-emerald-300 transition hover:text-emerald-200">
            Open projects page ↗
          </Link>
        </CommandSection>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
