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

  // Color theme constants
  const MINT = '#00df82';
  const DARK = '#040906';
  const CARD_BG = '#08140e';
  const BORDER = '#133d2a';
  const RED_ALERT = '#ef4444';
  const WA_GREEN = '#22c55e';

  // Total duration: 660 frames = 22 seconds @ 30fps
  // Scene 1: 0 - 165 (0.0s - 5.5s) -> TikTok Profile, Stop DM, Click Bio Link
  // Scene 2: 155 - 330 (5.1s - 11.0s) -> Web Catalog, Realtime Stock, Fisch & Blox Fruit
  // Scene 3: 320 - 495 (10.6s - 16.5s) -> Multi-item Cart, Auto Ticket ID
  // Scene 4: 485 - 660 (16.1s - 22.0s) -> 1-Click WhatsApp Checkout, Bio Link Call To Action

  // Background subtle motion
  const bgOffsetY = (frame * 1.5) % 80;
  const pulse = Math.sin(frame * 0.12) * 0.05 + 1;

  // ==========================================
  // SCENE 1 ANIMATIONS (0 - 165)
  // ==========================================
  const s1Opacity = interpolate(frame, [0, 15, 150, 165], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s1CardSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.9 },
  });

  // Animated cursor moving towards the bio link
  const cursorProgress = interpolate(frame, [45, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Click bounce when finger taps bio link at frame 95-125
  const clickTap = interpolate(
    frame,
    [92, 98, 106, 120],
    [1, 0.78, 1.05, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const clickRipple = interpolate(frame, [98, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ==========================================
  // SCENE 2 ANIMATIONS (155 - 330)
  // ==========================================
  const s2Opacity = interpolate(frame, [155, 170, 315, 330], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s2ZoomIn = spring({
    frame: frame - 158,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const s2Card1 = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12 },
  });

  const s2Card2 = spring({
    frame: frame - 198,
    fps,
    config: { damping: 12 },
  });

  const s2Card3 = spring({
    frame: frame - 216,
    fps,
    config: { damping: 12 },
  });

  // ==========================================
  // SCENE 3 ANIMATIONS (320 - 495)
  // ==========================================
  const s3Opacity = interpolate(frame, [320, 335, 480, 495], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s3CartSpring = spring({
    frame: frame - 325,
    fps,
    config: { damping: 13 },
  });

  const s3TicketSpring = spring({
    frame: frame - 355,
    fps,
    config: { damping: 12 },
  });

  // ==========================================
  // SCENE 4 ANIMATIONS (485 - 660)
  // ==========================================
  const s4Opacity = interpolate(frame, [485, 500, 650, 660], [0, 1, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const s4Spring = spring({
    frame: frame - 490,
    fps,
    config: { damping: 12, mass: 0.8 },
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: DARK,
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Cyber Grid */}
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

      {/* Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 223, 130, 0.22) 0%, rgba(4, 9, 6, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Persistent Top Header Branding */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 60,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Img
            src={staticFile('logo-store.png')}
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              border: `2px solid ${MINT}`,
              boxShadow: `0 0 20px rgba(0, 223, 130, 0.4)`,
            }}
          />
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 2, color: '#ffffff' }}>
              NAUUVALSTORE
            </div>
            <div style={{ fontSize: 13, color: MINT, letterSpacing: 3, fontWeight: 800 }}>
              OFFICIAL ROBLOX STORE
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '10px 20px',
            borderRadius: 999,
            backgroundColor: 'rgba(0, 223, 130, 0.12)',
            border: `1.5px solid ${MINT}`,
            color: MINT,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: MINT }} />
          100% ANTI HACKBACK
        </div>
      </div>

      {/* ====================================================================== */}
      {/* SCENE 1: HOOK - JANGAN CHAT DM TIKTOK, KLIK LINK DI BIO! (0 - 165)     */}
      {/* ====================================================================== */}
      {frame < 170 && (
        <div
          style={{
            opacity: s1Opacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 45px',
            zIndex: 10,
            width: '100%',
            maxWidth: 960,
          }}
        >
          {/* Warning Badge */}
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(239, 68, 68, 0.16)',
              border: `1.5px solid ${RED_ALERT}`,
              color: '#fca5a5',
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 2,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.3)',
            }}
          >
            <span style={{ fontSize: 22 }}>⚠️</span> PENGUMUMAN PENTING BUYER
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            JANGAN CHAT DI{' '}
            <span
              style={{
                color: RED_ALERT,
                textShadow: '0 0 30px rgba(239, 68, 68, 0.6)',
              }}
            >
              DM TIKTOK!
            </span>
          </h1>

          <p
            style={{
              fontSize: 26,
              color: '#94a3b8',
              marginBottom: 40,
              fontWeight: 600,
              lineHeight: 1.4,
              maxWidth: 780,
            }}
          >
            DM TikTok rawan tenggelam &amp; slow respon.{' '}
            <span style={{ color: '#fff', fontWeight: 800 }}>
              Order resmi wajib lewat link di bio TikTok kami!
            </span>
          </p>

          {/* TikTok Profile Card Mockup */}
          <div
            style={{
              transform: `scale(${s1CardSpring})`,
              width: '100%',
              maxWidth: 820,
              borderRadius: 28,
              backgroundColor: CARD_BG,
              border: `2px solid ${BORDER}`,
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0, 223, 130, 0.15)',
              overflow: 'hidden',
              position: 'relative',
              padding: '24px 28px',
            }}
          >
            {/* TikTok Top Nav Mockup */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: 16,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: 15, color: '#64748b', marginLeft: 8, fontWeight: 700 }}>
                  TikTok Profile Official
                </span>
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: MINT,
                  backgroundColor: 'rgba(0,223,130,0.1)',
                  padding: '4px 12px',
                  borderRadius: 8,
                }}
              >
                @nauuvalstore
              </div>
            </div>

            {/* Profile Screenshot Embedded */}
            <div
              style={{
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Img
                src={staticFile('tiktok-profile.png')}
                style={{
                  width: '100%',
                  display: 'block',
                  filter: 'contrast(1.05)',
                }}
              />

              {/* Bio Link Highlight Box Overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16%',
                  left: '28%',
                  width: '46%',
                  height: '18%',
                  borderRadius: 12,
                  border: `3px solid ${MINT}`,
                  backgroundColor: 'rgba(0, 223, 130, 0.15)',
                  boxShadow: `0 0 35px rgba(0, 223, 130, 0.8), inset 0 0 15px rgba(0, 223, 130, 0.4)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                  transform: `scale(${clickTap})`,
                }}
              >
                {/* Ripple Effect on Tap */}
                {frame > 95 && clickRipple < 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -20,
                      borderRadius: 16,
                      border: `3px solid ${MINT}`,
                      opacity: 1 - clickRipple,
                      transform: `scale(${1 + clickRipple * 0.8})`,
                    }}
                  />
                )}
              </div>

              {/* Animated Finger Cursor Pointing to Bio Link */}
              <div
                style={{
                  position: 'absolute',
                  left: `${interpolate(cursorProgress, [0, 1], [70, 50])}%`,
                  top: `${interpolate(cursorProgress, [0, 1], [85, 74])}%`,
                  transform: `scale(${clickTap}) translate(-50%, -50%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.9))',
                  pointerEvents: 'none',
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontWeight: 900,
                    fontSize: 18,
                    padding: '8px 18px',
                    borderRadius: 999,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                    marginBottom: 8,
                    whiteSpace: 'nowrap',
                    letterSpacing: 1,
                  }}
                >
                  👇 KLIK LINK DI SINI!
                </div>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00df82"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: `drop-shadow(0 0 12px ${MINT})`,
                  }}
                >
                  <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                  <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                  <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                  <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                </svg>
              </div>
            </div>

            {/* Bottom Target Highlight */}
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                backgroundColor: 'rgba(0, 223, 130, 0.08)',
                padding: '14px 20px',
                borderRadius: 16,
                border: `1px dashed ${MINT}`,
              }}
            >
              <span style={{ fontSize: 22, color: MINT }}>🔗</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>
                nauuvalstore.vercel.app
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SCENE 2: WEB CATALOG & REALTIME STOCK (155 - 330)                      */}
      {/* ====================================================================== */}
      {frame >= 155 && frame < 335 && (
        <div
          style={{
            opacity: s2Opacity,
            transform: `scale(${s2ZoomIn})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 45px',
            zIndex: 10,
            width: '100%',
            maxWidth: 960,
          }}
        >
          {/* Badge */}
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(0, 223, 130, 0.12)',
              border: `1.5px solid ${MINT}`,
              color: MINT,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 2,
              marginBottom: 20,
              boxShadow: `0 0 25px rgba(0, 223, 130, 0.3)`,
            }}
          >
            🌐 KATALOG WEB RESMI
          </div>

          <h2
            style={{
              fontSize: 60,
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 14,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            CEK HARGA &amp; STOK{' '}
            <span
              style={{
                color: MINT,
                textShadow: `0 0 35px rgba(0, 223, 130, 0.6)`,
              }}
            >
              REALTIME!
            </span>
          </h2>

          <p
            style={{
              fontSize: 24,
              color: '#94a3b8',
              marginBottom: 36,
              fontWeight: 600,
              maxWidth: 780,
            }}
          >
            Semua item Fisch &amp; Blox Fruit tertera jelas. Tanpa tanya admin "ready gak min?"
          </p>

          {/* Cards Showcase Vertical Stack */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              width: '100%',
              maxWidth: 820,
            }}
          >
            {/* Card 1: Fisch Relic */}
            <div
              style={{
                transform: `translateX(${interpolate(s2Card1, [0, 1], [-80, 0])}px)`,
                opacity: s2Card1,
                backgroundColor: CARD_BG,
                border: `1.5px solid ${BORDER}`,
                borderRadius: 22,
                padding: '22px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      backgroundColor: 'rgba(0, 223, 130, 0.15)',
                      color: MINT,
                      padding: '4px 12px',
                      borderRadius: 6,
                      letterSpacing: 1,
                    }}
                  >
                    KEBUTUHAN FISCH
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '4px 12px',
                      borderRadius: 999,
                    }}
                  >
                    ● Ready: 500
                  </span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#ffffff' }}>
                  Exalted Relic
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: MINT }}>Rp 150</div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>/ item</div>
              </div>
            </div>

            {/* Card 2: Song Of The Deep Relic */}
            <div
              style={{
                transform: `translateX(${interpolate(s2Card2, [0, 1], [80, 0])}px)`,
                opacity: s2Card2,
                backgroundColor: CARD_BG,
                border: `1.5px solid ${BORDER}`,
                borderRadius: 22,
                padding: '22px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      backgroundColor: 'rgba(0, 223, 130, 0.15)',
                      color: MINT,
                      padding: '4px 12px',
                      borderRadius: 6,
                      letterSpacing: 1,
                    }}
                  >
                    KEBUTUHAN FISCH
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '4px 12px',
                      borderRadius: 999,
                    }}
                  >
                    ● Ready: 20
                  </span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#ffffff' }}>
                  Song Of The Deep Relic
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: MINT }}>Rp 1.500</div>
                <div style={{ fontSize: 14, color: '#64748b', fontWeight: 600 }}>/ item</div>
              </div>
            </div>

            {/* Card 3: Promo Joki Fisch */}
            <div
              style={{
                transform: `translateY(${interpolate(s2Card3, [0, 1], [60, 0])}px)`,
                opacity: s2Card3,
                backgroundColor: CARD_BG,
                border: `2px solid ${MINT}`,
                borderRadius: 22,
                padding: '22px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: `0 0 35px rgba(0, 223, 130, 0.25)`,
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      backgroundColor: 'rgba(0, 223, 130, 0.2)',
                      color: MINT,
                      padding: '4px 12px',
                      borderRadius: 6,
                    }}
                  >
                    JOKI FISCH
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 900,
                      backgroundColor: MINT,
                      color: DARK,
                      padding: '4px 12px',
                      borderRadius: 6,
                      letterSpacing: 1,
                    }}
                  >
                    ⚡ PROMO
                  </span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#ffffff' }}>
                  Joki Olympian Godbreaker
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: MINT }}>Rp 160.000</div>
                <div style={{ fontSize: 15, color: '#64748b', textDecoration: 'line-through' }}>
                  Rp 200.000
                </div>
              </div>
            </div>
          </div>

          {/* Quick Feature Badges */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginTop: 32,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                color: '#cbd5e1',
              }}
            >
              🔍 Fitur Search Cepat
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                color: '#cbd5e1',
              }}
            >
              🏷️ Filter Kategori Lengkap
            </div>
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '10px 20px',
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 700,
                color: '#cbd5e1',
              }}
            >
              📄 Mode Halaman Ringan
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SCENE 3: MULTI-ITEM CART & ORDER TICKET ID (320 - 495)                 */}
      {/* ====================================================================== */}
      {frame >= 320 && frame < 500 && (
        <div
          style={{
            opacity: s3Opacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 45px',
            zIndex: 10,
            width: '100%',
            maxWidth: 960,
          }}
        >
          {/* Badge */}
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(0, 223, 130, 0.12)',
              border: `1.5px solid ${MINT}`,
              color: MINT,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 2,
              marginBottom: 20,
              boxShadow: `0 0 25px rgba(0, 223, 130, 0.3)`,
            }}
          >
            🛒 FITUR KERANJANG PESANAN
          </div>

          <h2
            style={{
              fontSize: 60,
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 14,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            ORDER BANYAK ITEM{' '}
            <span
              style={{
                color: MINT,
                textShadow: `0 0 35px rgba(0, 223, 130, 0.6)`,
              }}
            >
              SEKALIGUS!
            </span>
          </h2>

          <p
            style={{
              fontSize: 24,
              color: '#94a3b8',
              marginBottom: 36,
              fontWeight: 600,
              maxWidth: 780,
            }}
          >
            Masukkan semua item ke keranjang. Otomatis dibuatkan ringkasan pesanan &amp; tiket resmi!
          </p>

          {/* Cart Mockup Container */}
          <div
            style={{
              transform: `scale(${s3CartSpring})`,
              width: '100%',
              maxWidth: 820,
              backgroundColor: CARD_BG,
              border: `2px solid ${BORDER}`,
              borderRadius: 26,
              padding: '28px 32px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(0, 223, 130, 0.15)',
              textAlign: 'left',
            }}
          >
            {/* Cart Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 18,
                borderBottom: `1px solid rgba(255,255,255,0.08)`,
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 26 }}>🛍️</span>
                <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: 1 }}>
                  KERANJANG PESANAN
                </span>
                <span
                  style={{
                    backgroundColor: MINT,
                    color: DARK,
                    fontSize: 14,
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: 999,
                  }}
                >
                  21 Item
                </span>
              </div>
              <span style={{ fontSize: 14, color: '#64748b', fontWeight: 700 }}>
                Multi-item Checkout
              </span>
            </div>

            {/* Cart Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  padding: '12px 18px',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Song Of The Deep Relic</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>10 item × Rp 1.500</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: MINT }}>Rp 15.000</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  padding: '12px 18px',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Lullaby Full Quest (All Req)</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>1 item × Rp 120.000</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: MINT }}>Rp 120.000</div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  padding: '12px 18px',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>1M COIN Fisch</div>
                  <div style={{ fontSize: 14, color: '#94a3b8' }}>10 item × Rp 500</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: MINT }}>Rp 5.000</div>
              </div>
            </div>

            {/* Total Box */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 18,
                borderTop: `1px solid rgba(255,255,255,0.08)`,
                marginBottom: 20,
              }}
            >
              <div>
                <div style={{ fontSize: 14, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>
                  TOTAL PEMBAYARAN:
                </div>
                <div style={{ fontSize: 14, color: '#64748b' }}>21 item dalam keranjang</div>
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: MINT }}>Rp 140.000</div>
            </div>

            {/* Order Ticket Badge */}
            <div
              style={{
                transform: `scale(${s3TicketSpring})`,
                backgroundColor: 'rgba(0, 223, 130, 0.1)',
                border: `1.5px solid ${MINT}`,
                borderRadius: 16,
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>🎫</span>
                <div>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>
                    KODE TIKET PESANAN OTOMATIS:
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: 2 }}>
                    #NVL-849201
                  </div>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: MINT,
                  color: DARK,
                  fontSize: 13,
                  fontWeight: 900,
                  padding: '6px 14px',
                  borderRadius: 999,
                  letterSpacing: 1,
                }}
              >
                VERIFIED
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SCENE 4: 1-CLICK WHATSAPP CHECKOUT & BIO CTA (485 - 660)               */}
      {/* ====================================================================== */}
      {frame >= 485 && (
        <div
          style={{
            opacity: s4Opacity,
            transform: `scale(${s4Spring})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 45px',
            zIndex: 10,
            width: '100%',
            maxWidth: 960,
          }}
        >
          {/* Badge */}
          <div
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: `1.5px solid ${WA_GREEN}`,
              color: '#86efac',
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: 2,
              marginBottom: 20,
              boxShadow: `0 0 30px rgba(34, 197, 94, 0.4)`,
            }}
          >
            ⚡ CHECKOUT 1-KLIK KE WHATSAPP
          </div>

          <h2
            style={{
              fontSize: 66,
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: -1,
            }}
          >
            KLIK LINK DI BIO{' '}
            <span
              style={{
                color: MINT,
                textShadow: `0 0 40px rgba(0, 223, 130, 0.7)`,
              }}
            >
              SEKARANG JUGA!
            </span>
          </h2>

          <p
            style={{
              fontSize: 26,
              color: '#94a3b8',
              marginBottom: 44,
              fontWeight: 600,
              maxWidth: 780,
            }}
          >
            Pilih item di web ➔ otomatis kirim format rapi ke WhatsApp Admin resmi!
          </p>

          {/* Big WhatsApp Glowing Button */}
          <div
            style={{
              width: '100%',
              maxWidth: 760,
              backgroundColor: WA_GREEN,
              borderRadius: 24,
              padding: '24px 36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
              boxShadow: `0 0 50px rgba(34, 197, 94, 0.6), 0 20px 40px rgba(0,0,0,0.8)`,
              transform: `scale(${pulse})`,
              marginBottom: 36,
            }}
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#040906"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: '#040906',
                letterSpacing: 1.5,
              }}
            >
              KIRIM PESANAN KE WHATSAPP
            </div>
          </div>

          {/* Domain & Account Info Box */}
          <div
            style={{
              backgroundColor: CARD_BG,
              border: `2px solid ${MINT}`,
              borderRadius: 22,
              padding: '22px 36px',
              width: '100%',
              maxWidth: 760,
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              marginBottom: 36,
            }}
          >
            <div style={{ fontSize: 16, color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>
              KUNJUNGI LINK RESMI:
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', letterSpacing: 2 }}>
              nauuvalstore.vercel.app
            </div>
            <div style={{ fontSize: 18, color: MINT, fontWeight: 800, marginTop: 6 }}>
              TikTok: @nauuvalstore
            </div>
          </div>

          {/* Guarantee Badges */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: '#e2e8f0', fontWeight: 700 }}>
              <span>🛡️</span> 100% Anti Hackback
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: '#e2e8f0', fontWeight: 700 }}>
              <span>⚡</span> Pengerjaan Cepat
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, color: '#e2e8f0', fontWeight: 700 }}>
              <span>⭐</span> Rating 5.0 Buyer
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
