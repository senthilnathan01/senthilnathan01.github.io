import { CommandSection } from '@/components/CommandSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function PrinciplesPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://principles">
        <CommandSection command="cat growth-philosophy.txt" withCursor>
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="max-w-3xl text-base leading-8 text-zinc-100">{siteData.growthPhilosophy}</p>
          </div>
        </CommandSection>

        <CommandSection command="cat core-principles.txt">
          <ul className="space-y-4">
            {siteData.principles.map((principle) => (
              <li
                key={principle.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <h2 className="text-lg text-amber-200">{principle.title}</h2>
                <p className="mt-2 text-zinc-300">{principle.description}</p>
              </li>
            ))}
          </ul>
        </CommandSection>

        <CommandSection command="cat interests.txt">
          <p className="max-w-3xl text-base leading-8 text-emerald-100">{siteData.interestsBlurb}</p>
        </CommandSection>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
