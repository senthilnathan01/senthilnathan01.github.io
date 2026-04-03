import type { Metadata } from 'next';
import { CommandSection } from '@/components/CommandSection';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'About',
};

export default function AboutPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://about">
        <CommandSection command="cat growth-philosophy.txt" withCursor>
          <div className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="command-blurb content-title">{siteData.growthPhilosophy}</p>
          </div>
        </CommandSection>

        <CommandSection command="cat core-principles.txt">
          <ul className="w-full space-y-4">
            {siteData.about.map((about) => (
              <li
                key={about.title}
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5"
              >
                <h2 className="content-accent-warm text-lg">{about.title}</h2>
                <p className="content-body mt-2">{about.description}</p>
              </li>
            ))}
          </ul>
        </CommandSection>

        <CommandSection command="cat interests.txt">
          <div className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <p className="command-blurb content-title">{siteData.interestsBlurb}</p>
          </div>
        </CommandSection>
      </TerminalWindow>
    </main>
  );
}
