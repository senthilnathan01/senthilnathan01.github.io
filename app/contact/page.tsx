import { LinkList } from '@/components/LinkList';
import { CommandSection } from '@/components/CommandSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function ContactPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://contact">
        <CommandSection command="ping senthil" withCursor>
          <p className="max-w-2xl text-zinc-300">{siteData.contactBlurb}</p>
        </CommandSection>

        <CommandSection command="cat contacts.txt">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
            <LinkList items={siteData.links} />
          </div>
        </CommandSection>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
