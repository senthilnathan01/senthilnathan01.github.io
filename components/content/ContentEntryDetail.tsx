'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { CommandSection } from '@/components/CommandSection';
import { ContentCategoryPill } from './ContentCategoryPill';
import { formatContentDate, isContentCategory, type ContentEntry } from '@/lib/contentEntries';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

function normalizeDetailEntry(row: Record<string, unknown>): ContentEntry | null {
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
    created_at: row.created_at ? String(row.created_at) : undefined,
  };
}

export function ContentEntryDetail() {
  const searchParams = useSearchParams();
  const entryId = searchParams.get('id');
  const client = getSupabaseBrowserClient();
  const [entry, setEntry] = useState<ContentEntry | null>(null);
  const [loading, setLoading] = useState(() => Boolean(client && entryId));
  const [message, setMessage] = useState(() => {
    if (!client) {
      return 'Supabase is not configured yet.';
    }

    return entryId ? '' : 'Missing content entry id.';
  });

  const loadEntry = useCallback(async () => {
    if (!client) {
      setLoading(false);
      setMessage('Supabase is not configured yet.');
      return;
    }

    if (!entryId) {
      setLoading(false);
      setMessage('Missing content entry id.');
      return;
    }

    const { data, error } = await client
      .from('content_entries')
      .select('id,date,category,title,url,notes,created_at')
      .eq('id', entryId)
      .single();

    if (error) {
      setLoading(false);
      setMessage(error.message);
      return;
    }

    const normalizedEntry = data ? normalizeDetailEntry(data) : null;
    setEntry(normalizedEntry);
    setMessage(normalizedEntry ? '' : 'Content entry not found.');
    setLoading(false);
  }, [client, entryId]);

  useEffect(() => {
    if (!client || !entryId) {
      return;
    }

    void Promise.resolve().then(() => loadEntry());
  }, [client, entryId, loadEntry]);

  return (
    <CommandSection command="cat content_entry.json" withCursor>
      <div className="space-y-5">
        <Link href="/content" className="inline-block text-sm text-emerald-300 transition hover:text-emerald-200">
          ← back to content
        </Link>
        {loading ? <p className="content-subtitle">loading...</p> : null}
        {message ? <p className="content-subtitle">{message}</p> : null}
        {entry ? (
          <article className="rounded-xl border border-zinc-800 bg-zinc-950/55 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <ContentCategoryPill category={entry.category} />
              <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">{formatContentDate(entry.date)}</span>
            </div>
            <h1 className="content-title mt-4 text-2xl leading-tight">{entry.title}</h1>
            {entry.url ? (
              <Link
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm text-emerald-300 transition hover:text-emerald-200"
              >
                open source ↗
              </Link>
            ) : null}
            {entry.notes ? (
              <div className="content-subtitle mt-6 whitespace-pre-line text-sm leading-7 sm:text-base">{entry.notes}</div>
            ) : (
              <p className="content-subtitle mt-6 text-sm">No notes for this entry.</p>
            )}
          </article>
        ) : null}
      </div>
    </CommandSection>
  );
}
