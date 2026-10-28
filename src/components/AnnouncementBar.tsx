'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  text: string;
  onExploreClick?: () => void;
}

export default function AnnouncementBar({ text, onExploreClick }: AnnouncementBarProps) {
  if (!text) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-950 border-b border-violet-800/40 py-2.5 px-4 text-xs sm:text-sm">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-center sm:text-left relative z-10">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 font-medium text-slate-200">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 hidden sm:inline" />
          <span className="line-clamp-1">{text}</span>
        </div>

        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span>Cek Promo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
