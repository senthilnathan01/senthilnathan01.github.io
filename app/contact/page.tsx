import { LinkList } from '@/components/LinkList';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function ContactPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://contact">
        <section className="space-y-5">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> ping senthil
          </p>
          <p className="max-w-2xl text-zinc-300">
            I enjoy collaborating on research-driven product work, evaluation design, and thoughtful developer experiences.
            Feel free to reach out through any channel below.
          </p>
          <LinkList items={siteData.links} />
        </section>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
