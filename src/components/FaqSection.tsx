'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Zap, Clock, CreditCard, Lock } from 'lucide-react';

interface FaqItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    icon: <Lock className="w-4 h-4 text-[#00df82]" />,
    question: 'Apakah akun Roblox saya dijamin aman saat proses joki?',
    answer:
      'Sangat aman 100%. Kami menggunakan metode manual murni tanpa script ilegal atau cheat berbahaya. Kami juga menyarankan mengaktifkan PIN akun Roblox atau 2-Step Verification demi kenyamanan Anda.',
  },
  {
    id: 'faq-2',
    icon: <Clock className="w-4 h-4 text-[#00df82]" />,
    question: 'Berapa lama estimasi waktu pengerjaan joki?',
    answer:
      'Pengerjaan sangat kilat, rata-rata hanya membutuhkan waktu 15 - 45 menit untuk item/quest reguler, dan beberapa jam untuk paket level tinggi. Kami selalu menginfokan progres secara berkala via WhatsApp.',
  },
  {
    id: 'faq-3',
    icon: <CreditCard className="w-4 h-4 text-[#00df82]" />,
    question: 'Metode pembayaran apa saja yang diterima?',
    answer:
      'Kami menerima semua metode pembayaran modern: QRIS instan (BCA, Mandiri, BRI, BNI), E-Wallet (DANA, GoPay, OVO, ShopeePay), transfer bank, serta pulsa/alfamart (via e-wallet).',
  },
  {
    id: 'faq-4',
    icon: <Zap className="w-4 h-4 text-[#00df82]" />,
    question: 'Bisa request joki custom yang tidak ada di daftar katalog?',
    answer:
      'Tentu bisa! Silakan klik tombol "Chat Admin WA" dan konsultasikan kebutuhan joki atau item spesifik Anda. Admin kami siap melayani pesanan kustom dengan harga negosiasi terbaik.',
  },
  {
    id: 'faq-5',
    icon: <ShieldCheck className="w-4 h-4 text-[#00df82]" />,
    question: 'Apakah ada garansi jika pesanan bermasalah?',
    answer:
      'Ya, ada garansi penuh 100% uang kembali atau penggantian layanan jika target yang dijanjikan gagal tercapai sesuai kesepakatan awal.',
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-14 sm:py-20 relative bg-[#060b08] border-b border-[#143224]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#061e14] border border-[#14422e] text-[#00df82] text-xs font-bold mb-3 tracking-widest uppercase font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-[#00df82]" />
            <span>PUSAT BANTUAN & FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
            Pertanyaan Sering Diajukan
          </h2>
          <p className="mt-2 text-zinc-400 text-xs sm:text-sm">
            Jawaban lengkap untuk pertanyaan calon pembeli seputar keamanan akun, estimasi pengerjaan, dan pembayaran.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-[#091510] border-[#00df82]/50 shadow-[0_0_20px_rgba(0,223,130,0.12)]'
                    : 'bg-[#07110d] border-[#153325] hover:border-[#1e4b36]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#062015] border border-[#144530] flex items-center justify-center shrink-0">
                      {faq.icon}
                    </div>
                    <span className="font-bold text-white text-sm sm:text-base leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg bg-[#061d14] border border-[#14422e] flex items-center justify-center shrink-0 text-[#00df82] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#00df82] text-[#03140d]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-[#143224]/50 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action for Custom Inquiries */}
        <div className="mt-10 p-6 rounded-2xl metallic-card border border-[#173e2d] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-white text-base">Masih Punya Pertanyaan Lain?</h4>
            <p className="text-zinc-400 text-xs mt-0.5">
              Admin kami aktif 24 jam siap menjawab pertanyaan atau negosiasi pesanan Anda.
            </p>
          </div>
          <a
            href="#whatsapp-hub"
            className="px-5 py-2.5 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-bold text-xs font-tech uppercase tracking-wide flex items-center gap-2 shadow-md shadow-[#00df82]/20 transition-all shrink-0"
          >
            <span>Tanya Admin Langsung</span>
            <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </a>
        </div>
      </div>
    </section>
  );
}
