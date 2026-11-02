import React from 'react';
import { Composition } from 'remotion';
import { NauuvalPromo } from './NauuvalPromo';

export const Root: React.FC = () => {
  return (
    <>
      {/* 9:16 Vertical format (TikTok / Instagram Reels / YouTube Shorts) */}
      <Composition
        id="NauuvalStorePromo"
        component={NauuvalPromo}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 16:9 Landscape format (YouTube / Web) */}
      <Composition
        id="NauuvalStorePromoHorizontal"
        component={NauuvalPromo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
