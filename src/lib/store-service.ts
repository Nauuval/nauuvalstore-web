import { Product, StoreSettings } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './mock-data';

const LOCAL_PRODUCTS_KEY = 'singularity_products_v1';
const LOCAL_SETTINGS_KEY = 'singularity_settings_v1';
const LOCAL_EVENT_NAME = 'singularity_store_update';

// Format angka ke format Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper local storage
function getLocalProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function setLocalProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
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

// --- API / SERVICE FUNCTIONS ---

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
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
      return data as StoreSettings;
    }
  }

  return getLocalSettings();
}

export async function updateProductStock(id: string, newStock: number): Promise<boolean> {
  const stockVal = Math.max(0, Math.floor(newStock));
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase
      .from('products')
      .update({ stock: stockVal, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) return true;
    console.error('Supabase stock update error:', error);
  }

  // Local fallback
  const products = getLocalProducts();
  const updated = products.map((p) => (p.id === id ? { ...p, stock: stockVal } : p));
  setLocalProducts(updated);
  return true;
}

export async function saveProduct(product: Partial<Product> & { name: string }): Promise<Product | null> {
  const supabase = getSupabaseClient();

  // If is_discount is true or original_price is greater than price, mark is_discount
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

  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .upsert(payload)
      .select()
      .single();

    if (!error && data) {
      return data as Product;
    }
    console.error('Supabase upsert product error:', error);
  }

  // Local fallback
  const products = getLocalProducts();
  const exists = products.some((p) => p.id === payload.id);
  const updated = exists
    ? products.map((p) => (p.id === payload.id ? payload : p))
    : [payload, ...products];

  setLocalProducts(updated);
  return payload;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) return true;
    console.error('Supabase delete error:', error);
  }

  const products = getLocalProducts();
  const updated = products.filter((p) => p.id !== id);
  setLocalProducts(updated);
  return true;
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

// WhatsApp Link Generator with Pre-filled message
export function buildWhatsAppOrderUrl(
  waNumber: string,
  product: Product,
  details?: { username?: string; notes?: string }
): string {
  // Clean phone number (replace + and - and spaces)
  const cleanPhone = waNumber.replace(/[^0-9]/g, '');

  const finalPrice = formatRupiah(product.price);
  const discountText = product.is_discount && product.original_price
    ? ` (🔥 Diskon dari ${formatRupiah(product.original_price)})`
    : '';

  const message = [
    `Halo Admin ${INITIAL_SETTINGS.store_name}, saya ingin order layanan/produk ini:`,
    ``,
    `📦 *Nama Produk*: ${product.name}`,
    `🏷️ *Kategori*: ${product.category}`,
    `💰 *Harga*: ${finalPrice}${discountText}`,
    `📊 *Stok Saat Dilihat*: ${product.stock > 0 ? `${product.stock} Tersedia` : 'Habis (Pre-Order)'}`,
    details?.username ? `🎮 *Username Roblox*: ${details.username}` : `🎮 *Username Roblox*: (Tolong infokan formatnya min)`,
    details?.notes ? `📝 *Catatan / Request*: ${details.notes}` : ``,
    ``,
    `Apakah slot masih tersedia untuk diproses sekarang? Terima kasih!`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// Generic WA Consultation URL
export function buildWhatsAppConsultUrl(waNumber: string, context?: string): string {
  const cleanPhone = waNumber.replace(/[^0-9]/g, '');
  const message = context
    ? `Halo Admin, saya ingin konsultasi mengenai: ${context}`
    : `Halo Admin Singularity Store, saya mau tanya-tanya seputar layanan Joki Fisch / Blox Fruit & kebutuhan akun.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
