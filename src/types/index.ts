export type ProductCategory = 
  | 'JOKI FISCH'
  | 'JOKI BLOX FRUIT'
  | 'KEBUTUHAN FISCH'
  | 'KEBUTUHAN BLOX FRUIT';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description?: string;
  price: number; // Harga jual / harga setelah promo
  original_price?: number | null; // Harga awal sebelum promo
  is_discount: boolean; // Menandakan Produk Promo
  stock: number;
  image_url?: string;
  features?: string[];
  is_active: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline: string;
  wa_number: string;
  wa_channel_url: string;
  wa_group_url: string;
  announcement: string;
  admin_pin: string;
  updated_at?: string;
}

export interface DailyVisit {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface VisitorAnalytics {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  dailyHistory: DailyVisit[];
}
