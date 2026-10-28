export type ProductCategory = 
  | 'JOKI FISCH'
  | 'JOKI BLOX FRUIT'
  | 'KEBUTUHAN FISCH'
  | 'KEBUTUHAN BLOX FRUIT';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // Harga jual / harga setelah diskon
  original_price?: number | null; // Harga coret / awal sebelum diskon
  is_discount: boolean;
  stock: number;
  image_url?: string;
  features: string[];
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
