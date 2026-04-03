import type { Metadata } from 'next';
import { LinkList } from '@/components/LinkList';
import { CommandSection } from '@/components/CommandSection';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export const metadata: Metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://contact">
        <CommandSection command="ping senthil" withCursor>
          <p className="command-blurb content-body">{siteData.contactBlurb}</p>
        </CommandSection>

        <CommandSection command="cat contacts.txt">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
            <LinkList items={siteData.links} />
          </div>
        </CommandSection>
      </TerminalWindow>
    </main>
  );
}
