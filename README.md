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

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`
5. Output directory: `out`

Then deploy.
