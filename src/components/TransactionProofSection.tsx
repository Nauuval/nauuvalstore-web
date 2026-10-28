'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Star, ShieldCheck, Eye, X, Image as ImageIcon } from 'lucide-react';
import { TransactionProof } from '@/types';
import { formatRupiah } from '@/lib/store-service';

interface TransactionProofSectionProps {
  transactions: TransactionProof[];
}

export default function TransactionProofSection({ transactions }: TransactionProofSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (!transactions || transactions.length === 0) return null;

  return (
    <section id="bukti-transaksi" className="py-14 sm:py-20 relative bg-[#08090d] border-b border-zinc-800/80 scroll-mt-20">
      {/* Background Topo */}
      <div className="absolute inset-0 bg-topo-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold mb-3 tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>TESTIMONI & BUKTI REALTIME</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
              Bukti Transaksi Sukses
            </h2>
            <p className="mt-2 text-zinc-400 text-xs sm:text-sm">
              Geser ke samping untuk melihat bukti pengerjaan joki & pembelian item yang telah berhasil.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl metallic-card hover:border-white text-zinc-300 hover:text-white transition-all active:scale-95"
              aria-label="Geser ke Kiri"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl metallic-card hover:border-white text-zinc-300 hover:text-white transition-all active:scale-95"
              aria-label="Geser ke Kanan"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Carousel with Animation */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {transactions.map((trx) => (
            <div
              key={trx.id}
              className="metallic-card rounded-2xl p-5 min-w-[280px] sm:min-w-[340px] max-w-[360px] snap-start flex flex-col justify-between group hover:border-[#ccff00]/60 transition-all duration-300 relative"
            >
              <div>
                {/* Header Row: Buyer & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-white uppercase">
                      {trx.buyer_name.charAt(0)}
                    </span>
                    <div>
                      <span className="font-mono font-bold text-white text-xs block">
                        {trx.buyer_name}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {trx.date || 'Baru saja'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 border border-zinc-800 text-zinc-400 font-mono uppercase">
                    {trx.category}
                  </span>
                </div>

                {/* Service Name & Amount */}
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 mb-3">
                  <p className="font-bold text-zinc-200 text-xs sm:text-sm line-clamp-1">
                    {trx.service_name}
                  </p>
                  <p className="text-sm font-black text-white font-mono mt-1">
                    {formatRupiah(trx.amount)}
                  </p>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(trx.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#ccff00] text-[#ccff00]" />
                  ))}
                  <span className="text-[11px] font-mono text-zinc-400 ml-1.5 font-bold">5.0 / 5.0</span>
                </div>

                {/* Buyer Testimonial Note */}
                {trx.notes && (
                  <p className="text-xs text-zinc-400 italic line-clamp-2 leading-relaxed mb-4">
                    &ldquo;{trx.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Clickable Proof Screenshot Preview */}
              {trx.image_url && (
                <div className="pt-3 border-t border-zinc-800/80">
                  <button
                    onClick={() => setSelectedImage(trx.image_url)}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors group/btn"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#ccff00] group-hover/btn:scale-110 transition-transform" />
                    <span>Lihat Bukti Transaksi</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Full Proof View */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full rounded-2xl bg-zinc-950 border border-zinc-800 p-4 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-700 transition-colors z-10"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="rounded-xl overflow-hidden bg-black max-h-[80vh] flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Bukti Transaksi"
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs font-mono text-zinc-400">
                Bukti Pengerjaan & Transaksi Resmi nauuvalstore
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
