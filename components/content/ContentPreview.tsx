'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommandSection } from '@/components/CommandSection';
import { ContentCategoryPill } from './ContentCategoryPill';
import { formatContentDate, isContentCategory, type ContentEntry } from '@/lib/contentEntries';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

function normalizePreviewEntry(row: Record<string, unknown>): ContentEntry | null {
  const category = String(row.category ?? 'article');

  if (!isContentCategory(category)) {
    return null;
  }

  return {
    id: Number(row.id),
    date: String(row.date),
    category,
    title: String(row.title),
    url: row.url ? String(row.url) : null,
    notes: row.notes ? String(row.notes) : null,
  };
}

export function ContentPreview() {
  const [entries, setEntries] = useState<ContentEntry[]>([]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();

    if (!client) {
      return;
    }

    let active = true;

    client
      .from('content_entries')
      .select('id,date,category,title,url,notes')
      .order('date', { ascending: false })
      .order('id', { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (!active) {
          return;
        }

        setEntries((data ?? []).map(normalizePreviewEntry).filter((entry): entry is ContentEntry => Boolean(entry)));
      });

    return () => {
      active = false;
    };
  }, []);

  if (entries.length === 0) {
    return null;
  }

  return (
    <CommandSection command="cat recent_content.txt">
      <div className="grid gap-3">
        {entries.map((entry) => (
          <article key={entry.id} className="rounded-xl border border-zinc-800 bg-zinc-950/55 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <ContentCategoryPill category={entry.category} />
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{formatContentDate(entry.date)}</span>
            </div>
            <h3 className="content-title mt-2 text-base leading-7">
              {entry.notes ? (
                <Link href={`/content/entry?id=${entry.id}`} className="transition hover:text-emerald-300">
                  {entry.title}
                </Link>
              ) : entry.url ? (
                <Link href={entry.url} target="_blank" rel="noreferrer" className="transition hover:text-emerald-300">
                  {entry.title}
                </Link>
              ) : (
                entry.title
              )}
            </h3>
          </article>
        ))}
        <Link href="/content" className="justify-self-start text-sm text-emerald-300 transition hover:text-emerald-200">
          Open content log ↗
        </Link>
      </div>
    </CommandSection>
  );
}
