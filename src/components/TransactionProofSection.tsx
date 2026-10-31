'use client';

import React, { useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  Eye,
  X,
  PlusCircle,
  MessageSquarePlus,
} from 'lucide-react';
import { TransactionProof } from '@/types';
import { formatRupiah, saveTransactionProof, formatReviewDate } from '@/lib/store-service';
import SubmitReviewModal from './SubmitReviewModal';

interface TransactionProofSectionProps {
  transactions: TransactionProof[];
  onTransactionsUpdate?: (updated: TransactionProof[]) => void;
}

export default function TransactionProofSection({
  transactions,
  onTransactionsUpdate,
}: TransactionProofSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [localTransactions, setLocalTransactions] = useState<TransactionProof[]>(transactions);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync if prop updates
  React.useEffect(() => {
    setLocalTransactions(transactions);
  }, [transactions]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleAddReview = async (proof: Partial<TransactionProof>): Promise<boolean> => {
    try {
      const saved = await saveTransactionProof(proof as any);
      if (saved) {
        const updated = [saved, ...localTransactions];
        setLocalTransactions(updated);
        onTransactionsUpdate?.(updated);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <section id="bukti-transaksi" className="py-14 sm:py-20 relative bg-[#060b08] border-b border-[#143224] scroll-mt-20">
      {/* Background Topo */}
      <div className="absolute inset-0 bg-topo-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Actions & Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#061e14] border border-[#14422e] text-[#00df82] text-xs font-bold mb-3 tracking-widest uppercase font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00df82]" />
              <span>TESTIMONI & BUKTI REALTIME</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
              Bukti Transaksi & Ulasan
            </h2>
            <p className="mt-2 text-zinc-400 text-xs sm:text-sm">
              Geser ke samping untuk melihat bukti joki & pembelian item. Anda juga dapat mengirimkan ulasan langsung.
            </p>
          </div>

          {/* Action: Add Review Button + Carousel Arrows */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* Customer Review Button */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-black text-xs flex items-center gap-2 shadow-lg shadow-[#00df82]/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-tech uppercase tracking-wide"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>+ Tulis Testimoni & Ulasan</span>
            </button>

            {/* Carousel Arrows */}
            {localTransactions.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="p-2.5 rounded-xl metallic-card hover:border-[#00df82] text-zinc-300 hover:text-white transition-all active:scale-95"
                  aria-label="Geser ke Kiri"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="p-2.5 rounded-xl metallic-card hover:border-[#00df82] text-zinc-300 hover:text-white transition-all active:scale-95"
                  aria-label="Geser ke Kanan"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State when no transactions exist */}
        {localTransactions.length === 0 ? (
          <div className="metallic-card rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto my-6 border border-[#16382b]">
            <div className="w-14 h-14 rounded-2xl bg-[#00df82]/10 border border-[#00df82]/30 text-[#00df82] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="text-white font-bold text-lg mb-1 font-mono">
              Belum Ada Ulasan Pembeli
            </h4>
            <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Jadilah pembeli pertama yang memberikan testimoni dan rating untuk Nauuvalstore! Ulasan Anda langsung tampil live di sini.
            </p>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#00df82] text-[#03140d] font-bold text-xs inline-flex items-center gap-2 hover:bg-[#00c774] transition-all shadow-md shadow-[#00df82]/25 font-tech uppercase tracking-wide"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>+ Berikan Testimoni Sekarang</span>
            </button>
          </div>
        ) : (
          /* Horizontal Scrollable Carousel */
          <div
            ref={scrollRef}
            className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
          >
            {localTransactions.map((trx) => (
              <div
                key={trx.id}
                className="metallic-card rounded-2xl p-5 min-w-[280px] sm:min-w-[340px] max-w-[360px] snap-start flex flex-col justify-between group hover:border-[#00df82]/60 transition-all duration-300 relative"
              >
                <div>
                  {/* Header Row: Buyer & Category */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#061d14] border border-[#133d2b] flex items-center justify-center text-xs font-mono font-bold text-[#00df82] uppercase">
                        {trx.buyer_name.charAt(0)}
                      </span>
                      <div>
                        <span className="font-mono font-bold text-white text-xs block">
                          {trx.buyer_name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {isMounted ? formatReviewDate(trx.date, trx.created_at, trx.id) : (trx.date || 'Hari ini')}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#061811] border border-[#143d2c] text-[#00df82] font-mono uppercase">
                      {trx.category}
                    </span>
                  </div>

                  {/* Service Name & Amount */}
                  <div className="p-3 rounded-xl bg-[#060e0a] border border-[#133224] mb-3">
                    <p className="font-bold text-zinc-200 text-xs sm:text-sm line-clamp-1">
                      {trx.service_name}
                    </p>
                    {trx.amount > 0 && (
                      <p className="text-sm font-bold text-[#00df82] font-price mt-1">
                        {formatRupiah(trx.amount)}
                      </p>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(trx.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#00df82] text-[#00df82]" />
                    ))}
                    <span className="text-[11px] font-mono text-zinc-400 ml-1.5 font-bold">
                      {trx.rating || 5}.0 / 5.0
                    </span>
                  </div>

                  {/* Buyer Testimonial Note */}
                  {trx.notes && (
                    <p className="text-xs text-zinc-300 italic line-clamp-2 leading-relaxed mb-4">
                      &ldquo;{trx.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Clickable Proof Screenshot Preview */}
                {trx.image_url && (
                  <div className="pt-3 border-t border-[#143224]">
                    <button
                      onClick={() => setSelectedImage(trx.image_url)}
                      className="w-full py-2 px-3 rounded-xl bg-[#081812] hover:bg-[#0d271d] border border-[#153c2b] text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors group/btn"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#00df82] group-hover/btn:scale-110 transition-transform" />
                      <span>Lihat Bukti Foto</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

      {/* Customer Review & File Upload Modal */}
      <SubmitReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleAddReview}
      />
    </section>
  );
}
