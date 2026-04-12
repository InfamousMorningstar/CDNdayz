"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Globe, Shield, BookOpen, Calendar, HelpCircle, Hammer, ShoppingBag, AlertTriangle, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrambleLink } from '@/components/ui/ScrambleLink';
import Image from 'next/image';
import { useTheme } from '@/components/layout/ThemeProvider';

const navItems = [
  { name: 'Home', href: '/', icon: Globe },
  { name: 'Servers & Analytics', href: '/servers', icon: Shield },
  { name: 'Mods', href: '/features', icon: Hammer },
  { name: 'Wipe Info', href: '/wipe-info', icon: Calendar },
  { name: 'Rules & FAQ', href: '/rules', icon: BookOpen },
  { name: 'Join Guide', href: '/join', icon: HelpCircle },
  { name: 'Error Help', href: '/dayz-error-codes', icon: AlertTriangle },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Store', href: '/store', icon: ShoppingBag },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setIsDockVisible(true);
      } else if (currentY > lastScrollY.current) {
        setIsDockVisible(false);
      } else if (currentY < lastScrollY.current) {
        setIsDockVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogoClick = () => {
    logoTapCount.current += 1;

    if (logoTapTimer.current) {
      clearTimeout(logoTapTimer.current);
    }

    logoTapTimer.current = setTimeout(() => {
      logoTapCount.current = 0;
    }, 1300);

    if (logoTapCount.current >= 5) {
      logoTapCount.current = 0;
      window.dispatchEvent(new Event('cdn:easter-logo-streak'));
    }
  };

  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setClock(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, []);

  const { theme, toggle } = useTheme();

  const activeIndex = navItems.findIndex((item) => item.href === pathname);
  const activeItem = navItems[activeIndex >= 0 ? activeIndex : 0];

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 right-0 z-[70] py-3 sm:py-6"
    >
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 group relative z-20 shrink-0 justify-self-start"
          title="There may be secrets in this network"
          onClick={handleLogoClick}
        >
          <div className="relative w-10 h-10 flex items-center justify-center transition-all group-hover:scale-105">
            <Image 
              src="/Logo/Logo.png" 
              alt="CDN Logo" 
              width={40} 
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block">
            CDN <span className="text-gray-400 dark:text-neutral-500 font-normal">Network</span>
          </span>
        </Link>
        
        {/* Desktop navigation — compact minimal dock */}
        <motion.div
          initial={false}
          animate={isDockVisible
            ? { y: 0, opacity: 1, scale: 1 }
            : { y: -20, opacity: 0, scale: 0.96 }
          }
          transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30, mass: 0.75 }}
          className={cn(
            'relative hidden lg:flex min-w-0 items-center justify-center justify-self-center',
            !isDockVisible && 'pointer-events-none'
          )}
        >
          <div className="flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/60 px-2 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.58)] backdrop-blur-xl backdrop-saturate-150">
            <Link
              href={activeItem.href}
              aria-current="page"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/16 to-red-950/20 px-3 py-2 text-gray-900 dark:text-white"
            >
              <motion.span
                layoutId="desktop-nav-active-chip"
                className="absolute inset-0 rounded-full"
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
              />
              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-gray-800 dark:text-white">
                <activeItem.icon className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
              <span className={cn(
                'relative z-10 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em]',
                shouldReduceMotion ? '' : 'animate-flicker-2'
              )}>
                {activeItem.name}
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                if (isActive) return null;

                return (
                  <motion.div
                    key={item.href}
                    whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 22 }}
                  >
                    <ScrambleLink
                      href={item.href}
                      label={item.name}
                      className="group flex items-center justify-center rounded-full px-2.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-neutral-400 transition-colors hover:bg-black/5 dark:hover:bg-white/6 hover:text-red-500 dark:hover:text-red-400"
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="hidden xl:flex items-center pl-1 pr-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 dark:text-neutral-600">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2 relative z-20 shrink-0 justify-self-end">
            {/* Theme toggle — desktop only */}
            <motion.button
              type="button"
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                toggle({
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                });
              }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 24 }}
              className="hidden lg:flex text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white rounded-full p-2.5 bg-black/5 dark:bg-white/5 backdrop-blur-sm touch-manipulation transition-colors"
              data-theme-toggle
            >
              <span data-theme-toggle-icon>
                {theme === 'dark' ? <Sun className="w-4 h-4" strokeWidth={2} /> : <Moon className="w-4 h-4" strokeWidth={2} />}
              </span>
            </motion.button>
            <motion.button
            type="button"
              initial={false}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.9, rotate: isOpen ? -90 : 90 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 24 }}
              className="lg:hidden text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white rounded-full p-2.5 -mr-2 bg-black/8 dark:bg-black/30 backdrop-blur-sm touch-manipulation transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
              <motion.span
                key={isOpen ? 'close-trigger' : 'open-trigger'}
                initial={shouldReduceMotion ? false : { rotate: isOpen ? -90 : 90, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { rotate: isOpen ? 90 : -90, scale: 0.7, opacity: 0 }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 24 }}
                className="block"
              >
                {isOpen ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Menu className="w-5 h-5" strokeWidth={2.5} />}
              </motion.span>
            </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#f5f3ee] dark:bg-[#040404]"
            id="mobile-navigation"
          >
            {/* Red accent tint — dark mode only */}
            <div className="absolute inset-0 pointer-events-none hidden dark:block" style={{ background: 'radial-gradient(ellipse at 60% 20%, rgba(185,28,28,0.12) 0%, transparent 55%)' }} />
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-2 shrink-0">
              <span className="text-[10px] uppercase tracking-[0.24em] text-gray-400 dark:text-neutral-600 font-mono">CDN_NAV</span>
              <div className="flex items-center gap-2">
                {/* Theme toggle inside mobile menu */}
                <motion.button
                  type="button"
                  onClick={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    toggle({
                      x: rect.left + rect.width / 2,
                      y: rect.top + rect.height / 2,
                    });
                  }}
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.86 }}
                  className="min-h-10 min-w-10 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/8 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors touch-manipulation"
                  data-theme-toggle
                >
                  <span data-theme-toggle-icon>
                    {theme === 'dark' ? <Sun className="w-4 h-4" strokeWidth={2} /> : <Moon className="w-4 h-4" strokeWidth={2} />}
                  </span>
                </motion.button>
                <motion.button
                  type="button"
                  aria-label="Close navigation menu"
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 24, delay: 0.15 }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.12, rotate: 90 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.86 }}
                  className="min-h-11 min-w-11 flex items-center justify-center rounded-full bg-black/8 dark:bg-white/8 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors touch-manipulation"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </motion.button>
              </div>
            </div>

            {/* Nav links — giant typographic */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-0.5 px-6">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32, filter: shouldReduceMotion ? 'none' : 'blur(12px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: shouldReduceMotion ? 0 : 0.05 + index * 0.055, duration: shouldReduceMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.04, x: 6 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
                    style={{ transformOrigin: 'left center' }}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block font-heading font-black uppercase leading-none tracking-tight touch-manipulation select-none transition-colors duration-100',
                        'text-[min(8vw,2.8rem)]',
                        isActive
                          ? 'text-gray-900 dark:text-white [text-shadow:none] dark:[text-shadow:0_0_40px_rgba(255,255,255,0.28),0_2px_0_rgba(0,0,0,0.8)]'
                          : 'text-gray-400 dark:text-neutral-500 hover:text-gray-900 dark:hover:text-white'
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* HUD status bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: 0.3 }}
              className="shrink-0 flex items-end justify-between px-5 pb-[calc(env(safe-area-inset-bottom)+1.2rem)] pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-400 dark:text-neutral-600"
            >
              <div className="flex flex-col gap-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/70 animate-pulse" />
                  LINK_ESTABLISHED
                </span>
                <span>MEM: OPTIMAL</span>
              </div>
              <div className="text-right whitespace-pre leading-snug">
                {clock}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
