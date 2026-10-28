'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, ShieldCheck, Gamepad2, FileText } from 'lucide-react';
import { Product, StoreSettings } from '@/types';
import { buildWhatsAppOrderUrl, formatRupiah } from '@/lib/store-service';

interface OrderModalProps {
  product: Product | null;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ product, settings, isOpen, onClose }: OrderModalProps) {
  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock <= 0;
  const orderUrl = buildWhatsAppOrderUrl(settings.wa_number, product, { username, notes });

  const handleCopy = () => {
    // Generate text only
    const cleanPhone = settings.wa_number.replace(/[^0-9]/g, '');
    const finalPrice = formatRupiah(product.price);
    const discountText =
      product.is_discount && product.original_price
        ? ` (🔥 Diskon dari ${formatRupiah(product.original_price)})`
        : '';

    const text = [
      `Halo Admin ${settings.store_name}, saya ingin order layanan/produk ini:`,
      ``,
      `📦 *Nama Produk*: ${product.name}`,
      `🏷️ *Kategori*: ${product.category}`,
      `💰 *Harga*: ${finalPrice}${discountText}`,
      `📊 *Stok*: ${product.stock > 0 ? `${product.stock} Tersedia` : 'Habis (Pre-Order)'}`,
      username ? `🎮 *Username Roblox*: ${username}` : `🎮 *Username Roblox*: (Hubungi seller)`,
      notes ? `📝 *Catatan / Request*: ${notes}` : ``,
      ``,
      `Apakah slot masih tersedia untuk diproses sekarang? Terima kasih!`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-violet-950/50 p-6 sm:p-8 overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Format Pemesanan WhatsApp
            </h3>
            <p className="text-xs text-slate-400">
              Lengkapi info sebelum dialihkan ke chat WhatsApp Admin
            </p>
          </div>
        </div>

        {/* Product Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-violet-950 border border-violet-800 text-violet-300">
                {product.category}
              </span>
              <h4 className="font-bold text-slate-100 text-sm sm:text-base mt-1.5">
                {product.name}
              </h4>
            </div>

            {/* Stock pill */}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                product.stock > 0
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}
            >
              {product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-cyan-400 font-mono">
              {formatRupiah(product.price)}
            </span>
            {product.original_price && (
              <span className="text-xs text-slate-500 line-through">
                {formatRupiah(product.original_price)}
              </span>
            )}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Username Roblox (Opsional / Bisa nanti di WA):</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: ProPlayer_Fisch99"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Catatan Khusus / Request Tambahan:</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Minta dikerjakan jam 8 malam, atau butuh rod tier tertentu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-600 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
        </div>

        {/* Guarantees note */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Password & akun aman 100%. Data rahasia dikirim langsung ke WhatsApp Admin resmi.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Pesanan ke WhatsApp</span>
          </a>

          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Teks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
