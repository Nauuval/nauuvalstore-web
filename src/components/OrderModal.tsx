'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Copy, Check, Zap, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product, StoreSettings } from '@/types';
import { buildWhatsAppOrderUrl, formatRupiah } from '@/lib/store-service';

interface OrderModalProps {
  product: Product | null;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ product, settings, isOpen, onClose }: OrderModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [copied, setCopied] = useState(false);

  // Reset quantity when modal opens with a product
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setCopied(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const isPromo = Boolean(
    product.is_discount || (product.original_price && product.original_price > product.price)
  );

  const totalPrice = product.price * quantity;
  const orderUrl = buildWhatsAppOrderUrl(settings.wa_number, product, { quantity });

  const handleCopy = () => {
    const finalSinglePrice = formatRupiah(product.price);
    const discountText = isPromo && product.original_price
      ? ` (Diskon Promo dari ${formatRupiah(product.original_price)})`
      : '';

    const text = [
      `Halo Admin Nauuvalstore, saya ingin order:`,
      ``,
      `*Detail Pesanan:*`,
      `- Layanan / Produk: ${product.name}`,
      `- Kategori: ${product.category}`,
      `- Harga Satuan: ${finalSinglePrice}${discountText}`,
      `- Jumlah Pembelian: ${quantity}x`,
      `- Total Pembayaran: ${formatRupiah(totalPrice)}`,
      ``,
      `Apakah pesanan ini bisa diproses sekarang? Terima kasih.`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0c0d12] border border-zinc-800 shadow-2xl p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#ccff00]">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight font-mono">
              Format Pemesanan WhatsApp
            </h3>
            <p className="text-xs text-zinc-400">
              Nauuvalstore • {settings.tagline || 'TERMURAH - TERCEPAT - TERPERCAYA'}
            </p>
          </div>
        </div>

        {/* Product Summary Box */}
        <div className="p-4 rounded-xl bg-black border border-zinc-800 mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 font-mono">
                  {product.category}
                </span>
                {isPromo && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#ccff00] text-black flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-black text-black" />
                    <span>PROMO</span>
                  </span>
                )}
              </div>
              <h4 className="font-bold text-white text-base">
                {product.name}
              </h4>
            </div>

            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border font-mono ${
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
            <span className="text-[11px] text-zinc-400 font-mono">/ item</span>
          </div>
        </div>

        {/* Form: Jumlah Pembelian (Qty Selector) */}
        <div className="space-y-4 mb-6 text-xs">
          <div>
            <label className="block font-bold text-zinc-300 mb-2 uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>Jumlah Pembelian:</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-mono font-normal">
                {product.stock > 0 ? `Tersedia ${product.stock} stok` : 'Pre-order ready'}
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3">
              {/* Stepper Input */}
              <div className="flex items-center bg-black border border-zinc-800 rounded-xl p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-white font-bold flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-16 text-center bg-transparent text-white font-mono font-black text-base focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuantity(num)}
                    className={`px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                      quantity === num
                        ? 'bg-[#ccff00] text-black shadow-md'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtotal & Total Pembayaran Box */}
          <div className="p-4 rounded-xl bg-black/80 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                Total Pembayaran:
              </span>
              <span className="text-xs text-zinc-500 font-mono mt-0.5 block">
                {quantity}x @ {formatRupiah(product.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#ccff00] font-mono block">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#ccff00] text-black hover:bg-[#bbf000] font-black text-xs text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.25)] transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 text-black" />
            <span>Kirim Pesanan ke WhatsApp</span>
          </a>

          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#ccff00]" />
                <span className="text-[#ccff00]">Tersalin!</span>
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
