import { CommandSection } from '@/components/CommandSection';
import { LinkList } from '@/components/LinkList';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { UpdateLog } from '@/components/UpdateLog';
import { siteData } from '@/data/siteData';

export default function Home() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://home">
        <CommandSection command="whoami" withCursor>
          <p className="text-lg text-zinc-100 sm:text-xl">{siteData.name}</p>
          <p className="text-zinc-400">{siteData.role}</p>
        </CommandSection>

        <CommandSection command="cat about.txt">
          <p>{siteData.summary}</p>
        </CommandSection>

        <CommandSection command="ls focus-areas/">
          <ul className="space-y-1">
            {siteData.focusAreas.map((area) => (
              <li key={area}>- {area}</li>
            ))}
          </ul>
        </CommandSection>

        <CommandSection command="cat links.md">
          <LinkList items={siteData.links} />
        </CommandSection>

        <CommandSection command="tail -n 3 updates.log">
          <UpdateLog items={siteData.updates} />
        </CommandSection>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
