import type { NextConfig } from 'next';

const deployTarget = process.env.DEPLOY_TARGET ?? (process.env.VERCEL === '1' ? 'vercel' : 'github-pages');
const isGitHubPages = deployTarget === 'github-pages';

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: 'export' } : {}),
  images: {
    unoptimized: isGitHubPages,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-images-1.medium.com',
      },
    ],
  },
};

export default nextConfig;
