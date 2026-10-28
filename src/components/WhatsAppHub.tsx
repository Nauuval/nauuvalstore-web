'use client';

import React from 'react';
import { MessageCircle, Users, BellRing, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface WhatsAppHubProps {
  settings: StoreSettings;
}

export default function WhatsAppHub({ settings }: WhatsAppHubProps) {
  return (
    <section id="whatsapp-hub" className="py-14 sm:py-20 relative bg-[#08090d] border-b border-zinc-800/80 scroll-mt-20">
      {/* Topo background */}
      <div className="absolute inset-0 bg-topo-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold mb-3 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>PUSAT KOMUNIKASI RESMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Saluran, Grup & Kontak WhatsApp
          </h2>
          <p className="mt-2 text-zinc-400 text-xs sm:text-sm leading-relaxed">
            Semua transaksi dan informasi resmi hanya melalui tautan WhatsApp resmi di bawah ini.
          </p>
        </div>

        {/* 3 Metallic Graphite Cards (Reference Image 3 Inspiration) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Saluran WhatsApp (Channel) */}
          <div className="metallic-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-5 group-hover:bg-white group-hover:text-black transition-colors">
                <BellRing className="w-5 h-5" />
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 border border-zinc-800 text-zinc-400 font-mono">
                Official Channel
              </span>

              <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-2">
                Saluran WhatsApp
              </h3>

              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                Ikuti saluran resmi untuk notifikasi restock akun langka, flash promo dadakan, dan kupon diskon subscriber.
              </p>

              <ul className="space-y-2 mb-6 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Update promo & restock otomatis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Privasi nomor aman 100%</span>
                </li>
              </ul>
            </div>

            <a
              href={settings.wa_channel_url || 'https://whatsapp.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs text-center flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-[1.01]"
            >
              <span>Gabung Saluran WhatsApp</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 2: Grup Komunitas WhatsApp */}
          <div className="metallic-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-5 group-hover:bg-white group-hover:text-black transition-colors">
                <Users className="w-5 h-5" />
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 border border-zinc-800 text-zinc-400 font-mono">
                Community Group
              </span>

              <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-2">
                Grup Komunitas
              </h3>

              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                Wadah diskusi sesama player Fisch & Blox Fruit. Mabar raid dungeon/boss, info cuaca mancing, dan sharing tips game.
              </p>

              <ul className="space-y-2 mb-6 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Komunitas aktif dan anti scam</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  <span>Sering adakan mabar & giveaway</span>
                </li>
              </ul>
            </div>

            <a
              href={settings.wa_group_url || 'https://chat.whatsapp.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs text-center flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-[1.01]"
            >
              <span>Masuk Grup Komunitas</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Direct WhatsApp Admin */}
          <div className="metallic-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between group">
            <div>
              <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-5 group-hover:bg-white group-hover:text-black transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/60 border border-zinc-800 text-zinc-400 font-mono">
                  Direct CS 24/7
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online Siaga</span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-2">
                Direct WhatsApp Admin
              </h3>

              <p className="text-zinc-400 text-xs leading-relaxed mb-6">
                Hubungi admin langsung untuk konsultasi pesanan khusus, konfirmasi bayar QRIS/E-Wallet, dan proses joki cepat.
              </p>

              <div className="p-2.5 rounded-xl bg-black/70 border border-zinc-800 mb-6 font-mono text-xs text-zinc-300 flex items-center justify-between">
                <span className="text-zinc-500">Nomor Admin:</span>
                <span className="font-bold text-white">+{settings.wa_number}</span>
              </div>
            </div>

            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs text-center flex items-center justify-center gap-2 transition-all shadow-md group-hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Direct Pemesanan</span>
            </a>
          </div>
        </div>

        {/* Security Alert Note */}
        <div className="mt-8 p-3.5 rounded-xl metallic-card flex items-center gap-3 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-zinc-300 shrink-0" />
          <span>
            <strong className="text-white">Peringatan Keamanan:</strong> Jangan pernah bertransaksi di luar nomor WhatsApp resmi tertera (+{settings.wa_number}). Nauuvalstore tidak bertanggung jawab atas penipuan di luar kontak resmi kami.
          </span>
        </div>
      </div>
    </section>
  );
}
