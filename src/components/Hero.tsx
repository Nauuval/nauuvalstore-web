'use client';

import React from 'react';
import { ShieldCheck, Zap, Radio, Sparkles, MessageCircle, ArrowDown, Users } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface HeroProps {
  settings: StoreSettings;
  totalProducts: number;
  discountCount: number;
}

export default function Hero({ settings, totalProducts, discountCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Singularity Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[850px] sm:h-[850px] pointer-events-none">
        {/* Outer cosmic glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-cyan-500/20 blur-[120px] animate-singularity-glow" />
        {/* Accretion disk ring */}
        <div className="absolute inset-16 rounded-full border border-violet-500/20 blur-[1px] animate-singularity-spin" />
        {/* Core darkness */}
        <div className="absolute inset-32 rounded-full bg-[#030712] shadow-[inset_0_0_80px_rgba(139,92,246,0.3)]" />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-violet-500/40 text-violet-300 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-violet-950/50 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white">SINGULARITY STORE SYSTEM</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Live Stock & Real-time Update</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Joki & Kebutuhan Akun{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
              Fisch & Blox Fruit
            </span>{' '}
            Roblox
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {settings.tagline ||
              'Solusi joki nomor satu, aman tanpa cheat/script, pengerjaan kilat oleh pro player, bergaransi 100%, dengan stok katalog terpantau realtime.'}
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <a
              href="#catalog"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse text-cyan-300" />
              <span>Cek Katalog & Stok Live</span>
              <ArrowDown className="w-4 h-4 text-violet-200" />
            </a>

            <a
              href="#whatsapp-hub"
              className="px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700 hover:border-violet-500/50 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Saluran & Grup Komunitas</span>
            </a>

            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 hover:text-white font-semibold text-sm sm:text-base border border-emerald-600/40 hover:border-emerald-500 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp CS</span>
            </a>
          </div>

          {/* Value Badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-violet-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">100% Aman</span>
              </div>
              <p className="text-xs text-slate-400">Anti Rollback & No Cheat Script</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Kilat Express</span>
              </div>
              <p className="text-xs text-slate-400">Mulai Proses 15-30 Menit</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Radio className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Stok</span>
              </div>
              <p className="text-xs text-slate-400">{totalProducts} Item Terpantau Realtime</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Promo Aktif</span>
              </div>
              <p className="text-xs text-slate-400">{discountCount} Item Diskon Coret Harga</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
