'use client';

import React from 'react';
import { MessageCircle, Zap } from 'lucide-react';
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

  return (
    <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 hover:border-white transition-all flex flex-col justify-between group relative">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-300">
            {product.category}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Promo Tag */}
            {isPromo && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-black flex items-center gap-1">
                <Zap className="w-3 h-3 fill-black" />
                <span>PRODUK PROMO</span>
                {discountPercent && <span>(-{discountPercent}%)</span>}
              </span>
            )}

            {/* Stock Tag */}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                isOutOfStock
                  ? 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  : isLowStock
                  ? 'bg-zinc-900 text-amber-300 border-zinc-700'
                  : 'bg-zinc-900 text-zinc-200 border-zinc-700'
              }`}
            >
              {isOutOfStock
                ? 'Stok Habis'
                : isLowStock
                ? `Sisa ${product.stock} Slot!`
                : `Ready: ${product.stock}`}
            </span>
          </div>
        </div>

        {/* Product Title Only (No Image, No Description) */}
        <h4 className="font-bold text-white text-base sm:text-lg group-hover:text-zinc-200 transition-colors leading-snug min-h-[2.5rem]">
          {product.name}
        </h4>
      </div>

      {/* Price & Action Section */}
      <div className="mt-5 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          {isPromo && product.original_price && (
            <div className="text-xs text-zinc-500 line-through font-mono">
              {formatRupiah(product.original_price)}
            </div>
          )}
          <div className="text-xl font-black text-white font-mono tracking-tight">
            {formatRupiah(product.price)}
          </div>
        </div>

        <button
          onClick={() => onOrder(product)}
          disabled={isOutOfStock}
          className={`py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
            isOutOfStock
              ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
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
