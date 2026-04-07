"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Globe, Shield, BookOpen, Calendar, HelpCircle, Hammer, ShoppingBag, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrambleLink } from '@/components/ui/ScrambleLink';
import Image from 'next/image';

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

  const activeIndex = navItems.findIndex((item) => item.href === pathname);
  const activeItem = navItems[activeIndex >= 0 ? activeIndex : 0];

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 left-0 right-0 z-[70] py-4 sm:py-6"
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
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            CDN <span className="text-neutral-500 font-normal">Network</span>
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
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2 py-2 shadow-[0_14px_40px_rgba(0,0,0,0.58)] backdrop-blur-xl backdrop-saturate-150">
            <Link
              href={activeItem.href}
              aria-current="page"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-red-500/20 bg-gradient-to-r from-red-500/16 to-red-950/20 px-3 py-2 text-white"
            >
              <motion.span
                layoutId="desktop-nav-active-chip"
                className="absolute inset-0 rounded-full"
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
              />
              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white">
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
                      className="group flex items-center justify-center rounded-full px-2.5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400 transition-colors hover:bg-white/6 hover:text-red-400"
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="hidden xl:flex items-center pl-1 pr-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-600">
              {String(activeIndex + 1).padStart(2, '0')}
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4 relative z-20 shrink-0 justify-self-end">
            <motion.button
            type="button"
              initial={false}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08, y: -1 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.9, rotate: isOpen ? -90 : 90 }}
              transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 24 }}
              className="lg:hidden text-neutral-300 hover:text-white rounded-full p-2.5 -mr-2 bg-black/30 backdrop-blur-sm touch-manipulation transition-colors"
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
          <>
            <motion.button
              type="button"
              aria-label="Close mobile menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24, ease: 'easeOut' }}
              className="lg:hidden fixed inset-x-0 top-0 z-50 border-b border-white/10 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(185,28,28,0.14),transparent_52%),linear-gradient(to_bottom,rgba(7,7,7,0.98),rgba(2,2,2,0.99))]"
              id="mobile-navigation"
            >
              {/* Animated close button */}
              <motion.button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 22, delay: 0.1 }}
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.88 }}
                className="absolute top-[calc(env(safe-area-inset-top)+0.875rem)] right-4 sm:right-6 z-10 p-2.5 rounded-full bg-white/8 text-neutral-300 hover:text-white hover:bg-white/15 transition-colors touch-manipulation"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </motion.button>

            <div className="container mx-auto px-4 sm:px-6 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1.25rem)] min-h-[100svh] flex items-center justify-center">
              <div className="w-full max-w-md flex flex-col items-center">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, filter: 'blur(0px)' }}
                      transition={{ delay: shouldReduceMotion ? 0 : index * 0.04, duration: shouldReduceMotion ? 0 : 0.26, ease: 'easeOut' }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full"
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'group block text-center py-2.5 transition-all duration-200',
                          isActive
                            ? 'text-white'
                            : 'text-neutral-300 hover:text-white'
                        )}
                      >
                        <span
                          className={cn(
                            'font-heading font-extrabold uppercase tracking-tight text-[2.2rem] sm:text-5xl leading-[0.95] transition-all duration-200',
                            isActive
                              ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                              : 'opacity-90 group-hover:opacity-100 group-hover:translate-y-[-1px]'
                          )}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.4, duration: shouldReduceMotion ? 0 : 0.25 }}
                  className="mt-8 text-[11px] uppercase tracking-[0.22em] text-neutral-600"
                >
                  CDN Network Menu
                </motion.p>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
