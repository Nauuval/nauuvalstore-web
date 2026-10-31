import { Product, StoreSettings, TransactionProof, CartItem } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_TRANSACTIONS } from './mock-data';

const LOCAL_PRODUCTS_KEY = 'nauuvalstore_products_v3';
const LOCAL_PRODUCTS_INITIALIZED_KEY = 'nauuvalstore_prod_init_flag_v3';
const LOCAL_SETTINGS_KEY = 'nauuvalstore_settings_v2';
const LOCAL_TRANSACTIONS_KEY = 'nauuvalstore_transactions_v2';
const LOCAL_TRANSACTIONS_INITIALIZED_KEY = 'nauuvalstore_trx_init_flag_v3';
const LOCAL_EVENT_NAME = 'nauuvalstore_store_update';

// Format angka ke format Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Dynamic Indonesian Relative Time Formatter for Reviews / Testimonials
 * Automatically computes "Baru saja", "Hari ini", "Kemarin", "X hari lalu", "X minggu lalu"
 * based on review creation timestamp to ensure dates are always synchronized and never frozen.
 */
export function formatReviewDate(
  dateStr?: string,
  createdAt?: string,
  id?: string
): string {
  let dateObj: Date | null = null;

  // 1. Try to parse createdAt ISO timestamp
  if (createdAt) {
    const parsed = new Date(createdAt);
    if (!isNaN(parsed.getTime())) {
      dateObj = parsed;
    }
  }

  // 2. If no valid createdAt, try extracting timestamp from ID (e.g., trx_1730310000000_abc)
  if (!dateObj && id && id.startsWith('trx_')) {
    const parts = id.split('_');
    if (parts.length >= 2) {
      const timestamp = parseInt(parts[1], 10);
      if (!isNaN(timestamp) && timestamp > 1600000000000 && timestamp < 3000000000000) {
        dateObj = new Date(timestamp);
      }
    }
  }

  // 3. If no dateObj yet, check if dateStr is an ISO date string
  if (!dateObj && dateStr) {
    const lower = dateStr.trim().toLowerCase();
    // If it's already a manual relative phrase that isn't "hari ini", keep it if no real timestamp exists
    if (lower === 'kemarin' || lower.includes('lalu')) {
      return dateStr;
    }
    if (lower !== 'hari ini') {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }
  }

  // 4. If we have a valid Date object, compute relative difference in local days
  if (dateObj) {
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();

    // Reset both to midnight to compare calendar days accurately
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfTarget = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
    const diffCalendarDays = Math.round((startOfToday - startOfTarget) / (1000 * 60 * 60 * 24));

    if (diffCalendarDays <= 0) {
      // Created today or clock slightly ahead
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
        return diffMinutes <= 3 ? 'Baru saja' : `${diffMinutes} menit lalu`;
      }
      return 'Hari ini';
    }

    if (diffCalendarDays === 1) {
      return 'Kemarin';
    }

    if (diffCalendarDays >= 2 && diffCalendarDays <= 6) {
      return `${diffCalendarDays} hari lalu`;
    }

    if (diffCalendarDays >= 7 && diffCalendarDays <= 29) {
      const weeks = Math.floor(diffCalendarDays / 7);
      return `${weeks} minggu lalu`;
    }

    // Over 30 days: format as Indonesian date string, e.g. "28 Okt 2026"
    const MONTHS_ID = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const day = dateObj.getDate();
    const month = MONTHS_ID[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // Fallback
  return dateStr || 'Hari ini';
}

// Helper local storage
export function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const initialized = localStorage.getItem(LOCAL_PRODUCTS_INITIALIZED_KEY);
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);

    // Smooth migration: if user previously modified/saved products in v2, preserve it!
    if (!initialized) {
      const v2Raw = localStorage.getItem('nauuvalstore_products_v2');
      if (v2Raw) {
        localStorage.setItem(LOCAL_PRODUCTS_INITIALIZED_KEY, 'true');
        localStorage.setItem(LOCAL_PRODUCTS_KEY, v2Raw);
        return JSON.parse(v2Raw);
      }
      localStorage.setItem(LOCAL_PRODUCTS_INITIALIZED_KEY, 'true');
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }

    if (raw !== null) {
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
}

export function setLocalProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_PRODUCTS_INITIALIZED_KEY, 'true');
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(LOCAL_EVENT_NAME, { detail: { type: 'products', data: products } }));
  } catch (e) {
    console.error('Error saving local products', e);
  }
}

