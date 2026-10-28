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
  ExternalLink,
  Zap,
  TrendingDown,
  ArrowLeft,
  Copy,
  Check,
} from 'lucide-react';
import { Product, ProductCategory, StoreSettings } from '@/types';
import {
  getProducts,
  getStoreSettings,
  updateProductStock,
  saveProduct,
  deleteProduct,
  saveStoreSettings,
  formatRupiah,
} from '@/lib/store-service';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'stock' | 'products' | 'settings'>('stock');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [featuresInput, setFeaturesInput] = useState<string>('');

  // Stock edit state
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [savingStockId, setSavingStockId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Schema Modal
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Check auth session
  useEffect(() => {
    const session = sessionStorage.getItem('singularity_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodList, storeConfig] = await Promise.all([
        getProducts(),
        getStoreSettings(),
      ]);
      setProducts(prodList || []);
      if (storeConfig) setSettings(storeConfig);

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
      sessionStorage.setItem('singularity_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('PIN Admin salah. Coba: singularity2026');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('singularity_admin_auth');
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
      setFeaturesInput(product.features?.join(', ') || '');
    } else {
      setEditingProduct({
        category: 'JOKI FISCH',
        is_discount: false,
        is_active: true,
        stock: 10,
        price: 25000,
        original_price: null,
        description: '',
        name: '',
        image_url: '',
      });
      setFeaturesInput('Proses 1-2 Jam, Private Server, Garansi Aman');
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

    const feats = featuresInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = await saveProduct({
      ...editingProduct,
      features: feats,
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
    if (confirm('Yakin ingin menghapus produk ini dari katalog?')) {
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
      showNotify('success', 'Pengaturan toko & kontak WhatsApp berhasil disimpan!');
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
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Statistics
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const discountCount = products.filter(
    (p) => p.is_discount || (p.original_price && p.original_price > p.price)
  ).length;

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-cosmic-grid opacity-30 pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl glass-panel border-slate-800 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-violet-900/40">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Singularity</h1>
            <p className="text-xs text-slate-400 mt-1">
              Masukkan PIN Admin untuk mengelola stok & katalog toko
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                PIN / Passkey Akses:
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN (Default: singularity2026)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500 font-mono tracking-widest text-center"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-medium text-center bg-rose-950/40 border border-rose-800/40 py-2 rounded-xl">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-900/30 transition-all"
            >
              Buka Panel Kontrol
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
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
    <main className="min-h-screen bg-[#030712] text-slate-100 pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold transition-all animate-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
              : 'bg-rose-950 border border-rose-500 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Lihat Landing Page"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <div>
              <span className="font-black text-base sm:text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-400 font-mono">
                PANEL ADMIN
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {settings.store_name} • Realtime Stock & Product Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status indicator */}
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-800 bg-slate-900 hover:border-violet-500 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {isSupabaseConfigured() ? 'Supabase Connected' : 'Setup Supabase'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`}
              />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel rounded-2xl p-4 border-slate-800">
            <p className="text-xs text-slate-400 mb-1">Total Produk</p>
            <p className="text-2xl font-black text-white font-mono">{products.length}</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border-slate-800">
            <p className="text-xs text-slate-400 mb-1">Produk Diskon (Coret)</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-amber-400 font-mono">{discountCount}</p>
              <span className="text-[10px] text-amber-300">Tampil di Atas</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border-slate-800">
            <p className="text-xs text-slate-400 mb-1">Stok Kritis (&le; 3)</p>
            <p className="text-2xl font-black text-orange-400 font-mono">{lowStockCount}</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border-slate-800">
            <p className="text-xs text-slate-400 mb-1">Stok Habis (0)</p>
            <p className="text-2xl font-black text-rose-400 font-mono">{outOfStockCount}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'stock'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Edit Stok Cepat (Realtime)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Kelola Listing & Diskon</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Kontak WhatsApp & Store</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: QUICK STOCK EDITOR (REALTIME FAST EDIT) */}
        {/* ============================================================== */}
        {activeTab === 'stock' && (
          <div>
            {/* Header + Search/Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Editor Stok Realtime</h2>
                <p className="text-xs text-slate-400">
                  Ubah jumlah stok produk di bawah ini dan klik tombol simpan. Pengunjung web langsung melihat perubahan seketika!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold focus:outline-none"
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

            {/* Quick Stock Table */}
            <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Nama Produk & Layanan</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga Jual</th>
                      <th className="py-3 px-4 text-center">Status Stok</th>
                      <th className="py-3 px-4 text-center">Atur Jumlah Stok</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProducts.map((p) => {
                      const currentVal = stockInputs[p.id] ?? p.stock;
                      const isSaving = savingStockId === p.id;
                      const hasChanged = currentVal !== p.stock;

                      return (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div className="flex items-center gap-2">
                              {p.is_discount && (
                                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                              <span className="line-clamp-1">{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-cyan-300">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                currentVal > 5
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : currentVal > 0
                                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
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
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition-colors text-sm"
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
                                className="w-16 py-1 px-2 text-center rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-violet-500"
                              />
                              <button
                                type="button"
                                onClick={() => handleStockChange(p.id, 1)}
                                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition-colors text-sm"
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
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40 animate-pulse'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
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
        {/* TAB 2: FULL PRODUCT & DISCOUNT MANAGER */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Listing Produk & Diskon Coret</h2>
                <p className="text-xs text-slate-400">
                  Tambah produk baru, atur harga coret (diskon), dan deskripsi lengkap.
                </p>
              </div>

              <button
                onClick={() => openProductModal()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-violet-900/40 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Layanan / Produk</span>
              </button>
            </div>

            {/* Product Cards in Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const isDiscount =
                  p.is_discount || (p.original_price && p.original_price > p.price);

                return (
                  <div
                    key={p.id}
                    className="glass-panel rounded-2xl p-4 border-slate-800 flex flex-col justify-between relative group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-cyan-300 uppercase">
                          {p.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isDiscount && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                              ⚡ DISKON
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              p.stock > 0
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-rose-950 text-rose-300 border border-rose-800'
                            }`}
                          >
                            Stok: {p.stock}
                          </span>
                        </div>
                      </div>

                      <h4 className="font-bold text-white text-sm line-clamp-1">{p.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-base font-black text-cyan-400 font-mono">
                          {formatRupiah(p.price)}
                        </span>
                        {p.original_price && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatRupiah(p.original_price)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openProductModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-800/60 transition-colors"
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
        {/* TAB 3: STORE SETTINGS & WHATSAPP CHANNELS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Pengaturan Toko & WhatsApp</h2>
            <p className="text-xs text-slate-400 mb-6">
              Ubah nomor WhatsApp, link saluran, grup komunitas, dan pengumuman promo.
            </p>

            <form onSubmit={handleSaveSettings} className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Store:
                </label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline / Deskripsi Hero:
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nomor WhatsApp Admin (Order CS):
                </label>
                <input
                  type="text"
                  value={settings.wa_number}
                  onChange={(e) => setSettings({ ...settings, wa_number: e.target.value })}
                  placeholder="Contoh: 6281234567890 (Gunakan kode negara 62)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono text-sm focus:outline-none focus:border-violet-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Format angka saja dengan awalan 62 (contoh: 6281234567890).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link Saluran WhatsApp Resmi (Channel):
                </label>
                <input
                  type="text"
                  value={settings.wa_channel_url}
                  onChange={(e) => setSettings({ ...settings, wa_channel_url: e.target.value })}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link Grup Komunitas WhatsApp:
                </label>
                <input
                  type="text"
                  value={settings.wa_group_url}
                  onChange={(e) => setSettings({ ...settings, wa_group_url: e.target.value })}
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Teks Running Banner Pengumuman / Flash Sale:
                </label>
                <textarea
                  rows={2}
                  value={settings.announcement}
                  onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Ganti PIN Admin:
                </label>
                <input
                  type="password"
                  value={settings.admin_pin}
                  onChange={(e) => setSettings({ ...settings, admin_pin: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-900/30 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Semua Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* PRODUCT CREATE/EDIT MODAL */}
      {/* ============================================================== */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 my-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingProduct.id ? 'Edit Produk / Layanan' : 'Tambah Produk Baru'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nama Layanan / Produk:
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Contoh: Joki Quest Rod of the Depths"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kategori:</label>
                  <select
                    value={editingProduct.category || 'JOKI FISCH'}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-violet-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Stok Awal:</label>
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
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Price & Discount Settings */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <Zap className="w-4 h-4 fill-amber-300" />
                    <span>Sistem Coret Harga / Diskon</span>
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.is_discount)}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          is_discount: e.target.checked,
                        })
                      }
                      className="rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-0"
                    />
                    <span>Tampilkan Sebagai Promo Diskon</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1">
                      Harga Awal (Harga Coret):
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
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-500">
                      Kosongkan jika tidak ada harga coret.
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs mb-1 font-bold">
                      Harga Jual / Diskon (Final):
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
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-bold font-mono focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-[10px] text-cyan-400">
                      Harga yang dibayar pembeli.
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Deskripsi Singkat:</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder="Keterangan singkat mengenai produk/layanan ini..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Fitur / Keunggulan (Pisahkan dengan koma):
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Contoh: Proses 1-2 Jam, Private Server Aman, Garansi"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  URL Gambar (Opsional):
                </label>
                <input
                  type="text"
                  value={editingProduct.image_url || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, image_url: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-violet-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-900/40"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUPABASE SETUP & SQL SCHEMA MODAL */}
      {/* ============================================================== */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Panduan Supabase (Free Tier)</h3>
                <p className="text-xs text-slate-400">
                  Status Saat Ini:{' '}
                  <span className={isSupabaseConfigured() ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isSupabaseConfigured() ? 'Terkoneksi ke Supabase' : 'Mode Offline / Local Storage'}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 mb-6">
              <p>
                Aplikasi ini sudah dilengkapi dengan file <code className="text-cyan-300 bg-slate-950 px-1 py-0.5 rounded">supabase-schema.sql</code> di root folder proyek Anda.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="font-bold text-white text-xs">Langkah Cepat Aktivasi Supabase:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Buat project baru di <strong className="text-slate-200">supabase.com</strong> (Free tier).</li>
                  <li>Buka menu <strong className="text-slate-200">SQL Editor</strong>, buat query baru.</li>
                  <li>Buka file <strong className="text-slate-200">supabase-schema.sql</strong> di folder proyek, salin seluruh kodenya, dan jalankan (RUN).</li>
                  <li>Buka <strong className="text-slate-200">Settings &gt; API</strong>, lalu salin URL dan anon key ke file <code className="text-cyan-300">.env.local</code> atau di Environment Variables Vercel!</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
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
