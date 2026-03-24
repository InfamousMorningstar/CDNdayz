"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Shield, BookOpen, Calendar, HelpCircle, Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/', icon: Globe },
  { name: 'Servers', href: '/servers', icon: Shield },
  { name: 'Features', href: '/features', icon: Hammer },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Rules', href: '/rules', icon: BookOpen },
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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/0",
        isScrolled ? "bg-black/80 backdrop-blur-md border-white/5 py-4" : "bg-transparent py-6"
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
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
            CDN <span className="text-neutral-500 font-normal">Network</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-red-400 flex items-center gap-2",
                  isActive ? "text-white" : "text-neutral-400"
                )}
              >
                {item.name}
              </Link>
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
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium text-neutral-300 hover:text-red-400 py-2 border-b border-white/5"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile buttons removed */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
