'use client';

import type { Session } from '@supabase/supabase-js';
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CommandSection } from '@/components/CommandSection';
import { ContentEntryCard } from './ContentEntryCard';
import {
  contentCategories,
  contentCategoryLabels,
  formatContentDate,
  isContentCategory,
  type ContentCategory,
  type ContentEntry,
} from '@/lib/contentEntries';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

type ViewMode = 'calendar' | 'list';

type DraftEntry = {
  date: string;
  category: ContentCategory;
  title: string;
  url: string;
  notes: string;
};

const today = new Date().toISOString().slice(0, 10);
const listPageSize = 7;

type DateEntryGroup = {
  date: string;
  entries: ContentEntry[];
};

function normalizeEntry(row: Record<string, unknown>): ContentEntry | null {
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

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
}

function getCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const totalCells = leadingBlanks + daysInMonth;
  const trailingBlanks = (7 - (totalCells % 7)) % 7;

  return [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, monthIndex, index + 1)),
    ...Array.from({ length: trailingBlanks }, () => null),
  ];
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function groupEntriesByDate(entries: ContentEntry[]) {
  return entries.reduce<DateEntryGroup[]>((groups, entry) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.date === entry.date) {
      lastGroup.entries.push(entry);
      return groups;
    }

    groups.push({ date: entry.date, entries: [entry] });
    return groups;
  }, []);
}

