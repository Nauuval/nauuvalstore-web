'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem } from '@/types';
import AddToCartModal from '@/components/AddToCartModal';

const LOCAL_CART_KEY = 'nauuvalstore_cart_v1';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  promptAddToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add to cart quantity confirmation modal state
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_CART_KEY);
      if (raw) {
        setCart(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const promptAddToCart = (product: Product) => {
    setModalProduct(product);
    setIsAddModalOpen(true);
  };

  const addToCart = (product: Product, quantity = 1) => {
    const qty = Math.max(1, quantity);
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      const newQty = updated[existingIndex].quantity + qty;
      // Cap at product stock if available
      const maxQty = product.stock > 0 ? Math.min(newQty, product.stock) : newQty;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: maxQty,
        product, // refresh product details (price, discount)
      };
    } else {
      updated = [...cart, { product, quantity: qty }];
    }

    saveCart(updated);
    showToast(`✓ ${qty}x "${product.name}" dimasukkan ke keranjang!`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updated = cart.map((item) => {
      if (item.product.id === productId) {
        const maxQty = item.product.stock > 0 ? Math.min(quantity, item.product.stock) : quantity;
        return { ...item, quantity: maxQty };
      }
      return item;
    });

    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = cart.filter((item) => item.product.id !== productId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        promptAddToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        toastMessage,
      }}
    >
      {children}

      {/* Quantity Confirmation Modal before adding to cart */}
      <AddToCartModal
        product={modalProduct}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={addToCart}
      />

      {/* Floating Animated Toast Notification when item added */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className="px-4 py-2.5 rounded-xl bg-[#091510] border border-[#00df82] text-white text-xs font-semibold shadow-[0_8px_30px_rgba(0,223,130,0.25)] flex items-center gap-2.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00df82] animate-ping shrink-0" />
            <span className="font-tech tracking-wide">{toastMessage}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
