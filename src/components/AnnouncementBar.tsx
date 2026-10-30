'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  text: string;
  onExploreClick?: () => void;
}

export default function AnnouncementBar({ text, onExploreClick }: AnnouncementBarProps) {
  if (!text) return null;

  return (
    <div className="relative bg-[#040806] border-b border-[#143224] py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-center sm:text-left relative z-10">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0 font-medium text-zinc-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00df82] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00df82]"></span>
          </span>
          <span className="line-clamp-1 font-semibold text-white tracking-wide">{text}</span>
        </div>

        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#00df82] hover:text-[#00c774] transition-colors shrink-0 underline underline-offset-4 font-pixel"
          >
            <span>Lihat Promo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