function getLocalSettings(): StoreSettings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SETTINGS;
  }
}

function setLocalSettings(settings: StoreSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent(LOCAL_EVENT_NAME, { detail: { type: 'settings', data: settings } }));
  } catch (e) {
    console.error('Error saving local settings', e);
  }
}

function getLocalTransactions(): TransactionProof[] {
  if (typeof window === 'undefined') return [];
  try {
    const initialized = localStorage.getItem(LOCAL_TRANSACTIONS_INITIALIZED_KEY);
    const raw = localStorage.getItem(LOCAL_TRANSACTIONS_KEY);

    if (!initialized) {
      localStorage.setItem(LOCAL_TRANSACTIONS_INITIALIZED_KEY, 'true');
      localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }

    if (raw !== null) {
      return JSON.parse(raw);
    }
    return [];
  } catch {
    return [];
  }
}

function setLocalTransactions(transactions: TransactionProof[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_TRANSACTIONS_INITIALIZED_KEY, 'true');
    localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(transactions));
    window.dispatchEvent(new CustomEvent(LOCAL_EVENT_NAME, { detail: { type: 'transactions', data: transactions } }));
  } catch (e) {
    console.error('Error saving local transactions', e);
  }
}

// --- API / SERVICE FUNCTIONS ---

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setLocalProducts(data as Product[]);
      return data as Product[];
    }
  }

  // Fallback to local storage
  return getLocalProducts();
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'general')
      .single();

    if (!error && data) {
      setLocalSettings(data as StoreSettings);
      return data as StoreSettings;
    }
  }

  return getLocalSettings();
}

export async function updateProductStock(id: string, newStock: number): Promise<boolean> {
  const stockVal = Math.max(0, Math.floor(newStock));
  const supabase = getSupabaseClient();
  let success = true;

  if (supabase) {
    const { error } = await supabase
      .from('products')
      .update({ stock: stockVal, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Supabase stock update error:', error);
      success = false;
    }
  }

  // Always update local cache
  const products = getLocalProducts();
  const updated = products.map((p) => (p.id === id ? { ...p, stock: stockVal } : p));
  setLocalProducts(updated);
  return success;
}

export async function saveProduct(product: Partial<Product> & { name: string }): Promise<Product | null> {
  const supabase = getSupabaseClient();

  const isDiscount = product.original_price && product.original_price > (product.price ?? 0)
    ? true
    : Boolean(product.is_discount);

  const payload: Product = {
    id: product.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: product.name,
    category: product.category || 'JOKI FISCH',
    description: product.description || '',
    price: product.price ?? 0,
    original_price: product.original_price ?? null,
    is_discount: isDiscount,
    stock: Math.max(0, product.stock ?? 0),
    image_url: product.image_url || '',
    features: product.features || [],
    is_active: product.is_active ?? true,
    sort_order: product.sort_order ?? 0,
    updated_at: new Date().toISOString(),
  };

  let savedData = payload;

  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .upsert(payload)
      .select()
      .single();

    if (!error && data) {
      savedData = data as Product;
    } else if (error) {
      console.error('Supabase upsert product error:', error);
    }
  }

  // Always keep local storage updated in sync
  const products = getLocalProducts();
  const exists = products.some((p) => p.id === savedData.id);
  const updated = exists
    ? products.map((p) => (p.id === savedData.id ? savedData : p))
    : [savedData, ...products];

  setLocalProducts(updated);
  return savedData;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  let success = true;

  if (supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error:', error);
      success = false;
    }
  }

  // Always keep local cache updated in sync
  const products = getLocalProducts();
  const updated = products.filter((p) => p.id !== id);
  setLocalProducts(updated);

  return success;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase
      .from('store_settings')
      .upsert({ ...settings, updated_at: new Date().toISOString() });

    if (!error) return true;
    console.error('Supabase settings update error:', error);
  }

  setLocalSettings(settings);
  return true;
}

// --- TRANSACTION PROOFS SERVICE ---

export async function getTransactionProofs(): Promise<TransactionProof[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('transaction_proofs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setLocalTransactions(data as TransactionProof[]);
      return data as TransactionProof[];
    }
  }

  return getLocalTransactions();
}

