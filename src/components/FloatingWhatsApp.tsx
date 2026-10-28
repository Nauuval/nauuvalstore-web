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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expandable Mini Hub */}
      {openPopup && (
        <div className="mb-3 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl shadow-emerald-950/50 p-4 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white text-sm">Pusat Bantuan WA</span>
            </div>
            <button
              onClick={() => setOpenPopup(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <a
              href={buildWhatsAppConsultUrl(settings.wa_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600/40 hover:border-emerald-500 text-slate-200 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-emerald-300 text-xs">Direct Chat Admin</p>
                <p className="text-[10px] text-slate-400">Konsultasi order & cek slot</p>
              </div>
            </a>

            <a
              href={settings.wa_channel_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500 text-slate-200 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-violet-300 text-xs">Saluran Resmi WA</p>
                <p className="text-[10px] text-slate-400">Update promo & flash sale</p>
              </div>
            </a>

            <a
              href={settings.wa_group_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-200 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-cyan-300 text-xs">Grup Komunitas Mabar</p>
                <p className="text-[10px] text-slate-400">Sharing info Fisch & Blox Fruit</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setOpenPopup(!openPopup)}
        className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Kontak WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Pesan via WhatsApp</span>
        {openPopup ? (
          <X className="w-4 h-4 ml-1" />
        ) : (
          <ChevronUp className="w-4 h-4 ml-1 group-hover:-translate-y-0.5 transition-transform" />
        )}
      </button>
    </div>
  );
}
