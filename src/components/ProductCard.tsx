'use client';

import React from 'react';
import { MessageCircle, Flame, Tag } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/store-service';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const isPromo = Boolean(
    product.is_discount || (product.original_price && product.original_price > product.price)
  );

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  const savingsAmount =
    product.original_price && product.original_price > product.price
      ? product.original_price - product.price
      : 0;

  return (
    <div
      className={`metallic-card rounded-2xl p-5 flex flex-col justify-between group relative transition-all duration-300 ${
        isPromo ? 'promo-lime-border' : ''
      }`}
    >
      <div>
        {/* Top Meta Bar (Category + Badges) */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 border border-zinc-700/80 text-zinc-300 font-minecraft">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Eye-Catching Neon Lime Promo Badge (Minecraft Gaming Font) */}
            {isPromo && (
              <span className="promo-lime-badge px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider flex items-center gap-1 font-minecraft">
                <Flame className="w-3 h-3 fill-black text-black shrink-0" />
                <span>PROMO {discountPercent ? `-${discountPercent}%` : ''}</span>
              </span>
            )}

            {/* Radar / Sonar Blip Stock Tag (Minecraft Gaming Font) */}
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border font-minecraft flex items-center gap-2 ${
                isOutOfStock
                  ? 'bg-zinc-950 text-zinc-500 border-zinc-800'
                  : isLowStock
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600/70'
                  : 'bg-zinc-950 text-zinc-100 border-zinc-700'
              }`}
            >
              {/* Radar Sonar Blip Animation */}
              {!isOutOfStock ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className={`animate-radar-blip absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isLowStock ? 'bg-amber-400' : 'bg-[#ccff00]'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isLowStock ? 'bg-amber-400' : 'bg-[#ccff00]'
                    }`}
                  />
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
              )}

              <span>
                {isOutOfStock
                  ? 'HABIS'
                  : isLowStock
                  ? `SISA ${product.stock}!`
                  : `READY: ${product.stock}`}
              </span>
            </span>
          </div>
        </div>

        {/* Product Title Only (Clean, Typographic, No Image) */}
        <h4 className="font-bold text-white text-base sm:text-lg group-hover:text-zinc-200 transition-colors leading-snug min-h-[2.5rem]">
          {product.name}
        </h4>
      </div>

      {/* Price & Action Section */}
      <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {isPromo && product.original_price && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mb-0.5">
              <span className="line-through">{formatRupiah(product.original_price)}</span>
              {savingsAmount > 0 && (
                <span className="text-[9px] font-bold text-black bg-[#ccff00] px-1.5 py-0.5 rounded font-minecraft">
                  HEMAT {formatRupiah(savingsAmount)}
                </span>
              )}
            </div>
          )}
          <div
            className={`text-xl font-black font-mono tracking-tight ${
              isPromo ? 'promo-lime-text drop-shadow-[0_0_8px_rgba(204,255,0,0.3)]' : 'text-white'
            }`}
          >
            {formatRupiah(product.price)}
          </div>
        </div>

        <button
          onClick={() => onOrder(product)}
          disabled={isOutOfStock}
          className={`py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
            isOutOfStock
              ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
              : isPromo
              ? 'bg-[#ccff00] hover:bg-[#bbf000] text-black shadow-[#ccff00]/25 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-white text-black hover:bg-zinc-200 active:scale-95'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{isOutOfStock ? 'Stok Habis' : 'Order via WA'}</span>
        </button>
      </div>
    </div>
  );
}
