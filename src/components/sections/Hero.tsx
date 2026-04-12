"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ChevronRight, Footprints } from 'lucide-react';
import { NewsTicker } from '@/components/news/NewsTicker';
import { DISCORD_INVITE_URL } from '@/lib/links';
import { openDiscordAppFirst } from '@/lib/discord';
import { useTheme } from '@/components/layout/ThemeProvider';

export function Hero() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const hero3dCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const wideEnough = window.innerWidth >= 900;
    setShouldAnimate(!reducedMotion && finePointer && wideEnough);
  }, []);

  useEffect(() => {
    if (!shouldAnimate || !isLight) return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLight, shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate || !isLight) return;

    const canvas = hero3dCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId = 0;

    type Node3D = {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      r: number;
    };

    const nodes: Node3D[] = [];
    const NODE_COUNT = 44;
    const BOUNDS = 1.65;

    const randomInShell = (minR: number, maxR: number) => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const radius = minR + Math.random() * (maxR - minR);
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
      };
    };

    const initNodes = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        const p = randomInShell(0.5, 1.45);
        nodes.push({
          x: p.x,
          y: p.y,
          z: p.z,
          vx: (Math.random() - 0.5) * 0.00045,
          vy: (Math.random() - 0.5) * 0.00045,
          vz: (Math.random() - 0.5) * 0.00045,
          r: Math.random() * 1.5 + 0.9,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, 640);
    };

    const rotateY = (x: number, z: number, angle: number) => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return { x: x * c - z * s, z: x * s + z * c };
    };

    const rotateX = (y: number, z: number, angle: number) => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      return { y: y * c - z * s, z: y * s + z * c };
    };

    resize();
    initNodes();
    window.addEventListener('resize', resize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.48;
      const scale = Math.min(w, h) * 0.52;

      ctx.clearRect(0, 0, w, h);

      const projected: { x: number; y: number; z: number; r: number }[] = [];
      const yaw = pointerRef.current.x * 0.14;
      const pitch = -pointerRef.current.y * 0.1;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        if (n.x > BOUNDS || n.x < -BOUNDS) n.vx *= -1;
        if (n.y > BOUNDS || n.y < -BOUNDS) n.vy *= -1;
        if (n.z > BOUNDS || n.z < -BOUNDS) n.vz *= -1;

        const ry = rotateY(n.x, n.z, yaw);
        const rx = rotateX(n.y, ry.z, pitch);
        const depth = 2.2 + rx.z;
        const persp = 1 / depth;
        projected.push({
          x: cx + ry.x * scale * persp,
          y: cy + rx.y * scale * persp,
          z: rx.z,
          r: n.r * (0.6 + persp * 1.6),
        });
      }

      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 6200) continue;
          const alpha = Math.max(0, 0.13 - (d2 / 6200) * 0.13);
          ctx.strokeStyle = isLight
            ? `rgba(30,64,175,${alpha})`
            : `rgba(148,163,184,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.fillStyle = isLight ? 'rgba(37,99,235,0.75)' : 'rgba(248,250,252,0.72)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = isLight ? 'rgba(59,130,246,0.12)' : 'rgba(248,250,252,0.09)';
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [isLight, shouldAnimate]);

  return (
    <section className="relative h-screen min-h-[640px] sm:min-h-[760px] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_10%,rgba(56,189,248,0.2),transparent_55%),radial-gradient(100%_80%_at_85%_20%,rgba(59,130,246,0.16),transparent_60%),linear-gradient(180deg,#f8f6f0_0%,#efece4_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(245,243,238,0.62)_100%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10" />
            {/* Hero image */}
            <div className="w-full h-full bg-neutral-900 bg-[url('/Images/wp1886390-dayz-wallpapers.jpg')] bg-cover bg-center opacity-50" />
          </>
        )}

        {shouldAnimate && isLight && (
          <canvas
            ref={hero3dCanvasRef}
            className="absolute inset-0 z-[11] pointer-events-none"
          />
        )}
      </div>

      <div className="container relative z-20 px-4 sm:px-6 pt-[max(5.5rem,calc(env(safe-area-inset-top)+4.5rem))] sm:pt-0 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100/80 dark:bg-green-900/20 border border-green-300 dark:border-green-500/30 backdrop-blur-md mb-2 animate-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
            <span className="text-xs font-mono text-green-700 dark:text-green-400 tracking-widest uppercase">CDN NETWORK ONLINE</span>
          </div>
          
          <h1 className={`text-[2.15rem] sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight sm:tracking-tighter ${isLight ? 'text-gray-900' : 'text-white'} max-w-5xl relative z-20 leading-[1.03] sm:leading-tight`}>
            <span className={`inline-block ${isLight ? '' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]'}`}>
              <span className="inline-block">S</span>
              <span className="inline-block animate-flicker-3 opacity-90">U</span>
              <span className={`inline-block opacity-100 ${isLight ? '' : 'shadow-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`}>R</span>
              <span className={`inline-block animate-flicker-1 ${isLight ? 'text-gray-700' : 'text-white/80'}`}>V</span>
              <span className={`inline-block opacity-50 ${isLight ? 'text-gray-500' : 'text-neutral-500'}`}>I</span>
              <span className="inline-block animate-flicker-2">V</span>
              <span className="inline-block opacity-90">E</span>
            </span>{' '}
            <span className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.45)]">TOGETHER</span>
            <br />
            <span className={`text-[1.35rem] sm:text-3xl md:text-5xl lg:text-6xl font-heading text-transparent bg-clip-text tracking-[0.03em] sm:tracking-wide opacity-90 ${isLight ? 'bg-gradient-to-b from-gray-800 to-gray-500' : 'bg-gradient-to-b from-neutral-200 to-neutral-600'}`}>
              THRIVE FOREVER
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-neutral-300 max-w-2xl leading-relaxed font-sans font-light tracking-wide px-1 sm:px-0">
            Track every CDN server, required mods, wipe schedules, and live population intelligence from one place so you can join faster and plan smarter.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-4 mt-5 sm:mt-6 w-full sm:w-auto">
            <Button size="lg" className="h-12 px-6 text-base gap-2 font-heading tracking-wider w-full sm:w-auto" asChild>
              <Link href="/servers">
                View Servers <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base font-heading tracking-wider border-neutral-500/30 hover:border-red-500/50 hover:bg-red-900/20 hover:text-red-400 transition-all w-full sm:w-auto" asChild>
              <Link href="/features">Browse Mods</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base font-heading tracking-wider border-neutral-500/30 hover:border-amber-500/50 hover:bg-amber-900/20 hover:text-amber-300 transition-all w-full sm:w-auto" asChild>
              <Link href="/wipe-info">Wipe Status</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-6 text-base font-heading tracking-wider border-neutral-500/30 hover:border-red-500/50 hover:bg-red-900/20 hover:text-red-400 transition-all w-full sm:w-auto" onClick={() => openDiscordAppFirst(DISCORD_INVITE_URL)}>
              Join Comms
            </Button>
          </div>
        </motion.div>

        {/* Tactical News Ticker - Placed for visibility without scrolling */}
        <NewsTicker />

      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 dark:text-neutral-500 flex-col items-center gap-2"
      >
    <span className="text-xs tracking-wide font-sans font-medium">Yeah, you gotta scroll.</span>
    <Footprints className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
