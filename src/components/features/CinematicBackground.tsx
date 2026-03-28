"use client";

import React, { useEffect, useRef, useState } from 'react';

interface CinematicBackgroundProps {
  children: React.ReactNode;
  backgroundImageSrc?: string;
}

export function CinematicBackground({ children, backgroundImageSrc = "/Images/S3F8X.jpg" }: CinematicBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldAnimate]);

  // Particle System (Embers/Dust) - Optimized
  useEffect(() => {
    if (!shouldAnimate) return;

    const canvas = canvasRef.current;
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
  }, [shouldAnimate]);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      
      {/* 1. Background Image with Parallax */}
      <div 
        className="absolute inset-[-20px] bg-cover bg-center bg-no-repeat transition-transform duration-100 ease-out z-0"
        style={{
          backgroundImage: `url("${backgroundImageSrc}")`,
          transform: shouldAnimate
            ? `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px) scale(1.05)`
            : 'scale(1.02)',
        }}
      >
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/70 z-10" />
      </div>

      {/* 2. Particle Canvas (Embers) */}
      {shouldAnimate && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 pointer-events-none z-10 opacity-40 mix-blend-screen"
        />
      )}

      {/* 3. Subtle Muzzle Flash / Lighting Pulse */}
      {/* Creates a random faint orange flicker in the distance */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-overlay">
        <div className="absolute top-1/4 left-1/4 w-[42vw] h-[42vw] sm:w-[30vw] sm:h-[30vw] bg-orange-500/5 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      {/* 4. Vignette & Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
      <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.6)_100%)]" />

      {/* 5. Minimal Blood Drip (Corner) */}
      <div className="absolute top-0 right-0 pointer-events-none z-20 opacity-30 mix-blend-overlay w-[150px] h-[150px]">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-red-900 drop-shadow-lg">
             <path d="M60,0 C65,0 70,20 70,35 C70,45 65,50 60,45 C55,40 50,35 50,20 C50,10 55,0 60,0 Z" />
             <path d="M85,0 C90,0 95,40 95,60 C95,70 90,75 85,70 C80,65 75,60 75,40 C75,20 80,0 85,0 Z" style={{ opacity: 0.8 }}/>
          </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-40 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
