'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Award,
  Star,
  Check,
  Upload,
  Loader2,
  X,
  Image as ImageIcon,
  Activity,
  ArrowUpRight,
  Sparkles,
  Clock,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { Product, ProductCategory, StoreSettings, VisitorAnalytics, TransactionProof } from '@/types';
import { compressImageFile } from '@/lib/image-utils';
import {
  getProducts,
  getStoreSettings,
  updateProductStock,
  saveProduct,
  deleteProduct,
  saveStoreSettings,
  getTransactionProofs,
  saveTransactionProof,
  deleteTransactionProof,
  formatRupiah,
} from '@/lib/store-service';
import { getVisitorAnalytics } from '@/lib/analytics-service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_TRANSACTIONS } from '@/lib/mock-data';

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
  const [transactions, setTransactions] = useState<TransactionProof[]>(INITIAL_TRANSACTIONS);
  const [analytics, setAnalytics] = useState<VisitorAnalytics>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    dailyHistory: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'stock' | 'products' | 'transactions' | 'settings'>('analytics');

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Transaction Proof Form Modal state
  const [isTrxModalOpen, setIsTrxModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState<Partial<TransactionProof> | null>(null);
  const [isProcessingTrxImage, setIsProcessingTrxImage] = useState(false);
  const [trxImageError, setTrxImageError] = useState<string | null>(null);
  const trxFileInputRef = useRef<HTMLInputElement>(null);

  // Stock edit state
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [savingStockId, setSavingStockId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Schema Modal
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Modern Chart Hover State
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Check auth session & immediately load latest settings for PIN accuracy
  useEffect(() => {
    setPinInput('');
    setAuthError('');
    const session = sessionStorage.getItem('nauuval_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
    // Always load settings immediately on mount so custom admin PIN is up to date
    getStoreSettings().then((storeConfig) => {
      if (storeConfig) setSettings(storeConfig);
    });
  }, []);

  // Load data & analytics
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodList, storeConfig, analyticsData, proofList] = await Promise.all([
        getProducts(),
        getStoreSettings(),
        getVisitorAnalytics(),
        getTransactionProofs(),
      ]);
      setProducts(prodList || []);
      if (storeConfig) setSettings(storeConfig);
      if (analyticsData) setAnalytics(analyticsData);
      if (proofList) setTransactions(proofList);

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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      // Fetch fresh settings in real-time to check against the latest updated PIN
      const freshSettings = await getStoreSettings();
      const activeSettings = freshSettings || settings;
      const correctPin = (activeSettings.admin_pin || 'singularity2026').trim();

      if (pinInput.trim() === correctPin) {
        sessionStorage.setItem('nauuval_admin_auth', 'true');
        setPinInput('');
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('PIN Admin salah. Silakan coba lagi.');
      }
    } catch {
      const fallbackPin = (settings.admin_pin || 'singularity2026').trim();
      if (pinInput.trim() === fallbackPin) {
        sessionStorage.setItem('nauuval_admin_auth', 'true');
        setPinInput('');
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError('PIN Admin salah. Silakan coba lagi.');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nauuval_admin_auth');
    setPinInput('');
    setAuthError('');
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
      description: '',
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

  // Open Transaction Proof Modal
  const openTrxModal = (trx?: TransactionProof) => {
    setTrxImageError(null);
    setIsProcessingTrxImage(false);
    if (trx) {
      setEditingTrx({ ...trx });
    } else {
      setEditingTrx({
        buyer_name: '',
        service_name: '',
        category: 'JOKI FISCH',
        amount: 50000,
        date: 'Hari ini',
        rating: 5,
        image_url: '',
        notes: '',
      });
    }
    setIsTrxModalOpen(true);
  };

  // Handle transaction proof file upload
  const handleTrxFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTrxImageError(null);
    setIsProcessingTrxImage(true);

    try {
      const compressed = await compressImageFile(file);
      setEditingTrx((prev) => (prev ? { ...prev, image_url: compressed } : null));
    } catch (err: any) {
      console.error(err);
      setTrxImageError(err.message || 'Gagal memproses gambar. Coba file lain.');
    } finally {
      setIsProcessingTrxImage(false);
    }
  };

  // Save Transaction Proof
  const handleSaveTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrx?.buyer_name || !editingTrx?.service_name) {
      showNotify('error', 'Nama Pembeli dan Layanan wajib diisi.');
      return;
    }

    const saved = await saveTransactionProof({
      ...editingTrx,
      image_url: editingTrx?.image_url || '',
    } as any);
    if (saved) {
      showNotify('success', 'Bukti transaksi berhasil disimpan!');
      setIsTrxModalOpen(false);
      const updatedList = await getTransactionProofs();
      setTransactions(updatedList);
    } else {
      showNotify('error', 'Gagal menyimpan bukti transaksi.');
    }
  };

  // Delete Transaction Proof
  const handleDeleteTrx = async (id: string) => {
    if (confirm('Hapus bukti transaksi ini?')) {
      const ok = await deleteTransactionProof(id);
      if (ok) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        showNotify('success', 'Bukti transaksi berhasil dihapus.');
      } else {
        showNotify('error', 'Gagal menghapus bukti.');
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

  // Max visits for visual bar scaling
  const maxDailyVisit = useMemo(() => {
    if (!analytics.dailyHistory.length) return 100;
    return Math.max(...analytics.dailyHistory.map((d) => d.count), 50);
  }, [analytics]);

  // Computed data for Hi-Tech Spline Area Chart (matches reference dashboard)
  const chartMetrics = useMemo(() => {
    const rawData =
      analytics.dailyHistory && analytics.dailyHistory.length > 0
        ? analytics.dailyHistory
        : Array.from({ length: 14 }).map((_, i) => ({
            date: `2026-10-${String(16 + i).padStart(2, '0')}`,
            count: i === 13 ? analytics.today : Math.floor(analytics.thisWeek / 7),
          }));

    const padL = 35;
    const padR = 25;
    const padT = 30;
    const padB = 35;
    const width = 680;
    const height = 230;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const maxCount = Math.max(...rawData.map((d) => d.count), 12);

    const points = rawData.map((d, i) => {
      const x = padL + (i / Math.max(1, rawData.length - 1)) * plotW;
      const y = padT + plotH - (d.count / maxCount) * plotH;
      return { x, y, date: d.date, count: d.count };
    });

    const generateSpline = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return '';
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const cpx = (p0.x + p1.x) / 2;
        d += ` C ${cpx.toFixed(1)} ${p0.y.toFixed(1)}, ${cpx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
      }
      return d;
    };

    const mainLine = generateSpline(points);
    const mainArea =
      points.length > 0
        ? `${mainLine} L ${points[points.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`
        : '';

    // Secondary comparison curve (subtle red/coral baseline, like reference image)
    const secondaryPoints = points.map((p, idx) => ({
      x: p.x,
      y: Math.min(padT + plotH - 6, p.y + 30 + (idx % 2 === 0 ? 8 : -8)),
    }));
    const secLine = generateSpline(secondaryPoints);
    const secArea =
      secondaryPoints.length > 0
        ? `${secLine} L ${secondaryPoints[secondaryPoints.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${secondaryPoints[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`
        : '';

    const peakPoint =
      points.length > 0
        ? points.reduce((max, p) => (p.count >= max.count ? p : max), points[0])
        : null;

    return {
      width,
      height,
      padL,
      padR,
      padT,
      padB,
      plotW,
      plotH,
      maxCount,
      points,
      mainLine,
      mainArea,
      secLine,
      secArea,
      peakPoint,
    };
  }, [analytics]);

  const formatDateLabel = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[2], 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const m = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
        return `${day} ${m}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const popularProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative w-full max-w-sm rounded-2xl metallic-card p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-[#00df82]" />
            </div>
            <h1 className="text-xl font-black text-white uppercase font-mono tracking-tight">
              Admin nauuvalstore
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Masukkan PIN untuk mengelola stok, promo & bukti transaksi
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-bold text-zinc-400 mb-1.5 uppercase">
                PIN Akses Admin:
              </label>
              <input
                type="password"
                name="admin_security_token_field"
                id="admin_security_token_field"
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN Admin..."
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00df82] font-mono tracking-widest text-center"
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
              className="w-full py-3 px-4 rounded-xl bg-[#00df82] text-black hover:bg-[#00c774] font-black text-xs shadow-md transition-all uppercase tracking-wider"
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
              ? 'bg-zinc-900 border border-[#00df82] text-white'
              : 'bg-zinc-900 border border-rose-500 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#00df82]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#08090d]/85 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl metallic-card text-zinc-400 hover:text-white"
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
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-zinc-800 metallic-card hover:border-white transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-[#00df82]" />
              <span className="hidden sm:inline">
                {isSupabaseConfigured() ? 'Supabase Connected' : 'Setup Database'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured() ? 'bg-[#00df82]' : 'bg-zinc-600 animate-pulse'
                }`}
              />
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg metallic-card hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5"
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
                ? 'bg-[#00df82] text-black font-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-950 border border-transparent'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Listing & Produk Promo</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-950 border border-transparent'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Bukti Transaksi ({transactions.length})</span>
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
        {/* TAB 1: HI-TECH VISITOR ANALYTICS DASHBOARD (MATCHES REFERENCE) */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f59b] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f59b]" />
                  </span>
                  <span className="text-[11px] font-mono tracking-widest text-[#00f59b] uppercase font-bold">
                    Live Analytics & Visitor Overview
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white font-mono tracking-tight">
                  Statistik & Analisa Pengunjung
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Pantau pergerakan trafik pengunjung, tren calon pembeli, serta kepuasan pelanggan secara realtime.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={loadData}
                  className="px-3.5 py-2 rounded-xl bg-[#0e131b] border border-[#1b2433] hover:border-[#00f59b]/50 text-xs font-bold text-zinc-200 hover:text-white flex items-center gap-2 transition-all shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#00f59b]" />
                  <span>Perbarui Data</span>
                </button>
              </div>
            </div>

            {/* TOP 4 KPI STAT METRIC CARDS (Matches Reference image top row) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Pengunjung Hari Ini */}
              <div className="bg-[#0e131b] border border-[#1b2433] hover:border-[#00f59b]/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Pengunjung Hari Ini
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#00f59b]/10 border border-[#00f59b]/20 flex items-center justify-center text-[#00f59b]">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono tracking-tight">
                    {analytics.today.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">user</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00f59b]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+33.45%</span>
                  <span className="text-zinc-500 font-normal">vs kemarin</span>
                </div>
              </div>

              {/* Card 2: Pengunjung 7 Hari */}
              <div className="bg-[#0e131b] border border-[#1b2433] hover:border-[#00f59b]/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Pengunjung 7 Hari
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono tracking-tight">
                    {analytics.thisWeek.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">user</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00f59b]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+28.60%</span>
                  <span className="text-zinc-500 font-normal">7 hari terakhir</span>
                </div>
              </div>

              {/* Card 3: Minat Order / Chat WA */}
              <div className="bg-[#0e131b] border border-[#1b2433] hover:border-[#00f59b]/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Estimasi Minat Order
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono tracking-tight">
                    {Math.max(1, Math.round(analytics.thisWeek * 0.45))}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">klik WA</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00f59b]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+65.55%</span>
                  <span className="text-zinc-500 font-normal">tingkat minat</span>
                </div>
              </div>

              {/* Card 4: Total Kunjungan Kumulatif */}
              <div className="bg-[#0e131b] border border-[#1b2433] hover:border-[#00f59b]/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Total Kunjungan
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-white font-mono tracking-tight">
                    {analytics.total.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">total</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#00f59b]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+100%</span>
                  <span className="text-zinc-500 font-normal">all-time</span>
                </div>
              </div>
            </div>

            {/* MAIN CHART & SIDEBAR SECTION (Matches Reference layout 2 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT 2 COLS: Smooth Curved Spline Area Chart (Audience Chart) */}
              <div className="lg:col-span-2 bg-[#0e131b] border border-[#1b2433] rounded-2xl p-6 relative flex flex-col justify-between">
                {/* Chart Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Audience & Tren Trafik
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                        {analytics.thisWeek.toLocaleString('id-ID')} Kunjungan
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00f59b]/10 text-[#00f59b] text-xs font-bold font-mono">
                        <ArrowUpRight className="w-3 h-3" />
                        +43.46% 7 hari terakhir
                      </span>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00f59b] shadow-[0_0_8px_#00f59b]" />
                      <span>Trafik Harian</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                      <span>Estimasi Baseline</span>
                    </div>
                  </div>
                </div>

                {/* SVG Curve Chart */}
                <div className="w-full relative mt-2 select-none">
                  <svg
                    viewBox={`0 0 ${chartMetrics.width} ${chartMetrics.height}`}
                    className="w-full h-auto overflow-visible"
                  >
                    <defs>
                      {/* Main Glowing Emerald Area Gradient */}
                      <linearGradient id="emeraldCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00f59b" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#00f59b" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#00f59b" stopOpacity="0.0" />
                      </linearGradient>

                      {/* Secondary Coral Area Gradient */}
                      <linearGradient id="coralCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                      </linearGradient>

                      {/* Glow Filter for Primary Curve */}
                      <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#00f59b" floodOpacity="0.6" />
                      </filter>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line
                      x1={chartMetrics.padL}
                      y1={chartMetrics.padT}
                      x2={chartMetrics.padL + chartMetrics.plotW}
                      y2={chartMetrics.padT}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                      strokeOpacity="0.7"
                    />
                    <line
                      x1={chartMetrics.padL}
                      y1={chartMetrics.padT + chartMetrics.plotH / 2}
                      x2={chartMetrics.padL + chartMetrics.plotW}
                      y2={chartMetrics.padT + chartMetrics.plotH / 2}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                      strokeOpacity="0.7"
                    />
                    <line
                      x1={chartMetrics.padL}
                      y1={chartMetrics.padT + chartMetrics.plotH}
                      x2={chartMetrics.padL + chartMetrics.plotW}
                      y2={chartMetrics.padT + chartMetrics.plotH}
                      stroke="#1e293b"
                      strokeOpacity="0.9"
                    />

                    {/* Secondary Baseline Curve & Area (Matches red/coral curve in reference) */}
                    {chartMetrics.secArea && (
                      <path d={chartMetrics.secArea} fill="url(#coralCurveGrad)" />
                    )}
                    {chartMetrics.secLine && (
                      <path
                        d={chartMetrics.secLine}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.75"
                        strokeOpacity="0.6"
                      />
                    )}

                    {/* Primary Emerald Spline Curve & Area */}
                    {chartMetrics.mainArea && (
                      <path d={chartMetrics.mainArea} fill="url(#emeraldCurveGrad)" />
                    )}
                    {chartMetrics.mainLine && (
                      <path
                        d={chartMetrics.mainLine}
                        fill="none"
                        stroke="#00f59b"
                        strokeWidth="2.75"
                        filter="url(#emeraldGlow)"
                      />
                    )}

                    {/* Highlighted Peak Point with Pulsing Ring */}
                    {chartMetrics.peakPoint && (
                      <g>
                        <circle
                          cx={chartMetrics.peakPoint.x}
                          cy={chartMetrics.peakPoint.y}
                          r={10}
                          fill="none"
                          stroke="#00f59b"
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-ping"
                        />
                        <circle
                          cx={chartMetrics.peakPoint.x}
                          cy={chartMetrics.peakPoint.y}
                          r={5}
                          fill="#00f59b"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        {/* Peak Floating Badge */}
                        <g transform={`translate(${chartMetrics.peakPoint.x}, ${Math.max(18, chartMetrics.peakPoint.y - 28)})`}>
                          <rect
                            x="-44"
                            y="-13"
                            width="88"
                            height="22"
                            rx="6"
                            fill="#0b1016"
                            stroke="#00f59b"
                            strokeWidth="1.5"
                          />
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {chartMetrics.peakPoint.count} Kunjungan
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Interactive Hoverable Points */}
                    {chartMetrics.points.map((pt, idx) => (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r={hoveredChartPoint?.date === pt.date ? 6 : 3}
                        fill={hoveredChartPoint?.date === pt.date ? '#ffffff' : '#00f59b'}
                        stroke="#0e131b"
                        strokeWidth="1.5"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredChartPoint(pt)}
                        onMouseLeave={() => setHoveredChartPoint(null)}
                      />
                    ))}

                    {/* X-Axis Date Labels (Every 2-3 items) */}
                    {chartMetrics.points
                      .filter((_, idx, arr) => idx === 0 || idx === 3 || idx === 6 || idx === 9 || idx === 11 || idx === arr.length - 1)
                      .map((pt, idx, arr) => (
                        <text
                          key={idx}
                          x={pt.x}
                          y={chartMetrics.padT + chartMetrics.plotH + 20}
                          textAnchor={idx === 0 ? 'start' : idx === arr.length - 1 ? 'end' : 'middle'}
                          fill="#64748b"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {idx === arr.length - 1 ? 'Hari Ini' : formatDateLabel(pt.date)}
                        </text>
                      ))}
                  </svg>

                  {/* Dynamic Tooltip on Hover */}
                  {hoveredChartPoint && (
                    <div
                      className="absolute pointer-events-none -top-2 transform -translate-x-1/2 bg-black/90 border border-[#00f59b] px-3 py-1.5 rounded-lg text-xs shadow-xl text-center"
                      style={{
                        left: `${(hoveredChartPoint.x / chartMetrics.width) * 100}%`,
                      }}
                    >
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {formatDateLabel(hoveredChartPoint.date)}
                      </p>
                      <p className="text-white font-mono font-bold">
                        {hoveredChartPoint.count} Kunjungan
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT 1 COL: Audience Satisfaction Donut Gauge & Admin Tips */}
              <div className="space-y-6 flex flex-col justify-between">
                {/* 1. Audience Satisfaction Circular Gauge (Matches Reference) */}
                <div className="bg-[#0e131b] border border-[#1b2433] rounded-2xl p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Kepuasan Pelanggan
                    </span>
                    <div className="flex items-center gap-1 text-[#00f59b]">
                      <Star className="w-3.5 h-3.5 fill-[#00f59b]" />
                      <span className="text-xs font-mono font-bold">5.0</span>
                    </div>
                  </div>

                  {/* Circular SVG Donut Progress */}
                  <div className="relative flex items-center justify-center my-3">
                    <svg viewBox="0 0 140 140" className="w-36 h-36 transform -rotate-90">
                      <defs>
                        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#00f59b" />
                          <stop offset="100%" stopColor="#00e5ff" />
                        </linearGradient>
                        <filter id="gaugeGlow">
                          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#00f59b" floodOpacity="0.5" />
                        </filter>
                      </defs>

                      {/* Background Track Ring */}
                      <circle
                        cx="70"
                        cy="70"
                        r="52"
                        stroke="#1e293b"
                        strokeWidth="11"
                        fill="none"
                      />

                      {/* Foreground Progress Ring (98.5% progress = 326.7 * (1 - 0.985) = 4.9 offset) */}
                      <circle
                        cx="70"
                        cy="70"
                        r="52"
                        stroke="url(#gaugeGrad)"
                        strokeWidth="11"
                        strokeDasharray="326.7"
                        strokeDashoffset="12"
                        strokeLinecap="round"
                        fill="none"
                        filter="url(#gaugeGlow)"
                      />
                    </svg>

                    {/* Center Percentage & Rating */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-white font-mono tracking-tight">
                        98.5%
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider mt-0.5">
                        PUAS & AMAN
                      </span>
                    </div>
                  </div>

                  {/* Legend below gauge */}
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-3 border-t border-[#1b2433]">
                    <span>0%</span>
                    <span className="text-zinc-300 font-semibold">36+ Testimoni Riil</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* 2. Tips Konversi Admin Banner (Matches Reference Webinars card) */}
                <div className="bg-gradient-to-br from-[#0c141d] via-[#090f15] to-[#0c1a17] border border-[#1b2433] hover:border-[#00f59b]/40 rounded-2xl p-6 relative overflow-hidden transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#00f59b]/15 text-[#00f59b] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Flame className="w-3 h-3" />
                      Tips Penjualan
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mb-1.5 leading-snug">
                    Tingkatkan Order di Jam Ramai!
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Trafik calon pembeli Roblox Fisch & Blox Fruit paling ramai pada pukul 18:00 - 22:00 WIB. Pastikan stok selalu ready.
                  </p>
                  <button
                    onClick={() => setActiveTab('stock')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00f59b] hover:text-white transition-colors group"
                  >
                    <span>Buka Edit Stok Cepat</span>
                    <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Popular Catalog Items (Matches Reference's "Popular Episodes") */}
            <div className="bg-[#0e131b] border border-[#1b2433] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00f59b]" />
                    <span>Layanan & Produk Paling Diminati (Popular Catalog)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Produk dengan tingkat minat dan pencarian order tertinggi oleh pelanggan.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-bold text-[#00f59b] hover:underline flex items-center gap-1"
                >
                  <span>Kelola Semua ({products.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#1b2433]">
                {popularProducts.map((p, idx) => (
                  <div
                    key={p.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#121924]/50 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#00f59b]/10 border border-[#00f59b]/20 flex items-center justify-center text-[#00f59b] font-mono font-bold text-xs shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {p.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-mono text-zinc-400">
                            {p.category}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-[11px] font-mono text-[#00f59b] font-semibold">
                            {formatRupiah(p.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Stok: {p.stock} Ready
                      </span>
                      <button
                        onClick={() => openProductModal(p)}
                        className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-xs text-zinc-300 hover:text-white font-semibold transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: QUICK STOCK EDITOR (REALTIME WITH RADAR BLIP) */}
        {/* ============================================================== */}
        {activeTab === 'stock' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white uppercase font-mono">
                  Editor Stok Realtime
                </h2>
                <p className="text-xs text-zinc-400">
                  Ubah jumlah stok dan klik tombol Simpan. Pengunjung langsung melihat perubahan dengan sensor blip seketika.
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
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#00df82]"
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

            <div className="metallic-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/80 text-zinc-400 border-b border-zinc-800 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Nama Produk & Layanan</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga Final</th>
                      <th className="py-3 px-4 text-center">Status Stok</th>
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
                                <Zap className="w-3.5 h-3.5 text-[#00df82] fill-[#00df82] shrink-0" />
                              )}
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black border border-zinc-800 text-zinc-300 font-mono">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-white font-bold">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border font-mono inline-flex items-center gap-1.5 ${
                                currentVal > 5
                                  ? 'bg-zinc-900 text-zinc-100 border-zinc-700'
                                  : currentVal > 0
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-600/70'
                                  : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                              }`}
                            >
                              {currentVal > 0 && (
                                <span className="relative flex h-2 w-2">
                                  <span className={`animate-radar-blip absolute inline-flex h-full w-full rounded-full opacity-75 ${currentVal <= 3 ? 'bg-amber-400' : 'bg-[#00df82]'}`} />
                                  <span className={`relative inline-flex rounded-full h-2 w-2 ${currentVal <= 3 ? 'bg-amber-400' : 'bg-[#00df82]'}`} />
                                </span>
                              )}
                              <span>
                                {currentVal > 5
                                  ? 'Ready Stock'
                                  : currentVal > 0
                                  ? 'Sisa Sedikit'
                                  : 'Stok Habis'}
                              </span>
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
                                className="w-16 py-1 px-2 text-center rounded-lg bg-black border border-zinc-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-[#00df82]"
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
                                  ? 'bg-[#00df82] text-black shadow-md font-black'
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
                  Tambah layanan baru, atur status Produk Promo dengan outline hijau neon, dan tentukan harga awal serta promo.
                </p>
              </div>

              <button
                onClick={() => openProductModal()}
                className="px-4 py-2.5 rounded-xl bg-[#00df82] text-black hover:bg-[#00c774] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Layanan Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const isPromo =
                  p.is_discount || (p.original_price && p.original_price > p.price);

                return (
                  <div
                    key={p.id}
                    className={`metallic-card rounded-2xl p-5 flex flex-col justify-between ${
                      isPromo ? 'promo-lime-border' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black border border-zinc-800 text-zinc-300 uppercase font-mono">
                          {p.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isPromo && (
                            <span className="promo-lime-badge px-2 py-0.5 rounded text-[10px] font-black">
                              PROMO
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${
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
                        <span className={`text-lg font-black font-mono ${isPromo ? 'promo-lime-text' : 'text-white'}`}>
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
        {/* TAB 4: BUKTI TRANSAKSI (MANUAL TRANSACTION PROOF MANAGER) */}
        {/* ============================================================== */}
        {activeTab === 'transactions' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white uppercase font-mono">
                  Kelola Bukti Transaksi Sukses
                </h2>
                <p className="text-xs text-zinc-400">
                  Tambahkan bukti transaksi baru (screenshot, nama pembeli, rating) yang tampil di carousel web.
                </p>
              </div>

              <button
                onClick={() => openTrxModal()}
                className="px-4 py-2.5 rounded-xl bg-[#00df82] text-black hover:bg-[#00c774] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Bukti Transaksi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transactions.map((trx) => (
                <div
                  key={trx.id}
                  className="metallic-card rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono font-bold text-white text-sm">
                        {trx.buyer_name}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black border border-zinc-800 text-zinc-400 font-mono uppercase">
                        {trx.category}
                      </span>
                    </div>

                    <p className="font-bold text-zinc-200 text-sm mb-1">{trx.service_name}</p>
                    <p className="text-base font-black text-white font-mono mb-2">
                      {formatRupiah(trx.amount)}
                    </p>

                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(trx.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#00df82] text-[#00df82]" />
                      ))}
                      <span className="text-[11px] font-mono text-zinc-400 ml-1">
                        {trx.date || 'Hari ini'}
                      </span>
                    </div>

                    {trx.notes && (
                      <p className="text-xs text-zinc-400 italic line-clamp-2 mt-2">
                        &ldquo;{trx.notes}&rdquo;
                      </p>
                    )}

                    {trx.image_url && (
                      <div className="relative mt-3 h-28 rounded-xl overflow-hidden border border-zinc-800 bg-black/60">
                        <img
                          src={trx.image_url}
                          alt={`Bukti ${trx.buyer_name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between">
                    <a
                      href={trx.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#00df82] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Foto Full</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openTrxModal(trx)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTrx(trx.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: STORE SETTINGS & WHATSAPP CHANNELS */}
        {/* ============================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-white uppercase font-mono mb-1">
              Pengaturan Toko & WhatsApp
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              Ubah nomor WhatsApp, link saluran resmi, grup komunitas, dan pengumuman promo.
            </p>

            <form onSubmit={handleSaveSettings} className="metallic-card rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 uppercase">
                  Nama Store:
                </label>
                <input
                  type="text"
                  value={settings.store_name}
                  onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00df82] font-mono"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00df82]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:border-[#00df82]"
                />
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00df82]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00df82]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#00df82]"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white text-sm font-mono focus:outline-none focus:border-[#00df82]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#00df82] text-black hover:bg-[#00c774] font-black text-xs uppercase shadow-md flex items-center justify-center gap-2"
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
      {/* PRODUCT CREATE/EDIT MODAL */}
      {/* ============================================================== */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl metallic-card p-6 sm:p-7 shadow-2xl">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#00df82] font-semibold"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#00df82] font-semibold"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white font-mono focus:outline-none focus:border-[#00df82]"
                  />
                </div>
              </div>

              {/* Price & Promo Settings */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#00df82] flex items-center gap-1.5 text-xs uppercase">
                    <Zap className="w-3.5 h-3.5 fill-[#00df82]" />
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
                      className="rounded bg-zinc-900 border-zinc-700 text-[#00df82] focus:ring-0"
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
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono focus:outline-none focus:border-[#00df82]"
                    />
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
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-[#00df82] font-bold font-mono focus:outline-none focus:border-[#00df82]"
                    />
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
                  className="px-5 py-2 rounded-xl bg-[#00df82] text-black hover:bg-[#00c774] font-black text-xs shadow-md"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TRANSACTION PROOF CREATE/EDIT MODAL */}
      {/* ============================================================== */}
      {isTrxModalOpen && editingTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl metallic-card p-6 sm:p-7 shadow-2xl my-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white uppercase font-mono">
                {editingTrx.id ? 'Edit Bukti Transaksi' : 'Tambah Bukti Transaksi Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsTrxModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTrx} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">
                    Nama Pembeli (Disamarkan):
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTrx.buyer_name || ''}
                    onChange={(e) => setEditingTrx({ ...editingTrx, buyer_name: e.target.value })}
                    placeholder="Contoh: Dan***99"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#00df82] font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">Kategori:</label>
                  <select
                    value={editingTrx.category || 'JOKI FISCH'}
                    onChange={(e) =>
                      setEditingTrx({
                        ...editingTrx,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#00df82]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1 uppercase">
                  Nama Layanan / Pesanan:
                </label>
                <input
                  type="text"
                  required
                  value={editingTrx.service_name || ''}
                  onChange={(e) => setEditingTrx({ ...editingTrx, service_name: e.target.value })}
                  placeholder="Contoh: Joki Quest Rod of the Depths"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">
                    Nominal Transaksi (Rp):
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingTrx.amount ?? 50000}
                    onChange={(e) =>
                      setEditingTrx({
                        ...editingTrx,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white font-mono focus:outline-none focus:border-[#00df82]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 mb-1 uppercase">
                    Waktu Transaksi:
                  </label>
                  <input
                    type="text"
                    value={editingTrx.date || 'Hari ini'}
                    onChange={(e) => setEditingTrx({ ...editingTrx, date: e.target.value })}
                    placeholder="Contoh: Hari ini / 28 Okt 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white font-mono focus:outline-none focus:border-[#00df82]"
                  />
                </div>
              </div>

              {/* Rating Selector */}
              <div>
                <label className="block font-bold text-zinc-300 mb-1 uppercase">
                  Rating Testimoni:
                </label>
                <div className="flex items-center gap-2 bg-black border border-zinc-800 rounded-xl p-2.5">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingTrx({ ...editingTrx, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (editingTrx.rating ?? 5)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-zinc-400 font-mono text-xs ml-2">
                    {editingTrx.rating ?? 5} / 5 Bintang
                  </span>
                </div>
              </div>

              {/* Upload Screenshot from Device */}
              <div>
                <label className="block font-bold text-zinc-300 mb-1 uppercase">
                  Bukti Screenshot (Upload dari Perangkat / Galeri):
                </label>
                <input
                  type="file"
                  ref={trxFileInputRef}
                  accept="image/*"
                  onChange={handleTrxFileChange}
                  className="hidden"
                />

                {editingTrx.image_url ? (
                  <div className="relative rounded-xl border border-zinc-700 overflow-hidden bg-black p-2">
                    <img
                      src={editingTrx.image_url}
                      alt="Preview Bukti"
                      className="w-full h-40 object-cover rounded-lg border border-zinc-800"
                    />
                    <div className="flex items-center justify-between gap-2 mt-2 px-1">
                      <button
                        type="button"
                        onClick={() => trxFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#00df82]" />
                        <span>Ganti Gambar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTrx({ ...editingTrx, image_url: '' })}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/50 text-red-300 text-[11px] font-bold flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => trxFileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-800 hover:border-[#00df82] rounded-xl p-5 text-center cursor-pointer bg-zinc-950/60 hover:bg-zinc-900/40 transition-all flex flex-col items-center justify-center gap-2"
                  >
                    {isProcessingTrxImage ? (
                      <>
                        <Loader2 className="w-6 h-6 text-[#00df82] animate-spin" />
                        <span className="text-zinc-400">Mengompres & memproses gambar...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                          <Upload className="w-5 h-5 text-[#00df82]" />
                        </div>
                        <div className="text-zinc-200 font-bold">Pilih Gambar dari Perangkat</div>
                        <div className="text-zinc-500 text-[11px]">
                          Pilih file JPG, PNG, WEBP dari komputer atau HP
                        </div>
                      </>
                    )}
                  </div>
                )}

                {trxImageError && (
                  <p className="mt-1 text-red-400 text-[11px]">{trxImageError}</p>
                )}

                <div className="mt-2">
                  <details className="text-[11px] text-zinc-500">
                    <summary className="cursor-pointer hover:text-zinc-300 select-none">
                      Atau ketik tautan URL gambar secara manual
                    </summary>
                    <input
                      type="text"
                      value={editingTrx.image_url || ''}
                      onChange={(e) => setEditingTrx({ ...editingTrx, image_url: e.target.value })}
                      placeholder="https://..."
                      className="mt-1.5 w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#00df82]"
                    />
                  </details>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 mb-1 uppercase">
                  Catatan / Testimoni Pembeli:
                </label>
                <textarea
                  rows={2}
                  value={editingTrx.notes || ''}
                  onChange={(e) => setEditingTrx({ ...editingTrx, notes: e.target.value })}
                  placeholder="Contoh: Proses kilat 30 menit selesai, rod mythic langsung dapat!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-[#00df82]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsTrxModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isProcessingTrxImage}
                  className="px-5 py-2 rounded-xl bg-[#00df82] text-black hover:bg-[#00c774] font-black text-xs shadow-md disabled:opacity-50"
                >
                  Simpan Bukti
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
          <div className="relative w-full max-w-lg rounded-2xl metallic-card p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#00df82]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase font-mono">
                  Setup Supabase Database (Free Tier)
                </h3>
                <p className="text-xs text-zinc-400">
                  Status:{' '}
                  <span className={isSupabaseConfigured() ? 'text-[#00df82] font-bold' : 'text-zinc-400 font-bold'}>
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
                className="px-4 py-2 rounded-xl bg-[#00df82] text-black font-black text-xs"
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
