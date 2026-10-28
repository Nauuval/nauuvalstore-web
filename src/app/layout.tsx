import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SINGULARITY STORE | Joki & Kebutuhan Fisch & Blox Fruit',
  description: 'Penyedia jasa joki Roblox Fisch, Blox Fruit & kebutuhan akun terpercaya, aman, bergaransi dengan katalog stok realtime.',
  keywords: ['joki fisch', 'joki blox fruit', 'beli cash fisch', 'beli godhuman', 'singularity joki', 'roblox joki'],
  authors: [{ name: 'Singularity Store' }],
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
      <body className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-violet-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
