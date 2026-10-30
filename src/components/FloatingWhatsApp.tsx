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
} from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const [openPopup, setOpenPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(settings.wa_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Expandable Mini Hub with Assertive & Sleek Design */}
      {openPopup && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-84 max-w-sm rounded-2xl bg-[#0c0d12] border-2 border-zinc-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(204,255,0,0.15)] p-4 sm:p-5 text-xs animate-in slide-in-from-bottom-3 duration-200 backdrop-blur-xl relative overflow-hidden">
          {/* Top subtle neon lime glow line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00df82] to-transparent opacity-80" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-radar-blip-fast absolute inline-flex h-full w-full rounded-full bg-[#00df82] opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00df82]" />
              </span>
              <div>
                <span className="font-black text-white text-xs uppercase tracking-wider block font-mono">
                  PUSAT BANTUAN RESMI
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  nauuvalstore // Respon &lt; 3 Menit
                </span>
              </div>
            </div>
            <button
              onClick={() => setOpenPopup(false)}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Primary Action: Direct CS Order */}
            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-[#00df82] hover:bg-[#00c774] text-black flex items-center justify-between shadow-[0_0_18px_rgba(204,255,0,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black text-[#00df82] flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-5 h-5 text-[#00df82]" />
                </div>
                <div className="text-left">
                  <p className="font-black text-xs uppercase tracking-wide leading-tight text-black font-mono">
                    CHAT DIRECT PEMESANAN
                  </p>
                  <p className="text-[10px] font-bold text-zinc-800 mt-0.5">
                    Order Joki, Beli Item &amp; Cek Slot Kilat
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Secondary Action: Saluran WA */}
            <a
              href={settings.wa_channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl metallic-card hover:border-zinc-500 text-white flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#00df82] shrink-0">
                  <BellRing className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-black text-white text-xs uppercase tracking-wide font-mono">
                    SALURAN WHATSAPP
                  </p>
                  <p className="text-[10px] text-zinc-400">Notifikasi restock kilat &amp; info promo</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </a>

            {/* Tertiary Action: Grup Komunitas */}
            <a
              href={settings.wa_group_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl metallic-card hover:border-zinc-500 text-white flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-black text-white text-xs uppercase tracking-wide font-mono">
                    GRUP KOMUNITAS MABAR
                  </p>
                  <p className="text-[10px] text-zinc-400">Diskusi pemain Fisch &amp; Blox Fruit</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Bottom Direct Number Bar */}
          <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">NOMOR RESMI:</span>
              <span className="font-mono font-bold text-white text-xs">
                +{settings.wa_number.replace(/(\d{2})(\d{3})(\d{4})(\d+)/, '$1 $2-$3-$4')}
              </span>
            </div>
            <button
              onClick={handleCopyNumber}
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-[#00df82]" />
                  <span className="text-[#00df82]">Tersalin!</span>
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

      {/* Main Floating Trigger Button (Bold, Assertive, Eye-Catching) */}
      <button
        onClick={() => setOpenPopup(!openPopup)}
        className="relative group flex items-center gap-2.5 sm:gap-3 p-1.5 sm:p-2 pr-3.5 sm:pr-5 rounded-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border-2 border-[#00df82] text-white shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_22px_rgba(204,255,0,0.35)] hover:shadow-[0_0_30px_rgba(204,255,0,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Pesan via WhatsApp Resmi"
      >
        {/* Glowing Radar Icon Capsule */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#00df82] text-black flex items-center justify-center font-black shrink-0 shadow-md">
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          <span className="animate-radar-blip-fast absolute -top-0.5 -right-0.5 inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#00df82] opacity-80" />
          <span className="absolute -top-0.5 -right-0.5 inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-[#00df82] border-2 border-black" />
        </div>

        {/* Assertive Bold Text (Always clearly visible on mobile & desktop) */}
        <div className="text-left flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00df82] animate-pulse" />
            <span className="text-[9px] font-black tracking-widest text-[#00df82] uppercase font-mono">
              ONLINE 24/7
            </span>
          </div>
          <span className="font-black text-white text-xs sm:text-sm tracking-wider uppercase font-mono leading-tight">
            PESAN VIA WHATSAPP
          </span>
        </div>

        {/* Toggle Arrow */}
        <div className="ml-0.5 text-zinc-400 group-hover:text-white transition-colors">
          {openPopup ? (
            <X className="w-4 h-4 text-[#00df82]" />
          ) : (
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          )}
        </div>
      </button>
    </div>
  );
}
