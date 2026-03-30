"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Shield, BookOpen, Calendar, HelpCircle, Hammer, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrambleLink } from '@/components/ui/ScrambleLink';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/', icon: Globe },
  { name: 'Servers', href: '/servers', icon: Shield },
  { name: 'Features & Mods', href: '/features', icon: Hammer },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Store', href: '/store', icon: ShoppingBag },
  { name: 'Rules & FAQ', href: '/rules', icon: BookOpen },
  { name: 'Wipe Info', href: '/wipe-info', icon: Shield },
  { name: 'Join Guide', href: '/join', icon: HelpCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-3 sm:py-4" 
          : "bg-transparent border-transparent py-4 sm:py-6"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 relative flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group relative z-20"
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
        
        {/* Centered Navigation for Desktop */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-5 xl:gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <ScrambleLink
                key={item.href}
                href={item.href}
                label={item.name}
                icon={undefined}
                ariaCurrent={isActive ? 'page' : undefined}
                className={cn(
                  "text-xs xl:text-sm font-medium transition-colors flex items-center gap-2",
                  "hover:text-red-400",
                  isActive ? "text-white" : "text-neutral-400"
                )}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-4 relative z-20">
          <button
            type="button"
            className="lg:hidden text-neutral-400 hover:text-white rounded-full p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 border-b border-white/10 overflow-hidden"
            id="mobile-navigation"
          >
            <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <ScrambleLink
                  key={item.href}
                  href={item.href}
                  label={item.name}
                  ariaCurrent={pathname === item.href ? 'page' : undefined}
                  className="text-base sm:text-lg font-medium text-neutral-300 hover:text-red-400 py-3 border-b border-white/5"
                  onClick={() => setIsOpen(false)}
                />
              ))}
              {/* Mobile buttons removed */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
