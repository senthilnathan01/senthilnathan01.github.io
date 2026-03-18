import Image from 'next/image';
import { CommandSection } from '@/components/CommandSection';
import { LinkList } from '@/components/LinkList';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function Home() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://home">
        <CommandSection command="whois senthil" withCursor>
          <div className="grid gap-6 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
              <Image
                src="/images/profile.jpg"
                alt="Portrait of Senthilnathan"
                width={360}
                height={450}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <dl className="space-y-3 text-sm sm:text-base">
              {siteData.profileFacts.map((fact) => (
                <div key={fact.label} className="grid gap-1 text-zinc-300 sm:grid-cols-[92px_18px_minmax(0,1fr)]">
                  <dt className="text-zinc-500">{fact.label}</dt>
                  <span className="hidden text-zinc-700 sm:inline">:</span>
                  <dd className={fact.label === 'role' ? 'text-amber-300' : 'text-zinc-100'}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </CommandSection>

        <CommandSection command="cat about.txt">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 sm:px-5 sm:py-4">
            <div className="space-y-2">
              {siteData.summary ? <p className="text-base text-zinc-100">{siteData.summary}</p> : null}
              {siteData.about.map((paragraph) => (
                <p key={paragraph} className="text-zinc-100">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </CommandSection>

        <CommandSection command="cat links.txt">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
            <LinkList items={siteData.links} />
          </div>
        </CommandSection>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
