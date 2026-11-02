import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';

export const NauuvalPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Color constants
  const MINT = '#00df82';
  const DARK = '#040906';
  const CARD_BG = '#08140e';
  const BORDER = '#133d2a';

  // --- SCENE TIMINGS (Total 600 frames = 20 seconds @ 30fps) ---
  // Scene 1: Intro Hook (0 - 140 frames / 0 - 4.6s)
  // Scene 2: Catalog Showcase (130 - 290 frames / 4.3 - 9.6s)
  // Scene 3: Cart & Order ID (280 - 440 frames / 9.3 - 14.6s)
  // Scene 4: Outro CTA (430 - 600 frames / 14.3 - 20s)

  // Global background grid drift
  const bgOffsetY = (frame * 1.5) % 80;

  // ==========================================
  // SCENE 1: HOOK & BRAND LOGO
  // ==========================================
  const s1Opacity = interpolate(frame, [0, 15, 125, 140], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s1Scale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  const s1BadgeSlide = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14 },
  });

  // ==========================================
  // SCENE 2: FISCH & BLOX FRUIT SERVICES
  // ==========================================
  const s2Opacity = interpolate(frame, [135, 150, 275, 290], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s2Card1Spring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 12 },
  });

  const s2Card2Spring = spring({
    frame: frame - 170,
    fps,
    config: { damping: 12 },
  });

  // ==========================================
  // SCENE 3: CART & ORDER TICKET ID
  // ==========================================
  const s3Opacity = interpolate(frame, [285, 300, 425, 440], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s3CartSpring = spring({
    frame: frame - 300,
    fps,
    config: { damping: 13 },
  });

  const s3TicketSpring = spring({
    frame: frame - 325,
    fps,
    config: { damping: 12 },
  });

  // ==========================================
  // SCENE 4: OUTRO & CALL TO ACTION
  // ==========================================
  const s4Opacity = interpolate(frame, [435, 450, 590, 600], [0, 1, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s4Scale = spring({
    frame: frame - 445,
    fps,
    config: { damping: 12 },
  });

  const s4Pulse = Math.sin(frame * 0.15) * 0.05 + 1;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: DARK,
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Dynamic Cyber Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 223, 130, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 223, 130, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: `0px ${bgOffsetY}px`,
          pointerEvents: 'none',
        }}
      />

      {/* Radial Glow Orb Center */}
      <div
        style={{
          position: 'absolute',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 223, 130, 0.22) 0%, rgba(4, 9, 6, 0) 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Watermark */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Img
            src={staticFile('logo-store.png')}
            style={{ width: 52, height: 52, borderRadius: 12, border: `1px solid ${BORDER}` }}
          />
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 2, color: '#fff' }}>
              NAUUVALSTORE
            </div>
            <div style={{ fontSize: 13, color: MINT, letterSpacing: 3, fontWeight: 700 }}>
              OFFICIAL STORE
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 18px',
            borderRadius: 999,
            backgroundColor: 'rgba(0, 223, 130, 0.12)',
            border: `1px solid ${MINT}`,
            color: MINT,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1.5,
          }}
        >
          ● 100% ANTI HACKBACK
        </div>
      </div>

      {/* ==================================================== */}
      {/* SCENE 1: HERO HOOK */}
      {/* ==================================================== */}
      {frame < 145 && (
        <div
          style={{
            opacity: s1Opacity,
            transform: `scale(${s1Scale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 50px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 30,
              backgroundColor: '#0a2318',
              border: `1px solid ${MINT}`,
              color: MINT,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 3,
              marginBottom: 35,
              textTransform: 'uppercase',
            }}
          >
            ROBLOX STORE TERPERCAYA
          </div>

          <h1
            style={{
              fontSize: 66,
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 30,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            CARI JOKI & ITEM <br />
            <span
              style={{
                color: MINT,
                textShadow: `0 0 40px rgba(0, 223, 130, 0.6)`,
              }}
            >
              FISCH & BLOX FRUIT?
            </span>
          </h1>

          <div
            style={{
              opacity: s1BadgeSlide,
              transform: `translateY(${(1 - s1BadgeSlide) * 40}px)`,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 20,
            }}
          >
            {['PROSES KILAT', 'BEBAS CHEAT', 'STOK REALTIME'].map((tag, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 22px',
                  borderRadius: 16,
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  color: '#d1fae5',
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                }}
              >
                ✓ {tag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SCENE 2: CATALOG SERVICES SHOWCASE */}
      {/* ==================================================== */}
      {frame >= 135 && frame < 295 && (
        <div
          style={{
            opacity: s2Opacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 60px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: MINT,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            KATALOG LENGKAP & DISKON SPESIAL
          </div>

          <h2
            style={{
              fontSize: 54,
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: 50,
            }}
          >
            LAYANAN TERBAIK <br /> DENGAN HARGA TERMURAH
          </h2>

          {/* Service Card 1: Fisch */}
          <div
            style={{
              transform: `translateY(${(1 - s2Card1Spring) * 100}px) scale(${s2Card1Spring})`,
              width: '100%',
              maxWidth: 750,
              backgroundColor: CARD_BG,
              border: `2px solid ${MINT}`,
              boxShadow: '0 0 35px rgba(0, 223, 130, 0.25)',
              borderRadius: 24,
              padding: '28px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 26,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Img
                src={staticFile('logo-fisch.png')}
                style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'contain' }}
              />
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 8,
                    backgroundColor: '#0a2318',
                    color: MINT,
                    fontSize: 13,
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  FISCH SPECIALIST
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                  Joki Quest Rod & C$ Coin
                </div>
                <div style={{ fontSize: 16, color: '#a1a1aa', marginTop: 4 }}>
                  Olympian, Depths Rod, Aurora Totem
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 900,
                  display: 'inline-block',
                  marginBottom: 6,
                }}
              >
                HEMAT 30%
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: MINT }}>Mulai Rp 500</div>
            </div>
          </div>

          {/* Service Card 2: Blox Fruit */}
          <div
            style={{
              transform: `translateY(${(1 - s2Card2Spring) * 100}px) scale(${s2Card2Spring})`,
              width: '100%',
              maxWidth: 750,
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 24,
              padding: '28px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Img
                src={staticFile('logo-bloxfruits.png')}
                style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'contain' }}
              />
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 8,
                    backgroundColor: '#181b24',
                    color: '#60a5fa',
                    fontSize: 13,
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  BLOX FRUIT SPECIALIST
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                  Leveling & Fruit Fisik
                </div>
                <div style={{ fontSize: 16, color: '#a1a1aa', marginTop: 4 }}>
                  Max Level 2550, Godhuman, Kitsune
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, color: '#71717a', textDecoration: 'line-through' }}>
                Rp 200.000
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: MINT }}>Rp 160.000</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SCENE 3: MULTI-ITEM CART & TICKET ORDER ID */}
      {/* ==================================================== */}
      {frame >= 285 && frame < 445 && (
        <div
          style={{
            opacity: s3Opacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '0 60px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: MINT,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            FITUR KERANJANG BELANJA
          </div>

          <h2
            style={{
              fontSize: 54,
              fontWeight: 900,
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: 50,
            }}
          >
            ORDER BANYAK ITEM <br /> SEKALIGUS DALAM 1 KLIK
          </h2>

          {/* Cart Drawer Simulated Box */}
          <div
            style={{
              transform: `scale(${s3CartSpring})`,
              width: '100%',
              maxWidth: 720,
              backgroundColor: '#07120c',
              border: `2px solid ${MINT}`,
              borderRadius: 24,
              padding: '36px',
              boxShadow: '0 0 50px rgba(0, 223, 130, 0.25)',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${BORDER}`,
                paddingBottom: 20,
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800 }}>🛒 KERANJANG BELANJA</div>
              <div
                style={{
                  backgroundColor: MINT,
                  color: '#000',
                  padding: '4px 16px',
                  borderRadius: 20,
                  fontSize: 16,
                  fontWeight: 900,
                }}
              >
                3 ITEM
              </div>
            </div>

            {/* Generated Unique Ticket ID */}
            <div
              style={{
                transform: `scale(${s3TicketSpring})`,
                backgroundColor: '#040906',
                border: `1px dashed ${MINT}`,
                borderRadius: 16,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: '#a1a1aa', letterSpacing: 2 }}>
                  KODE TIKET OTOMATIS:
                </div>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: MINT,
                    letterSpacing: 3,
                    fontFamily: 'monospace',
                  }}
                >
                  #NVL-849201
                </div>
              </div>
              <div
                style={{
                  fontSize: 14,
                  backgroundColor: '#0c2e1f',
                  color: MINT,
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontWeight: 700,
                }}
              >
                ✓ Terverifikasi
              </div>
            </div>

            <div
              style={{
                marginTop: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 18, color: '#a1a1aa' }}>Total Pembayaran:</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: MINT }}>Rp 140.000</div>
            </div>
          </div>

          <div style={{ fontSize: 18, color: '#a1a1aa', letterSpacing: 1 }}>
            ★ Rating 5.0/5.0 dari ratusan pelanggan puas
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* SCENE 4: CALL TO ACTION OUTRO */}
      {/* ==================================================== */}
      {frame >= 430 && (
        <div
          style={{
            opacity: s4Opacity,
            transform: `scale(${s4Scale})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 50px',
            zIndex: 10,
          }}
        >
          <Img
            src={staticFile('logo-store.png')}
            style={{
              width: 140,
              height: 140,
              borderRadius: 32,
              border: `3px solid ${MINT}`,
              boxShadow: '0 0 50px rgba(0, 223, 130, 0.4)',
              marginBottom: 35,
            }}
          />

          <h2
            style={{
              fontSize: 62,
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            ORDER SEKARANG JUGA!
          </h2>

          <p
            style={{
              fontSize: 24,
              color: '#d1fae5',
              maxWidth: 680,
              lineHeight: 1.5,
              marginBottom: 45,
            }}
          >
            Buka website resmi kami untuk cek promo & checkout langsung ke WhatsApp Admin.
          </p>

          {/* Big CTA WhatsApp Button */}
          <div
            style={{
              transform: `scale(${s4Pulse})`,
              backgroundColor: '#25D366',
              color: '#03190e',
              padding: '24px 56px',
              borderRadius: 30,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: 2,
              boxShadow: '0 0 45px rgba(37, 211, 102, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 45,
            }}
          >
            <span>💬 CHAT WHATSAPP ADMIN</span>
          </div>

          <div
            style={{
              backgroundColor: CARD_BG,
              border: `1px solid ${BORDER}`,
              padding: '16px 36px',
              borderRadius: 20,
              fontSize: 26,
              fontWeight: 800,
              color: MINT,
              letterSpacing: 2,
              fontFamily: 'monospace',
            }}
          >
            🌐 nauuvalstore.vercel.app
          </div>
        </div>
      )}

      {/* Bottom Progress Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${(frame / 600) * 100}%`,
          height: 8,
          backgroundColor: MINT,
          boxShadow: `0 0 16px ${MINT}`,
        }}
      />
    </div>
  );
};
