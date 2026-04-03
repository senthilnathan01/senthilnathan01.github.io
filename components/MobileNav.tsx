'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NavItem } from '@/data/siteData';

type MobileNavProps = {
  items: NavItem[];
  pathname: string;
};

function isActivePath(itemHref: string, pathname: string) {
  if (itemHref === '/') {
    return pathname === '/';
  }

  if (itemHref.endsWith('.pdf')) {
    return false;
  }

  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}

export function MobileNav({ items, pathname }: MobileNavProps) {
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
                  aria-current={isActivePath(item.href, pathname) ? 'page' : undefined}
                  className={`nav-link nav-link--mobile ${
                    isActivePath(item.href, pathname) ? 'nav-link--active' : 'content-body'
                  }`}
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
