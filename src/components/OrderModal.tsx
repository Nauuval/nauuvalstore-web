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
      <div className="relative w-full max-w-lg rounded-2xl bg-[#09130f] border border-[#173e2d] shadow-2xl p-6 sm:p-7">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-[#061811] border border-[#143d2c] transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#062015] border border-[#164733] flex items-center justify-center text-[#00df82]">
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
        <div className="p-4 rounded-xl bg-[#060e0a] border border-[#133526] mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#0b2419] border border-[#174532] text-[#00df82] font-mono">
                  {product.category}
                </span>
                {isPromo && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#00df82] text-[#03140d] font-tech flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-[#03140d] text-[#03140d]" />
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
                  ? 'bg-[#061d13] text-[#00df82] border-[#14422e]'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800'
              }`}
            >
              {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#00df82] font-price tracking-tight">
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
                <ShoppingCart className="w-3.5 h-3.5 text-[#00df82]" />
                <span>Jumlah Pembelian:</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-mono font-normal">
                {product.stock > 0 ? `Tersedia ${product.stock} stok` : 'Pre-order ready'}
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3">
              {/* Stepper Input */}
              <div className="flex items-center bg-[#060e0a] border border-[#133526] rounded-xl p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg bg-[#0c1f17] hover:bg-[#122e22] disabled:opacity-30 disabled:pointer-events-none text-white font-bold flex items-center justify-center transition-colors active:scale-95"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-16 text-center bg-transparent text-[#00df82] font-price font-bold text-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-lg bg-[#0c1f17] hover:bg-[#122e22] text-white font-bold flex items-center justify-center transition-colors active:scale-95"
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
                    className={`px-3 py-2 rounded-xl font-tech text-xs font-bold transition-all ${
                      quantity === num
                        ? 'bg-[#00df82] text-[#03140d] shadow-md shadow-[#00df82]/30'
                        : 'bg-[#071911] border border-[#143d2c] text-zinc-300 hover:text-white hover:border-[#00df82]/50'
                    }`}
                  >
                    {num}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtotal & Total Pembayaran Box */}
          <div className="p-4 rounded-xl bg-[#060e0a] border border-[#143928] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                Total Pembayaran:
              </span>
              <span className="text-xs text-zinc-500 font-mono mt-0.5 block">
                {quantity}x @ {formatRupiah(product.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold text-[#00df82] font-price block tracking-tight drop-shadow-[0_0_12px_rgba(0,223,130,0.3)]">
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
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-bold font-tech text-sm text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,223,130,0.35)] transition-all active:scale-[0.98] uppercase tracking-wide"
          >
            <MessageCircle className="w-4 h-4 text-[#03140d]" />
            <span>Kirim Pesanan ke WhatsApp</span>
          </a>

          <button
            onClick={handleCopy}
            type="button"
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#071911] hover:bg-[#0e271c] border border-[#143e2d] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all font-tech"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#00df82]" />
                <span className="text-[#00df82]">Tersalin!</span>
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
