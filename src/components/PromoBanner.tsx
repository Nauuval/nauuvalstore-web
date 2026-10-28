'use client';

import React from 'react';
import Image from 'next/image';
import { Flame, Sparkles, MessageCircle, Clock, Zap, Tag } from 'lucide-react';
import { Product, StoreSettings } from '@/types';
import { formatRupiah } from '@/lib/store-service';

interface PromoBannerProps {
  discountProducts: Product[];
  settings: StoreSettings;
  onOrderProduct: (product: Product) => void;
}

export default function PromoBanner({
  discountProducts,
  settings,
  onOrderProduct,
}: PromoBannerProps) {
  if (discountProducts.length === 0) return null;

  return (
    <section id="flash-sale" className="py-12 relative scroll-mt-20">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-48 bg-gradient-to-r from-amber-500/10 via-violet-600/15 to-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Title Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-violet-950/80 via-slate-900/90 to-indigo-950/80 border border-violet-700/50 shadow-2xl shadow-violet-950/40 relative overflow-hidden mb-8">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/30 shrink-0">
                <Flame className="w-7 h-7 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-extrabold uppercase tracking-wider">
                    PROMO CORET HARGA
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">• Slot Terbatas</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  ⚡ Flash Sale Singularity
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800 self-start md:self-auto">
              <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>
                Harga diskon berlaku selama persediaan slot masih ada!
              </span>
            </div>
          </div>
        </div>

        {/* Discount Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {discountProducts.map((product) => {
            const discountPercent =
              product.original_price && product.original_price > product.price
                ? Math.round(
                    ((product.original_price - product.price) /
                      product.original_price) *
                      100
                  )
                : null;

            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between border-slate-800 group relative"
              >
                {/* Discount Percentage Badge */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                  <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs shadow-lg shadow-red-900/50 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>{discountPercent ? `-${discountPercent}%` : 'DISKON'}</span>
                  </div>
                </div>

                {/* Real-time Stock Badge Top Right */}
                <div className="absolute top-3 right-3 z-20">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-md ${
                      product.stock > 5
                        ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                        : product.stock > 0
                        ? 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                        : 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.stock > 5
                          ? 'bg-emerald-400'
                          : product.stock > 0
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>
                      {product.stock > 5
                        ? `Stok: ${product.stock}`
                        : product.stock > 0
                        ? `Sisa ${product.stock}!`
                        : 'Habis'}
                    </span>
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-950 to-slate-900">
                      <Sparkles className="w-10 h-10 text-violet-500/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Category Pill on Image */}
                  <div className="absolute bottom-2 left-3">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-cyan-300">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price Block with Coret Harga */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div>
                        {product.original_price && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 line-through">
                            <span>{formatRupiah(product.original_price)}</span>
                          </div>
                        )}
                        <div className="text-lg sm:text-xl font-black text-cyan-400 font-mono tracking-tight">
                          {formatRupiah(product.price)}
                        </div>
                      </div>

                      {product.original_price && (
                        <div className="text-right text-[11px] text-emerald-400 font-medium">
                          Hemat {formatRupiah(product.original_price - product.price)}
                        </div>
                      )}
                    </div>

                    {/* Order Button */}
                    <button
                      onClick={() => onOrderProduct(product)}
                      disabled={isOutOfStock}
                      className={`w-full mt-3 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                        isOutOfStock
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40 hover:scale-[1.02]'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Stok Sedang Habis' : 'Order via WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
