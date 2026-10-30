'use client';

import React from 'react';
import { ArrowDown, Users, ShieldCheck, Zap, Radio, CheckCircle, Award, Star } from 'lucide-react';
import { StoreSettings } from '@/types';

interface HeroProps {
  settings: StoreSettings;
  totalProducts: number;
  promoCount: number;
  totalTransactions?: number;
  averageRating?: number;
  totalReviews?: number;
}

export default function Hero({
  settings,
  totalProducts,
  promoCount,
  totalTransactions = 1250,
  averageRating = 5.0,
  totalReviews = 36,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-zinc-800/80 bg-[#060b08]">
      {/* 1. Full-Bleed Singularity Cinematic Background Image (Vivid on Mobile & Desktop) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/singularity-hero.jpg"
          alt="Singularity Event Horizon Background"
          className="w-full h-full object-cover object-[50%_20%] sm:object-right md:object-center opacity-95 contrast-125 brightness-125 sm:brightness-115"
        />

        {/* Directional Vignette: On mobile top remains translucent so singularity shines vibrantly; on desktop left-to-right vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060b08]/20 via-[#060b08]/75 to-[#060b08] sm:bg-gradient-to-r sm:from-[#060b08] sm:via-[#060b08]/85 sm:via-45% sm:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060b08] via-transparent to-black/20 pointer-events-none" />

        {/* Subtle Topo Grid Overlay */}
        <div className="absolute inset-0 bg-topo-grid opacity-15 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Technical Top Sub-Bar (Reference 3 Inspired) */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-400 uppercase border-b border-zinc-800/90 pb-3 mb-10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00df82] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00df82]"></span>
              </span>
              ONLINE 24/7
            </span>
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-zinc-300">ROBLOX JOKI SPECIALIST</span>
          </div>

          <div className="flex items-center gap-3 text-zinc-400">
            <span>SYS // NAUUVALSTORE</span>
            <span className="text-zinc-600">※</span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="max-w-3xl">
          {/* Header Star Rating Social Proof (Requested by User) */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <a
              href="#bukti-transaksi"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-700/80 hover:border-[#00df82] text-zinc-300 text-xs font-semibold tracking-wide backdrop-blur-md transition-all group shadow-sm"
              title="Lihat Semua Testimoni & Bukti Transaksi"
            >
              <div className="flex items-center gap-0.5 text-[#00df82]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#00df82] text-[#00df82]" />
                ))}
              </div>
              <span className="font-bold font-mono text-white text-xs">
                {averageRating ? averageRating.toFixed(1) : '5.0'} / 5.0
              </span>
              <span className="text-zinc-600 font-mono">•</span>
              <span className="text-zinc-300 group-hover:text-white transition-colors text-[11px] font-mono">
                {totalReviews} Testimoni Pembeli
              </span>
            </a>

            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-700 text-zinc-300 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00df82]" />
              <span>{settings.tagline || 'TERMURAH - TERCEPAT - TERPERCAYA'}</span>
            </div>
          </div>

          {/* Main Headline - Bold & Assertive Sci-Fi Gaming Font (Requested by User) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-wider text-white uppercase font-brand-bold leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
            {settings.store_name?.toUpperCase() || 'NAUUVALSTORE'}
          </h1>

          <p className="mt-4 text-lg sm:text-xl font-bold tracking-wide text-zinc-200 uppercase">
            Joki & Kebutuhan Roblox Fisch & Blox Fruit
          </p>

          <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-2xl drop-shadow">
            Pilihan tepat untuk leveling kilat, quest rod fisch, hunting melee bloxfruit, buah fisik, dan koin fisch. 100% aman tanpa cheat script, transparan, dan stok terpantau realtime.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#catalog"
              className="px-6 py-3.5 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#00df82]/25 flex items-center gap-2 font-tech uppercase tracking-wider"
            >
              <span>Cek Katalog & Promo</span>
              <ArrowDown className="w-4 h-4" />
            </a>

            <a
              href="#bukti-transaksi"
              className="px-5 py-3.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 text-white font-bold text-xs sm:text-sm border border-zinc-700 hover:border-zinc-500 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Award className="w-4 h-4 text-[#00df82]" />
              <span>Bukti Transaksi Sukses</span>
            </a>

            <a
              href="#whatsapp-hub"
              className="px-5 py-3.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-900 text-white font-bold text-xs sm:text-sm border border-zinc-700 hover:border-zinc-500 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <Users className="w-4 h-4 text-zinc-400" />
              <span>Pusat WhatsApp</span>
            </a>
          </div>

          {/* Technical Metric Blocks (Reference 3 Inspired) */}
          <div className="mt-12 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="metallic-card p-3.5 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Security</span>
              <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">100%</p>
              <span className="text-[11px] text-zinc-300 font-semibold block">Anti Hackback</span>
            </div>

            <div className="metallic-card p-3.5 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Katalog</span>
              <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">{totalProducts}</p>
              <span className="text-[11px] text-zinc-300 font-semibold block">Layanan Ready</span>
            </div>

            {/* Eye-catching Neon Lime Promo Metric */}
            <div className="metallic-card promo-lime-border p-3.5 rounded-xl relative overflow-hidden group">
              <span className="text-[10px] font-mono font-bold flex items-center gap-1 promo-lime-text uppercase">
                <Zap className="w-3.5 h-3.5 fill-[#00df82]" />
                <span>Promo Aktif</span>
              </span>
              <p className="text-xl sm:text-2xl font-black font-mono mt-0.5 promo-lime-text">
                {promoCount}
              </p>
              <span className="text-[11px] text-zinc-200 font-bold block">Diskon Spesial</span>
            </div>

            <div className="metallic-card p-3.5 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Rating Testimoni</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 fill-[#00df82] text-[#00df82]" />
                <p className="text-xl sm:text-2xl font-black text-white font-mono">
                  {averageRating ? averageRating.toFixed(1) : '5.0'}
                </p>
                <span className="text-xs text-zinc-400 font-mono">/5.0</span>
              </div>
              <span className="text-[11px] text-zinc-300 font-semibold block">{totalReviews}+ Bukti Ulasan</span>
            </div>
          </div>
        </div>

        {/* Supported Games Bar with Fisch & Blox Fruits Logos */}
        <div className="mt-14 pt-6 border-t border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00df82]" />
              <span>SPESIALISASI GAME RESMI:</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#catalog"
                className="metallic-card px-4 py-2.5 rounded-xl flex items-center gap-3 group"
              >
                <img
                  src="/logo-fisch.png"
                  alt="Fisch Roblox"
                  className="h-7 w-auto object-contain brightness-100 group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Fisch Joki & Item</span>
              </a>

              <a
                href="#catalog"
                className="metallic-card px-4 py-2.5 rounded-xl flex items-center gap-3 group"
              >
                <img
                  src="/logo-bloxfruits.png"
                  alt="Blox Fruits Roblox"
                  className="h-7 w-auto object-contain brightness-100 group-hover:scale-105 transition-transform"
                />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Blox Fruits Joki & Fruit</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
