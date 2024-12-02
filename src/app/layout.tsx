import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import '@/src/assests/scss/global.scss';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Navigation Builder',
  description: 'Build and manage navigation menus with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-family-inter text-primary bg-page text-base font-normal antialiased">{children}</body>
    </html>
  );
}
