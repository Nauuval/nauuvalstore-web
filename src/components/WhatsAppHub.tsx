'use client';

import React from 'react';
import { MessageCircle, Users, BellRing, ArrowUpRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface WhatsAppHubProps {
  settings: StoreSettings;
}

export default function WhatsAppHub({ settings }: WhatsAppHubProps) {
  return (
    <section id="whatsapp-hub" className="py-16 sm:py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PUSAT KOMUNIKASI RESMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Saluran, Grup & Kontak WhatsApp
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Terhubung langsung dengan ekosistem Singularity Store untuk info restock kilat, mabar komunitas, dan konsultasi pesanan langsung.
          </p>
        </div>

        {/* 3 Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Saluran WhatsApp (Channel) */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-slate-800/80 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-900/20 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-violet-600/20 transition-all" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-700/60 flex items-center justify-center text-violet-400 mb-5 shadow-lg shadow-violet-900/30">
                <BellRing className="w-6 h-6" />
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full bg-violet-950 border border-violet-800 text-[11px] font-bold text-violet-300 mb-2 uppercase tracking-wide">
                Official Channel
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Saluran WhatsApp
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Ikuti saluran resmi untuk notifikasi restock item langka (Kitsune, Relic, Mythic Rod), event giveaway akun, dan kupon diskon spesial.
              </p>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Update promo & diskon kilat</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Notifikasi stok ready otomatis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Privasi 100% terjaga (nomor aman)</span>
                </li>
              </ul>
            </div>

            <a
              href={settings.wa_channel_url || 'https://whatsapp.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/25 group-hover:scale-[1.02]"
            >
              <span>Gabung Saluran WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 2: Grup Komunitas WhatsApp */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-slate-800/80 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-600/20 transition-all" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 mb-5 shadow-lg shadow-cyan-900/30">
                <Users className="w-6 h-6" />
              </div>

              <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[11px] font-bold text-cyan-300 mb-2 uppercase tracking-wide">
                Community Group
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Grup Komunitas
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Ruang diskusi sesama pemain Fisch & Blox Fruit. Mabar raid dungeon/boss, info spawn event, barter aman, dan sharing build PvP.
              </p>

              <ul className="space-y-2 mb-6 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Komunitas aktif & ramah pemula</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Sering adakan mabar & giveaway</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Pengawasan admin ketat anti scam</span>
                </li>
              </ul>
            </div>

            <a
              href={settings.wa_group_url || 'https://chat.whatsapp.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-600/25 group-hover:scale-[1.02]"
            >
              <span>Masuk Grup Komunitas</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Direct WhatsApp CS & Order */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between border-slate-800/80 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-600/20 transition-all" />

            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-900/30">
                <MessageCircle className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[11px] font-bold text-emerald-300 uppercase tracking-wide">
                  Direct CS 24/7
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Siap Melayani</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Direct WhatsApp Admin
              </h3>

              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Pemesanan joki kustom, pembelian item/koin, konfirmasi pembayaran via QRIS/e-Wallet/Bank, serta konsultasi gratis dengan admin toko.
              </p>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 mb-6 font-mono text-xs text-slate-300 flex items-center justify-between">
                <span className="text-slate-400">Nomor Admin:</span>
                <span className="font-bold text-emerald-400">+{settings.wa_number}</span>
              </div>
            </div>

            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 group-hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Direct Pemesanan</span>
            </a>
          </div>
        </div>

        {/* Anti-Scam Notice */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-400">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Perhatian Keamanan:</strong> Transaksi resmi hanya diproses melalui nomor WhatsApp tertera (+{settings.wa_number}). Hati-hati terhadap pihak yang mengatasnamakan Singularity Store di luar saluran dan kontak resmi kami.
          </span>
        </div>
      </div>
    </section>
  );
}
