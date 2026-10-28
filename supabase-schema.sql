-- =========================================================================
-- SINGULARITY JOKI STORE - SUPABASE SCHEMA & INITIAL SEED
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
  store_name TEXT DEFAULT 'SINGULARITY STORE',
  tagline TEXT DEFAULT 'Penyedia Layanan Joki & Kebutuhan Gaming Roblox Terpercaya',
  wa_number TEXT DEFAULT '6281234567890',
  wa_channel_url TEXT DEFAULT 'https://whatsapp.com/channel/0029VaXXXXXX',
  wa_group_url TEXT DEFAULT 'https://chat.whatsapp.com/XXXXXX',
  announcement TEXT DEFAULT '⚡ FLASH SALE SINGULARITY: Diskon Joki & Kebutuhan Fisch & Blox Fruit hingga 35%! Slot Terbatas!',
  admin_pin TEXT DEFAULT 'singularity2026',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Aktifkan Realtime Replication untuk sinkronisasi live stock & produk
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.store_settings;

-- 4. Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Policy untuk read publik (Semua pengunjung bisa melihat katalog)
CREATE POLICY "Allow public read products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow public read settings" ON public.store_settings
  FOR SELECT USING (true);

-- Policy untuk modifikasi (Admin / Anon untuk kemudahan web pribadi)
CREATE POLICY "Allow anon update products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon update settings" ON public.store_settings
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed Data Awal (Settings)
INSERT INTO public.store_settings (id, store_name, tagline, wa_number, wa_channel_url, wa_group_url, announcement, admin_pin)
VALUES (
  'general',
  'SINGULARITY STORE',
  'Penyedia Layanan Joki & Kebutuhan Gaming Roblox Terpercaya & Bergaransi',
  '6281234567890',
  'https://whatsapp.com/channel/0029VaXXXXXX',
  'https://chat.whatsapp.com/XXXXXX',
  '⚡ FLASH SALE SINGULARITY: Diskon Joki & Kebutuhan Fisch & Blox Fruit hingga 35%! Slot Terbatas!',
  'singularity2026'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Data Awal (Katalog Produk & Layanan)
INSERT INTO public.products (id, name, category, description, price, original_price, is_discount, stock, image_url, features, is_active, sort_order)
VALUES
  (
    'fisch-joki-1',
    'Joki Level Fisch (1 - 100 Express)',
    'JOKI FISCH',
    'Jasa leveling akun Fisch dari level 1 sampai 100 dengan proses kilat dan aman via private server.',
    35000,
    55000,
    true,
    8,
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    '["Proses 1-3 Jam", "Private Server 100% Aman", "Bonus Ikan Legend / Mythic", "Garansi Anti Banned"]'::jsonb,
    true,
    1
  ),
  (
    'fisch-joki-2',
    'Joki Quest Rod of the Depths / Destiny Rod',
    'JOKI FISCH',
    'Pengerjaan quest rod tier tertinggi di Fisch. Terima beres langsung dapat rod impian Anda.',
    65000,
    90000,
    true,
    5,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    '["Joki Oleh Pro Player", "Item & Bahan Quest Disiapkan", "Bonus C$ Melimpah", "Bisa Request Live Update"]'::jsonb,
    true,
    2
  ),
  (
    'fisch-joki-3',
    'Joki Bestiary Unlock All Island (Terima Beres)',
    'JOKI FISCH',
    'Bantu lengkapi koleksi Bestiary semua pulau dari Sunstone hingga Vertigo & The Depths.',
    85000,
    null,
    false,
    4,
    'https://images.unsplash.com/photo-1516655855035-d5215adc5604?auto=format&fit=crop&w=600&q=80',
    '["Buka 90%+ Bestiary", "Dapat Ratusan Title Langka", "Proses Cepat & Rapih", "Semua Hasil Milik Buyer"]'::jsonb,
    true,
    3
  ),
  (
    'bf-joki-1',
    'Joki Max Level (1 - 2550) Paket Hemat',
    'JOKI BLOX FRUIT',
    'Leveling akun Blox Fruit dari level 1 sampai Max Level 2550. Bonus Beli & Fragment jutaan.',
    49000,
    75000,
    true,
    12,
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    '["Pengerjaan 1-2 Hari", "Bonus 15Jt+ Beli & Ribuan Frag", "Anti Rollback / Aman 100%", "Update via WhatsApp"]'::jsonb,
    true,
    4
  ),
  (
    'bf-joki-2',
    'Joki Melee Godhuman / Sanguine Art',
    'JOKI BLOX FRUIT',
    'Bantu unlock Fighting Style terkuat Melee Godhuman atau Sanguine Art lengkap dengan materialnya.',
    70000,
    95000,
    true,
    6,
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    '["Mastery Melee Ditingkatkan", "Material Leviathan / Levi Heart", "100% Pengerjaan Manual Pro", "Garansi Kepuasan"]'::jsonb,
    true,
    5
  ),
  (
    'bf-joki-3',
    'Joki Cursed Dual Katana (CDK) + Soul Guitar',
    'JOKI BLOX FRUIT',
    'Paket kombo senjata meta PvP Blox Fruit. Yama & Tushita mastery 350 + puzzle quest selesai.',
    80000,
    null,
    false,
    3,
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    '["Paket 2 Senjata Meta Sekaligus", "Termasuk Quest Altar & Soul", "Aman Tanpa Script Cheat", "Free Konsultasi Stat"]'::jsonb,
    true,
    6
  ),
  (
    'bf-joki-4',
    'Joki Race Awakening V4 (Full Gear Tier 5)',
    'JOKI BLOX FRUIT',
    'Buka potensi penuh V4 ras karaktermu (Cyborg, Ghoul, Human, Mink, Shark, Angel).',
    60000,
    80000,
    true,
    2,
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    '["Full Trial & Mirage Island", "Full Gear Max Tier", "Bebas Pilih Ras", "Proses Cepat Bersama Tim"]'::jsonb,
    true,
    7
  ),
  (
    'fisch-item-1',
    'Paket C$ (Cash) Fisch 2.500.000 C$',
    'KEBUTUHAN FISCH',
    'Instant C$ koin untuk belanja rod mahal, bobber, enchant relics dan keliling pulau bebas.',
    25000,
    35000,
    true,
    20,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    '["Pengiriman Via Trade / Gift", "Proses 5-10 Menit Selesai", "Legal & Anti Minus", "Bonus 250k C$ Ekstra"]'::jsonb,
    true,
    8
  ),
  (
    'fisch-item-2',
    'Bundle 15x Enchant Relic + 5x Aurora Totem',
    'KEBUTUHAN FISCH',
    'Paket amunisi berburu enchant langka dan summon event Aurora untuk memancing Mythic fish.',
    45000,
    60000,
    true,
    7,
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    '["15 Enchant Relics", "5 Aurora Totems", "Stock Ready Kirim", "Panduan Lokasi Mancing"]'::jsonb,
    true,
    9
  ),
  (
    'fisch-item-3',
    'Akun Starter Fisch: Rod of the Depths + 5Jt C$',
    'KEBUTUHAN FISCH',
    'Akun polosan siap pakai, belum verifikasi email/nomor hp, 100% aman dan langsung pro.',
    95000,
    null,
    false,
    3,
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    '["Polosan (Email Belum Verif)", "Rod Tier Tertinggi", "Koin C$ 5.000.000+", "Garansi Akun 100%"]'::jsonb,
    true,
    10
  ),
  (
    'bf-item-1',
    'Physical Fruit Kitsune / Dragon Rework',
    'KEBUTUHAN BLOX FRUIT',
    'Fruit Mythical fisik siap kirim via trade server private. Stok limited & fast transfer.',
    110000,
    150000,
    true,
    2,
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    '["Trade Cepat 5 Menit", "Via Private Server Seller", "100% Buah Fisik Permanen Inventory", "Stok Terbatas"]'::jsonb,
    true,
    11
  ),
  (
    'bf-item-2',
    'Paket Beli 50.000.000 + 50.000 Fragment',
    'KEBUTUHAN BLOX FRUIT',
    'Suntik saldo Beli & Frag akun untuk reroll race awakening, beli true triple katana, upgrade weapon.',
    35000,
    50000,
    true,
    15,
    'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=600&q=80',
    '["Pengerjaan Cepat", "Aman dari Banned/Reset", "Bonus Naik Mastery", "Bisa Request Split Frag"]'::jsonb,
    true,
    12
  ),
  (
    'bf-item-3',
    'Akun Blox Fruit Max Level 2550 + Godhuman + CDK',
    'KEBUTUHAN BLOX FRUIT',
    'Akun monster siap PvP! Full Godhuman, Cursed Dual Katana, Soul Guitar, Soul Reaper Title.',
    135000,
    175000,
    true,
    1,
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    '["Email & No HP Kosong (Unverified)", "Melee Godhuman Max Mastery", "CDK + Soul Guitar Siap Tempur", "Garansi Seumur Hidup"]'::jsonb,
    true,
    13
  ),
  (
    'bf-item-4',
    'Carry Raid Dough / Buddha Full Awaken (Paket 5x)',
    'KEBUTUHAN BLOX FRUIT',
    'Jasa carry raid chip spesial sampai selesai. Kamu cukup duduk diam di spawn point.',
    20000,
    null,
    false,
    10,
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    '["Chip Dari Seller", "Proses Kilat 15 Menit", "Awaken Semua Skill", "Free Konsultasi Build"]'::jsonb,
    true,
    14
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  is_discount = EXCLUDED.is_discount,
  stock = EXCLUDED.stock;
