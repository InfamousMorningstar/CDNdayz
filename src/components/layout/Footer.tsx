import Link from 'next/link';
import Image from 'next/image';
import { Spotlight } from '@/components/ui/Spotlight';
import { cn } from '@/lib/utils';
import { FooterTicTacToe } from '@/components/layout/FooterTicTacToe';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer aria-label="Site footer" className="relative bg-black border-t border-white/10 pt-20 pb-10 text-neutral-400 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-12 h-12 flex items-center justify-center bg-gradient-to-br from-red-600/20 to-black rounded-2xl border border-white/5 transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                <Image 
                  src="/Logo/Logo.png" 
                  alt="CDN Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl tracking-tight text-white leading-none">CDN</span>
                <span className="text-xs text-red-500 font-mono tracking-widest uppercase">Network</span>
              </div>
            </Link>
            <p className="text-neutral-400 leading-relaxed max-w-sm">
              The ultimate DayZ PvE experience. We're building a community focused on immersive survival, custom events, and a toxic-free environment where every player's story matters.
            </p>
          </div>
          
          {/* Spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links Columns */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-white tracking-wide text-sm uppercase">Explore</h3>
              <div className="flex flex-col gap-2">
                <FooterLink href="/servers">Our Servers</FooterLink>
                <FooterLink href="/features">Features</FooterLink>
                <FooterLink href="/store">Store</FooterLink>
                <FooterLink href="/events">Events</FooterLink>
                <FooterLink href="/wipe-info" className="text-red-400 hover:text-red-300 font-medium">Wipe Info</FooterLink>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-white tracking-wide text-sm uppercase">Support</h3>
              <div className="flex flex-col gap-2">
                <FooterLink href="/rules">Rules & FAQ</FooterLink>
                <FooterLink href="/join">Join Guide</FooterLink>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-white tracking-wide text-sm uppercase">Legal</h3>
              <div className="flex flex-col gap-2">
                <FooterLink href="/legal/terms">Terms of Service</FooterLink>
                <FooterLink href="/legal/privacy">Privacy Policy</FooterLink>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm text-center md:text-left max-w-2xl space-y-4">
            <p className="text-neutral-300 font-medium tracking-wide">
              &copy; {currentYear} CDN Network. All rights reserved.
            </p>
            <div className="space-y-2 text-xs text-neutral-500 leading-relaxed">
              <p>
                This website and the CDN DayZ community are unrelated to, not sponsored by, and not endorsed by Bohemia Interactive a.s. or any of its partners.
              </p>
              <p className="text-amber-200/90">
                ⚠ CDN servers run a modified DayZ experience, so gameplay systems, client performance, and overall stability may differ from vanilla.
              </p>
              <p>
                DayZ&reg;, Bohemia Interactive&reg;, and their respective logos are trademarks or registered trademarks of Bohemia Interactive a.s. All other trademarks, images, and assets used are the property of their respective owners and are used here for informational and community purposes only.
              </p>
            </div>
          </div>

          <a href="https://portfolio.ahmxd.net" target="_blank" rel="noopener noreferrer" className="block w-full md:w-auto group">
            <Spotlight className="rounded-full border border-white/5 bg-white/5 hover:bg-black/50 transition-all duration-300">
              <div className="flex items-center gap-4 py-2 pl-2 pr-6 relative z-10">
                 <div className="relative w-10 h-10 rounded-full bg-black flex items-center justify-center border border-white/10 shadow-inner overflow-hidden group-hover:border-red-500/30 transition-colors">
                    <Image 
                      src="https://portfolio.ahmxd.net/assets/logo.svg" 
                      alt="Logo" 
                      width={20} 
                      height={20}
                      className="w-5 h-5 invert opacity-70 group-hover:opacity-100 transition-opacity" 
                    />
                 </div>
                 
                 <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium leading-none mb-1">Designed & Built by</span>
                    <span className="text-sm font-mono font-semibold text-red-400/90 group-hover:text-red-300 transition-colors tracking-wide">Morningstar.0</span>
                 </div>
              </div>
            </Spotlight>
          </a>

          <FooterTicTacToe />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "text-neutral-400 hover:text-white transition-colors text-sm w-fit relative group py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/80 rounded", 
        className
      )}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-red-600 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
