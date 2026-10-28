'use client';

import React from 'react';
import { ShieldCheck, UserCheck, RefreshCw, Smartphone, Award, Lock } from 'lucide-react';

export default function WhyUs() {
  const points = [
    {
      icon: ShieldCheck,
      title: '100% Anti Hackback & Aman',
      desc: 'Keamanan akun pembeli adalah prioritas utama. Kami tidak pernah meminta email reset atau mengubah credential akun Anda.',
      color: 'text-violet-400',
    },
    {
      icon: UserCheck,
      title: 'Pengerjaan Manual Pro Player',
      desc: 'Bebas dari script ilegal / exploit berbahaya yang berisiko banned. Semua joki dijalankan murni skill oleh tim berpengalaman.',
      color: 'text-cyan-400',
    },
    {
      icon: RefreshCw,
      title: 'Garansi Uang Kembali Penuh',
      desc: 'Jika ada kendala dari pihak kami atau pesanan tidak sesuai tenggat waktu perjanjian, saldo dikembalikan 100% tanpa potongan.',
      color: 'text-emerald-400',
    },
    {
      icon: Smartphone,
      title: 'QRIS & Semua E-Wallet',
      desc: 'Dukung QRIS instan semua bank (BCA, Mandiri, BRI, BNI) serta e-wallet terpopuler (DANA, GoPay, OVO, ShopeePay).',
      color: 'text-amber-400',
    },
    {
      icon: Award,
      title: 'Track Record & Ribuan Order',
      desc: 'Telah melayani ribuan player Roblox di Indonesia dengan ulasan positif bintang lima di saluran dan grup komunitas kami.',
      color: 'text-indigo-400',
    },
    {
      icon: Lock,
      title: 'Private Server Eksklusif',
      desc: 'Proses joki farming maupun quest dilakukan di private server khusus agar terbebas dari player rusuh / bounty hunter liar.',
      color: 'text-teal-400',
    },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold mb-3">
            <span>STANDAR KUALITAS KAMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kenapa Memilih Singularity Store?
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Komitmen kami memberikan layanan joki teraman, tercepat, dan paling memuaskan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="glass-panel glass-panel-hover rounded-2xl p-6 border-slate-800/80 flex items-start gap-4"
              >
                <div className={`p-3 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0 ${pt.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1.5">{pt.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
