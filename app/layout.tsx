import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const themeBootstrapScript = `
  (() => {
    const defaultTheme = 'dark';

    try {
      const storedTheme = window.localStorage.getItem('theme');
      const theme = storedTheme === 'light' ? 'light' : defaultTheme;

      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch {
      document.documentElement.dataset.theme = defaultTheme;
      document.documentElement.style.colorScheme = defaultTheme;
    }
  })();
`;

export const metadata: Metadata = {
  title: {
    default: 'Nathan',
    template: 'Nathan | %s',
  },
  description: 'Terminal-inspired portfolio for Nathan, an Applied AI Engineer.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        {gaMeasurementId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} />
            <script defer src={`/ga-init.js?id=${gaMeasurementId}`} />
          </>
        ) : null}
      </head>
      <body className="bg-zinc-950 font-mono text-zinc-100 antialiased">
        <div className="mx-auto min-h-screen w-full max-w-5xl px-5 pb-8 sm:px-8 sm:pb-10">{children}</div>
        <Analytics />
      </body>
    </html>
  );
}
