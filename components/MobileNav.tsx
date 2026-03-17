'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NavItem } from '@/data/siteData';

type MobileNavProps = {
  items: NavItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
        aria-expanded={open}
      >
        menu
      </button>
      {open ? (
        <nav className="mt-3 border border-zinc-800 bg-zinc-900/90 p-3" aria-label="Mobile">
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                  rel={item.href.endsWith('.pdf') ? 'noreferrer' : undefined}
                  className="block text-zinc-300 transition hover:text-emerald-300"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
