'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  User,
  FileText,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { StoreSettings } from '@/types';
import { formatRupiah, buildWhatsAppCartOrderUrl } from '@/lib/store-service';

interface CartDrawerProps {
  settings: StoreSettings;
}

export default function CartDrawer({ settings }: CartDrawerProps) {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const [username, setUsername] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const checkoutUrl = buildWhatsAppCartOrderUrl(settings.wa_number, cart, {
    username,
    notes,
  });

  const handleCopyOrder = () => {
    const cleanPhone = settings.wa_number.replace(/[^0-9]/g, '');
    const itemsListText = cart
      .map((item, index) => {
        const subtotal = item.product.price * item.quantity;
        return `${index + 1}. *${item.product.name}*\n   • Kategori: ${item.product.category}\n   • Jumlah: ${item.quantity}x @ ${formatRupiah(item.product.price)}\n   • Subtotal: ${formatRupiah(subtotal)}`;
      })
      .join('\n\n');

    const usernameLine = username.trim() ? `\n👤 *Username Roblox:* ${username.trim()}` : '';
    const notesLine = notes.trim() ? `\n📝 *Catatan:* ${notes.trim()}` : '';

    const text = [
      `Halo Admin Nauuvalstore, saya ingin memesan beberapa produk sekaligus dari Keranjang Belanja:`,
      ``,
      `📋 *DAFTAR ITEM PESANAN:*`,
      itemsListText,
      ``,
      `💰 *TOTAL PEMBAYARAN: ${formatRupiah(totalPrice)}*${usernameLine}${notesLine}`,
      ``,
      `Mohon info ketersediaan antrean dan instruksi pembayaran via QRIS / Bank / E-Wallet. Terima kasih!`,
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#080d0a] border-l border-[#133c2a] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 relative text-zinc-100">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#143d2c] flex items-center justify-between bg-[#050a07]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#091f16] border border-[#174e35] text-[#00df82] flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base font-mono uppercase tracking-wide flex items-center gap-2">
                  <span>Keranjang Pesanan</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#00df82] text-[#03140d] font-bold font-price">
                    {totalItems}
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Multi-item checkout via WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900 transition-colors"
                  title="Kosongkan Keranjang"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 transition-colors"
                aria-label="Tutup Keranjang"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <div className="w-16 h-16 rounded-2xl bg-[#081b13] border border-[#143e2c] text-[#00df82] flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 opacity-70" />
                </div>
                <h4 className="text-white font-bold text-base mb-1 font-mono">
                  Keranjang Anda Masih Kosong
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-6 leading-relaxed">
                  Pilih layanan joki, buah fisik, atau koin di katalog, lalu klik tombol <b>+ Keranjang</b> untuk memesan beberapa item sekaligus.
                </p>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-bold text-xs uppercase tracking-wider font-tech flex items-center gap-2 transition-all shadow-md shadow-[#00df82]/20"
                >
                  <span>Mulai Belanja</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const subtotal = item.product.price * item.quantity;
                const isOutOfStock = item.product.stock <= 0;

                return (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-xl bg-[#06100c] border border-[#143a29] hover:border-[#00df82]/50 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0b2419] border border-[#174c34] text-[#00df82] font-mono">
                          {item.product.category}
                        </span>
                        <h5 className="font-bold text-white text-xs sm:text-sm mt-1 leading-snug">
                          {item.product.name}
                        </h5>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-zinc-900 transition-colors shrink-0"
                        title="Hapus dari keranjang"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                      {/* Price per unit */}
                      <div>
                        <span className="text-xs font-bold text-zinc-300 font-price">
                          {formatRupiah(item.product.price)}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono ml-1">/ item</span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-[#0a1b14] border border-[#153e2d] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-[#06140e] hover:bg-[#102d20] text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                          aria-label="Kurang satu"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-price text-[#00df82]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.product.stock > 0 && item.quantity >= item.product.stock}
                          className="w-6 h-6 rounded bg-[#06140e] hover:bg-[#102d20] disabled:opacity-30 disabled:pointer-events-none text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                          aria-label="Tambah satu"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#00df82] font-price">
                          {formatRupiah(subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#143e2d] bg-[#050a07] space-y-3.5">
              {/* Optional Buyer Metadata Inputs */}
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 mb-1 flex items-center gap-1.5 uppercase font-mono">
                    <User className="w-3 h-3 text-[#00df82]" />
                    <span>Username Roblox (Disarankan):</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: NauuvalPro_99"
                    className="w-full px-3 py-2 rounded-xl bg-[#08140f] border border-[#163a2a] text-white text-xs focus:outline-none focus:border-[#00df82] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 mb-1 flex items-center gap-1.5 uppercase font-mono">
                    <FileText className="w-3 h-3 text-[#00df82]" />
                    <span>Catatan Pesanan (Opsional):</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Tolong dikerjakan malam jam 8 ya min..."
                    className="w-full px-3 py-2 rounded-xl bg-[#08140f] border border-[#163a2a] text-white text-xs focus:outline-none focus:border-[#00df82]"
                  />
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-3.5 rounded-xl bg-[#06100c] border border-[#143928] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                    Total Pembayaran:
                  </span>
                  <span className="text-xs text-zinc-400 font-mono mt-0.5 block">
                    {totalItems} item dalam keranjang
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-bold text-[#00df82] font-price block tracking-tight drop-shadow-[0_0_12px_rgba(0,223,130,0.3)]">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="flex flex-col gap-2">
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeCart}
                  className="w-full py-3 px-4 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-bold font-tech text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,223,130,0.35)] transition-all active:scale-[0.98] uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4 text-[#03140d]" />
                  <span>Kirim Pesanan ke WhatsApp</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyOrder}
                    type="button"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#071911] hover:bg-[#0e271c] border border-[#143e2d] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all font-tech"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#00df82]" />
                        <span className="text-[#00df82]">Format Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Format Order</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={closeCart}
                    type="button"
                    className="py-2 px-3 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
                  >
                    Lanjut Belanja
                  </button>
                </div>
              </div>

              {/* Security Guarantee Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-mono pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00df82]" />
                <span>100% Anti Hackback • Transaksi Langsung dengan Admin Resmi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