export async function saveTransactionProof(proof: Partial<TransactionProof> & { buyer_name: string; service_name: string }): Promise<TransactionProof | null> {
  const supabase = getSupabaseClient();
  const payload: TransactionProof = {
    id: proof.id || `trx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    buyer_name: proof.buyer_name,
    service_name: proof.service_name,
    category: proof.category || 'JOKI FISCH',
    amount: proof.amount ?? 0,
    date: proof.date || 'Hari ini',
    image_url: proof.image_url || '',
    rating: proof.rating ?? 5,
    notes: proof.notes || '',
    created_at: proof.created_at || new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase
      .from('transaction_proofs')
      .upsert(payload)
      .select()
      .single();

    if (!error && data) {
      return data as TransactionProof;
    }
  }

  const current = getLocalTransactions();
  const exists = current.some((t) => t.id === payload.id);
  const updated = exists ? current.map((t) => (t.id === payload.id ? payload : t)) : [payload, ...current];
  setLocalTransactions(updated);
  return payload;
}

export async function deleteTransactionProof(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  let success = true;

  if (supabase) {
    const { error } = await supabase.from('transaction_proofs').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete trx error:', error);
      success = false;
    }
  }

  const current = getLocalTransactions();
  const updated = current.filter((t) => t.id !== id);
  setLocalTransactions(updated);
  return success;
}

// Realtime subscription handler
export function subscribeToProducts(onUpdate: (products: Product[]) => void): () => void {
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    const channel = supabase
      .channel('realtime_products_feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          const fresh = await getProducts();
          onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Local sync across tabs and same tab
  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.type === 'products') {
      onUpdate(customEvent.detail.data);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === LOCAL_PRODUCTS_KEY && e.newValue) {
      try {
        onUpdate(JSON.parse(e.newValue));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(LOCAL_EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(LOCAL_EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }

  return () => {};
}

// WhatsApp Link Generator with Pre-filled message (Clean, Professional, No Emoji Clutter)
export function buildWhatsAppOrderUrl(
  waNumber: string,
  product: Product,
  details?: { quantity?: number; username?: string; notes?: string }
): string {
  const cleanPhone = waNumber.replace(/[^0-9]/g, '');
  const qty = details?.quantity && details.quantity > 0 ? details.quantity : 1;
  const totalPrice = product.price * qty;
  const finalSinglePrice = formatRupiah(product.price);
  const discountText = product.is_discount && product.original_price
    ? ` (Diskon Promo dari ${formatRupiah(product.original_price)})`
    : '';

  const message = [
    `Halo Admin Nauuvalstore, saya ingin order:`,
    ``,
    `*Detail Pesanan:*`,
    `- Layanan / Produk: ${product.name}`,
    `- Kategori: ${product.category}`,
    `- Harga Satuan: ${finalSinglePrice}${discountText}`,
    `- Jumlah Pembelian: ${qty}x`,
    `- Total Pembayaran: ${formatRupiah(totalPrice)}`,
    ``,
    `Apakah pesanan ini bisa diproses sekarang? Terima kasih.`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Generic WA Consultation URL
export function buildWhatsAppConsultUrl(waNumber: string, context?: string): string {
  const cleanPhone = waNumber.replace(/[^0-9]/g, '');
  const message = context
    ? `Halo Admin Nauuvalstore, saya ingin konsultasi mengenai: ${context}`
    : `Halo Admin Nauuvalstore, saya mau tanya-tanya seputar layanan Joki Fisch / Blox Fruit & kebutuhan akun.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Multi-item Cart WhatsApp Checkout Link Generator
export function buildWhatsAppCartOrderUrl(
  waNumber: string,
  items: CartItem[],
  orderId?: string
): string {
  const cleanPhone = waNumber.replace(/[^0-9]/g, '');
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const itemsListText = items
    .map((item, index) => {
      const subtotal = item.product.price * item.quantity;
      return `${index + 1}. *${item.product.name}*\n   • Kategori: ${item.product.category}\n   • Jumlah: ${item.quantity}x @ ${formatRupiah(item.product.price)}\n   • Subtotal: ${formatRupiah(subtotal)}`;
    })
    .join('\n\n');

  const message = [
    `Halo Admin Nauuvalstore, saya ingin checkout pesanan dari Keranjang Belanja:`,
    ...(orderId ? [``, `🔖 *KODE PESANAN:* #${orderId}`] : []),
    ``,
    `📋 *DAFTAR ITEM PESANAN:*`,
    itemsListText,
    ``,
    `💰 *TOTAL PEMBAYARAN: ${formatRupiah(totalPrice)}*`,
    ``,
    `Mohon info ketersediaan antrean dan instruksi pembayaran via QRIS / Bank / E-Wallet. Terima kasih!`,
  ].join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
