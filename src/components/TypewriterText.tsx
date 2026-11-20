'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text?: string;
  speed?: number;
  className?: string;
}

export default function TypewriterText({
  text = 'PILIHAN TEPAT UNTUK LEVELING KILAT, QUEST ROD FISCH, HUNTING MELEE BLOXFRUIT, BUAH FISIK, DAN KOIN FISCH. 100% AMAN TANPA CHEAT SCRIPT, TRANSPARAN, DAN STOK TERPANTAU REALTIME.',
  speed = 18,
  className = '',
}: TypewriterTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setDisplayedLength(current);
      if (current >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  // Highlight segment: "100% AMAN TANPA CHEAT SCRIPT"
  const highlightPhrase = '100% AMAN TANPA CHEAT SCRIPT';
  const highlightStart = text.indexOf(highlightPhrase);
  const highlightEnd = highlightStart + highlightPhrase.length;

  const currentText = text.slice(0, displayedLength);

  // Render text with styled highlight if reached
  const renderFormattedText = () => {
    if (highlightStart === -1 || displayedLength <= highlightStart) {
      return <span>{currentText}</span>;
    }

    const before = text.slice(0, highlightStart);
    if (displayedLength <= highlightEnd) {
      const highlightedPart = text.slice(highlightStart, displayedLength);
      return (
        <>
          <span>{before}</span>
          <span className="text-[#00df82] font-bold drop-shadow-[0_0_8px_rgba(0,223,130,0.4)]">
            {highlightedPart}
          </span>
        </>
      );
    }

    const highlightedPart = highlightPhrase;
    const after = text.slice(highlightEnd, displayedLength);
    return (
      <>
        <span>{before}</span>
        <span className="text-[#00df82] font-bold drop-shadow-[0_0_8px_rgba(0,223,130,0.4)]">
          {highlightedPart}
        </span>
        <span>{after}</span>
      </>
    );
  };

  return (
    <p className={className}>
      {renderFormattedText()}
      <span
        className={`inline-block ml-1 w-1.5 h-3.5 bg-[#00df82] align-middle shadow-[0_0_8px_rgba(0,223,130,0.8)] ${
          isComplete ? 'animate-caret opacity-75' : 'animate-caret'
        }`}
        aria-hidden="true"
      />
    </p>
  );
}
