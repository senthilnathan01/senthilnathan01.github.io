import { ReactNode } from 'react';
import { PromptLine } from './PromptLine';

type CommandSectionProps = {
  command: string;
  children: ReactNode;
  withCursor?: boolean;
};

export function CommandSection({ command, children, withCursor = false }: CommandSectionProps) {
  return (
    <section aria-label={`Command output: ${command}`} className="space-y-3">
      <PromptLine command={command} withCursor={withCursor} />
      <div className="content-body border-l border-zinc-800 pl-4 text-sm leading-7 sm:text-base">{children}</div>
    </section>
  );
}
