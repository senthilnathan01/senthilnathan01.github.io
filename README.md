# Nathan's Portfolio

Terminal-inspired personal portfolio built with Next.js App Router and deployed to both GitHub Pages and Vercel from the same codebase.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel Web Analytics
- Google Analytics 4

## What is in the site

- Home
- Blog
- Experience
- Projects
- About
- Research
- Contact
- Downloadable CV

## Local development

Install dependencies:

```bash
npm install
```

Create a local env file if you want Google Analytics enabled while developing:

```bash
cp .env.example .env.local
```

`.env.example` currently contains:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Notes:

- `npm run build` defaults to the GitHub Pages build behavior when run locally.
- Use `DEPLOY_TARGET=vercel npm run build` if you want to locally simulate the Vercel-targeted build path.
- `npm run start` is only useful after a non-export build, such as a Vercel-style local build.

## Deployment model

This repo supports two deployment targets.

### GitHub Pages

GitHub Pages uses static export.

- The GitHub Actions workflow is defined in `.github/workflows/deploy.yml`.
- The workflow sets `DEPLOY_TARGET=github-pages`.
- That enables `output: 'export'` in `next.config.ts`.
- Exported files are written to `out/`.
- Images are served unoptimized for compatibility with static hosting.

### Vercel

Vercel uses the standard Next.js build output.

- Vercel is auto-detected through `process.env.VERCEL === '1'`.
- You can also set `DEPLOY_TARGET=vercel` explicitly if you want the intent to be obvious.
- Output stays in `.next/`.
- Next image optimization remains enabled.

## Analytics

There are two analytics systems in the project.

### Google Analytics

Google Analytics is enabled only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.

- The external loader is injected from `app/layout.tsx`.
- Initialization is handled by `public/ga-init.js`.
- For GitHub Pages, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` as a GitHub repository secret so the Actions build can inject it.
- For Vercel, set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the project environment variables.

### Vercel Web Analytics

Vercel Web Analytics is enabled only for Vercel deployments.

- The component is mounted from `app/layout.tsx`.
- The GitHub Pages build intentionally skips it because `/_vercel/insights/script.js` does not exist on the `*.github.io` domain.
- In Vercel, make sure Web Analytics is enabled in the project settings.

### Analytics troubleshooting

- `ERR_BLOCKED_BY_CLIENT` usually means a browser extension or privacy tool blocked the analytics request.
- On GitHub Pages, you should not see Vercel Analytics load attempts after the recent fix.
- On Vercel, `/_vercel/insights/script.js` should load only on the Vercel-hosted domain.

## Where to edit content

Most content is intentionally file-driven.

### Core site content

Edit `data/siteData.ts` for:

- navigation
- profile facts
- current status
- experience
- projects
- about content
- contact blurbs
- CV link metadata

### Blog content

Blog content is split across:

- `data/blogPosts.generated.json`: rendered post payloads
- `data/blogPosts.ts`: slugs, categories, labels, summaries, and related metadata

### Static assets

Edit files under `public/` for:

- `public/images/`: profile images
- `public/cv/senthilnathan_t.pdf`: downloadable resume PDF
- `public/cv/resume.tex`: LaTeX source for the CV
- favicon and touch icon assets

## Project structure

High-level layout:

```text
app/                   Next.js App Router pages and layout
components/            Shared UI components
data/                  Site and blog content
public/                Static assets, images, CV, GA init script
.github/workflows/     GitHub Pages deployment workflow
next.config.ts         Build behavior by deployment target
```

## Build behavior details

`next.config.ts` switches behavior using `DEPLOY_TARGET`.

- `github-pages`: static export enabled, images unoptimized
- `vercel`: normal Next.js build, images optimized

If `DEPLOY_TARGET` is not set, the config falls back to:

1. `vercel` when `VERCEL=1`
2. `github-pages` otherwise

That fallback is important because a plain local `npm run build` behaves like the GitHub Pages build unless you override it.

## GitHub Pages setup

1. Push the repository to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set the source to `GitHub Actions`.
4. Add the `NEXT_PUBLIC_GA_MEASUREMENT_ID` repository secret if you want GA enabled there.
5. Push to `main` or trigger the workflow manually.

## Vercel setup

1. Import the repository into Vercel.
2. Keep the framework preset as `Next.js`.
3. Leave the output directory blank.
4. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` if you want Google Analytics enabled.
5. Enable Web Analytics in the Vercel project settings.
6. Optionally set `DEPLOY_TARGET=vercel` to make the deployment target explicit.

## Notes

- The UI defaults to dark mode and stores the theme preference in `localStorage`.
- The portfolio is compatible with static hosting, but GitHub Pages still cannot support server-only Next.js features such as API routes or middleware-backed behavior.
- The home portrait is already prebuilt in AVIF, WebP, and JPEG variants under `public/images/`.
