# 🌌 SINGULARITY STORE - WEB PROFIL JOKI & KATALOG REALTIME

Landing page modern dan profil store penyedia jasa joki Roblox (**FISCH** & **BLOX FRUIT**) dan kebutuhan akun, dilengkapi **katalog dengan stok realtime**, sistem **diskon coret harga**, pusat komunikasi **WhatsApp resmi (Saluran, Grup, Direct CS)**, serta **Admin Panel** terintegrasi dengan **Supabase Database (Free Tier)**. Siap dideploy langsung ke **Vercel**.

---

## ✨ Fitur Utama

1. **Tema Singularity (Futuristik & Sleek Cosmic Black)**
   - Desain gelap berkelas bernuansa cosmic singularity, event horizon glow (violet & cyan neon), grid pattern, dan glassmorphism cards.
2. **Kategori Layanan Lengkap**:
   - `JOKI FISCH` (Leveling, Quest Rod of the Depths, Destiny Rod, Bestiary)
   - `JOKI BLOX FRUIT` (Max Level 2550, Godhuman, CDK, Race Awakening V4)
   - `KEBUTUHAN FISCH` (Paket Koin C$, Enchant Relics, Aurora Totem, Akun Starter)
   - `KEBUTUHAN BLOX FRUIT` (Buah Fisik Kitsune/Dragon, Beli & Fragment, Akun Monster)
3. **Sistem Stok Realtime**:
   - Status visual langsung: `🟢 Ready Stock (X)`, `🟡 Sisa Sedikit (X)`, `🔴 Habis`.
   - Menggunakan **Supabase Realtime Postgres Changes** (tanpa refresh halaman).
4. **Sistem Coret Harga (Diskon Spesial)**:
   - Menampilkan harga awal (coret) dan harga diskon.
   - Badge persentase hemat (contoh `-35%` / `Hemat Rp 25.000`).
   - Bagian **⚡ Flash Sale & Diskon Spesial** otomatis tampil di bagian teratas.
5. **Pusat Komunikasi WhatsApp Lengkap**:
   - 📢 **Saluran WhatsApp Resmi (Channel)** untuk update restock & kupon diskon.
   - 👥 **Grup Komunitas WhatsApp** untuk wadah mabar, info event, dan giveaway.
   - 💬 **Direct WhatsApp Admin** untuk konsultasi 24 jam dan pesan joki.
   - 🚀 **Format Order Otomatis**: Tombol pemesanan langsung membuka WhatsApp dengan format pesan rapi berisi nama produk, kategori, harga diskon, username Roblox, dan catatan tambahan.
6. **Admin Panel Lengkap (`/admin`)**:
   - Dilindungi **PIN Admin** (Default: `singularity2026`).
   - **Editor Stok Cepat (Quick Stock Manager)**: Atur stok dengan tombol `+` / `-` atau ketik langsung dalam 1 klik.
   - **Listing Manager**: Tambah/edit produk dengan input harga awal, harga diskon, status promo, stok, kategori, dan keunggulan fitur.
   - **Store Settings**: Ubah nomor WhatsApp, link saluran, link grup, dan teks pengumuman running banner dari admin panel.
7. **Zero-Friction Fallback**:
   - Jika Supabase belum dihubungkan, web tetap berjalan 100% menggunakan data mock & sinkronisasi local storage antar tab.

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
# 1. Masuk ke folder proyek
cd "d:\WEB\Upgrade Web"

# 2. Jalankan development server
npm run dev

# 3. Buka di browser
# Website Utama: http://localhost:3000
# Admin Panel:   http://localhost:3000/admin (PIN: singularity2026)
```

---

## 🗄️ Panduan Menghubungkan Supabase (Gratis / Free Tier)

1. Daftar atau login di [Supabase](https://supabase.com/).
2. Buat project baru (pilih region terdekat, misalnya Singapore).
3. Buka menu **SQL Editor** di sidebar Supabase.
4. Buka file `supabase-schema.sql` yang ada di folder proyek ini, salin seluruh kodenya, paste ke SQL Editor Supabase, lalu klik tombol **RUN**.
   *(File ini otomatis membuat tabel `products`, `store_settings`, mengaktifkan Realtime replication, dan mengisi seed produk awal).*
5. Buka menu **Project Settings > API** di Supabase, lalu salin:
   - **Project URL**
   - **Project API Anon Key**
6. Buat file `.env.local` di folder proyek ini:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
7. Selesai! Web Anda sekarang langsung terhubung dengan database live cloud Supabase secara realtime.

---

## 🌐 Panduan Deploy ke Vercel

1. Push folder proyek ini ke repository GitHub pribadi Anda:
   ```bash
   git add .
   git commit -m "feat: singularity joki store landing page and admin"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com/) -> Klik **Add New Project** -> Pilih repo GitHub Anda.
3. Di bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = (URL Supabase Anda)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon Key Supabase Anda)
4. Klik tombol **Deploy**. Website akan langsung online dan siap digunakan dengan domain gratis `*.vercel.app` atau custom domain Anda!

---

## 🔐 Kredensial Admin Awal

- **URL Admin**: `/admin`
- **PIN Default**: `singularity2026` *(Dapat diganti kapan saja melalui tab Pengaturan di Admin Panel)*
