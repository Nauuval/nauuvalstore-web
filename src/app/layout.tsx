import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'nauuvalstore | TERMURAH - TERCEPAT - TERPERCAYA',
  description: 'nauuvalstore - Layanan joki & kebutuhan akun Fisch dan Blox Fruit Roblox terlengkap, termurah, tercepat, dan terpercaya dengan pantauan stok realtime.',
  keywords: ['nauuvalstore', 'joki fisch', 'joki blox fruit', 'roblox joki murah', 'termurah tercepat terpercaya'],
  authors: [{ name: 'nauuvalstore' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#08090d] text-zinc-100 antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
