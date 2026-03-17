import { ReactNode } from 'react';

type TerminalWindowProps = {
  title: string;
  children: ReactNode;
};

export function TerminalWindow({ title, children }: TerminalWindowProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
        </div>
        <p className="text-xs text-zinc-500">{title}</p>
      </div>
      <div className="space-y-10 p-5 sm:p-8">{children}</div>
    </div>
  );
}
