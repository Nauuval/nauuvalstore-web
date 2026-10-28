'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Shield, Menu, X, Sparkles, Orbit } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface NavbarProps {
  settings: StoreSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Katalog Produk', href: '#catalog' },
    { name: '⚡ Flash Sale', href: '#flash-sale' },
    { name: 'Saluran & Komunitas', href: '#whatsapp-hub' },
    { name: 'Cara Order', href: '#how-to-order' },
    { name: 'Keunggulan', href: '#why-us' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-700 to-cyan-500 p-0.5 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                {/* Singularity core glow */}
                <div className="absolute w-4 h-4 bg-violet-500 rounded-full blur-[2px] opacity-80" />
                <Orbit className="w-5 h-5 text-cyan-300 relative z-10 animate-singularity-spin" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-cyan-300 font-mono">
                  {settings.store_name || 'SINGULARITY'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-700/50 text-violet-300 font-bold uppercase tracking-wider hidden sm:inline-block">
                  STORE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Joki Fisch & Blox Fruit Roblox
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-cyan-400 transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-all flex items-center gap-1.5"
              title="Admin Panel Toko"
            >
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>Admin Panel</span>
            </Link>

            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold rounded-xl group bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
              <span className="relative px-3.5 py-2 transition-all ease-out bg-slate-950 rounded-[10px] group-hover:bg-opacity-0 flex items-center gap-1.5 text-white">
                <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                <span>Chat Admin WA</span>
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 text-xs"
              title="Admin"
            >
              <Shield className="w-4 h-4 text-violet-400" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Admin WhatsApp</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium text-center flex items-center justify-center gap-2 text-sm"
            >
              <Shield className="w-4 h-4 text-violet-400" />
              <span>Buka Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
