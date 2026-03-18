import Link from 'next/link';
import { CommandSection } from '@/components/CommandSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { TerminalWindow } from '@/components/TerminalWindow';
import { siteData } from '@/data/siteData';

export default function ProjectsPage() {
  return (
    <main className="space-y-8">
      <SiteHeader />
      <TerminalWindow title="session://projects">
        <CommandSection command="cat projects.txt" withCursor>
          <p className="max-w-3xl text-zinc-300">{siteData.projectsIntro}</p>
        </CommandSection>

        <CommandSection command="ls projects/">
          <ul className="space-y-5">
            {siteData.projects.map((project) => (
              <li
                key={project.title}
                className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"
              >
                <div className="space-y-2">
                  <h2 className="text-lg text-zinc-100">{project.title}</h2>
                  <p className="text-zinc-300">{project.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {project.stack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-amber-500/20 bg-amber-500/8 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-amber-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex text-sm text-emerald-300 transition hover:text-emerald-200"
                >
                  Open repository
                </Link>
              </li>
            ))}
          </ul>
        </CommandSection>
      </TerminalWindow>
      <SiteFooter />
    </main>
  );
}
