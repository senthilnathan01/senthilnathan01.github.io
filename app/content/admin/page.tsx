import type { Metadata } from 'next';
import { ContentAdminPanel } from '@/components/content/ContentLog';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';

export const metadata: Metadata = {
  title: 'Content Admin',
};

export default function ContentAdminPage() {
  return (
    <main className="space-y-8 pb-24">
      <SiteHeader />
      <TerminalWindow title="session://content/admin">
        <ContentAdminPanel />
      </TerminalWindow>
    </main>
  );
}
