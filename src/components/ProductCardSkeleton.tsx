import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="metallic-card rounded-2xl p-5 flex flex-col justify-between animate-shimmer relative overflow-hidden border border-[#143225]/60 min-h-[250px] shadow-sm select-none">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="h-6 w-28 rounded-lg bg-zinc-800/80" />
          <div className="h-6 w-20 rounded-md bg-zinc-800/80" />
        </div>

        {/* Title Lines */}
        <div className="space-y-2 mt-4">
          <div className="h-5 w-5/6 rounded-md bg-zinc-800/90" />
          <div className="h-4 w-1/2 rounded-md bg-zinc-800/60" />
        </div>
      </div>

      {/* Price & Action Section */}
      <div className="mt-6 pt-4 border-t border-[#143225]/40 flex flex-col gap-3">
        <div>
          <div className="h-3.5 w-24 rounded bg-zinc-800/50 mb-2" />
          <div className="h-8 w-36 rounded-md bg-zinc-800/90" />
        </div>

        {/* Buttons Skeleton */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="h-10 rounded-xl bg-zinc-800/70" />
          <div className="h-10 rounded-xl bg-zinc-800/80" />
        </div>
      </div>
    </div>
  );
}
