'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Flame,
  Radio,
  Check,
  Sparkles,
  Zap,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from 'lucide-react';
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

  // Page mode pagination state
  const [pageSize, setPageSize] = useState<number>(8); // 8 items default per batch/page
  const [currentPage, setCurrentPage] = useState<number>(1);

  const catalogGridRef = useRef<HTMLDivElement>(null);

  // Dynamic Product Counts per Category Tab
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: products.filter((p) => p.is_active).length,
      PROMO: products.filter(
        (p) =>
          p.is_active &&
          (p.is_discount || (p.original_price && p.original_price > p.price))
      ).length,
    };
    TABS.forEach((tab) => {
      if (tab !== 'ALL' && tab !== 'PROMO') {
        counts[tab] = products.filter((p) => p.is_active && p.category === tab).length;
      }
    });
    return counts;
  }, [products]);

  // Pinned Promo Products (Highlighted at the top to notify visitors of special offers)
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

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchQuery, onlyReadyStock, sortBy, pageSize]);

  // Total pages calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  // Sliced products for current page
  const displayedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handlePageChange = (newPage: number) => {
    const target = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(target);
    if (catalogGridRef.current) {
      catalogGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const startItemIndex = filteredProducts.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItemIndex = Math.min(currentPage * pageSize, filteredProducts.length);
  const progressPercent =
    filteredProducts.length > 0
      ? Math.min(100, Math.round((endItemIndex / filteredProducts.length) * 100))
      : 0;

  // Smart page numbers array for desktop view (supports ellipsis if pages > 7)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  return (
    <section id="catalog" className="py-14 sm:py-20 relative bg-[#08090d] scroll-mt-20">
      {/* Subtle Topo Grid Background */}
      <div className="absolute inset-0 bg-topo-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold mb-3 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00df82]" />
              <span>KATALOG PRODUK & LAYANAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
              Katalog Layanan & Stok Realtime
            </h2>
            <p className="mt-2 text-zinc-400 text-xs sm:text-sm">
              Semua produk promo otomatis disematkan di bagian atas. Indikator stok dilengkapi sensor blip realtime.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl metallic-card text-xs font-semibold self-start md:self-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-radar-blip-fast absolute inline-flex h-full w-full rounded-full bg-[#00df82] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00df82]" />
            </span>
            <span className="text-zinc-300 font-mono text-[11px]">
              {isRealtimeActive ? 'Realtime Supabase Sync' : 'Realtime Live Sync'}
            </span>
          </div>
        </div>

        {/* Pinned Promo Banner / Top Pinned Section */}
        {selectedTab === 'ALL' && !searchQuery && pinnedPromoProducts.length > 0 && (
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black promo-lime-border relative overflow-hidden">
            {/* Ambient neon lime glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#00df82]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800 relative z-10">
              <div className="flex items-center gap-2.5">
                <span className="promo-lime-badge px-3 py-1 rounded-lg font-black text-xs flex items-center gap-1.5 uppercase tracking-wide font-tech">
                  <Flame className="w-4 h-4 fill-black text-black" />
                  <span>⚡ PRODUK PROMO SPESIAL</span>
                </span>
                <span className="text-xs text-zinc-300 font-semibold hidden sm:inline">
                  • Diskon Terbatas Sedang Berlangsung!
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-black bg-[#00df82] px-2.5 py-1 rounded-lg shadow-sm">
                {pinnedPromoProducts.length} Layanan Promo
              </span>
            </div>

            <div
              className={`grid gap-4 relative z-10 ${
                pinnedPromoProducts.length === 1
                  ? 'grid-cols-1 max-w-sm sm:max-w-md'
                  : pinnedPromoProducts.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
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

        {/* Category Tabs with Dynamic Count Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none no-scrollbar">
          {TABS.map((tab) => {
            const isSelected = selectedTab === tab;
            let label: string = tab;
            if (tab === 'ALL') label = 'SEMUA LAYANAN';
            if (tab === 'PROMO') label = '⚡ PRODUK PROMO';

            const count = categoryCounts[tab] ?? 0;

            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? tab === 'PROMO'
                      ? 'promo-lime-badge shadow-md scale-[1.02]'
                      : 'bg-white text-black shadow-md'
                    : 'metallic-card text-zinc-300 hover:text-white'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? tab === 'PROMO'
                        ? 'bg-black text-[#00df82]'
                        : 'bg-zinc-800 text-white'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-zinc-800 text-white placeholder:text-zinc-600 text-xs sm:text-sm focus:outline-none focus:border-[#00df82] transition-all font-mono"
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
              <span className={`w-2 h-2 rounded-full ${onlyReadyStock ? 'bg-black' : 'bg-[#00df82]'}`} />
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

        {/* Product Grid Anchor */}
        <div ref={catalogGridRef} className="scroll-mt-28" />

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOrder={onOrderProduct}
                />
              ))}
            </div>

            {/* Pagination Controls & Per Batch Option */}
            {filteredProducts.length > pageSize && (
              <div className="mt-10 pt-8 border-t border-[#133d2c]/60 flex flex-col items-center gap-4">
                {/* Progress Bar & Indikator Jumlah Produk */}
                <div className="w-full max-w-md text-center">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2 px-1">
                    <span>
                      Menampilkan <strong className="text-white font-price">{startItemIndex} - {endItemIndex}</strong> dari{' '}
                      <strong className="text-white font-price">{filteredProducts.length}</strong> Layanan
                    </span>
                    <span className="text-[#00df82] font-bold font-price">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-950 overflow-hidden border border-[#143e2d]">
                    <div
                      className="h-full bg-gradient-to-r from-zinc-600 via-[#00df82]/60 to-[#00df82] transition-all duration-300 rounded-full"
                      style={{
                        width: `${progressPercent}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Mobile View (< sm): Compact, No-Overflow Pagination */}
                <div className="flex sm:hidden items-center justify-between w-full max-w-xs px-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#071610] border border-[#143d2c] text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all flex items-center justify-center gap-1 font-tech"
                    aria-label="Halaman Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#00df82]" />
                    <span>Sebelumnya</span>
                  </button>

                  {/* Interactive Page Indicator with direct page picker */}
                  <div className="relative px-3.5 py-2 rounded-xl bg-[#091a13] border border-[#174e35] text-center shrink-0 shadow-inner flex items-center justify-center gap-1.5 cursor-pointer hover:border-[#00df82]/60 transition-colors">
                    <span className="text-xs font-mono font-bold text-[#00df82] font-price">
                      Hal {currentPage}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">/</span>
                    <span className="text-xs font-mono font-bold text-zinc-300 font-price">
                      {totalPages}
                    </span>
                    <select
                      value={currentPage}
                      onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      aria-label="Pilih Halaman Langsung"
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <option key={p} value={p} className="bg-[#050a07] text-white">
                          Halaman {p} dari {totalPages}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#071610] border border-[#143d2c] text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all flex items-center justify-center gap-1 font-tech"
                    aria-label="Halaman Selanjutnya"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4 text-[#00df82]" />
                  </button>
                </div>

                {/* Desktop View (>= sm): Numbered Pagination with Smart Ellipsis */}
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2.5 rounded-xl bg-[#071610] border border-[#143d2c] text-xs font-bold text-zinc-300 hover:text-white hover:border-[#00df82]/50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all font-tech active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#00df82]" />
                    <span>Sebelumnya</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {pageNumbers.map((page, idx) => {
                      if (page === '...') {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="w-8 text-center text-zinc-600 font-mono text-xs select-none"
                          >
                            ...
                          </span>
                        );
                      }
                      const pageNum = page as number;
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all ${
                            isActive
                              ? 'bg-[#00df82] text-[#03140d] font-bold shadow-[0_0_12px_rgba(0,223,130,0.4)] scale-105'
                              : 'bg-[#071610] border border-[#143d2c] text-zinc-400 hover:text-white hover:border-zinc-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2.5 rounded-xl bg-[#071610] border border-[#143d2c] text-xs font-bold text-zinc-300 hover:text-white hover:border-[#00df82]/50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition-all font-tech active:scale-95"
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight className="w-4 h-4 text-[#00df82]" />
                  </button>
                </div>

                {/* Per Batch Size Option (Preserved per user request) */}
                <div className="flex items-center gap-2 bg-[#06120c] px-3.5 py-1.5 rounded-xl border border-[#143d2c] shadow-sm">
                  <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">Per Batch:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setPageSize(val);
                      setCurrentPage(1);
                    }}
                    className="bg-transparent border-0 text-[#00df82] font-mono text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="8" className="bg-[#050a07] text-white">8 Item</option>
                    <option value="12" className="bg-[#050a07] text-white">12 Item</option>
                    <option value="16" className="bg-[#050a07] text-white">16 Item</option>
                    <option value="24" className="bg-[#050a07] text-white">24 Item</option>
                  </select>
                </div>
              </div>
            )}
          </>
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
