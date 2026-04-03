'use client';

const storageKey = 'theme';

function applyTheme(theme: 'dark' | 'light') {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(storageKey, theme);
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        d="M21 15.2A8.7 8.7 0 1 1 12.8 3a7.1 7.1 0 0 0 8.2 12.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" strokeLinecap="round" />
    </svg>
  );
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={() => {
        const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
      }}
      className="theme-toggle inline-flex items-center justify-center rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition hover:border-zinc-500 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
    >
      <span className="sr-only">Toggle light and dark mode</span>
      <span className="theme-toggle__icon theme-toggle__icon--moon">
        <MoonIcon />
      </span>
      <span className="theme-toggle__icon theme-toggle__icon--sun">
        <SunIcon />
      </span>
    </button>
  );
}
