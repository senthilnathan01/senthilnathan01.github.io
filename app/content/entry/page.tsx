import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContentEntryDetail } from '@/components/content/ContentEntryDetail';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';

export const metadata: Metadata = {
  title: 'Content Entry',
};

export default function ContentEntryPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://content/entry">
        <Suspense fallback={<p className="content-subtitle">loading...</p>}>
          <ContentEntryDetail />
        </Suspense>
      </TerminalWindow>
    </main>
  );
}
