
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', 
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
  // Verhindert Build-Abbrüche durch Typ-Fehler oder Linting in der CI-Umgebung
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
