'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Radio, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import ProductCard from './ProductCard';

interface CatalogProps {
  products: Product[];
  onOrderProduct: (product: Product) => void;
  isRealtimeActive: boolean;
}

const CATEGORIES: ('ALL' | ProductCategory)[] = [
  'ALL',
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
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyReadyStock, setOnlyReadyStock] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'stock'>('default');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.is_active) return false;
        if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
        if (onlyReadyStock && p.stock <= 0) return false;
        if (onlyDiscount && !p.is_discount && !(p.original_price && p.original_price > p.price)) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchFeat = p.features?.some((f) => f.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCat && !matchFeat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'stock') return b.stock - a.stock;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      });
  }, [products, selectedCategory, searchQuery, onlyReadyStock, onlyDiscount, sortBy]);

  return (
    <section id="catalog" className="py-16 sm:py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header & Live Realtime Indicator */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-500/40 text-violet-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>KATALOG RESMI LAYANAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pilih Layanan & Cek Stok Realtime
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              Katalog terupdate otomatis setiap kali stok berubah di sistem.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium self-start md:self-auto shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-mono">
              {isRealtimeActive ? 'Realtime Supabase Sync' : 'Realtime Live Sync'}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none no-scrollbar">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count =
              category === 'ALL'
                ? products.filter((p) => p.is_active).length
                : products.filter((p) => p.is_active && p.category === category).length;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/50 border border-violet-400/40'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{category === 'ALL' ? '🌟 SEMUA LAYANAN' : category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan (misal: 'Depths', 'Kitsune', 'Godhuman', 'Level')..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                Reset
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Only Ready Stock Toggle */}
            <button
              onClick={() => setOnlyReadyStock(!onlyReadyStock)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                onlyReadyStock
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  onlyReadyStock ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
              />
              <span>Hanya Ready Stok</span>
            </button>

            {/* Only Discount Toggle */}
            <button
              onClick={() => setOnlyDiscount(!onlyDiscount)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                onlyDiscount
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hanya Diskon</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-semibold focus:outline-none focus:border-violet-500"
            >
              <option value="default">Urutan: Rekomendasi</option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
              <option value="stock">Stok: Terbanyak</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={onOrderProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-panel rounded-3xl border-slate-800 max-w-lg mx-auto p-8">
            <Radio className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white">Layanan Tidak Ditemukan</h4>
            <p className="mt-1 text-xs text-slate-400">
              Tidak ada produk yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setOnlyReadyStock(false);
                setOnlyDiscount(false);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
