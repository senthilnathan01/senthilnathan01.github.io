import type { NextConfig } from 'next';

const deployTarget = process.env.DEPLOY_TARGET ?? (process.env.VERCEL === '1' ? 'vercel' : 'github-pages');
const isGitHubPages = deployTarget === 'github-pages';

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: 'export' } : {}),
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;
