
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', 
  // Das basePath muss exakt dem Namen deines GitHub-Repositorys entsprechen
  basePath: '/vociflow',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
