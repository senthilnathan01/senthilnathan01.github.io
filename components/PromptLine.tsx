import { ReactNode } from 'react';

type PromptLineProps = {
  command: string;
  children?: ReactNode;
  withCursor?: boolean;
};

export function PromptLine({ command, children, withCursor = false }: PromptLineProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-400 sm:text-base">
        <span className="text-emerald-400">$</span> {command}
        {withCursor && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-zinc-300 align-middle" aria-hidden="true" />}
      </p>
      {children ? <div className="pl-4 text-zinc-200">{children}</div> : null}
    </div>
  );
}
