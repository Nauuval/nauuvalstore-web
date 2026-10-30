import type { Metadata, Viewport } from 'next';
import './globals.css';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Nauuvalstore | Joki & Kebutuhan Roblox Fisch & Blox Fruit Terpercaya',
  description:
    'Pusat joki Roblox Fisch, Blox Fruit serta kebutuhan akun, koin C$, beli, fruit kitsune & godhuman terpercaya di Indonesia. Bergaransi 100% aman anti-hackback, pengerjaan kilat 24 jam.',
  keywords: [
    'nauuvalstore',
    'joki fisch',
    'joki fisch roblox',
    'joki blox fruit',
    'joki blox fruit murah',
    'joki godhuman blox fruit',
    'joki cdk blox fruit',
    'joki rod of the depths fisch',
    'beli koin fisch roblox',
    'beli fruit kitsune',
    'roblox joki terpercaya',
    'jasa joki game roblox',
    'joki leveling fisch',
    'joki v4 blox fruit',
  ],
  authors: [{ name: 'Nauuvalstore', url: 'https://nauuvalstore.vercel.app' }],
  creator: 'Nauuvalstore',
  metadataBase: new URL('https://nauuvalstore.vercel.app'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '64x64', type: 'image/png' },
      { url: '/logo-store.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Nauuvalstore - Joki & Kebutuhan Roblox Fisch & Blox Fruit',
    description:
      'Layanan joki & kebutuhan game Roblox termurah, tercepat, dan terpercaya dengan pantauan stok realtime & garansi aman 100%.',
    url: 'https://nauuvalstore.vercel.app',
    siteName: 'Nauuvalstore',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/logo-store.png',
        width: 800,
        height: 800,
        alt: 'Nauuvalstore Roblox Joki Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nauuvalstore - Roblox Fisch & Blox Fruit Specialist',
    description: 'Jasa joki & kebutuhan Roblox termurah, tercepat, dan terpercaya.',
    images: ['/logo-store.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#060b08',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#060b08] text-zinc-100 antialiased selection:bg-[#00df82] selection:text-[#03140d]">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
