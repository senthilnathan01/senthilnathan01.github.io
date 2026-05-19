'use client';

import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
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
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const sidebar = (
    <>
      <button
        type="button"
        className={`fixed inset-0 z-[60] bg-zinc-950/20 backdrop-blur-[1px] transition-opacity duration-200 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />
      <nav
        id="mobile-nav-menu"
        className={`fixed inset-y-0 right-0 z-[70] flex h-dvh w-[75vw] max-w-sm flex-col border-l border-zinc-800 bg-zinc-950 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.45)] transition duration-300 ease-out ${
          open
            ? 'translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-full opacity-0'
        }`}
        aria-label="Mobile"
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        <div className="mb-8 flex items-center justify-end">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-zinc-700 text-lg leading-none text-zinc-200 transition hover:border-zinc-500 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>
        <ul className="space-y-4 text-base">
          {items.map((item) => {
            const isDocumentLink = item.href.endsWith('.pdf');
            const isActive = isActivePath(item.href, pathname);
            const linkClassName = `nav-link nav-link--mobile ${isActive ? 'nav-link--active' : 'content-body'}`;

            return (
              <li key={item.href}>
                {isDocumentLink ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-current={isActive ? 'page' : undefined}
                    className={linkClassName}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={linkClassName}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <div className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-700 p-0 text-zinc-200 transition hover:border-zinc-500 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
        aria-controls="mobile-nav-menu"
        aria-expanded={open}
        aria-label="Open navigation menu"
      >
        <span className="flex w-4 flex-col gap-1" aria-hidden="true">
          <span className="h-0.5 rounded-full bg-current" />
          <span className="h-0.5 rounded-full bg-current" />
          <span className="h-0.5 rounded-full bg-current" />
        </span>
      </button>
      {mounted ? createPortal(sidebar, document.body) : null}
    </div>
  );
}
