'use client';

import React from 'react';
import { MessageCircle, Zap, Flame, Tag } from 'lucide-react';
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
        isPromo ? 'promo-border-glow' : ''
      }`}
    >
      <div>
        {/* Top Meta Bar (Category + Badges) */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-black/60 border border-zinc-700/80 text-zinc-300 font-mono">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Eye-Catching Promo Badge (Vibrant High-Converting Contrast) */}
            {isPromo && (
              <span className="promo-badge-glow px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                <span>PROMO {discountPercent ? `-${discountPercent}%` : ''}</span>
              </span>
            )}

            {/* Stock Tag */}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
                isOutOfStock
                  ? 'bg-zinc-950 text-zinc-500 border-zinc-800'
                  : isLowStock
                  ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                  : 'bg-zinc-900 text-zinc-200 border-zinc-700'
              }`}
            >
              {isOutOfStock
                ? 'Stok Habis'
                : isLowStock
                ? `Sisa ${product.stock}!`
                : `Ready: ${product.stock}`}
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
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
              <span className="line-through">{formatRupiah(product.original_price)}</span>
              {savingsAmount > 0 && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.2 rounded">
                  Hemat {formatRupiah(savingsAmount)}
                </span>
              )}
            </div>
          )}
          <div
            className={`text-xl font-black font-mono tracking-tight ${
              isPromo ? 'text-amber-400' : 'text-white'
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
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-extrabold shadow-amber-950/50 hover:scale-[1.02] active:scale-[0.98]'
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
