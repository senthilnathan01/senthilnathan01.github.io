import { CommandSection } from '@/components/CommandSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function AboutPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://about">
        <CommandSection command="cat growth-philosophy.txt" withCursor>
          <div className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="text-base leading-8 text-zinc-100">{siteData.growthPhilosophy}</p>
          </div>
        </CommandSection>

        <CommandSection command="cat core-principles.txt">
          <ul className="w-full space-y-4">
            {siteData.about.map((about) => (
              <li
                key={about.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <h2 className="text-lg text-amber-200">{about.title}</h2>
                <p className="mt-2 text-zinc-300">{about.description}</p>
              </li>
            ))}
          </ul>
        </CommandSection>

        <CommandSection command="cat interests.txt">
          <div className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <p className="text-base leading-8 text-emerald-100">{siteData.interestsBlurb}</p>
          </div>
        </CommandSection>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
