import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="footer bg-black border-t border-white/5 pt-12 pb-8 text-neutral-400">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="relative w-8 h-8 flex items-center justify-center transition-all group-hover:scale-105">
                <Image 
                  src="/Logo/Logo.png" 
                  alt="CDN Logo" 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
             </div>
            <span className="font-bold text-2xl tracking-tighter text-white">CDN</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            A premium DayZ PvE community focused on immersive survival, custom events, and a toxicity-free environment.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white tracking-widest text-xs uppercase opacity-80">Explore</h3>
          <Link href="/servers" className="text-sm hover:text-red-400 transition-colors">Servers</Link>
          <Link href="/events" className="text-sm hover:text-red-400 transition-colors">Events</Link>
          <Link href="/rules" className="text-sm hover:text-red-400 transition-colors">Rules</Link>
          <Link href="/join" className="text-sm hover:text-red-400 transition-colors">How to Join</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white tracking-widest text-xs uppercase opacity-80">Community</h3>
          <Link href="#" className="text-sm hover:text-red-400 transition-colors">Discord</Link>
          <Link href="#" className="text-sm hover:text-red-400 transition-colors">Staff Application</Link>
          <Link href="#" className="text-sm hover:text-red-400 transition-colors">Support Ticket</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white tracking-widest text-xs uppercase opacity-80">Legal</h3>
          <Link href="#" className="text-sm hover:text-red-400 transition-colors">Terms of Service</Link>
          <Link href="#" className="text-sm hover:text-red-400 transition-colors">Privacy Policy</Link>
        </div>
      </div>

      <div className="container mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-xs text-neutral-600 max-w-2xl space-y-2 text-center md:text-left">
            <p>
              &copy; {new Date().getFullYear()} CDN Network. CDN is an independent DayZ community and is not affiliated with or endorsed by Bohemia Interactive.
            </p>
            <p className="opacity-80">
              DayZ&reg; and Bohemia Interactive&reg; are registered trademarks of Bohemia Interactive a.s. 
              This server is heavily modded and does not represent the original DayZ experience.
            </p>
          </div>

          <div className="text-xs text-neutral-600 flex flex-col items-center md:items-end gap-1 shrink-0">
             <span>Designed and built by <span className="text-neutral-400 font-medium">Salman Ahmad</span></span>
             <span className="text-neutral-700 tracking-wide">Morningstar.0 in-game</span>
             <a href="https://portfolio.ahmxd.net" target="_blank" rel="noopener noreferrer" className="text-red-500/60 hover:text-red-500 transition-colors mt-1">
               portfolio.ahmxd.net
             </a>
          </div>
      </div>
    </footer>
  );
}
