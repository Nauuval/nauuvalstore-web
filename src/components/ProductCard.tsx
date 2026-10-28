'use client';

import React from 'react';
import { MessageCircle, Check, Zap, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/store-service';

interface ProductCardProps {
  product: Product;
  onOrder: (product: Product) => void;
}

export default function ProductCard({ product, onOrder }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 4;

  const hasDiscount = Boolean(
    product.is_discount || (product.original_price && product.original_price > product.price)
  );

  const discountPercent =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : null;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border-slate-800/90 group relative transition-all duration-300">
      {/* Realtime Stock Badge Top Right */}
      <div className="absolute top-3 right-3 z-20">
        <span
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md ${
            isOutOfStock
              ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
              : isLowStock
              ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
              : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOutOfStock
                ? 'bg-rose-500'
                : isLowStock
                ? 'bg-amber-400 animate-ping'
                : 'bg-emerald-400'
            }`}
          />
          <span>
            {isOutOfStock
              ? 'Stok Habis'
              : isLowStock
              ? `Sisa ${product.stock} Slot!`
              : `Ready (${product.stock})`}
          </span>
        </span>
      </div>

      {/* Discount Badge Top Left if present */}
      {hasDiscount && discountPercent && (
        <div className="absolute top-3 left-3 z-20">
          <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs shadow-lg shadow-red-900/50 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>-{discountPercent}%</span>
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-950">
            <Sparkles className="w-10 h-10 text-violet-500/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category Badge on Bottom-Left of Image */}
        <div className="absolute bottom-2.5 left-3">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-950/90 border border-slate-700 text-cyan-300 shadow-md">
            {product.category}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-white text-base sm:text-lg group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h4>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <ul className="mt-3.5 space-y-1.5 text-xs text-slate-300">
              {product.features.slice(0, 3).map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-end justify-between mb-3">
            <div>
              {hasDiscount && product.original_price && (
                <div className="text-xs text-slate-400 line-through">
                  {formatRupiah(product.original_price)}
                </div>
              )}
              <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono tracking-tight">
                {formatRupiah(product.price)}
              </div>
            </div>

            {hasDiscount && product.original_price && (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                Hemat {formatRupiah(product.original_price - product.price)}
              </span>
            )}
          </div>

          <button
            onClick={() => onOrder(product)}
            disabled={isOutOfStock}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 hover:scale-[1.01]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{isOutOfStock ? 'Stok Habis (Hubungi CS)' : 'Order via WhatsApp'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
