'use client';

import React from 'react';
import { MessageCircle, Flame, ArrowRight } from 'lucide-react';
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
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#061d14] border border-[#143e2d] text-[#00df82] font-mono">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Eye-Catching Cyber Mint Promo Badge (Pixel Font) */}
            {isPromo && (
              <span className="promo-lime-badge px-2.5 py-0.5 rounded-md text-[11px] font-pixel font-bold uppercase tracking-wide flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#03140d] text-[#03140d] shrink-0" />
                <span>PROMO {discountPercent ? `-${discountPercent}%` : ''}</span>
              </span>
            )}

            {/* Radar / Sonar Blip Stock Tag */}
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border font-mono flex items-center gap-2 ${
                isOutOfStock
                  ? 'bg-zinc-950 text-zinc-500 border-zinc-800'
                  : isLowStock
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600/70'
                  : 'bg-[#061710] text-[#00df82] border-[#133c2b]'
              }`}
            >
              {/* Radar Sonar Blip Animation */}
              {!isOutOfStock ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className={`animate-radar-blip absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isLowStock ? 'bg-amber-400' : 'bg-[#00df82]'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isLowStock ? 'bg-amber-400' : 'bg-[#00df82]'
                    }`}
                  />
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-zinc-600 shrink-0" />
              )}

              <span>
                {isOutOfStock
                  ? 'Stok Habis'
                  : isLowStock
                  ? `Sisa ${product.stock}!`
                  : `Ready: ${product.stock}`}
              </span>
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h4 className="font-bold text-white text-base sm:text-lg group-hover:text-emerald-300 transition-colors leading-snug min-h-[2.5rem]">
          {product.name}
        </h4>
      </div>

      {/* Price & Action Section (With Pixel Font Styling) */}
      <div className="mt-5 pt-4 border-t border-[#143225] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {isPromo && product.original_price && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono mb-0.5">
              <span className="line-through">{formatRupiah(product.original_price)}</span>
              {savingsAmount > 0 && (
                <span className="text-[11px] font-bold text-[#03140d] bg-[#00df82] px-1.5 py-0.5 rounded font-pixel">
                  Hemat {formatRupiah(savingsAmount)}
                </span>
              )}
            </div>
          )}
          {/* Price displayed in Pixel Font for retro gaming aesthetic */}
          <div
            className={`text-xl sm:text-2xl font-bold font-pixel tracking-tight ${
              isPromo ? 'text-[#00df82] drop-shadow-[0_0_10px_rgba(0,223,130,0.35)]' : 'text-white'
            }`}
          >
            {formatRupiah(product.price)}
          </div>
        </div>

        {/* Action Button: Matches "Beli Sekarang →" from user's reference image */}
        <button
          onClick={() => onOrder(product)}
          disabled={isOutOfStock}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md font-pixel tracking-wide ${
            isOutOfStock
              ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
              : isPromo
              ? 'bg-[#00df82] hover:bg-[#00c774] text-[#03140d] shadow-[#00df82]/30 hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-[#00df82] text-[#03140d] hover:bg-[#00c774] hover:scale-[1.02] active:scale-95'
          }`}
        >
          <span>{isOutOfStock ? 'Stok Habis' : 'Order Sekarang'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
