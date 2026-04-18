# Nathan's Portfolio

Personal portfolio site with a terminal-inspired UI, built with Next.js and configured to deploy to both GitHub Pages and Vercel.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Local development

```bash
npm install
```

If you want analytics enabled locally, create `.env.local` from `.env.example` and set your Google Analytics measurement ID:

```bash
cp .env.example .env.local
```

Then update:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Continue with:

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000).

## Visitor tracking

Google Analytics is wired in via `app/layout.tsx` and is enabled only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.

Vercel Web Analytics is also mounted from `app/layout.tsx`, but only for Vercel deployments. The GitHub Pages build skips it because the `/_vercel/insights/script.js` endpoint does not exist on the `*.github.io` domain.

For GitHub Pages deployment, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` as a GitHub repository secret so the workflow can inject it during the static build.

For Vercel deployment, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the Vercel project environment variables and enable Web Analytics in the Vercel project settings.

## Production build

```bash
npm run build
```

Build output depends on the target:

- GitHub Pages: static export in `out/`
- Vercel: standard Next.js build output in `.next/`

## Site structure

This project currently includes:

- Home
- Blog
- Experience
- Projects
- About
- Research
- Contact
- Downloadable CV

## Content sources

Most editable site content lives in `data/siteData.ts`, including:

- profile details
- navigation
- social/contact links
- experience
- projects
- about
- research and update placeholders

Blog content is assembled from:

- `data/blogPosts.generated.json` for post payloads
- `data/blogPosts.ts` for slugs, categories, labels, summaries, and link cleanup

Static assets live in `public/`, including the optimized profile portrait (`profile.avif`, `profile.webp`, `profile.jpg` fallback), favicon files, and CV PDF.

## Deployment

This repo supports both GitHub Pages and Vercel from the same codebase.

### GitHub Pages

1. Push the repository to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` to trigger the build and deployment workflow.

The workflow sets `DEPLOY_TARGET=github-pages`, which keeps static export enabled for Pages.

### Vercel

1. Push the repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click `Add New -> Project`.
3. Import this GitHub repository.
4. In Vercel project settings, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` if you want Google Analytics enabled.
5. Optional but explicit: add `DEPLOY_TARGET=vercel` as an environment variable. This is not strictly required because Vercel is auto-detected, but it makes the intended target obvious.
6. Keep the framework preset as `Next.js`.
7. Leave the output directory blank.
8. Deploy.

After that, Vercel will redeploy automatically on new pushes to the connected branch.

## Notes

- `next.config.ts` switches behavior by deployment target:
- GitHub Pages uses static export and unoptimized images.
- Vercel uses standard Next.js output and Next image optimization.
- The home portrait is served from prebuilt AVIF/WebP/JPEG assets in `public/images/`.
- The UI defaults to dark mode, includes a manual light/dark toggle in the header, and stores the visitor's choice in `localStorage`.
- GitHub Pages still has static-hosting limits, so features like API routes or middleware would require Vercel or another server-capable host.
