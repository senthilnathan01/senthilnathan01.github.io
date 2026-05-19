import type { Metadata } from 'next';
import { ContentLog } from '@/components/content/ContentLog';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';

export const metadata: Metadata = {
  title: 'Content',
};

export default function ContentPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://content">
        <ContentLog />
      </TerminalWindow>
    </main>
  );
}
