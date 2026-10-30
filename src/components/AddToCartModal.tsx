'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Check, Zap } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah } from '@/lib/store-service';

interface AddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (product: Product, quantity: number) => void;
}

export default function AddToCartModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: AddToCartModalProps) {
  const [quantity, setQuantity] = useState<number>(1);

  // Reset quantity whenever a new product is selected
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const isPromo = Boolean(
    product.is_discount || (product.original_price && product.original_price > product.price)
  );
  const maxStock = product.stock > 0 ? product.stock : 999;
  const totalPrice = product.price * quantity;

  const handleIncrement = () => {
    setQuantity((prev) => (prev < maxStock ? prev + 1 : prev));
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handlePreset = (num: number) => {
    const val = Math.min(num, maxStock);
    setQuantity(Math.max(1, val));
  };

  const handleConfirm = () => {
    onConfirm(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-[#080e0b] border-2 border-[#164430] shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,223,130,0.2)] p-5 sm:p-6 text-zinc-100 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Top subtle emerald gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00df82] to-transparent opacity-90" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#143d2c] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#091f16] border border-[#174e35] text-[#00df82] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm uppercase tracking-wide font-tech">
                Tambah ke Keranjang
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Tentukan jumlah item yang ingin dipesan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white bg-[#0e1a14] border border-[#1b3d2c] transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Information Card */}
        <div className="p-3.5 rounded-xl bg-[#050c09] border border-[#133827] mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0b2419] border border-[#174c34] text-[#00df82] font-mono">
              {product.category}
            </span>
            {isPromo && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00df82] text-[#03140d] font-tech flex items-center gap-1">
                <Zap className="w-3 h-3 fill-[#03140d] text-[#03140d]" />
                <span>PROMO</span>
              </span>
            )}
            <span className="text-[10px] text-zinc-400 font-mono ml-auto">
              {product.stock > 0 ? `Ready: ${product.stock}` : 'Pre-Order'}
            </span>
          </div>

          <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
            {product.name}
          </h4>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#00df82] font-price">
              {formatRupiah(product.price)}
            </span>
            {isPromo && product.original_price && (
              <span className="text-xs text-zinc-500 line-through font-mono">
                {formatRupiah(product.original_price)}
              </span>
            )}
            <span className="text-[10px] text-zinc-400 font-mono">/ item</span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="space-y-3 mb-5">
          <label className="block text-xs font-bold text-zinc-300 uppercase font-mono flex items-center justify-between">
            <span>Jumlah Pembelian:</span>
            <span className="text-[11px] text-zinc-400 font-mono font-normal">
              Maksimal {maxStock} item
            </span>
          </label>

          {/* Stepper Input */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#071710] border border-[#143e2d] rounded-xl p-1">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg bg-[#0c2218] hover:bg-[#123023] disabled:opacity-30 disabled:pointer-events-none text-white font-bold flex items-center justify-center transition-colors active:scale-95"
                aria-label="Kurangi jumlah"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max={maxStock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (isNaN(val)) setQuantity(1);
                  else setQuantity(Math.min(maxStock, Math.max(1, val)));
                }}
                className="w-16 text-center bg-transparent text-[#00df82] font-price font-bold text-lg focus:outline-none"
              />
              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= maxStock}
                className="w-10 h-10 rounded-lg bg-[#0c2218] hover:bg-[#123023] disabled:opacity-30 disabled:pointer-events-none text-white font-bold flex items-center justify-center transition-colors active:scale-95"
                aria-label="Tambah jumlah"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              {[1, 2, 3, 5, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handlePreset(num)}
                  disabled={num > maxStock}
                  className={`px-3 py-2 rounded-xl font-tech text-xs font-bold transition-all disabled:opacity-30 ${
                    quantity === num
                      ? 'bg-[#00df82] text-[#03140d] shadow-md shadow-[#00df82]/30 scale-105'
                      : 'bg-[#071911] border border-[#143d2c] text-zinc-300 hover:text-white hover:border-[#00df82]/50'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>

          {/* Subtotal Calculation */}
          <div className="p-3 rounded-xl bg-[#050c09] border border-[#143928] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                Subtotal Produk:
              </span>
              <span className="text-xs text-zinc-400 font-mono mt-0.5 block">
                {quantity}x @ {formatRupiah(product.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-bold text-[#00df82] font-price block tracking-tight drop-shadow-[0_0_10px_rgba(0,223,130,0.3)]">
                {formatRupiah(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#0a1611] hover:bg-[#0f221a] border border-[#153a29] text-zinc-300 hover:text-white font-tech text-xs font-bold transition-colors uppercase tracking-wider"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-[2] py-3 px-4 rounded-xl bg-[#00df82] text-[#03140d] hover:bg-[#00c774] font-bold font-tech text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,223,130,0.35)] transition-all active:scale-[0.98] uppercase tracking-wider"
          >
            <ShoppingCart className="w-4 h-4 text-[#03140d]" />
            <span>Masukkan ({quantity} Item)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
