
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export', 
  // Da GitHub Pages meist unter /vociflow/ läuft, muss der Pfad angepasst werden
  // Falls du eine eigene Domain nutzt, kannst du basePath entfernen
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
