"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, Search, Play, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Reveal3D } from '@/components/motion/Reveal3D';
import { TiltCard } from '@/components/motion/TiltCard';
import { TextReveal } from '@/components/motion/TextReveal';

const steps = [
  {
    step: "01",
    title: "Get DayZ",
    description: "Purchase DayZ on Steam if you haven't already. Ensure you have the Livonia DLC for our Livonia servers.",
    icon: Download,
    action: { label: "Steam Store", url: "https://store.steampowered.com/app/221100/DayZ/" }
  },
  {
    step: "02",
    title: "Download Launcher",
    description: "We recommend using the DZSA Launcher for easy mod management and server discovery.",
    icon: Search,
    action: { label: "Get DZSA", url: "https://dayzsalauncher.com/#/home" }
  },
  {
    step: "03",
    title: "Join CDN",
    description: "Search for 'CDN' in the launcher filter to see our full list of modded PvE servers. Choose your map and join the action.",
    icon: Play,
    action: { label: "View Server List", url: "/servers", internal: true }
  }
];

export function QuickStartGuide() {
  return (
    <section aria-labelledby="start-journey-heading" className="py-12 sm:py-16 bg-white dark:bg-neutral-950 border-t border-gray-200 dark:border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-white to-gray-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 opacity-80 dark:opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-8 gap-2">
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-red-500/80">03 // Deployment</span>
          <h2 id="start-journey-heading" className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white">
            <TextReveal>
              Start Your <span className="text-red-500">Journey</span>
            </TextReveal>
          </h2>
          <p className="text-gray-600 dark:text-neutral-400 max-w-2xl">
            From fresh spawn to veteran survivor in three steps. No whitelist required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {steps.map((item, index) => (
            <Reveal3D key={index} from="up" delay={index * 0.1} duration={0.6} className="h-full">
              <TiltCard intensity={7}>
                <Card className="p-6 sm:p-7 h-full bg-gray-50 dark:bg-neutral-900/40 border-gray-200 dark:border-neutral-800 hover:border-red-500/30 transition-all duration-300 relative group overflow-hidden hud-corners">
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-25 transition-opacity">
                    <span className="text-7xl font-bold font-mono text-gray-900 dark:text-white tracking-tighter leading-none">{item.step}</span>
                  </div>

                  <div className="relative z-10 flex flex-col h-full" style={{ transform: 'translateZ(28px)' }}>
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                      <item.icon size={24} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-neutral-400 text-sm mb-5 leading-relaxed flex-grow">
                      {item.description}
                    </p>

                    {item.action.internal ? (
                       <Button variant="outline" className="w-full justify-between group/btn" asChild>
                          <Link href={item.action.url}>
                             {item.action.label} <ArrowRight size={16} className="text-red-500 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                       </Button>
                    ) : (
                       <Button variant="outline" className="w-full justify-between group/btn" onClick={() => window.open(item.action.url, '_blank')}>
                        {item.action.label} <ExternalLink size={16} className="text-gray-500 dark:text-neutral-500 group-hover/btn:text-red-600 dark:group-hover/btn:text-white transition-colors" />
                       </Button>
                    )}
                  </div>
                </Card>
              </TiltCard>
            </Reveal3D>
          ))}
        </div>
      </div>
    </section>
  );
}
