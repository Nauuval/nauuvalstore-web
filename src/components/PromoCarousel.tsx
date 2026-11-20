'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Flame, ChevronLeft, ChevronRight, Sparkles, Pause, Play } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface PromoCarouselProps {
  promoProducts: Product[];
  onOrderProduct: (product: Product) => void;
}

export default function PromoCarousel({
  promoProducts,
  onOrderProduct,
}: PromoCarouselProps) {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Determine items per page based on responsive breakpoints
  // On desktop: 3, on tablet: 2, on mobile: 1
  const [itemsPerView, setItemsPerView] = useState<number>(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = promoProducts.length;

  // Auto-rotate every 5 seconds when not paused
  useEffect(() => {
    if (isPaused || total <= itemsPerView) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4800);

    return () => clearInterval(timer);
  }, [isPaused, total, itemsPerView, startIndex]);

  const handleNext = () => {
    if (total <= itemsPerView) return;
    setDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setStartIndex((prev) => (prev + 1) % total);
      setIsTransitioning(false);
    }, 180);
  };

  const handlePrev = () => {
    if (total <= itemsPerView) return;
    setDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setStartIndex((prev) => (prev - 1 + total) % total);
      setIsTransitioning(false);
    }, 180);
  };

  // Get current slice with wrap-around
  const visibleProducts = useMemo(() => {
    if (total === 0) return [];
    if (total <= itemsPerView) return promoProducts;

    const list: Product[] = [];
    for (let i = 0; i < itemsPerView; i++) {
      const idx = (startIndex + i) % total;
      list.push(promoProducts[idx]);
    }
    return list;
  }, [promoProducts, startIndex, itemsPerView, total]);

  if (total === 0) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black promo-lime-border relative overflow-hidden group shadow-[0_0_30px_rgba(0,223,130,0.15)] animate-promo-aura"
    >
      {/* Ambient neon lime background glow */}
      <div className="absolute -top-12 -right-12 w-56 h-56 bg-[#00df82]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-[#00df82]/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-zinc-800/90 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="promo-lime-badge px-3 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 uppercase tracking-wide font-tech shadow-md shadow-[#00df82]/20">
            <Flame className="w-4 h-4 fill-black text-black shrink-0 animate-pulse" />
            <span>⚡ PRODUK PROMO SPESIAL</span>
          </span>
          <span className="text-xs text-zinc-300 font-semibold hidden sm:inline">
            • Diskon Terbatas Sedang Berlangsung!
          </span>
        </div>

        {/* Carousel Controls (Counter & Navigation Arrows) */}
        <div className="flex items-center gap-2">
          {/* Pause / Live indicator */}
          <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2 py-1 rounded-md hidden md:flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-[#00df82] animate-ping'}`} />
            <span>{isPaused ? 'Dijeda' : 'Auto-Rotate'}</span>
          </span>

          <span className="text-xs font-mono font-bold text-black bg-[#00df82] px-2.5 py-1 rounded-lg shadow-sm">
            {total} Layanan Promo
          </span>

          {total > itemsPerView && (
            <div className="flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-[#00df82] hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
                aria-label="Promo Sebelumnya"
                title="Lihat promo sebelumnya"
              >
                <ChevronLeft className="w-4 h-4 text-[#00df82]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-[#00df82] hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
                aria-label="Promo Selanjutnya"
                title="Lihat promo selanjutnya"
              >
                <ChevronRight className="w-4 h-4 text-[#00df82]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rotating Products Grid with Smooth Transition */}
      <div
        className={`grid gap-4 relative z-10 transition-all duration-300 ${
          isTransitioning
            ? direction === 'right'
              ? 'opacity-40 translate-x-2 scale-[0.99]'
              : 'opacity-40 -translate-x-2 scale-[0.99]'
            : 'opacity-100 translate-x-0 scale-100'
        } ${
          itemsPerView === 1
            ? 'grid-cols-1'
            : itemsPerView === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {visibleProducts.map((product, idx) => (
          <div
            key={`promo-slot-${idx}-${product.id}`}
            className="animate-stagger-item"
            style={{ animationDelay: `${idx * 70}ms` }}
          >
            <ProductCard
              product={product}
              onOrder={onOrderProduct}
            />
          </div>
        ))}
      </div>

      {/* Bottom Progress Bar & Dot Indicators */}
      {total > itemsPerView && (
        <div className="mt-5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5">
            {promoProducts.map((p, idx) => {
              const isActive =
                (idx >= startIndex && idx < startIndex + itemsPerView) ||
                (startIndex + itemsPerView > total && idx < (startIndex + itemsPerView) % total);
              return (
                <button
                  key={`dot-${p.id}`}
                  type="button"
                  onClick={() => setStartIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 bg-[#00df82] shadow-[0_0_8px_rgba(0,223,130,0.8)]'
                      : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                  aria-label={`Beralih ke promo ${idx + 1}`}
                />
              );
            })}
          </div>

          <span className="text-[11px] font-mono text-zinc-400">
            Menampilkan {startIndex + 1}–{Math.min(startIndex + itemsPerView, total)} dari {total} promo
          </span>
        </div>
      )}
    </div>
  );
}
