"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Shield, BookOpen, Calendar, HelpCircle, Hammer, ShoppingBag, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ScrambleLink } from '@/components/ui/ScrambleLink';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/', icon: Globe },
  { name: 'Servers', href: '/servers', icon: Shield },
  { name: 'Features', href: '/features', icon: Hammer },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Store', href: '/store', icon: ShoppingBag },
  { name: 'Rules', href: '/rules', icon: BookOpen },
  { name: 'Wipe Info', href: '/wipe-info', icon: Flame, special: true },
  { name: 'Join Guide', href: '/join', icon: HelpCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-4" 
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
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
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            // @ts-ignore
            const isSpecial = item.special;
            
            return (
              <ScrambleLink
                key={item.href}
                href={item.href}
                label={item.name}
                icon={isSpecial ? item.icon : undefined}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-2",
                  isSpecial 
                    ? "text-red-500 hover:text-red-400 font-bold animate-pulse hover:animate-none" 
                    : "hover:text-red-400",
                  isActive && !isSpecial ? "text-white" : isActive && isSpecial ? "text-red-400" : !isSpecial ? "text-neutral-400" : ""
                )}
              />
            );
          })}
        </div>
        <div className="hidden md:flex items-center gap-4">
          {/* Discord button moved to Hero section */}
        </div>
        <button
          className="md:hidden text-neutral-400 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <ScrambleLink
                  key={item.href}
                  href={item.href}
                  label={item.name}
                  className="text-lg font-medium text-neutral-300 hover:text-red-400 py-2 border-b border-white/5"
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
