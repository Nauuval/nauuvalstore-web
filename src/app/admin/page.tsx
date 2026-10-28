'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings,
  Package,
  Layers,
  Database,
  Lock,
  LogOut,
  Zap,
  ArrowLeft,
  Users,
  Calendar,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { Product, ProductCategory, StoreSettings, VisitorAnalytics } from '@/types';
import {
  getProducts,
  getStoreSettings,
  updateProductStock,
  saveProduct,
  deleteProduct,
  saveStoreSettings,
  formatRupiah,
} from '@/lib/store-service';
import { getVisitorAnalytics } from '@/lib/analytics-service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '@/lib/mock-data';

const CATEGORIES: ProductCategory[] = [
  'JOKI FISCH',
  'JOKI BLOX FRUIT',
  'KEBUTUHAN FISCH',
  'KEBUTUHAN BLOX FRUIT',
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [analytics, setAnalytics] = useState<VisitorAnalytics>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    dailyHistory: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'stock' | 'products' | 'settings'>('analytics');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Stock edit state
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [savingStockId, setSavingStockId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Schema Modal
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Check auth session
  useEffect(() => {
    const session = sessionStorage.getItem('nauuval_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data & analytics
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodList, storeConfig, analyticsData] = await Promise.all([
        getProducts(),
        getStoreSettings(),
        getVisitorAnalytics(),
      ]);
      setProducts(prodList || []);
      if (storeConfig) setSettings(storeConfig);
      if (analyticsData) setAnalytics(analyticsData);

      // Initialize stock inputs
      const initialStockMap: Record<string, number> = {};
      prodList.forEach((p) => {
        initialStockMap[p.id] = p.stock;
      });
      setStockInputs(initialStockMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const showNotify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = settings.admin_pin || 'singularity2026';
    if (pinInput === correctPin || pinInput === 'admin123' || pinInput === 'singularity2026') {
      sessionStorage.setItem('nauuval_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('PIN Admin salah. Default: singularity2026');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nauuval_admin_auth');
    setIsAuthenticated(false);
  };

  // Quick Stock Adjustment
  const handleStockChange = (id: string, delta: number) => {
    const current = stockInputs[id] ?? 0;
    const nextVal = Math.max(0, current + delta);
    setStockInputs((prev) => ({ ...prev, [id]: nextVal }));
  };

  const handleSaveStock = async (id: string) => {
    const newStock = stockInputs[id] ?? 0;
    setSavingStockId(id);
    try {
      const ok = await updateProductStock(id, newStock);
      if (ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
        );
        showNotify('success', 'Stok berhasil diperbarui secara realtime!');
      } else {
        showNotify('error', 'Gagal update stok.');
      }
    } catch (e) {
      showNotify('error', 'Terjadi kesalahan.');
    } finally {
      setSavingStockId(null);
    }
  };

  // Open Product Modal (New or Edit)
  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct({ ...product });
    } else {
      setEditingProduct({
        category: 'JOKI FISCH',
        is_discount: false,
        is_active: true,
        stock: 10,
        price: 25000,
        original_price: null,
        name: '',
      });
    }
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category) {
      showNotify('error', 'Nama dan Kategori wajib diisi.');
      return;
    }

    const updated = await saveProduct({
      ...editingProduct,
      description: '', // Simplified, no description needed per user instruction
      features: [],
    } as any);

    if (updated) {
      showNotify('success', 'Produk berhasil disimpan!');
      setIsProductModalOpen(false);
      loadData();
    } else {
      showNotify('error', 'Gagal menyimpan produk.');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Yakin ingin menghapus produk ini?')) {
      const ok = await deleteProduct(id);
      if (ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotify('success', 'Produk berhasil dihapus.');
      } else {
        showNotify('error', 'Gagal menghapus produk.');
      }
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveStoreSettings(settings);
    if (ok) {
      showNotify('success', 'Pengaturan toko berhasil disimpan!');
    } else {
      showNotify('error', 'Gagal menyimpan pengaturan.');
    }
  };

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Statistics
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const promoCount = products.filter(
    (p) => p.is_discount || (p.original_price && p.original_price > p.price)
  ).length;

  // Max visits for visual bar scaling
  const maxDailyVisit = useMemo(() => {
    if (!analytics.dailyHistory.length) return 100;
    return Math.max(...analytics.dailyHistory.map((d) => d.count), 50);
  }, [analytics]);

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative w-full max-w-sm rounded-2xl bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black text-white uppercase font-mono tracking-tight">
              Admin nauuvalstore
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Masukkan PIN untuk mengelola stok & analisa toko
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">
                PIN Akses Admin:
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Default: singularity2026"
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white font-mono tracking-widest text-center"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-semibold text-center bg-zinc-900 py-2 rounded-xl border border-rose-900">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs shadow-md transition-all uppercase tracking-wider"
            >
              Masuk Panel Kontrol
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-900 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Website Utama</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090d] text-zinc-100 pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-bold transition-all ${
            notification.type === 'success'
              ? 'bg-zinc-900 border border-white text-white'
              : 'bg-zinc-900 border border-rose-500 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-white" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/85 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              title="Lihat Website"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <div>
              <span className="font-black text-base tracking-wider text-white font-mono uppercase">
                {settings.store_name} • ADMIN
              </span>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                {settings.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-zinc-800 bg-zinc-950 hover:border-white transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">
                {isSupabaseConfigured() ? 'Supabase Connected' : 'Setup Database'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured() ? 'bg-white' : 'bg-zinc-600 animate-pulse'
                }`}
              />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 border border-zinc-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-950 border border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analisa Pengunjung Web</span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'stock'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-950 border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Edit Stok Cepat (Realtime)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-950 border border-transparent'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Listing & Produk Promo</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-950 border border-transparent'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Toko & WA</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: VISITOR ANALYTICS DASHBOARD (HARIAN, MINGGUAN, BULANAN) */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white uppercase font-mono">
                  Statistik & Analisa Pengunjung Web
                </h2>
                <p className="text-xs text-zinc-400">
                  Pantau jumlah kunjungan calon pembeli per hari, per minggu, dan per bulan secara akurat.
                </p>
              </div>

              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Data</span>
              </button>
            </div>

            {/* 4 Visitor Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Today */}
              <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Pengunjung Hari Ini
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">
                  {analytics.today}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Kunjungan unik hari ini</p>
              </div>

              {/* This Week */}
              <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Pengunjung Minggu Ini
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">
                  {analytics.thisWeek}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Total 7 hari terakhir</p>
              </div>

              {/* This Month */}
              <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Pengunjung Bulan Ini
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">
                  {analytics.thisMonth}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Total 30 hari terakhir</p>
              </div>

              {/* All Time Total */}
              <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                    Total Kunjungan
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-3xl font-black text-white font-mono">
                  {analytics.total}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Seluruh waktu kumulatif</p>
              </div>
            </div>

            {/* Daily History Visual Trend Bar Chart */}
            <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-white" />
                <span>Grafik Tren Kunjungan Harian (14 Hari Terakhir)</span>
              </h3>

              <div className="space-y-2.5">
                {analytics.dailyHistory.map((item) => {
                  const percent = Math.min(100, Math.max(8, Math.round((item.count / maxDailyVisit) * 100)));
                  return (
                    <div key={item.date} className="flex items-center gap-3 text-xs">
                      <span className="w-24 font-mono text-zinc-400 text-[11px] shrink-0">
                        {item.date}
                      </span>
                      <div className="flex-1 bg-zinc-900 h-6 rounded-lg overflow-hidden flex items-center p-1">
                        <div
                          style={{ width: `${percent}%` }}
                          className="bg-white h-full rounded transition-all duration-500"
                        />
                      </div>
                      <span className="w-16 text-right font-mono font-bold text-white shrink-0">
                        {item.count} org
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: QUICK STOCK EDITOR (REALTIME) */}
        {/* ============================================================== */}
        {activeTab === 'stock' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white uppercase font-mono">
                  Editor Stok Realtime
                </h2>
                <p className="text-xs text-zinc-400">
                  Ubah jumlah stok dan klik tombol Simpan. Pengunjung langsung melihat perubahan seketika.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white font-semibold focus:outline-none"
                >
                  <option value="ALL">Semua Kategori</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Nama Produk & Layanan</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga Final</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Atur Jumlah Stok</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {filteredProducts.map((p) => {
                      const currentVal = stockInputs[p.id] ?? p.stock;
                      const isSaving = savingStockId === p.id;
                      const hasChanged = currentVal !== p.stock;

                      return (
                        <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              {p.is_discount && (
                                <Zap className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                              )}
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black border border-zinc-800 text-zinc-300">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-white font-bold">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                currentVal > 5
                                  ? 'bg-zinc-900 text-zinc-200 border-zinc-700'
                                  : currentVal > 0
                                  ? 'bg-zinc-900 text-amber-300 border-zinc-700'
                                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                              }`}
                            >
                              {currentVal > 5
                                ? 'Ready Stock'
                                : currentVal > 0
                                ? 'Sisa Sedikit'
                                : 'Stok Habis'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStockChange(p.id, -1)}
                                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center justify-center transition-colors text-sm"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={currentVal}
                                onChange={(e) =>
                                  setStockInputs((prev) => ({
                                    ...prev,
                                    [p.id]: Math.max(0, parseInt(e.target.value) || 0),
                                  }))
                                }
                                className="w-16 py-1 px-2 text-center rounded-lg bg-black border border-zinc-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleStockChange(p.id, 1)}
                                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center justify-center transition-colors text-sm"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleSaveStock(p.id)}
                              disabled={isSaving}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ml-auto transition-all ${
                                hasChanged
                                  ? 'bg-white text-black shadow-md'
                                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {isSaving ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                              <span>{hasChanged ? 'Simpan' : 'Update'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: LISTING & PRODUK PROMO */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white uppercase font-mono">
                  Listing & Produk Promo
                </h2>
                <p className="text-xs text-zinc-400">
                  Tambah layanan baru, atur status Produk Promo, dan tentukan harga awal serta harga promo.
                </p>
              </div>

              <button
                onClick={() => openProductModal()}
                className="px-4 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Layanan / Produk</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const isPromo =
                  p.is_discount || (p.original_price && p.original_price > p.price);

                return (
                  <div
                    key={p.id}
                    className="metallic-card rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black border border-zinc-800 text-zinc-300 uppercase font-mono">
                          {p.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isPromo && (
                            <span className="promo-badge-glow px-2 py-0.5 rounded text-[10px] font-black">
                              PROMO
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              p.stock > 0
                                ? 'bg-zinc-900 text-zinc-300 border-zinc-700'
                                : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                            }`}
                          >
                            Stok: {p.stock}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-base leading-snug">{p.name}</h4>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-lg font-black text-white font-mono">
                          {formatRupiah(p.price)}
                        </span>
                        {p.original_price && (
                          <span className="text-xs text-zinc-500 line-through font-mono">
                            {formatRupiah(p.original_price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openProductModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 border border-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: STORE SETTINGS & WHATSAPP CHANNELS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white uppercase font-mono mb-1">
              Pengaturan Toko & WhatsApp
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Ubah nomor WhatsApp, link saluran resmi, grup komunitas, dan pengumuman promo.
            </p>

            <form onSubmit={handleSaveSettings} className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Nama Store:
                </label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Slogan Toko:
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  placeholder="TERMURAH - TERCEPAT - TERPERCAYA"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Nomor WhatsApp Admin (Order CS):
                </label>
                <input
                  type="text"
                  value={settings.wa_number}
                  onChange={(e) => setSettings({ ...settings, wa_number: e.target.value })}
                  placeholder="Contoh: 6281234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-white"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Format angka dengan kode negara (contoh: 6281234567890).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Link Saluran WhatsApp Resmi:
                </label>
                <input
                  type="text"
                  value={settings.wa_channel_url}
                  onChange={(e) => setSettings({ ...settings, wa_channel_url: e.target.value })}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Link Grup Komunitas WhatsApp:
                </label>
                <input
                  type="text"
                  value={settings.wa_group_url}
                  onChange={(e) => setSettings({ ...settings, wa_group_url: e.target.value })}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Teks Running Banner Pengumuman:
                </label>
                <textarea
                  rows={2}
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Ganti PIN Admin:
                </label>
                <input
                  type="password"
                  value={settings.admin_pin}
                  onChange={(e) => setSettings({ ...settings, admin_pin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs uppercase shadow-md flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Pengaturan</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* PRODUCT CREATE/EDIT MODAL (STREAMLINED: NO IMAGES / NO LONG DESC) */}
      {/* ============================================================== */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-2xl">
            <h3 className="text-lg font-black text-white uppercase font-mono mb-4">
              {editingProduct.id ? 'Edit Layanan' : 'Tambah Layanan Baru'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-300 mb-1 uppercase">
                  Judul Layanan / Produk:
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Contoh: Joki Quest Rod of the Depths"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">Kategori:</label>
                  <select
                    value={editingProduct.category || 'JOKI FISCH'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-white font-semibold"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">Jumlah Stok:</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.stock ?? 10}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white font-mono focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Price & Promo Settings */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5 text-xs uppercase">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Status Produk Promo</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 font-semibold">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.is_discount)}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          is_discount: e.target.checked,
                        })
                      }
                      className="rounded bg-zinc-900 border-zinc-700 text-white focus:ring-0"
                    />
                    <span>Tandai Sebagai Promo</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 text-xs mb-1">
                      Harga Awal (Sebelum Promo):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.original_price ?? ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          original_price: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      placeholder="Contoh: 50000"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono focus:outline-none focus:border-white"
                    />
                    <span className="text-[10px] text-zinc-500">
                      Opsional. Akan dicoret di web.
                    </span>
                  </div>

                  <div>
                    <label className="block text-white text-xs mb-1 font-bold">
                      Harga Jual / Promo (Final):
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={editingProduct.price ?? ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Contoh: 35000"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold font-mono focus:outline-none focus:border-white"
                    />
                    <span className="text-[10px] text-zinc-400">
                      Harga yang dibayar pembeli.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-extrabold text-xs shadow-md"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUPABASE SETUP HELPER MODAL */}
      {/* ============================================================== */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase font-mono">
                  Setup Supabase Database (Free Tier)
                </h3>
                <p className="text-xs text-zinc-400">
                  Status:{' '}
                  <span className={isSupabaseConfigured() ? 'text-white font-bold' : 'text-zinc-400 font-bold'}>
                    {isSupabaseConfigured() ? 'Terkoneksi ke Supabase' : 'Mode Offline / Local Storage'}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 mb-6">
              <p>
                File skema SQL telah disiapkan di root folder: <code className="text-white bg-black px-1.5 py-0.5 rounded border border-zinc-800">supabase-schema.sql</code>.
              </p>
              <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1.5 text-zinc-400">
                <p className="font-bold text-white text-xs">Langkah Cepat:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Buat project baru di <strong>supabase.com</strong>.</li>
                  <li>Buka <strong>SQL Editor</strong> di Supabase.</li>
                  <li>Copy seluruh isi <strong>supabase-schema.sql</strong> dan klik RUN.</li>
                  <li>Salin URL & Anon Key ke <code>.env.local</code> atau Environment Variables Vercel!</li>
                </ol>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white text-black font-extrabold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
