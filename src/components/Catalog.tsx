'use client';

import React, { useState, useMemo } from 'react';
import { Search, Flame, Radio, Check, Sparkles, Zap } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import ProductCard from './ProductCard';

interface CatalogProps {
  products: Product[];
  onOrderProduct: (product: Product) => void;
  isRealtimeActive: boolean;
}

type TabType = 'ALL' | 'PROMO' | ProductCategory;

const TABS: TabType[] = [
  'ALL',
  'PROMO',
  'JOKI FISCH',
  'JOKI BLOX FRUIT',
  'KEBUTUHAN FISCH',
  'KEBUTUHAN BLOX FRUIT',
];

export default function Catalog({
  products,
  onOrderProduct,
  isRealtimeActive,
}: CatalogProps) {
  const [selectedTab, setSelectedTab] = useState<TabType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyReadyStock, setOnlyReadyStock] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'stock'>('default');

  // Pinned Promo Products
  const pinnedPromoProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.is_active &&
        (p.is_discount || (p.original_price && p.original_price > p.price))
    );
  }, [products]);

  // Main filtered products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.is_active) return false;

        if (selectedTab === 'PROMO') {
          if (!p.is_discount && !(p.original_price && p.original_price > p.price)) return false;
        } else if (selectedTab !== 'ALL') {
          if (p.category !== selectedTab) return false;
        }

        if (onlyReadyStock && p.stock <= 0) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // If default sorting, always prioritize promo products first!
        if (sortBy === 'default') {
          const aPromo = a.is_discount || (a.original_price && a.original_price > a.price);
          const bPromo = b.is_discount || (b.original_price && b.original_price > b.price);
          if (aPromo && !bPromo) return -1;
          if (!aPromo && bPromo) return 1;
          return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return b.stock - a.stock;
        return 0;
      });
  }, [products, selectedTab, searchQuery, onlyReadyStock, sortBy]);

  return (
    <section id="catalog" className="py-14 sm:py-20 relative bg-[#08090d] scroll-mt-20">
      {/* Subtle Topo Grid Background */}
      <div className="absolute inset-0 bg-topo-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold mb-3 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>KATALOG PRODUK & LAYANAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
              Katalog Layanan & Stok Realtime
            </h2>
            <p className="mt-2 text-zinc-400 text-xs sm:text-sm">
              Semua produk promo otomatis disematkan di bagian atas. Perubahan stok terpantau langsung.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl metallic-card text-xs font-semibold self-start md:self-auto">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-zinc-300 font-mono text-[11px]">
              {isRealtimeActive ? 'Realtime Supabase Sync' : 'Realtime Live Sync'}
            </span>
          </div>
        </div>

        {/* Pinned Promo Banner / Top Pinned Section (Eye-Catching Vibrant Border & Glow) */}
        {selectedTab === 'ALL' && !searchQuery && pinnedPromoProducts.length > 0 && (
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border-2 border-red-500/40 shadow-2xl shadow-red-950/20 relative overflow-hidden">
            {/* Ambient flame glow in top-right */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="promo-badge-glow px-3 py-1 rounded-lg font-black text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <Flame className="w-4 h-4 fill-white" />
                  <span>⚡ PRODUK PROMO SPESIAL</span>
                </span>
                <span className="text-xs text-amber-300/90 font-semibold hidden sm:inline">
                  • Diskon Terbatas Sedang Berlangsung!
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-lg">
                {pinnedPromoProducts.length} Layanan Promo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
              {pinnedPromoProducts.slice(0, 3).map((product) => (
                <ProductCard
                  key={`pinned-${product.id}`}
                  product={product}
                  onOrder={onOrderProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none no-scrollbar">
          {TABS.map((tab) => {
            const isSelected = selectedTab === tab;
            let label: string = tab;
            if (tab === 'ALL') label = 'SEMUA LAYANAN';
            if (tab === 'PROMO') label = '🔥 PRODUK PROMO';

            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? tab === 'PROMO'
                      ? 'promo-badge-glow shadow-md scale-[1.02]'
                      : 'bg-white text-black shadow-md'
                    : 'metallic-card text-zinc-300 hover:text-white'
                }`}
              >
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="p-4 rounded-2xl metallic-card mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan (contoh: 'Depths', 'Godhuman', 'Level 1-2550', 'Fruit')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-zinc-800 text-white placeholder:text-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-white transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setOnlyReadyStock(!onlyReadyStock)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                onlyReadyStock
                  ? 'bg-white text-black border-white'
                  : 'bg-black/60 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyReadyStock ? 'bg-black' : 'bg-white'}`} />
              <span>Hanya Ready Stok</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-black/60 border border-zinc-800 text-zinc-300 text-xs font-semibold focus:outline-none focus:border-white"
            >
              <option value="default">Urutan: Produk Promo Teratas</option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
              <option value="stock">Stok: Terbanyak</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={onOrderProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center metallic-card rounded-2xl max-w-md mx-auto p-8">
            <p className="text-base font-bold text-white">Tidak ada produk ditemukan</p>
            <p className="mt-1 text-xs text-zinc-400">
              Coba ganti kategori atau reset kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedTab('ALL');
                setSearchQuery('');
                setOnlyReadyStock(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
