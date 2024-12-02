import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./src/assests/scss'], // Zmiana na właściwą ścieżkę
  },
};

export default nextConfig;
