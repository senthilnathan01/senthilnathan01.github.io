import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function ProjectsPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://projects">
        <section className="space-y-6">
          <p className="text-sm text-zinc-400">
            <span className="text-emerald-400">$</span> tree projects --depth 1
          </p>
          <ul className="space-y-5">
            {siteData.projects.map((project) => (
              <li key={project.title} className="space-y-2 border-l border-zinc-800 pl-4">
                <h2 className="text-zinc-100">{project.title}</h2>
                <p className="text-zinc-300">{project.description}</p>
                <p className="text-xs text-zinc-500">stack: {project.stack.join(' · ')}</p>
                {project.href ? <Link href={project.href} className="text-sm text-emerald-300 hover:text-emerald-200">View details ↗</Link> : null}
              </li>
            ))}
          </ul>
        </section>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
