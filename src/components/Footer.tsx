'use client';

import React from 'react';
import Link from 'next/link';
import { Orbit, MessageCircle, Shield, ArrowUp, Heart } from 'lucide-react';
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
    <footer className="relative border-t border-slate-800/80 bg-slate-950 pt-16 pb-12 overflow-hidden text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 p-0.5 shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Orbit className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <span className="font-black text-lg text-white font-mono tracking-wider">
                {settings.store_name}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Penyedia jasa joki Roblox Fisch, Blox Fruit serta kebutuhan akun & koin terpercaya dengan pantauan stok realtime.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={buildWhatsAppConsultUrl(settings.wa_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-900 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WA: +{settings.wa_number}</span>
              </a>
            </div>
          </div>

          {/* Kategori Layanan */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider text-slate-200">
              Kategori Layanan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#catalog" className="hover:text-cyan-400 transition-colors">
                  • Joki Fisch (Level, Rod Quest, Bestiary)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-cyan-400 transition-colors">
                  • Joki Blox Fruit (Level 1-2550, Godhuman, CDK)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-cyan-400 transition-colors">
                  • Kebutuhan Fisch (C$ Cash, Relics, Totems)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-cyan-400 transition-colors">
                  • Kebutuhan Blox Fruit (Beli, Fruit Fisik, Carry)
                </a>
              </li>
            </ul>
          </div>

          {/* Link Komunitas & Saluran */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider text-slate-200">
              Saluran & Komunitas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={settings.wa_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-violet-400 transition-colors flex items-center gap-1.5"
                >
                  <span>📢 Saluran Resmi WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={settings.wa_group_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                >
                  <span>👥 Grup Komunitas Mabar</span>
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppConsultUrl(settings.wa_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>💬 Direct WhatsApp Customer Care</span>
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 pt-1 text-slate-400"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Control Panel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Jam Operasional */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3 uppercase tracking-wider text-slate-200">
              Jam Operasional
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex justify-between">
                <span>Pelayanan Chat:</span>
                <span className="text-emerald-400 font-semibold">24 Jam Siaga</span>
              </p>
              <p className="flex justify-between">
                <span>Pengerjaan Joki:</span>
                <span className="text-slate-200">08:00 - 23:00 WIB</span>
              </p>
              <p className="flex justify-between">
                <span>Metode Bayar:</span>
                <span className="text-slate-200">QRIS / E-Wallet / Bank</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 {settings.store_name}. All rights reserved. Game content and materials are trademarks and copyrights of Roblox Corp.
          </p>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Kembali ke Atas</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
