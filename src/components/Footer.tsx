'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Shield, ArrowUp } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface FooterProps {
  settings: StoreSettings;
}

export default function Footer({ settings }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-zinc-800/80 bg-[#08090d] pt-14 pb-12 text-zinc-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 p-1 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo-store.png"
                  alt="nauuvalstore"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-black text-lg text-white font-mono uppercase tracking-tight">
                  {settings.store_name}
                </span>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  {settings.tagline}
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Penyedia jasa joki Roblox Fisch, Blox Fruit serta kebutuhan akun & koin terpercaya dengan pantauan stok realtime.
            </p>

            <div className="pt-2">
              <a
                href={buildWhatsAppConsultUrl(settings.wa_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white text-black font-extrabold text-xs inline-flex items-center gap-1.5 hover:bg-zinc-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat Admin: +{settings.wa_number}</span>
              </a>
            </div>
          </div>

          {/* Kategori Layanan */}
          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
              Kategori Layanan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  • Joki Fisch (Level 1-100, Rod Quests)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  • Joki Blox Fruit (Max Level, Godhuman, CDK)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  • Kebutuhan Fisch (Koin C$, Relics, Totems)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">
                  • Kebutuhan Blox Fruit (Beli, Fruit, Carry)
                </a>
              </li>
            </ul>
          </div>

          {/* Saluran & Komunitas */}
          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
              Saluran & Komunitas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={settings.wa_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>📢 Saluran Resmi WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.wa_group_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>👥 Grup Komunitas Mabar</span>
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-white transition-colors flex items-center gap-1.5 pt-1 text-zinc-400"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Control Panel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Jam Operasional */}
          <div>
            <h4 className="font-bold text-white text-xs mb-3 uppercase tracking-wider">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <p className="flex justify-between">
                <span>Pelayanan Chat:</span>
                <span className="text-white font-bold">24 Jam Siaga</span>
              </p>
              <p className="flex justify-between">
                <span>Pengerjaan Joki:</span>
                <span className="text-zinc-200">08:00 - 23:00 WIB</span>
              </p>
              <p className="flex justify-between">
                <span>Metode Bayar:</span>
                <span className="text-zinc-200">QRIS / E-Wallet / Bank</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p className="text-center sm:text-left">
            © 2026 {settings.store_name}. All rights reserved. Game content and materials are trademarks of Roblox Corp.
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Kembali ke Atas</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
