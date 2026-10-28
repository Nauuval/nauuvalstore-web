'use client';

import React from 'react';
import { MousePointerClick, CheckSquare, CreditCard, Rocket, ArrowRight } from 'lucide-react';

export default function HowToOrder() {
  const steps = [
    {
      step: '01',
      title: 'Pilih Layanan & Cek Stok',
      description: 'Pilih produk yang kamu inginkan di katalog. Perhatikan label stok realtime dan badge Produk Promo.',
      icon: MousePointerClick,
    },
    {
      step: '02',
      title: 'Order via WhatsApp',
      description: 'Klik "Order via WhatsApp", sistem otomatis merapikan format pemesanan berisi produk dan harga.',
      icon: CheckSquare,
    },
    {
      step: '03',
      title: 'Konfirmasi Pembayaran',
      description: 'Admin memberikan nomor rekening / QRIS instan resmi. Pembayaran aman & verifikasi cepat.',
      icon: CreditCard,
    },
    {
      step: '04',
      title: 'Pengerjaan Kilat & Bergaransi',
      description: 'Akun diproses via Private Server secara manual tanpa script exploit. Garansi aman 100%.',
      icon: Rocket,
    },
  ];

  return (
    <section id="how-to-order" className="py-14 sm:py-20 relative bg-[#08090d] border-b border-zinc-800/80 scroll-mt-20">
      <div className="absolute inset-0 bg-topo-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-bold mb-3 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>ALUR TRANSAKSI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Cara Order di nauuvalstore
          </h2>
          <p className="mt-2 text-zinc-400 text-xs sm:text-sm">
            4 Langkah mudah dan transparan langsung terhubung dengan admin resmi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="metallic-card rounded-2xl p-6 flex flex-col justify-between relative group"
              >
                <div className="absolute top-3 right-4 font-mono font-black text-4xl text-zinc-800 select-none pointer-events-none group-hover:text-zinc-600 transition-colors">
                  {item.step}
                </div>

                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-black transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
