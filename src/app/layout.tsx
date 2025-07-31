import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Volleyball Score Tracker',
  description: 'Track volleyball match scores with professional rules. Best of 5 sets scoring system.',
  keywords: ['volleyball', 'score', 'tracker', 'sports', 'match', 'tournament'],
  authors: [{ name: 'Terry Truong' }],
  creator: 'Terry Truong',
  publisher: 'Terry Truong',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#22c55e' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Volleyball Tracker',
    startupImage: [
      {
        url: '/apple-splash-2048-2732.jpg',
        media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1668-2388.jpg',
        media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1536-2048.jpg',
        media: '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1284-2778.jpg',
        media: '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/apple-splash-1170-2532.jpg',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/apple-splash-1125-2436.jpg',
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/apple-splash-828-1792.jpg',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-750-1334.jpg',
        media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://volleyball-tracker-frontend.vercel.app/',
    siteName: 'Volleyball Score Tracker',
    title: 'Volleyball Score Tracker',
    description: 'Track volleyball match scores with professional rules',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Volleyball Score Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volleyball Score Tracker',
    description: 'Track volleyball match scores with professional rules',
    images: ['/og-image.png'],
  },
  other: {
    'msapplication-TileColor': '#171717',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22c55e' },
    { media: '(prefers-color-scheme: dark)', color: '#22c55e' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Volleyball Tracker" />
        
        {/* Microsoft specific */}
        <meta name="msapplication-TileColor" content="#171717" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        
        {/* Prevent zoom on input focus (iOS Safari) */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}