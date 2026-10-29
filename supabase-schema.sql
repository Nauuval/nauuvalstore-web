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
  store_name TEXT DEFAULT 'Nauuvalstore',
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

-- 4. Tabel Bukti Transaksi Sukses
CREATE TABLE IF NOT EXISTS public.transaction_proofs (
  id TEXT PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  date TEXT DEFAULT 'Hari ini',
  image_url TEXT,
  rating INTEGER DEFAULT 5,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Aktifkan Realtime Replication untuk sinkronisasi live
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

-- 6. Grant Permissions & Row Level Security (RLS)
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.store_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.transaction_proofs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_visits TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_proofs ENABLE ROW LEVEL SECURITY;

-- Policy untuk Products (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow public read products" ON public.products;
DROP POLICY IF EXISTS "Allow anon update products" ON public.products;
DROP POLICY IF EXISTS "Allow public all products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete products" ON public.products;
CREATE POLICY "Allow public select products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update products" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete products" ON public.products FOR DELETE USING (true);

-- Policy untuk Store Settings
DROP POLICY IF EXISTS "Allow public read settings" ON public.store_settings;
DROP POLICY IF EXISTS "Allow anon update settings" ON public.store_settings;
CREATE POLICY "Allow public select settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update settings" ON public.store_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert settings" ON public.store_settings FOR INSERT WITH CHECK (true);

-- Policy untuk Site Visits
DROP POLICY IF EXISTS "Allow public insert visits" ON public.site_visits;
DROP POLICY IF EXISTS "Allow public read visits" ON public.site_visits;
CREATE POLICY "Allow public select visits" ON public.site_visits FOR SELECT USING (true);
CREATE POLICY "Allow public insert visits" ON public.site_visits FOR INSERT WITH CHECK (true);

-- Policy untuk Transaction Proofs (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow public read transactions" ON public.transaction_proofs;
DROP POLICY IF EXISTS "Allow anon update transactions" ON public.transaction_proofs;
DROP POLICY IF EXISTS "Allow public delete transactions" ON public.transaction_proofs;
CREATE POLICY "Allow public select transactions" ON public.transaction_proofs FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" ON public.transaction_proofs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transactions" ON public.transaction_proofs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete transactions" ON public.transaction_proofs FOR DELETE USING (true);

-- 7. Seed Data Awal (Settings)
INSERT INTO public.store_settings (id, store_name, tagline, wa_number, wa_channel_url, wa_group_url, announcement, admin_pin)
VALUES (
  'general',
  'Nauuvalstore',
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

-- 8. Seed Data Awal (36 Katalog Produk & Layanan Lengkap)
INSERT INTO public.products (id, name, category, description, price, original_price, is_discount, stock, is_active, sort_order)
VALUES
  -- JOKI FISCH
  ('fisch-joki-1', 'Joki Level Fisch (1 - 100 Express)', 'JOKI FISCH', '', 35000, 50000, true, 8, true, 1),
  ('fisch-joki-2', 'Joki Quest Rod of the Depths / Destiny Rod', 'JOKI FISCH', '', 65000, 85000, true, 5, true, 2),
  ('fisch-joki-3', 'Joki Bestiary Unlock All Island (Terima Beres)', 'JOKI FISCH', '', 80000, null, false, 4, true, 3),
  ('fisch-joki-4', 'Joki Mythic Catch: Megalodon & Colossal Squid', 'JOKI FISCH', '', 45000, 60000, true, 6, true, 4),
  ('fisch-joki-5', 'Joki Sunken Rod / Trident Rod Unlock Full', 'JOKI FISCH', '', 55000, 75000, true, 4, true, 5),
  ('fisch-joki-6', 'Joki Level Fisch 100 - 250 (Endgame Leveling)', 'JOKI FISCH', '', 70000, 90000, true, 3, true, 6),
  ('fisch-joki-7', 'Joki Quest The Depths Key + Maze Puzzle', 'JOKI FISCH', '', 30000, null, false, 9, true, 7),
  ('fisch-joki-8', 'Joki Enchant Tier S (Sea King / Resilient / Hasty)', 'JOKI FISCH', '', 40000, 55000, true, 5, true, 8),
  ('fisch-joki-9', 'Joki All Titles Master Angler + 100% Mutation', 'JOKI FISCH', '', 95000, 125000, true, 2, true, 9),

  -- JOKI BLOX FRUIT
  ('bf-joki-1', 'Joki Max Level (1 - 2550) Paket Hemat', 'JOKI BLOX FRUIT', '', 49000, 70000, true, 12, true, 10),
  ('bf-joki-2', 'Joki Melee Godhuman / Sanguine Art', 'JOKI BLOX FRUIT', '', 65000, 90000, true, 6, true, 11),
  ('bf-joki-3', 'Joki Cursed Dual Katana (CDK) + Soul Guitar', 'JOKI BLOX FRUIT', '', 75000, 95000, true, 3, true, 12),
  ('bf-joki-4', 'Joki Race Awakening V4 (Full Gear Tier 5)', 'JOKI BLOX FRUIT', '', 55000, 75000, true, 4, true, 13),
  ('bf-joki-5', 'Joki Raid Boss Dough King / Rip Indra Spawn & Kill', 'JOKI BLOX FRUIT', '', 35000, 50000, true, 7, true, 14),
  ('bf-joki-6', 'Joki Dark Blade V3 / Saber V2 Unlock Express', 'JOKI BLOX FRUIT', '', 45000, null, false, 5, true, 15),
  ('bf-joki-7', 'Joki Mastery Fruit / Sword 1 - 600 Max', 'JOKI BLOX FRUIT', '', 30000, 45000, true, 10, true, 16),
  ('bf-joki-8', 'Joki Leviathan Heart / Leviathan Shield Hunt', 'JOKI BLOX FRUIT', '', 70000, 95000, true, 2, true, 17),
  ('bf-joki-9', 'Joki Terror Shark & Sea Beast Hunting (Material)', 'JOKI BLOX FRUIT', '', 40000, null, false, 8, true, 18),
  ('bf-joki-10', 'Joki Mirage Island Hunt + Blue Gear V4', 'JOKI BLOX FRUIT', '', 50000, 65000, true, 5, true, 19),

  -- KEBUTUHAN FISCH
  ('fisch-item-1', 'Paket C$ (Cash) Fisch 2.500.000 C$', 'KEBUTUHAN FISCH', '', 25000, 35000, true, 20, true, 20),
  ('fisch-item-2', 'Paket C$ (Cash) Fisch 10.000.000 C$ (Sultan)', 'KEBUTUHAN FISCH', '', 75000, 100000, true, 10, true, 21),
  ('fisch-item-3', 'Bundle 15x Enchant Relic + 5x Aurora Totem', 'KEBUTUHAN FISCH', '', 40000, 55000, true, 7, true, 22),
  ('fisch-item-4', 'Paket 10x Megalodon Bait + Mythical Bait Box', 'KEBUTUHAN FISCH', '', 30000, null, false, 14, true, 23),
  ('fisch-item-5', 'Akun Starter Fisch: Rod of the Depths + 5Jt C$', 'KEBUTUHAN FISCH', '', 85000, 110000, true, 3, true, 24),
  ('fisch-item-6', 'Akun Sultan Fisch: Trident Rod + 25Jt C$ + Max Level', 'KEBUTUHAN FISCH', '', 140000, 180000, true, 2, true, 25),
  ('fisch-item-7', 'Totem Pack: 10x Eclipse + 10x Tempest Totem', 'KEBUTUHAN FISCH', '', 35000, 45000, true, 9, true, 26),
  ('fisch-item-8', 'Gamepass Fisch Gifting: Auto Reel + Extra Luck', 'KEBUTUHAN FISCH', '', 45000, null, false, 11, true, 27),

  -- KEBUTUHAN BLOX FRUIT
  ('bf-item-1', 'Physical Fruit Kitsune / Dragon Rework', 'KEBUTUHAN BLOX FRUIT', '', 110000, 140000, true, 3, true, 28),
  ('bf-item-2', 'Physical Fruit Leopard / T-Rex Mythical', 'KEBUTUHAN BLOX FRUIT', '', 65000, 85000, true, 4, true, 29),
  ('bf-item-3', 'Physical Fruit Dough / Venom / Portal', 'KEBUTUHAN BLOX FRUIT', '', 45000, 60000, true, 6, true, 30),
  ('bf-item-4', 'Paket Beli 50.000.000 + 50.000 Fragment', 'KEBUTUHAN BLOX FRUIT', '', 35000, 45000, true, 15, true, 31),
  ('bf-item-5', 'Paket Beli 100.000.000 + 100.000 Fragment', 'KEBUTUHAN BLOX FRUIT', '', 65000, 85000, true, 8, true, 32),
  ('bf-item-6', 'Akun Blox Fruit Max Level 2550 + Godhuman + CDK', 'KEBUTUHAN BLOX FRUIT', '', 130000, 165000, true, 2, true, 33),
  ('bf-item-7', 'Akun Blox Fruit Polosan Max Level 2550 (Siap Main)', 'KEBUTUHAN BLOX FRUIT', '', 45000, 60000, true, 12, true, 34),
  ('bf-item-8', 'Akun Starter Blox Fruit: Perm Fruit + Sanguine Art', 'KEBUTUHAN BLOX FRUIT', '', 160000, 195000, true, 1, true, 35),
  ('bf-item-9', 'Carry Raid Dough / Buddha Full Awaken (Paket 5x)', 'KEBUTUHAN BLOX FRUIT', '', 20000, null, false, 10, true, 36)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  is_discount = EXCLUDED.is_discount,
  stock = EXCLUDED.stock;
