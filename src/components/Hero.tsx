'use client';

import React from 'react';
import { ArrowDown, Users, ShieldCheck, Zap, Radio, Sparkles } from 'lucide-react';
import { StoreSettings } from '@/types';

interface HeroProps {
  settings: StoreSettings;
  totalProducts: number;
  promoCount: number;
}

export default function Hero({ settings, totalProducts, promoCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-zinc-800/80 bg-[#08090d]">
      {/* Topo / Wireframe Grid Background (Reference Image 3 Inspiration) */}
      <div className="absolute inset-0 bg-topo-grid opacity-30 pointer-events-none" />

      {/* Subtle radial lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Technical Sub-bar Header (Reference 3 Inspired) */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-zinc-500 uppercase border-b border-zinc-800/80 pb-3 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-zinc-300 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE 24/7
            </span>
            <span className="text-zinc-700 hidden sm:inline">/</span>
            <span className="hidden sm:inline">ROBLOX GAMING SPECIALIST</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-400">
            <span>SYS // SINGULARITY</span>
            <span className="text-zinc-600">※</span>
          </div>
        </div>

        {/* Main Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Headline & Technical Info (7 cols) */}
          <div className="lg:col-span-7 text-left">
            {/* Slogan Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700 text-zinc-300 text-xs font-bold mb-5 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>{settings.tagline || 'TERMURAH - TERCEPAT - TERPERCAYA'}</span>
            </div>

            {/* Brand Title with High-Tech Styling */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-mono leading-none">
              {settings.store_name || 'nauuvalstore'}
            </h1>

            <p className="mt-4 text-base sm:text-lg font-bold tracking-wide text-zinc-300 uppercase">
              Joki & Kebutuhan Roblox Fisch & Blox Fruit
            </p>

            <p className="mt-3 text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-xl">
              Solusi leveling akun tercepat, unlock quest rod mythic fisch, hunting melee godhuman & buah fisik blox fruit. Pengerjaan manual pro player, anti cheat script, dan pantauan stok realtime.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a
                href="#catalog"
                className="px-6 py-3.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md flex items-center gap-2"
              >
                <span>Cek Katalog & Promo</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#whatsapp-hub"
                className="px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-zinc-700 hover:border-zinc-500 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-zinc-400" />
                <span>Saluran & Komunitas WA</span>
              </a>
            </div>

            {/* Technical Metric Blocks (Reference Image 3 Inspiration) */}
            <div className="mt-10 pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Security</span>
                <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">100%</p>
                <span className="text-[11px] text-zinc-300 font-semibold block">Anti Hackback</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-mono block">Katalog</span>
                <p className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">{totalProducts}</p>
                <span className="text-[11px] text-zinc-300 font-semibold block">Layanan Ready</span>
              </div>

              {/* Eye-catching Promo Metric */}
              <div className="p-3 rounded-xl bg-zinc-900/90 border border-amber-500/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] text-amber-400 uppercase font-mono font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  <span>Promo</span>
                </span>
                <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-0.5">
                  {promoCount}
                </p>
                <span className="text-[11px] text-amber-300 font-bold block">Diskon Spesial</span>
              </div>
            </div>
          </div>

          {/* Right Side: Realistic Black Hole Singularity Visual (5 cols) */}
          {/* User specifically asked to replace store logo with the uploaded singularity-hero.jpg */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full aspect-video sm:aspect-square max-w-md rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl group metallic-card p-1">
              {/* Inner container with realistic singularity photo */}
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                <img
                  src="/singularity-hero.jpg"
                  alt="Singularity Event Horizon"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-110"
                />

                {/* Vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Technical Coordinates / Watermark (Reference Image 3 Inspiration) */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                  EVENT HORIZON // GARGANTUA
                </div>

                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>SINGULARITY REALTIME</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Games Bar with Fisch & Blox Fruits Logos */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>SPESIALISASI GAME RESMI:</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {/* Fisch Badge */}
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

              {/* Blox Fruits Badge */}
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
