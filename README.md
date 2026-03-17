# Terminal Portfolio (Next.js)

Minimal personal website with a dark terminal aesthetic, built with:
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Static export (`output: "export"`)

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build static site

```bash
npm run build
```

Static files are generated in `out/`.

## Content editing

Update placeholder profile, links, projects, posts, and research entries in:

- `data/siteData.ts`

## Deploy to GitHub Pages

This repo is already configured for static export, so GitHub Pages can host it directly.

1. Push the repo to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` and let the workflow publish the `out/` directory.

The deployment workflow lives in `.github/workflows/deploy.yml`.

## Notes

- This works well on GitHub Pages because the site is fully static.
- If you later add Next.js server features like API routes, middleware, or server-side rendering, GitHub Pages will no longer be enough on its own.
