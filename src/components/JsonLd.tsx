import React from 'react';

export default function JsonLd() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://nauuvalstore.vercel.app/#website',
        url: 'https://nauuvalstore.vercel.app',
        name: 'Nauuvalstore',
        description: 'Jasa Joki & Kebutuhan Roblox Fisch & Blox Fruit Terpercaya di Indonesia.',
        inLanguage: 'id-ID',
      },
      {
        '@type': 'Store',
        '@id': 'https://nauuvalstore.vercel.app/#store',
        name: 'Nauuvalstore',
        image: 'https://nauuvalstore.vercel.app/logo-store.png',
        url: 'https://nauuvalstore.vercel.app',
        telephone: '+6289529834425',
        priceRange: 'Rp 20.000 - Rp 160.000',
        paymentAccepted: 'QRIS, Bank Transfer, DANA, GoPay, OVO, ShopeePay',
        currenciesAccepted: 'IDR',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '36',
          bestRating: '5',
          worstRating: '1',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Layanan Joki Roblox',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Joki Fisch Roblox',
                description: 'Leveling Fisch 1-250, Quest Rod of the Depths, Mythic Catch, Enchant Tier S.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Joki Blox Fruit Roblox',
                description: 'Max Level 2550, Melee Godhuman, CDK, Soul Guitar, Race V4 Full Gear.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Kebutuhan Koin & Buah Fisik Roblox',
                description: 'Paket Koin C$ Fisch, Physical Fruit Kitsune, Leopard, Dough King carry raid.',
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
