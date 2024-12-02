import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./src/assests/scss'], // Zmiana na właściwą ścieżkę
  },
};

// Połącz konfigurację Next.js z bundle-analyzer
export default nextConfig;
