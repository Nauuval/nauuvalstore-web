'use client';

import React from 'react';
import { MousePointerClick, CheckSquare, CreditCard, Rocket, ArrowRight } from 'lucide-react';

export default function HowToOrder() {
  const steps = [
    {
      step: '01',
      title: 'Pilih Layanan & Cek Stok',
      description:
        'Cari produk yang kamu butuhkan di kategori Joki Fisch, Blox Fruit, atau Kebutuhan Akun. Cek ketersediaan slot realtime.',
      icon: MousePointerClick,
      color: 'from-violet-600 to-indigo-600',
    },
    {
      step: '02',
      title: 'Order via WhatsApp',
      description:
        'Klik tombol "Order via WhatsApp", sistem otomatis menyiapkan format pemesanan rapi lengkap dengan nama produk dan harga diskon.',
      icon: CheckSquare,
      color: 'from-indigo-600 to-cyan-600',
    },
    {
      step: '03',
      title: 'Konfirmasi Pembayaran',
      description:
        'Admin mengirimkan instruksi pembayaran aman via QRIS (Semua Bank/e-Wallet), DANA, GoPay, OVO, atau Transfer Bank.',
      icon: CreditCard,
      color: 'from-cyan-600 to-teal-600',
    },
    {
      step: '04',
      title: 'Pengerjaan Kilat & Bergaransi',
      description:
        'Joki langsung dikerjakan via Private Server oleh tim terpercaya. Update progres diberikan berkala hingga selesai 100%.',
      icon: Rocket,
      color: 'from-emerald-600 to-green-600',
    },
  ];

  return (
    <section id="how-to-order" className="py-16 sm:py-24 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold mb-3">
            <span>PANDUAN TRANSAKSI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cara Mudah Order di Singularity
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Proses pemesanan cepat, transparan, dan langsung terhubung dengan admin tanpa birokrasi rumit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border-slate-800 relative group overflow-hidden"
              >
                {/* Step watermarked number */}
                <div className="absolute top-2 right-4 font-mono font-black text-5xl text-slate-800/40 select-none pointer-events-none group-hover:text-violet-500/10 transition-colors">
                  {item.step}
                </div>

                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-5 shadow-lg shadow-violet-900/30 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {index < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <ArrowRight className="w-5 h-5 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
