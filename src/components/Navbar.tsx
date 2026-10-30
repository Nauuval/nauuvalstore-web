'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Shield, Menu, X, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  settings: StoreSettings;
}

export default function Navbar({ settings }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();

  const navLinks = [
    { name: 'Bukti & Ulasan', href: '#bukti-transaksi' },
    { name: 'Pusat WhatsApp', href: '#whatsapp-hub' },
    { name: 'Katalog & Promo', href: '#catalog' },
    { name: 'Cara Order', href: '#how-to-order' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#060b08]/90 border-b border-[#143224]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#081711] border border-[#14402d] p-1 flex items-center justify-center overflow-hidden group-hover:border-[#00df82] transition-colors">
              <img
                src="/logo-store.png"
                alt="nauuvalstore logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white font-mono uppercase group-hover:text-emerald-300 transition-colors">
                  {settings.store_name || 'nauuvalstore'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#061d14] border border-[#14422e] text-[#00df82] font-bold font-tech uppercase tracking-wider hidden sm:inline-block">
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
                className="hover:text-[#00df82] transition-colors py-1 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00df82] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              type="button"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#071911] border border-[#143d2c] hover:border-[#00df82] transition-all flex items-center gap-2 relative group"
              title="Buka Keranjang Pesanan"
            >
              <ShoppingCart className="w-4 h-4 text-[#00df82] group-hover:scale-110 transition-transform" />
              <span className="font-tech uppercase tracking-wide">Keranjang</span>
              {totalItems > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#00df82] text-[#03140d] font-bold font-price text-[10px] animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            <Link
              href="/admin"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-[#081711] border border-[#143929] hover:border-[#00df82]/50 transition-all flex items-center gap-1.5"
              title="Admin Panel"
            >
              <Shield className="w-3.5 h-3.5 text-[#00df82]" />
              <span>Admin Panel</span>
            </Link>

            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#00df82]/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-tech uppercase tracking-wide"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#03140d]" />
              <span>Chat Admin WA</span>
            </a>
          </div>

          {/* Mobile Header Elements */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Cart Trigger */}
            <button
              onClick={openCart}
              type="button"
              className="p-2 rounded-xl text-white bg-[#071911] border border-[#143d2c] relative"
              aria-label="Buka Keranjang"
            >
              <ShoppingCart className="w-4 h-4 text-[#00df82]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-[#00df82] text-[#03140d] font-bold font-price text-[9px] flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

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
