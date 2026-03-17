import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Senthil Nathan | Terminal Portfolio',
  description: 'A minimal personal website with terminal-inspired interface.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 font-mono text-zinc-100 antialiased">
        <div className="mx-auto min-h-screen w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </body>
    </html>
  );
}
