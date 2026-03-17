import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Senthilnathan | Applied AI Engineer',
  description: 'Terminal-inspired portfolio for Senthilnathan, an Applied AI Engineer.',
  icons: {
    icon: '/images/profile.jpg',
    shortcut: '/images/profile.jpg',
    apple: '/images/profile.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 font-mono text-zinc-100 antialiased">
        <div className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </body>
    </html>
  );
}
