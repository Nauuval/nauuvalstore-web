'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Shield, Menu, X, ArrowUpRight } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface NavbarProps {
  settings: StoreSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Bukti & Ulasan', href: '#bukti-transaksi' },
    { name: 'Pusat WhatsApp', href: '#whatsapp-hub' },
    { name: 'Katalog & Promo', href: '#catalog' },
    { name: 'Cara Order', href: '#how-to-order' },
    { name: 'Keunggulan', href: '#why-us' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/85 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-900 border border-zinc-700/80 p-1 flex items-center justify-center overflow-hidden group-hover:border-white transition-colors">
              <img
                src="/logo-store.png"
                alt="nauuvalstore logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white font-mono uppercase">
                  {settings.store_name || 'nauuvalstore'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold uppercase tracking-wider hidden sm:inline-block">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
                {settings.tagline || 'TERMURAH - TERCEPAT - TERPERCAYA'}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-400">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-white transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all flex items-center gap-1.5"
              title="Admin Panel"
            >
              <Shield className="w-3.5 h-3.5 text-zinc-300" />
              <span>Admin Panel</span>
            </Link>

            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat Admin WA</span>
            </a>
          </div>

          {/* Mobile Header Elements */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 text-xs"
              title="Admin"
            >
              <Shield className="w-4 h-4 text-zinc-300" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2.5">
            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-bold text-center flex items-center justify-center gap-2 text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Admin WhatsApp</span>
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-center flex items-center justify-center gap-2 text-xs"
            >
              <Shield className="w-4 h-4 text-zinc-400" />
              <span>Buka Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
