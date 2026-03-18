# Senthilnathan Portfolio

Personal portfolio site with a terminal-inspired UI, built as a fully static Next.js app for GitHub Pages.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Static export via `output: 'export'`

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

Open [http://localhost:3000](http://localhost:3000).

## Visitor tracking

Google Analytics is wired in via `app/layout.tsx` and is enabled only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.

For GitHub Pages deployment, add `NEXT_PUBLIC_GA_MEASUREMENT_ID` as a GitHub repository secret so the workflow can inject it during the static build.

## Production build

```bash
npm run build
```

The static export is generated in `out/`.

## Site structure

This project currently includes:

- Home
- Blog
- Experience
- Projects
- Principles
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
- principles
- research and update placeholders

Blog content is assembled from:

- `data/blogPosts.generated.json` for post payloads
- `data/blogPosts.ts` for slugs, categories, labels, summaries, and link cleanup

Static assets live in `public/`, including the profile image and CV PDF.

## Deployment

The site is configured for GitHub Pages with a GitHub Actions workflow at `.github/workflows/deploy.yml`.

To deploy:

1. Push the repository to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` to trigger the build and deployment workflow.

## Notes

- `next.config.ts` enables static export and unoptimized images for GitHub Pages compatibility.
- Because this is a static export, features that require a live Next.js server, such as API routes or middleware, will not work on GitHub Pages without a different hosting setup.
