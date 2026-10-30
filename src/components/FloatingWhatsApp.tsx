'use client';

import React, { useState } from 'react';
import {
  MessageCircle,
  BellRing,
  Users,
  X,
  ChevronUp,
  ArrowUpRight,
  Copy,
  Check,
  ShoppingCart,
} from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl, formatRupiah } from '@/lib/store-service';
import { useCart } from '@/context/CartContext';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const [openPopup, setOpenPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const { totalItems, totalPrice, openCart } = useCart();

  const handleCopyNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.wa_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Mobile Backdrop when popup is active */}
      {openPopup && (
        <div
          onClick={() => setOpenPopup(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden animate-in fade-in duration-200"
        />
      )}

      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        {/* Expandable Mini Hub with Authentic WhatsApp Branding (Distinct & Non-Intrusive) */}
        {openPopup && (
          <div className="mb-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm rounded-2xl bg-[#0a0f0d] border border-[#1b4332] shadow-[0_12px_45px_rgba(0,0,0,0.9),0_0_20px_rgba(37,211,102,0.15)] p-4 text-xs animate-in slide-in-from-bottom-3 duration-200 backdrop-blur-xl relative overflow-hidden">
            {/* Top WhatsApp Emerald Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#25D366] to-transparent opacity-90" />

            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#143224] mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]" />
                </span>
                <div>
                  <span className="font-bold text-white text-xs uppercase tracking-wide block font-mono">
                    Pusat Bantuan WhatsApp
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Admin Aktif 24 Jam • Respon Kilat
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpenPopup(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white bg-[#0e1a14] border border-[#1b3d2c] transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Primary Action: Direct CS Order with Authentic WhatsApp Green */}
              <a
                href={buildWhatsAppConsultUrl(settings.wa_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-[#051a0e] flex items-center justify-between shadow-[0_4px_16px_rgba(37,211,102,0.3)] transition-all hover:scale-[1.01] active:scale-[0.98] group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#051a0e] text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs uppercase tracking-wide leading-tight text-[#051a0e] font-tech">
                      Chat CS &amp; Konsultasi
                    </p>
                    <p className="text-[10px] font-semibold text-[#0a2e1a] mt-0.5">
                      Tanya antrean, nego &amp; cek slot kilat
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#051a0e] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Secondary Action: Saluran WA */}
              <a
                href={settings.wa_channel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#091510] hover:bg-[#0f241a] border border-[#143d2b] text-white flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#050e0a] border border-[#1b4431] flex items-center justify-center text-[#25D366] shrink-0">
                    <BellRing className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-xs font-tech tracking-wide">
                      Saluran WhatsApp Resmi
                    </p>
                    <p className="text-[10px] text-zinc-400">Info restock &amp; diskon khusus member</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              </a>

              {/* Tertiary Action: Grup Komunitas */}
              <a
                href={settings.wa_group_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#091510] hover:bg-[#0f241a] border border-[#143d2b] text-white flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#050e0a] border border-[#1b4431] flex items-center justify-center text-zinc-300 shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-xs font-tech tracking-wide">
                      Grup Komunitas Mabar
                    </p>
                    <p className="text-[10px] text-zinc-400">Mabar Fisch &amp; Blox Fruit santai</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Bottom Direct Number Bar */}
            <div className="mt-3 pt-2.5 border-t border-[#143224] flex items-center justify-between">
              <div>
                <span className="text-[9px] text-zinc-500 block uppercase font-mono">NOMOR RESMI:</span>
                <span className="font-mono font-bold text-white text-xs">
                  +{settings.wa_number.replace(/(\d{2})(\d{3})(\d{4})(\d+)/, '$1 $2-$3-$4')}
                </span>
              </div>
              <button
                onClick={handleCopyNumber}
                className="px-2.5 py-1 rounded-lg bg-[#0e1f17] hover:bg-[#153023] border border-[#1e4834] text-zinc-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#25D366]" />
                    <span className="text-[#25D366]">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Action Row: Floating Cart Pill (if items exist) + WhatsApp Trigger */}
        <div className="flex items-center gap-2">
          {/* Floating Cart Trigger Pill (Only shows when customer has items in cart) */}
          {totalItems > 0 && (
            <button
              onClick={openCart}
              type="button"
              className="flex items-center gap-2 h-11 px-3.5 rounded-full bg-[#081711] border-2 border-[#00df82] text-white shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(0,223,130,0.25)] hover:bg-[#0e2c1e] hover:scale-105 active:scale-95 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2"
              title="Buka Keranjang Pesanan"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-[#00df82]" />
                <span className="absolute -top-1.5 -right-2 px-1 min-w-[1rem] h-4 rounded-full bg-[#00df82] text-black font-bold font-price text-[9px] flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div className="text-left hidden xs:block">
                <span className="text-xs font-bold text-white font-price block leading-none">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </button>
          )}

          {/* Refined WhatsApp Button: Compact circle on mobile, sleek pill on desktop */}
          <button
            onClick={() => setOpenPopup(!openPopup)}
            className="group flex items-center gap-2 h-11 px-2.5 sm:px-3.5 rounded-full bg-[#071911] border-2 border-[#25D366] text-white shadow-[0_4px_22px_rgba(0,0,0,0.85),0_0_16px_rgba(37,211,102,0.25)] hover:bg-[#0c291c] hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Pusat Bantuan WhatsApp Resmi"
          >
            {/* WhatsApp Green Icon Circle */}
            <div className="w-7 h-7 rounded-full bg-[#25D366] text-[#051a0e] flex items-center justify-center font-bold shrink-0 shadow-sm relative">
              <MessageCircle className="w-4 h-4 text-[#051a0e]" />
              <span className="animate-ping absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-[#25D366] opacity-75" />
              <span className="absolute -top-0.5 -right-0.5 inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </div>

            {/* Label (Hidden on small mobile screens to keep it ultra compact, visible on desktop) */}
            <div className="text-left hidden sm:flex flex-col justify-center">
              <span className="text-[9px] font-bold tracking-widest text-[#25D366] uppercase font-mono leading-none">
                ONLINE 24/7
              </span>
              <span className="font-bold text-white text-xs tracking-wide uppercase font-tech leading-tight mt-0.5">
                Bantuan WA
              </span>
            </div>

            {/* Toggle Icon */}
            <div className="text-zinc-400 group-hover:text-white transition-colors ml-0.5">
              {openPopup ? (
                <X className="w-3.5 h-3.5 text-[#25D366]" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </div>
          </button>
        </div>
      </div>
    </>
  );
}