'use client';

import React, { useState } from 'react';
import { MessageCircle, BellRing, Users, X, ChevronUp } from 'lucide-react';
import { StoreSettings } from '@/types';
import { buildWhatsAppConsultUrl } from '@/lib/store-service';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const [openPopup, setOpenPopup] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expandable Mini Hub */}
      {openPopup && (
        <div className="mb-3 w-72 rounded-2xl bg-zinc-950 border border-zinc-700 shadow-2xl p-4 text-xs animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-black text-white text-xs uppercase tracking-wide">
                Kontak WhatsApp Resmi
              </span>
            </div>
            <button
              onClick={() => setOpenPopup(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-white text-white flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">Direct Chat Admin</p>
                <p className="text-[10px] text-zinc-400">Order & cek ketersediaan slot</p>
              </div>
            </a>

            <a
              href={settings.wa_channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-zinc-200 text-xs">Saluran Resmi WA</p>
                <p className="text-[10px] text-zinc-500">Update promo & info diskon</p>
              </div>
            </a>

            <a
              href={settings.wa_group_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-zinc-200 text-xs">Grup Komunitas Mabar</p>
                <p className="text-[10px] text-zinc-500">Sharing info Fisch & Blox Fruit</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button (High contrast Black & White) */}
      <button
        onClick={() => setOpenPopup(!openPopup)}
        className="relative group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs shadow-2xl hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all"
        aria-label="Kontak WhatsApp"
      >
        <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">WhatsApp nauuvalstore</span>
        {openPopup ? (
          <X className="w-3.5 h-3.5 ml-0.5" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 ml-0.5 group-hover:-translate-y-0.5 transition-transform" />
        )}
      </button>
    </div>
  );
}
