"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/layout/ThemeProvider';

interface CinematicBackgroundProps {
  children: React.ReactNode;
  backgroundImageSrc?: string;
}

export function CinematicBackground({ children, backgroundImageSrc = "/Images/S3F8X.jpg" }: CinematicBackgroundProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const darkCanvasRef = useRef<HTMLCanvasElement>(null);
  const lightCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const wideEnough = window.innerWidth >= 1024;

    setShouldAnimate(!reducedMotion && finePointer && wideEnough);
  }, []);
  
  // Parallax Effect
  useEffect(() => {
    if (!shouldAnimate) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized position (-1 to 1)
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;

      // Keep ref-driven cursor data for high-FPS canvas updates without React re-renders.
      pointerRef.current = { x, y };
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldAnimate]);

  // Dark-mode Particle System (Embers/Dust)
  useEffect(() => {
    if (!shouldAnimate || isLight) return;

    const canvas = darkCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    // Type definition for particles
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      life: number;
    }
    
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const createParticle = (): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 1 - 0.2, // Move upwards
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random() * 100 + 100
      };
    };

    // Initialize particles
    for (let i = 0; i < 40; i++) {
        const p = createParticle();
        p.y = Math.random() * canvas.height; // Distribute initially
        particles.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.life--;
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity = Math.max(0, p.opacity - 0.005);

        if (p.life <= 0 || p.y < -10 || p.opacity <= 0) {
          particles[index] = createParticle();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 38, 38, ${p.opacity})`; // Generic red ember tint
        ctx.fill();
        
        // Add glow for larger particles only to save perf
        if (p.size > 1.5) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = "rgba(220, 38, 38, 0.5)";
        } else {
            ctx.shadowBlur = 0;
        }
      });
      
      ctx.shadowBlur = 0; // Reset
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [shouldAnimate, isLight]);

  // Light-mode 3D node field with depth projection and dynamic links
  useEffect(() => {
    if (!shouldAnimate || !isLight) return;

    const canvas = lightCanvasRef.current;
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
      radius: number;
    };

    const NODES = 44;
    const nodes: Node3D[] = [];
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
      for (let i = 0; i < NODES; i++) {
        const p = randomInShell(0.5, 1.45);
        nodes.push({
          x: p.x,
          y: p.y,
          z: p.z,
          vx: (Math.random() - 0.5) * 0.00045,
          vy: (Math.random() - 0.5) * 0.00045,
          vz: (Math.random() - 0.5) * 0.00045,
          radius: Math.random() * 1.5 + 0.9,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();
    initNodes();

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

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.48;
      const baseScale = Math.min(w, h) * 0.52;

      ctx.clearRect(0, 0, w, h);

      // Soft radial lift to make depth read cleaner against light UI
      const grad = ctx.createRadialGradient(cx, cy * 0.9, 0, cx, cy, Math.max(w, h) * 0.6);
      grad.addColorStop(0, 'rgba(255,255,255,0.22)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

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
        const perspective = 1 / depth;
        const px = cx + ry.x * baseScale * perspective;
        const py = cy + rx.y * baseScale * perspective;
        const pr = n.radius * (0.6 + perspective * 1.6);

        projected.push({ x: px, y: py, z: rx.z, r: pr });
      }

      // Links: distance-based with subtle depth weighting
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 6200) continue;
          const alpha = Math.max(0, 0.13 - d2 / 6200 * 0.13);
          const depthTone = (a.z + b.z) * 0.5;
          ctx.strokeStyle = depthTone > 0
            ? `rgba(14,165,233,${alpha})`
            : `rgba(59,130,246,${alpha * 0.9})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes: crisp core + bloom
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        ctx.fillStyle = p.z > 0 ? 'rgba(14,165,233,0.86)' : 'rgba(37,99,235,0.8)';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = p.z > 0 ? 'rgba(14,165,233,0.16)' : 'rgba(37,99,235,0.14)';
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
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
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#f5f3ee] dark:bg-black text-gray-900 dark:text-white">

      {!isLight && (
        <>
          {/* 1. Background Image with Parallax (dark mode only) */}
          <div
            className="absolute inset-[-20px] bg-cover bg-center bg-no-repeat transition-transform duration-100 ease-out z-0"
            style={{
              backgroundImage: `url("${backgroundImageSrc}")`,
              transform: shouldAnimate
                ? `translate(${mousePosition.x * -6}px, ${mousePosition.y * -6}px) scale(1.04)`
                : 'scale(1.02)',
            }}
          >
            <div className="absolute inset-0 bg-black/70 z-10" />
          </div>

          {/* 2. Embers */}
          {shouldAnimate && (
            <canvas
              ref={darkCanvasRef}
              className="absolute inset-0 pointer-events-none z-10 opacity-40 mix-blend-screen"
            />
          )}

          {/* 3. Distant muzzle-light pulse */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-overlay">
            <div className="absolute top-1/4 left-1/4 w-[42vw] h-[42vw] sm:w-[30vw] sm:h-[30vw] bg-orange-500/5 rounded-full blur-[100px] animate-pulse-slow" />
          </div>

          {/* 4. Vignette */}
          <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
          <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)]" />

          {/* 5. Corner accent */}
          <div className="absolute top-0 right-0 pointer-events-none z-20 opacity-30 mix-blend-overlay w-[150px] h-[150px]">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-red-900 drop-shadow-lg">
              <path d="M60,0 C65,0 70,20 70,35 C70,45 65,50 60,45 C55,40 50,35 50,20 C50,10 55,0 60,0 Z" />
              <path d="M85,0 C90,0 95,40 95,60 C95,70 90,75 85,70 C80,65 75,60 75,40 C75,20 80,0 85,0 Z" style={{ opacity: 0.8 }} />
            </svg>
          </div>
        </>
      )}

      {isLight && (
        <>
          {/* 1. No image in light mode: layered luminous base */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(120%_90%_at_10%_10%,rgba(56,189,248,0.18),transparent_55%),radial-gradient(110%_80%_at_90%_20%,rgba(59,130,246,0.14),transparent_60%),linear-gradient(180deg,#f7f5ef_0%,#efece4_100%)]" />

          {/* 2. Perspective grid plane for depth */}
          <div className="absolute inset-0 z-10 pointer-events-none [perspective:1200px]">
            <div
              className="absolute left-[-20%] right-[-20%] bottom-[-36%] h-[70%] opacity-45"
              style={{
                transform: `rotateX(66deg) translateY(${mousePosition.y * -4}px) translateX(${mousePosition.x * 4}px)`,
                backgroundImage:
                  'linear-gradient(to right, rgba(14,165,233,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.2) 1px, transparent 1px)',
                backgroundSize: '54px 54px',
                maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
              }}
            />
          </div>

          {/* 3. Soft volumetric orbs with slow spins */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -left-20 w-[38vw] h-[38vw] min-w-[260px] min-h-[260px] rounded-full bg-sky-300/14 blur-[78px] animate-[spin_105s_linear_infinite]" />
            <div className="absolute top-[20%] -right-16 w-[34vw] h-[34vw] min-w-[220px] min-h-[220px] rounded-full bg-blue-300/14 blur-[88px] animate-[spin_130s_linear_infinite_reverse]" />
            <div className="absolute bottom-[-18%] left-[25%] w-[32vw] h-[32vw] min-w-[200px] min-h-[200px] rounded-full bg-cyan-300/12 blur-[82px] animate-[spin_118s_linear_infinite]" />
          </div>

          {/* 4. High-fidelity 3D node field */}
          {shouldAnimate && (
            <canvas
              ref={lightCanvasRef}
              className="absolute inset-0 z-20 pointer-events-none"
            />
          )}

          {/* 5. Edge falloff for readability */}
          <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(245,243,238,0.72)_100%)]" />
        </>
      )}

      {/* Content Container */}
      <div className="relative z-40 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
