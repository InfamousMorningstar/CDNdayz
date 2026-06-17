"use client";

import { useEffect } from 'react';

/**
 * LiquidGlass — the engine behind the site-wide Apple "Liquid Glass" material.
 *
 * 1. Renders a hidden SVG <filter> (feTurbulence + feDisplacementMap) used to
 *    refract / lens the backdrop behind glass surfaces.
 * 2. Feature-detects whether the browser honours url() inside backdrop-filter
 *    (Chromium does; Safari/Firefox don't) and flags <html> so the CSS can
 *    opt that refraction in only where it actually works.
 * 3. Tracks the pointer and drives the moving specular highlight (the light
 *    that glides across the glass) on any element marked [data-liquid].
 */
export function LiquidGlass() {
  useEffect(() => {
    const root = document.documentElement;

    // 1 — Feature detect refraction support.
    const supportsRefraction =
      typeof CSS !== 'undefined' &&
      (CSS.supports('backdrop-filter', 'url(#liquid-glass-filter)') ||
        CSS.supports('-webkit-backdrop-filter', 'url(#liquid-glass-filter)'));
    if (supportsRefraction) root.classList.add('lg-refract-ok');

    // 2 — Pointer-driven specular highlight (skip for reduced motion / touch).
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (reduced || !finePointer) return;

    let frame = 0;
    let current: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const target = (event.target as Element | null)?.closest?.(
          '[data-liquid]'
        ) as HTMLElement | null;

        if (current && current !== target) {
          current.classList.remove('is-lit');
          current = null;
        }
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        target.style.setProperty('--lg-x', `${x}%`);
        target.style.setProperty('--lg-y', `${y}%`);
        target.classList.add('is-lit');
        current = target;
      });
    };

    const onLeave = () => {
      if (current) {
        current.classList.remove('is-lit');
        current = null;
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter
          id="liquid-glass-filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.012"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation={2} result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale={18}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
