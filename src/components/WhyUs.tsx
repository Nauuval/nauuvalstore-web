'use client';

import React from 'react';
import { ShieldCheck, UserCheck, RefreshCw, Smartphone, Award, Lock } from 'lucide-react';

export default function WhyUs() {
  const points = [
    {
      icon: ShieldCheck,
      title: '100% Anti Hackback & Aman',
      desc: 'Keamanan akun adalah nomor satu. Password & data rahasia tidak pernah disalahgunakan dan langsung dihapus setelah joki selesai.',
    },
    {
      icon: UserCheck,
      title: 'Pengerjaan Manual Pro Player',
      desc: 'Tanpa script cheat / exploit ilegal yang berisiko banned server Roblox. Murni skill tim penjoki berpengalaman.',
    },
    {
      icon: RefreshCw,
      title: 'Garansi Penggantian Penuh',
      desc: 'Jika pesanan tidak selesai sesuai target waktu yang dijanjikan, dana dikembalikan 100% tanpa potongan.',
    },
    {
      icon: Smartphone,
      title: 'QRIS & Semua E-Wallet',
      desc: 'Mendukung QRIS instan semua bank (BCA, BRI, Mandiri, BNI) serta e-wallet terpopuler (DANA, GoPay, OVO, ShopeePay).',
    },
    {
      icon: Award,
      title: 'Reputasi & Ribuan Testimoni',
      desc: 'Telah dipercaya komunitas player Roblox di Indonesia dengan reputasi amanah dan testimoni bintang lima di saluran WA.',
    },
    {
      icon: Lock,
      title: 'Private Server Eksklusif',
      desc: 'Farming ikan Fisch dan quest Blox Fruit dilakukan di private server khusus agar terbebas dari gangguan player lain.',
    },
  ];

  return (
    <section id="why-us" className="py-14 sm:py-20 relative bg-black border-b border-zinc-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold mb-3 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>STANDAR LAYANAN</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Kenapa Memilih nauuvalstore?
          </h2>
          <p className="mt-2 text-zinc-400 text-xs sm:text-sm">
            Komitmen kami: TERMURAH - TERCEPAT - TERPERCAYA di setiap transaksi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 hover:border-white transition-all flex items-start gap-4"
              >
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-700 shrink-0 text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{pt.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
