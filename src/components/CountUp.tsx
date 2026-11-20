'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  to,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: CountUpProps) {
  const [count, setCount] = useState<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInViewRef = useRef<boolean>(false);
  const currentCountRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const prevToRef = useRef<number>(to);

  const runAnimation = (startVal: number, endVal: number) => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (startVal === endVal) {
      setCount(endVal);
      currentCountRef.current = endVal;
      return;
    }

    const startTime = performance.now();
    const animDuration = Math.max(duration, 300);

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animDuration, 1);

      // Smooth ease-out expo curve: 1 - pow(2, -10 * progress)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * ease;

      setCount(current);
      currentCountRef.current = current;

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setCount(endVal);
        currentCountRef.current = endVal;
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    // If IntersectionObserver is not supported, just set count to `to`
    if (typeof IntersectionObserver === 'undefined') {
      isInViewRef.current = true;
      runAnimation(0, to);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          isInViewRef.current = true;
          // Animate from current count (usually 0) to target `to`
          runAnimation(currentCountRef.current, to);
        }
      },
      { threshold: 0.1 }
    );

    const el = elementRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) observer.unobserve(el);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Watch for changes to `to` (e.g. data loaded from API / localStorage)
  useEffect(() => {
    if (to !== prevToRef.current) {
      prevToRef.current = to;
      if (isInViewRef.current) {
        runAnimation(currentCountRef.current, to);
      }
    }
  }, [to]);

  const formattedNumber =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.round(count).toLocaleString('id-ID');

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
