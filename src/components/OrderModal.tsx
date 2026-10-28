'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, ShieldCheck, Gamepad2, FileText, Zap } from 'lucide-react';
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
  const isPromo = Boolean(
    product.is_discount || (product.original_price && product.original_price > product.price)
  );
  const orderUrl = buildWhatsAppOrderUrl(settings.wa_number, product, { username, notes });

  const handleCopy = () => {
    const finalPrice = formatRupiah(product.price);
    const promoText = isPromo && product.original_price
      ? ` (⚡ Promo dari ${formatRupiah(product.original_price)})`
      : '';

    const text = [
      `Halo Admin ${settings.store_name}, saya ingin order layanan/produk ini:`,
      ``,
      `📦 *Nama Produk*: ${product.name}`,
      `🏷️ *Kategori*: ${product.category}`,
      `💰 *Harga*: ${finalPrice}${promoText}`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight font-mono">
              Format Pemesanan WhatsApp
            </h3>
            <p className="text-xs text-zinc-400">
              {settings.store_name} • {settings.tagline}
            </p>
          </div>
        </div>

        {/* Product Summary Box */}
        <div className="p-4 rounded-xl bg-black border border-zinc-800 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                  {product.category}
                </span>
                {isPromo && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white text-black flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-black" />
                    <span>PROMO</span>
                  </span>
                )}
              </div>
              <h4 className="font-bold text-white text-base">
                {product.name}
              </h4>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                product.stock > 0
                  ? 'bg-zinc-900 text-zinc-200 border-zinc-700'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-black text-white font-mono">
              {formatRupiah(product.price)}
            </span>
            {isPromo && product.original_price && (
              <span className="text-xs text-zinc-500 line-through font-mono">
                {formatRupiah(product.original_price)}
              </span>
            )}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 mb-6 text-xs">
          <div>
            <label className="block font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Username Roblox (Opsional):</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Contoh: ProPlayer_Fisch99"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white placeholder:text-zinc-600 text-xs focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Catatan / Request Tambahan:</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Dikerjakan jam berapa, atau target mastery tertentu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-800 text-white placeholder:text-zinc-600 text-xs focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white text-black hover:bg-zinc-200 font-black text-xs text-center flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Pesanan ke WhatsApp</span>
          </a>

          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin!</span>
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
