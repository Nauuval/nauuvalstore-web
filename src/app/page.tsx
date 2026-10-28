'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import AnnouncementBar from '@/components/AnnouncementBar';
import Hero from '@/components/Hero';
import WhatsAppHub from '@/components/WhatsAppHub';
import Catalog from '@/components/Catalog';
import HowToOrder from '@/components/HowToOrder';
import WhyUs from '@/components/WhyUs';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import OrderModal from '@/components/OrderModal';
import { Product, StoreSettings } from '@/types';
import {
  getProducts,
  getStoreSettings,
  subscribeToProducts,
} from '@/lib/store-service';
import { recordVisit } from '@/lib/analytics-service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '@/lib/mock-data';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Record visitor analytics (daily, weekly, monthly tracking)
    recordVisit('/');

    // 2. Fetch initial products & settings
    async function loadData() {
      try {
        const [prodList, storeConfig] = await Promise.all([
          getProducts(),
          getStoreSettings(),
        ]);
        if (isMounted) {
          if (prodList && prodList.length > 0) setProducts(prodList);
          if (storeConfig) setSettings(storeConfig);
          setIsRealtimeActive(isSupabaseConfigured());
        }
      } catch (err) {
        console.error('Failed to load store data:', err);
      }
    }

    loadData();

    // 3. Subscribe to real-time changes
    const unsubscribe = subscribeToProducts((updatedProducts) => {
      if (isMounted && updatedProducts) {
        setProducts(updatedProducts);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Filter promo products count
  const promoCount = useMemo(() => {
    return products.filter(
      (p) =>
        p.is_active &&
        (p.is_discount || (p.original_price && p.original_price > p.price))
    ).length;
  }, [products]);

  const handleOrderProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen flex flex-col bg-black text-white relative overflow-hidden">
      {/* Top Announcement Bar */}
      <AnnouncementBar
        text={settings.announcement}
        onExploreClick={scrollToCatalog}
      />

      {/* Navigation */}
      <Navbar settings={settings} />

      {/* Hero Section with Singularity Artwork & Game Logos */}
      <Hero
        settings={settings}
        totalProducts={products.length}
        promoCount={promoCount}
      />

      {/* Pusat Komunikasi Resmi (WhatsApp Hub) - Placed prominent at top, clean & non-overlapping */}
      <WhatsAppHub settings={settings} />

      {/* Unified Catalog with Pinned Promo Products at top */}
      <Catalog
        products={products}
        onOrderProduct={handleOrderProduct}
        isRealtimeActive={isRealtimeActive}
      />

      {/* How To Order */}
      <HowToOrder />

      {/* Why Us Guarantees */}
      <WhyUs />

      {/* Footer */}
      <Footer settings={settings} />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp settings={settings} />

      {/* Order Modal with Roblox Username & WhatsApp forwarder */}
      <OrderModal
        product={selectedProduct}
        settings={settings}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </main>
  );
}
