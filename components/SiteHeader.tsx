'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { siteData } from '@/data/siteData';
import { MobileNav } from './MobileNav';
import { ThemeToggle } from './ThemeToggle';

function isActivePath(itemHref: string, pathname: string) {
  if (itemHref === '/') {
    return pathname === '/';
  }

  if (itemHref.endsWith('.pdf')) {
    return false;
  }

  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 -mx-5 flex items-start justify-between gap-4 border-b border-zinc-800 bg-zinc-950/88 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
      <div className="space-y-1">
        <Link href="/" className="content-title text-sm transition hover:text-emerald-300">
          {siteData.brand}
        </Link>
        <p className="content-muted text-xs lowercase tracking-[0.18em]">{siteData.status}</p>
      </div>
      <div className="flex items-start gap-3 sm:items-center">
        <MobileNav items={siteData.nav} pathname={pathname} />
        <nav className="hidden sm:block" aria-label="Primary">
          <ul className="content-body flex flex-wrap items-center gap-5 text-sm">
            {siteData.nav.map((item) => {
              const isActive = isActivePath(item.href, pathname);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                    rel={item.href.endsWith('.pdf') ? 'noreferrer' : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    className={`transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                      isActive ? 'text-emerald-300' : 'hover:text-emerald-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
