-- =========================================================================
-- NAUUVALSTORE - SUPABASE SCHEMA & INITIAL SEED (FREE TIER)
-- =========================================================================
-- Cara pakai:
-- 1. Buka dashboard Supabase (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Masuk ke menu "SQL Editor"
-- 3. Copy semua isi file ini, paste ke SQL Editor, lalu klik tombol "RUN"
-- 4. Buka Project Settings -> API -> Salin URL dan anon key ke .env.local
-- =========================================================================

-- 1. Tabel Products (Katalog Joki & Kebutuhan)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('JOKI FISCH', 'JOKI BLOX FRUIT', 'KEBUTUHAN FISCH', 'KEBUTUHAN BLOX FRUIT')),
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  is_discount BOOLEAN DEFAULT false,
  stock INTEGER NOT NULL DEFAULT 10,
  image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Store Settings (Info Store, WhatsApp, Saluran & Grup)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  store_name TEXT DEFAULT 'nauuvalstore',
  tagline TEXT DEFAULT 'TERMURAH - TERCEPAT - TERPERCAYA',
  wa_number TEXT DEFAULT '6281234567890',
  wa_channel_url TEXT DEFAULT 'https://whatsapp.com/channel/0029VaXXXXXX',
  wa_group_url TEXT DEFAULT 'https://chat.whatsapp.com/XXXXXX',
  announcement TEXT DEFAULT '🔥 FLASH PROMO NAUUVALSTORE: TERMURAH - TERCEPAT - TERPERCAYA! Slot Terbatas Setiap Hari!',
  admin_pin TEXT DEFAULT 'singularity2026',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Site Visits (Analisa Pengunjung Harian, Mingguan, Bulanan)
CREATE TABLE IF NOT EXISTS public.site_visits (
  id BIGSERIAL PRIMARY KEY,
  visited_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visited_at TIMESTAMPTZ DEFAULT now(),
  page_path TEXT DEFAULT '/',
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_site_visits_date ON public.site_visits(visited_date);

-- 4. Aktifkan Realtime Replication untuk sinkronisasi live stock & produk
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

-- 5. Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Policy untuk read publik (Semua pengunjung bisa melihat katalog)
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert visits" ON public.site_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read visits" ON public.site_visits FOR SELECT USING (true);

-- Policy untuk modifikasi (Admin / Anon untuk kemudahan web pribadi)
CREATE POLICY "Allow anon update products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon update settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Seed Data Awal (Settings)
INSERT INTO public.store_settings (id, store_name, tagline, wa_number, wa_channel_url, wa_group_url, announcement, admin_pin)
VALUES (
  'general',
  'nauuvalstore',
  'TERMURAH - TERCEPAT - TERPERCAYA',
  '6281234567890',
  'https://whatsapp.com/channel/0029VaXXXXXX',
  'https://chat.whatsapp.com/XXXXXX',
  '🔥 FLASH PROMO NAUUVALSTORE: TERMURAH - TERCEPAT - TERPERCAYA! Slot Terbatas Setiap Hari!',
  'singularity2026'
)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  tagline = EXCLUDED.tagline;

-- 7. Seed Data Awal (Katalog Produk & Layanan)
INSERT INTO public.products (id, name, category, description, price, original_price, is_discount, stock, is_active, sort_order)
VALUES
  ('fisch-joki-1', 'Joki Level Fisch (1 - 100 Express)', 'JOKI FISCH', '', 35000, 50000, true, 8, true, 1),
  ('fisch-joki-2', 'Joki Quest Rod of the Depths / Destiny Rod', 'JOKI FISCH', '', 65000, 85000, true, 5, true, 2),
  ('fisch-joki-3', 'Joki Bestiary Unlock All Island (Terima Beres)', 'JOKI FISCH', '', 80000, null, false, 4, true, 3),
  ('bf-joki-1', 'Joki Max Level (1 - 2550) Paket Hemat', 'JOKI BLOX FRUIT', '', 49000, 70000, true, 12, true, 4),
  ('bf-joki-2', 'Joki Melee Godhuman / Sanguine Art', 'JOKI BLOX FRUIT', '', 65000, 90000, true, 6, true, 5),
  ('bf-joki-3', 'Joki Cursed Dual Katana (CDK) + Soul Guitar', 'JOKI BLOX FRUIT', '', 75000, null, false, 3, true, 6),
  ('bf-joki-4', 'Joki Race Awakening V4 (Full Gear Tier 5)', 'JOKI BLOX FRUIT', '', 55000, 75000, true, 2, true, 7),
  ('fisch-item-1', 'Paket C$ (Cash) Fisch 2.500.000 C$', 'KEBUTUHAN FISCH', '', 25000, 35000, true, 20, true, 8),
  ('fisch-item-2', 'Bundle 15x Enchant Relic + 5x Aurora Totem', 'KEBUTUHAN FISCH', '', 40000, 55000, true, 7, true, 9),
  ('fisch-item-3', 'Akun Starter Fisch: Rod of the Depths + 5Jt C$', 'KEBUTUHAN FISCH', '', 85000, null, false, 3, true, 10),
  ('bf-item-1', 'Physical Fruit Kitsune / Dragon Rework', 'KEBUTUHAN BLOX FRUIT', '', 110000, 140000, true, 2, true, 11),
  ('bf-item-2', 'Paket Beli 50.000.000 + 50.000 Fragment', 'KEBUTUHAN BLOX FRUIT', '', 35000, 45000, true, 15, true, 12),
  ('bf-item-3', 'Akun Blox Fruit Max Level 2550 + Godhuman + CDK', 'KEBUTUHAN BLOX FRUIT', '', 130000, 165000, true, 1, true, 13),
  ('bf-item-4', 'Carry Raid Dough / Buddha Full Awaken (Paket 5x)', 'KEBUTUHAN BLOX FRUIT', '', 20000, null, false, 10, true, 14)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  is_discount = EXCLUDED.is_discount,
  stock = EXCLUDED.stock;
