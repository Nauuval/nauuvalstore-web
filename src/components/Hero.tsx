'use client';

import React from 'react';
import { ArrowDown, Users, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { StoreSettings } from '@/types';

interface HeroProps {
  settings: StoreSettings;
  totalProducts: number;
  promoCount: number;
}

export default function Hero({ settings, totalProducts, promoCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-zinc-900 bg-black">
      {/* Background monochrome grid */}
      <div className="absolute inset-0 bg-monochrome-grid opacity-25 pointer-events-none" />

      {/* Subtle white vignette glow in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left Column: Text & CTAs */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold mb-6 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{settings.tagline || 'TERMURAH - TERCEPAT - TERPERCAYA'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-mono leading-none">
              {settings.store_name || 'nauuvalstore'}
            </h1>

            <p className="mt-4 text-lg sm:text-xl font-bold tracking-wide text-zinc-300 uppercase">
              Joki & Kebutuhan Roblox Fisch & Blox Fruit
            </p>

            <p className="mt-4 text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Pilihan tepat untuk leveling kilat, quest rod mythic, hunting melee godhuman, dan kebutuhan koin akun Roblox. 100% aman tanpa cheat script dan stok terpantau realtime.
            </p>

            {/* Action Buttons (High contrast Black & White) */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#catalog"
                className="px-6 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs sm:text-sm shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Cek Katalog & Promo</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#whatsapp-hub"
                className="px-5 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-white font-bold text-xs sm:text-sm border border-zinc-800 hover:border-zinc-600 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-zinc-400" />
                <span>Saluran & Komunitas WA</span>
              </a>
            </div>

            {/* Mini Trust Points */}
            <div className="mt-10 pt-6 border-t border-zinc-900 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">100%</p>
                <p className="text-[11px] text-zinc-400 uppercase font-semibold">Anti Hackback</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">{totalProducts}</p>
                <p className="text-[11px] text-zinc-400 uppercase font-semibold">Layanan Ready</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-white font-mono">{promoCount}</p>
                <p className="text-[11px] text-zinc-400 uppercase font-semibold">Produk Promo</p>
              </div>
            </div>
          </div>

          {/* Right Column: Singularity Artwork uploaded by user */}
          <div className="w-full lg:w-2/5 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
              {/* Subtle back shadow */}
              <div className="absolute inset-4 rounded-full bg-white/5 blur-3xl pointer-events-none" />

              <img
                src="/logo-store.png"
                alt="nauuvalstore singularity"
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_35px_rgba(255,255,255,0.18)] hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Supported Games Bar (Fisch & Blox Fruits Logos) */}
        <div className="mt-16 pt-8 border-t border-zinc-900">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
            Spesialisasi Game Roblox:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            {/* Fisch Logo */}
            <a
              href="#catalog"
              className="p-3.5 px-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-white transition-all flex items-center gap-4 group"
            >
              <img
                src="/logo-fisch.png"
                alt="Fisch Roblox"
                className="h-10 sm:h-12 w-auto object-contain brightness-100 group-hover:scale-105 transition-transform"
              />
              <div className="text-left border-l border-zinc-800 pl-4">
                <p className="text-xs font-extrabold text-white uppercase">Game Fisch</p>
                <p className="text-[10px] text-zinc-400">Joki Quest, Level & Koin C$</p>
              </div>
            </a>

            {/* Blox Fruits Logo */}
            <a
              href="#catalog"
              className="p-3.5 px-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-white transition-all flex items-center gap-4 group"
            >
              <img
                src="/logo-bloxfruits.png"
                alt="Blox Fruits Roblox"
                className="h-10 sm:h-12 w-auto object-contain brightness-100 group-hover:scale-105 transition-transform"
              />
              <div className="text-left border-l border-zinc-800 pl-4">
                <p className="text-xs font-extrabold text-white uppercase">Game Blox Fruits</p>
                <p className="text-[10px] text-zinc-400">Max Level, Melee, Buah Fisik</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
