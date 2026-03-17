import Link from 'next/link';
import { siteData } from '@/data/siteData';
import { MobileNav } from './MobileNav';

export function SiteHeader() {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-6">
      <div className="space-y-1">
        <Link href="/" className="text-sm text-zinc-100 transition hover:text-emerald-300">
          {siteData.brand}
        </Link>
        <p className="text-xs lowercase tracking-[0.18em] text-zinc-500">{siteData.status}</p>
      </div>
      <MobileNav items={siteData.nav} />
      <nav className="hidden sm:block" aria-label="Primary">
        <ul className="flex flex-wrap gap-5 text-sm text-zinc-300">
          {siteData.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                target={item.href.endsWith('.pdf') ? '_blank' : undefined}
                rel={item.href.endsWith('.pdf') ? 'noreferrer' : undefined}
                className="transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