function ContentCalendar({
  entries,
  onDateSelect,
}: {
  entries: ContentEntry[];
  onDateSelect: (date: string) => void;
}) {
  const [month, setMonth] = useState(() => new Date());

  const entriesByDate = useMemo(() => {
    return entries.reduce<Record<string, ContentEntry[]>>((grouped, entry) => {
      grouped[entry.date] ??= [];
      grouped[entry.date].push(entry);
      return grouped;
    }, {});
  }, [entries]);

  const days = getCalendarDays(month);
  const todayKey = toDateKey(new Date());

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded border border-zinc-700 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-emerald-300"
          onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1))}
          aria-label="Previous month"
        >
          ←
        </button>
        <h2 className="content-title text-center text-base sm:text-lg">{getMonthLabel(month)}</h2>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded border border-zinc-700 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-emerald-300"
          onClick={() => setMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1))}
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-[0.62rem] uppercase tracking-[0.14em] text-zinc-500 sm:gap-2 sm:text-xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <span key={day} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`blank-${index}`} className="aspect-square rounded-lg border border-transparent sm:aspect-auto sm:min-h-28 lg:min-h-32" />;
          }

          const dateKey = toDateKey(day);
          const dayEntries = entriesByDate[dateKey] ?? [];
          const hasEntries = dayEntries.length > 0;
          const isToday = dateKey === todayKey;

          return (
            <button
              key={dateKey}
              type="button"
              className={`group relative flex aspect-square min-w-0 flex-col rounded-lg border p-1.5 text-left transition sm:aspect-auto sm:min-h-28 sm:p-2 lg:min-h-32 ${
                hasEntries
                  ? 'border-zinc-700 bg-zinc-950/70 hover:border-zinc-500'
                  : 'border-zinc-800 bg-zinc-950/35 hover:border-zinc-700'
              }`}
              onClick={() => onDateSelect(dateKey)}
            >
              <span className={`text-xs leading-none ${isToday ? 'content-title font-medium' : 'text-zinc-500'}`}>
                {day.getDate()}
              </span>

              {hasEntries ? (
                <>
                  <span className="mt-auto text-[0.68rem] leading-none text-zinc-400 sm:text-xs">
                    {dayEntries.length}
                  </span>
                  <span className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 hidden w-52 -translate-x-1/2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs leading-5 text-zinc-300 opacity-0 shadow-[0_16px_45px_rgba(0,0,0,0.42)] transition group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                    {dayEntries.slice(0, 4).map((entry) => entry.title).join(', ')}
                    {dayEntries.length > 4 ? ` +${dayEntries.length - 4} more` : ''}
                  </span>
                </>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContentList({
  entries,
  highlightedDate,
  page,
  setPage,
}: {
  entries: ContentEntry[];
  highlightedDate: string | null;
  page: number;
  setPage: (updater: (value: number) => number) => void;
}) {
  const highlightedGroupRef = useRef<HTMLDivElement | null>(null);
  const groupedEntries = useMemo(() => groupEntriesByDate(entries), [entries]);
  const totalPages = Math.max(1, Math.ceil(groupedEntries.length / listPageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const visibleGroups = groupedEntries.slice(currentPage * listPageSize, currentPage * listPageSize + listPageSize);

  useEffect(() => {
    if (!highlightedDate || !highlightedGroupRef.current) {
      return;
    }

    highlightedGroupRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [highlightedDate, currentPage]);

  return (
    <div className="space-y-4">
      <div className="grid gap-6">
        {visibleGroups.map((group) => (
          <section
            key={group.date}
            ref={highlightedDate === group.date ? highlightedGroupRef : null}
            className={`scroll-mt-28 rounded-xl border p-4 transition ${
              highlightedDate === group.date
                ? 'border-emerald-500/60 bg-emerald-500/10'
                : 'border-zinc-800 bg-zinc-950/35'
            }`}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">{formatContentDate(group.date)}</p>
            <div className="grid gap-3">
              {group.entries.map((entry) => (
                <ContentEntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        ))}
      </div>
      {groupedEntries.length > listPageSize ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            className="rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            disabled={currentPage === 0}
          >
            prev
          </button>
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            page {currentPage + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="rounded border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-zinc-500 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            next
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ContentAdmin({
  session,
  onEntriesChanged,
}: {
  session: Session | null;
  onEntriesChanged: () => Promise<void>;
}) {
  const client = getSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftEntry>({
    date: today,
    category: 'article',
    title: '',
    url: '',
    notes: '',
  });
  const [status, setStatus] = useState('');

  const resetDraft = useCallback(() => {
    setDraft({ date: today, category: 'article', title: '', url: '', notes: '' });
    setEditingEntryId(null);
  }, []);

  const loadAdminEntries = useCallback(async () => {
    if (!client || !session) {
      setEntries([]);
      return;
    }

    const { data, error } = await client
      .from('content_entries')
      .select('id,date,category,title,url,notes,created_at')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) {
      setStatus(error.message);
      return;
    }

    setEntries((data ?? []).map(normalizeEntry).filter((entry): entry is ContentEntry => Boolean(entry)));
  }, [client, session]);

  useEffect(() => {
    void Promise.resolve().then(() => loadAdminEntries());
  }, [loadAdminEntries]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!client) {
      setStatus('Supabase is not configured.');
      return;
    }

    const { error } = await client.auth.signInWithPassword({ email, password });
    setStatus(error ? error.message : 'Signed in.');
  }

  async function signOut() {
    if (!client) {
      return;
    }

    await client.auth.signOut();
    resetDraft();
    setEntries([]);
    setStatus('Signed out.');
  }

  function editEntry(entry: ContentEntry) {
    setEditingEntryId(entry.id);
    setDraft({
      date: entry.date,
      category: entry.category,
      title: entry.title,
      url: entry.url ?? '',
      notes: entry.notes ?? '',
    });
    setStatus(`Editing "${entry.title}".`);
  }

  async function saveEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!client) {
      setStatus('Supabase is not configured.');
      return;
    }

    const payload = {
      date: draft.date,
      category: draft.category,
      title: draft.title.trim(),
      url: draft.url.trim() || null,
      notes: draft.notes.trim() || null,
    };

    const { error } = editingEntryId
      ? await client.from('content_entries').update(payload).eq('id', editingEntryId)
      : await client.from('content_entries').insert(payload);

    if (error) {
      setStatus(error.message);
      return;
    }

    resetDraft();
    setStatus(editingEntryId ? 'Entry updated.' : 'Entry added.');
    await onEntriesChanged();
    await loadAdminEntries();
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/55 p-4">
      {session ? (
        <div className="grid gap-6">
          <form onSubmit={saveEntry} className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
              <span>{session.user.email}</span>
              <button
                type="button"
                className="text-emerald-300 transition hover:text-emerald-200"
                onClick={signOut}
              >
                sign out
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-zinc-500">date</span>
                <input
                  type="date"
                  required
                  value={draft.date}
                  onChange={(event) => setDraft((value) => ({ ...value, date: event.target.value }))}
                  className="min-h-11 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-zinc-500">category</span>
                <div className="grid grid-cols-2 gap-2">
                  {contentCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`min-h-11 rounded border px-3 py-2 text-sm transition ${
                        draft.category === category
                          ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                      }`}
                      onClick={() => setDraft((value) => ({ ...value, category }))}
                    >
                      {contentCategoryLabels[category]}
                    </button>
                  ))}
                </div>
              </label>
            </div>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-500">title</span>
              <input
                required
                value={draft.title}
                onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))}
                className="min-h-11 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-500">url</span>
              <input
                type="url"
                value={draft.url}
                onChange={(event) => setDraft((value) => ({ ...value, url: event.target.value }))}
                className="min-h-11 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-zinc-500">notes</span>
              <textarea
                rows={5}
                value={draft.notes}
                onChange={(event) => setDraft((value) => ({ ...value, notes: event.target.value }))}
                className="min-h-32 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="min-h-11 rounded border border-emerald-500/40 px-4 py-2 text-sm text-emerald-300 transition hover:border-emerald-300 hover:text-emerald-200"
              >
                {editingEntryId ? 'update entry' : 'add entry'}
              </button>
              {editingEntryId ? (
                <button
                  type="button"
                  className="min-h-11 rounded border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
                  onClick={() => {
                    resetDraft();
                    setStatus('');
                  }}
                >
                  cancel edit
                </button>
              ) : null}
            </div>
            {status ? <p className="text-sm text-zinc-500">{status}</p> : null}
          </form>
          <div className="grid gap-3 border-t border-zinc-800 pt-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">existing entries</p>
            {entries.length > 0 ? (
              <div className="grid gap-2">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={`rounded-lg border p-3 text-left transition ${
                      editingEntryId === entry.id
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : 'border-zinc-800 bg-zinc-950/55 hover:border-zinc-600'
                    }`}
                    onClick={() => editEntry(entry)}
                  >
                    <span className="block text-sm text-zinc-200">{entry.title}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-zinc-500">
                      {formatContentDate(entry.date)} / {contentCategoryLabels[entry.category]}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No entries yet.</p>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={signIn} className="grid gap-4">
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-500">email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-zinc-500">password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-200"
            />
          </label>
          <button
            type="submit"
            className="min-h-11 justify-self-start rounded border border-emerald-500/40 px-4 py-2 text-sm text-emerald-300 transition hover:border-emerald-300 hover:text-emerald-200"
          >
            sign in
          </button>
          {status ? <p className="text-sm text-zinc-500">{status}</p> : null}
        </form>
      )}
    </div>
  );
}

export function ContentLog() {
  const client = getSupabaseBrowserClient();
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [view, setView] = useState<ViewMode>('calendar');
  const [listPage, setListPage] = useState(0);
  const [highlightedDate, setHighlightedDate] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ContentCategory[]>(() => [...contentCategories]);
  const [loading, setLoading] = useState(() => Boolean(client));
  const [message, setMessage] = useState(() => (client ? '' : 'Supabase is not configured yet.'));

  const filteredEntries = useMemo(
    () => entries.filter((entry) => selectedCategories.includes(entry.category)),
    [entries, selectedCategories],
  );
  const groupedEntries = useMemo(() => groupEntriesByDate(filteredEntries), [filteredEntries]);

  function toggleCategory(category: ContentCategory) {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((currentCategory) => currentCategory !== category)
        : [...currentCategories, category],
    );
    setListPage(0);
    setHighlightedDate(null);
  }

  function jumpToDate(date: string) {
    const groupIndex = groupedEntries.findIndex((group) => group.date === date);

    if (groupIndex >= 0) {
      setListPage(Math.floor(groupIndex / listPageSize));
      setHighlightedDate(date);
    } else {
      setHighlightedDate(null);
    }

    setView('list');
  }

  const loadEntries = useCallback(async () => {
    if (!client) {
      setLoading(false);
      setMessage('Supabase is not configured yet.');
      return;
    }

    const { data, error } = await client
      .from('content_entries')
      .select('id,date,category,title,url,notes,created_at')
      .order('date', { ascending: false })
      .order('id', { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setEntries((data ?? []).map(normalizeEntry).filter((entry): entry is ContentEntry => Boolean(entry)));
    setMessage('');
    setLoading(false);
  }, [client]);

  useEffect(() => {
    if (!client) {
      return;
    }

    void Promise.resolve().then(() => loadEntries());
  }, [client, loadEntries]);

  return (
    <div className="space-y-8">
      <CommandSection command="cat content_worth_consuming.json" withCursor>
        <div className="space-y-5">
          <p className="content-subtitle text-sm leading-7 sm:text-base">
            using this space to keep track of things I’ve read and shipped
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-950/55 p-1">
              {(['calendar', 'list'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    view === mode ? 'bg-zinc-800 text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  onClick={() => {
                    setView(mode);
                    if (mode === 'calendar') {
                      setHighlightedDate(null);
                    }
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {contentCategories.map((category) => {
                const isSelected = selectedCategories.includes(category);

                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isSelected}
                    className={`rounded-full border px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] transition ${
                      isSelected
                        ? 'border-zinc-600 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
                        : 'border-zinc-800 bg-zinc-950/35 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {contentCategoryLabels[category]}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? <p className="content-subtitle">loading...</p> : null}
          {message ? <p className="content-subtitle">{message}</p> : null}
          {!loading && !message && entries.length === 0 ? <p className="content-subtitle">No entries yet.</p> : null}
          {!loading && !message && entries.length > 0 && filteredEntries.length === 0 ? (
            <p className="content-subtitle">No entries for selected categories.</p>
          ) : null}
          {!loading && !message && entries.length > 0 && view === 'calendar' ? (
            <ContentCalendar entries={filteredEntries} onDateSelect={jumpToDate} />
          ) : null}
          {!loading && !message && filteredEntries.length > 0 && view === 'list' ? (
            <ContentList
              entries={filteredEntries}
              highlightedDate={highlightedDate}
              page={listPage}
              setPage={(updater) => {
                setHighlightedDate(null);
                setListPage(updater);
              }}
            />
          ) : null}
        </div>
      </CommandSection>
    </div>
  );
}

export function ContentAdminPanel() {
  const client = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState(() => (client ? '' : 'Supabase is not configured yet.'));

  const refreshSession = useCallback(async () => {
    if (!client) {
      setMessage('Supabase is not configured yet.');
      return;
    }

    const { data, error } = await client.auth.getSession();
    setSession(data.session);
    setMessage(error ? error.message : '');
  }, [client]);

  useEffect(() => {
    if (!client) {
      return;
    }

    void Promise.resolve().then(() => refreshSession());
    const { data } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setMessage('');
    });

    return () => data.subscription.unsubscribe();
  }, [client, refreshSession]);

  return (
    <CommandSection command="admin manage-content" withCursor>
      <div className="space-y-4">
        {message ? <p className="content-subtitle">{message}</p> : null}
        <ContentAdmin session={session} onEntriesChanged={refreshSession} />
      </div>
    </CommandSection>
  );
}
